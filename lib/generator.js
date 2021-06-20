const fs = require('fs')

const _dicionaryElementsStyles = []
const _conditionalStyles = []
let _currentTargetName = ''

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
const applyConditionalStyles = () => {if($elementStyles.length > 0)$elementStyles.forEach(e => e.conditionalStyles.length > 0?(e.conditionalStyles.forEach(s => {myLib.getState()[\`$\${s.conditionalKey}\`]?eval(s.conditionalFunction):eval(e.styleFunction)})):eval(e.styleFunction))}
window.addEventListener('resize', () => {applyConditionalStyles()})
const $references=[]
${jsCodeFromStatements(program)}\napplyConditionalStyles()`

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
  }
  for(let line of program.statements){
    if(line.type !== 'comment_line') lines.push(interpretStatement(line))
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
    element_assignment_inline_applyment: doElementAssignmentInlineApplyment,
    conditional_style_definition: doConditionalStyleDefinition,
    function_assignment: functionAssignment,
    function_call: functionCall,
    event_handler: eventHandler,
    comment_line: () => {}
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
  if(node.repeat.value) node.repeat = node.repeat.value
  if(node.parentElement.value === "window"){
    return `const ${elementName}=myLib.createElement('${elementType}',document.body, ${+node.repeat})\n$references.push({name:'${elementName}',ref:${elementName}})`
  }else{
    return `const ${elementName}=myLib.createElement('${elementType}',${node.parentElement.value},${+node.repeat})\n$references.push({name:'${elementName}',ref:${elementName}})`
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
  _currentTargetName = node.target.value
  let styles = node.styleGroup.value
  if(node.styleGroup.type === "style_new_instance"){
    styles = interpretStatement(node.styleGroup)
  }
  _dicionaryElementsStyles.push({elementRefName: node.target.value, style: styles})
  let conditionalStylesString = '$elementStyles.push('
  if(_conditionalStyles.length > 0){
    _conditionalStyles.forEach(e => {
      e.styleFunction = e.styleFunction.replace('_styles_', styles)
      conditionalStylesString += 'JSON.parse(`' + JSON.stringify(e) + '`),'
    })
  }
  return `myLib.applyStyleGroupInElement(${node.target.value},${styles})\n${conditionalStylesString})` 
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

function doConditionalStyleDefinition (node){
  let instructions = ""
  if(node.styleBody) if(node.styleBody.length > 0){
    for(let i = 0; i < node.styleBody.length; i++){
      instructions += interpretStatement(node.styleBody[i]) + (i == node.styleBody.length - 1 ? '' : ';')
    }
  }
  _conditionalStyles.push({
    targetName: _currentTargetName,
    styleFunction: `myLib.applyStyleGroupInElement(${_currentTargetName},_styles_)`,
    conditionalStyles: [
      {
        conditionalKey: node.platformRule.value,
        conditionalFunction: `myLib.applyStyleGroupInElement(${_currentTargetName},myLib.createStyleGroup('${instructions}',$references))`
      }
    ]
  })
  return ''
}

function functionAssignment(node){
  const params = node.body.substring(node.body.indexOf('(') + 1, node.body.indexOf(')'))
  .replace('\r\n', '')
  .replace('\n', '')
  .replace('\t', '')
  .replace(' ', '')

  const treatedBody = node.body.substring(node.body.indexOf('{$') + 2, node.body.lastIndexOf('$}')).trim()

  return `const ${node.name} = (${params}) => {\n${treatedBody}\n}`
}

function functionCall(node){
  return `${node.name}()`
}

function eventHandler(node){
  // console.log(node)
  // console.log(node.function.type)
  if(node.function.type === 'identifier'){
    return `${node.target}.addEventListener('${node.event}',($event) => ${node.function.value}($event))`
  }else{
    const treatedBodyFunction = node.function.value.substring(node.function.value.indexOf('{$') + 2, node.function.value.lastIndexOf('$}') - 1)
    .trim()
    .split('\n').join(';')
    .split('\r\n').join(';')
    .split('\r').join(';')
    .replace(/\;+/gm, ';')
    .split(' ').join('')
    return `${node.target}.addEventListener('${node.event}',($event) => {${treatedBodyFunction}})`
  }
}