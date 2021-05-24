const moo = require('moo')

let lexer = moo.compile({
  WS: /[ \t]+/,
  comment: /\/\/.*?$/,
  // valueWithUnit: / *\d+(?:px|vw|vh|%|rem|em)/,
  keyword: ['new', 'in', 'style', 'HEAD', 'def', "*"],
  string: /"(?:\\["\\]|[^\n"\\])*"/,
  styleValue: {
    match: /:[ \t]+[a-zA-Z0-9%# ]+/,
    value: s => s.replace(':', '').trim()
  },  
  identifier: /[a-zA-Z][a-zA-Z_0-9]*/,
  number: /0|[1-9][0-9]*/,
  lparen: '(',
  rparen: ')',
  lbrace: '{',
  rbrace: '}',
  assing: '=',
  declare: ':',
  hexColor: /#(?:[a-fA-F0-9]{6}|[a-fA-F0-9]{3})/,
  NL: { match: /[\r\n]+/, lineBreaks: true },
})

module.exports = lexer