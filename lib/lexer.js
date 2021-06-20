const moo = require('moo')

let lexer = moo.compile({
  jsfunction: {
    match: /jsFunction[ ]*\((?:(?:[a-zA-Z][a-zA-Z_0-9]*)(?:\s*\,\s*(?:[a-zA-Z][a-zA-Z_0-9]*))*)*\)\s*(?:\{\$[\s\S]*\$\})/,
    value: x => `${x.replace('jsFunction ', '')}`,
    lineBreaks: true
  },
  WS: /[ \t]+/,
  comment: /\/\/.*?$/,
  // valueWithUnit: / *\d+(?:px|vw|vh|%|rem|em)/,
  keyword: ['new', 'in', 'on', 'style', 'HEAD', 'def', "*"],
  string: /"(?:\\["\\]|[^\n"\\])*"/,
  styleValue: {
    match: /:[ \t]+[a-zA-Z0-9%#\(\)\,\. ]+/,
    value: s => s.replace(':', '').trim()
  },  
  identifier: /[a-zA-Z][a-zA-Z_0-9]*/,
  number: /0|[1-9][0-9]*/,
  lbrace: '{',
  rbrace: '}',
  lbracket: '[',
  rbracket: ']',
  assing: '=',
  dash: '-',
  declare: ':',
  dot: '.',
  comma: ',',
  hexColor: /#(?:[a-fA-F0-9]{6}|[a-fA-F0-9]{3})/,
  NL: { match: /[\r\n]+/, lineBreaks: true },
})

module.exports = lexer