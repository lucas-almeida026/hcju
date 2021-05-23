const moo = require('moo')

let lexer = moo.compile({
  WS: /[ \t]+/,
  comment: /\/\/.*?$/,
  number: /0|[1-9][0-9]*/,
  string: /"(?:\\["\\]|[^\n"\\])*"/,
  keyword: ['new', 'in', 'style', 'HEAD', 'def', "*"],
  identifier: /[a-zA-Z][a-zA-Z_0-9]*/,
  lparen: '(',
  rparen: ')',
  lbrace: '{',
  rbrace: '}',
  assing: '=',
  styleValue: /:[ \t]+[a-zA-Z0-9%# ]+/,
  NL: { match: /[\r\n]+/, lineBreaks: true },
})

module.exports = lexer