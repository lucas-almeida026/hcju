const fs = require('fs')

const main = async () => {
  const filename = process.argv[2]
  if(!filename){
    console.log('provide a .ast file')
    return
  }

  const astJson = await fs.readFileSync(filename, 'utf8')
  const program = JSON.parse(astJson)
  const jsCode = 
`import myLib from './lib/intermadiator.js'
const $elementStyles = []
window.addEventListener('resize', () => $elementStyles.forEach(fn => fn()))
const $references=[]
${jsCodeFromStatements(program)}`

  const outName = filename.replace('.ast', '.js')
  await fs.writeFileSync(outName, jsCode)
  console.log(`Wrote ${outName}.`)
}
main().catch(err => console.log(err.stack))

function jsCodeFromStatements(program){
  const lines = []
  if(program.head){
    for(let line of program.head){
      lines.push(interpretHead(line))
    }
    lines.push("\n")
  }
  for(let line of program.statements){
    lines.push(interpretStatement(line))
  }
  return lines.join('\n')
}

function interpretHead(node){
  if(node.type === "platform_rules_statements"){
    let arguments = '['
    if(node.body){
      for(let i = 0; i < node.body.length; i++){
        i == node.body.length - 1 ?
        arguments += interpretHead(node.body[i]):
        arguments += interpretHead(node.body[i]) + ', '
      }
      arguments += ']'
      return `myLib.setPlatformRules(${arguments})`
    }
  }else if(node.type === 'global_style_statements'){
  
  }else if(node.type === "platform_rule"){
    const values = node.between.map(e => +e)
    return `{identifier:'${node.name.value}',expression: (value) => value <= ${Math.max(...values)} && value > ${Math.min(...values)}}`
  }else{
    throw new Error(`Unhandled AST node type ${node.type}`)
  }
  return ''
}

function interpretStatement(node){
  const dictionary = {
    element_assignment: doElementAssignment,
    style_new_instance: doStyleNewInstante,
    style_applyment: doStyleApplyment,
    style_line: doStyleLine,
    style_assignment: doStyleAssignment,
    element_write_text: doElementWriteText,
    element_assignment_inline_applyment: doElementAssignmentInlineApplyment
  }
  if(dictionary[node.type]){
    return dictionary[node.type](node)
  }else{
    throw new Error(`Unhandled AST node type ${node.type}`)
  }
}

function doElementAssignment(node){
  const elementName = node.elementName.value
  const elementType = node.elementType.value
  if(node.parentElement.value === "window"){
    return `const ${elementName}=myLib.createElement('${elementType}',document.body, ${+node.repeat.value})\n$references.push({name:'${elementName}',ref:${elementName}})`
  }else{
    return `const ${elementName}=myLib.createElement('${elementType}',${node.parentElement.value},${+node.repeat.value})\n$references.push({name:'${elementName}',ref:${elementName}})`
  }
}

function doStyleNewInstante(node){
  let instructions = ""
  if(node.body) if(node.body.length > 0){
    for(let i = 0; i < node.body.length; i++){
      instructions += interpretStatement(node.body[i]) + (i == node.body.length - 1 ? '' : ';')
    }
  }
  return `myLib.createStyleGroup('${instructions}',$references)`
}

function doStyleApplyment(node){
  let styles = node.styleGroup.value
  if(node.styleGroup.type === "style_new_instance"){
    styles = interpretStatement(node.styleGroup)
  }
  return `myLib.applyStyleGroupInElement(${node.target.value},${styles})\n$elementStyles.push(() => myLib.applyStyleGroupInElement(${node.target.value},${styles}))` 
}

function doStyleAssignment(node){
  let instructions = ""
  const styleGroupName = node.styleName.value
  if(node.body) if(node.body.length > 0){
    for(let i = 0; i < node.body.length; i++){
      instructions += interpretStatement(node.body[i]) + (i == node.body.length - 1 ? '' : ';')
    }
  }
  return `const ${styleGroupName}=myLib.createStyleGroup('${instructions}')`
}

function doElementWriteText(node){
  const target = node.target.value
  const text = node.text.value
  return `myLib.insertTextInElement(${target}, ${text})`
}

function doStyleLine(node){return node.propertie.value + ":" + node.propertie.expression}

function doElementAssignmentInlineApplyment(node){
  if(node.styleGroup.type === "identifier"){
    return `${doElementAssignment(node).split('\n')[0]}\nmyLib.applyStyleGroupInElement(${node.elementName.value},${node.styleGroup.value})\n$references.push({name:'${node.elementName.value}',ref:${node.elementName.value}})`
  }else{
    return `${doElementAssignment(node).split('\n')[0]}\nmyLib.applyStyleGroupInElement(${node.elementName.value},${interpretStatement(node.styleGroup)})\n$references.push({name:'${node.elementName.value}',ref:${node.elementName.value}})`
  }
}