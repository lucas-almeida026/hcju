const nearley = require('nearley')
const grammar = require('./hcju.js')
const fs = require('fs')

const main = async () => {
  const filename = process.argv[2]
  if(!filename){
    console.log('a .hcju file must be provided')
    return
  }

  const file = await fs.readFileSync(filename, 'utf8')
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))  
  parser.feed(file)
  
  if(parser.results.length > 1){
    console.log('ambigous grammar')
    for(let i = 0; i < parser.results.length; i++){
      const ast = parser.results[i]
      await fs.writeFileSync(`err/report-${i}-${filename.replace('.hcju', '.ast')}`, JSON.stringify(ast, null, " "))      
    }
    console.log('Files wrote in the err folder')
  }else if (parser.results.length == 1){    
    const ast = parser.results[0]
    const outputFilename = filename.replace('.hcju', '.ast')
    await fs.writeFileSync(outputFilename, JSON.stringify(ast, null, " "))
    console.log(`Wrote ${outputFilename}.`)
  }else{
    console.log('Error with the parse')    
  }
}
main().catch(err => console.log(err.stack))