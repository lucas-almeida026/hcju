// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const lexer = require('./lexer.js')
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program$ebnf$1", "symbols": ["program_head"], "postprocess": id},
    {"name": "program$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "program", "symbols": ["program$ebnf$1", "_enter", "statements", "_enter"], "postprocess":  (data) => ({
          head: data[0],
          statements: data[2]
        }) },
    {"name": "program_head$ebnf$1", "symbols": ["definition_block_list"], "postprocess": id},
    {"name": "program_head$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "program_head", "symbols": ["_enter", {"literal":"HEAD"}, "_", {"literal":"{"}, "_ml", "program_head$ebnf$1", "_ml", {"literal":"}"}], "postprocess": data => data[5]},
    {"name": "definition_block_list$ebnf$1", "symbols": []},
    {"name": "definition_block_list$ebnf$1$subexpression$1", "symbols": ["_tab", "definition_block"]},
    {"name": "definition_block_list$ebnf$1", "symbols": ["definition_block_list$ebnf$1", "definition_block_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "definition_block_list", "symbols": ["definition_block", "definition_block_list$ebnf$1"], "postprocess": data => [data[0], ...data[1].map(e => e[1])]},
    {"name": "definition_block$subexpression$1", "symbols": [{"literal":"PLATFORM_RULES"}]},
    {"name": "definition_block$subexpression$1", "symbols": [{"literal":"GLOBAL_STYLES"}]},
    {"name": "definition_block", "symbols": [{"literal":"def"}, "__", "definition_block$subexpression$1", "_", {"literal":"{"}, "_ml", "definition_statement_list", "_ml", {"literal":"}"}], "postprocess": data => data[6]},
    {"name": "definition_statement_list", "symbols": ["global_style_list"], "postprocess":  data => ({
          type: "global_style_statements",
          body: data[0]
        }) },
    {"name": "definition_statement_list", "symbols": ["platform_rule_list"], "postprocess":  data => ({
          type: "platform_rules_statements",
          body: data[0]
        }) },
    {"name": "platform_rule_list$ebnf$1", "symbols": []},
    {"name": "platform_rule_list$ebnf$1$subexpression$1", "symbols": ["__tab", "platform_rule"]},
    {"name": "platform_rule_list$ebnf$1", "symbols": ["platform_rule_list$ebnf$1", "platform_rule_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "platform_rule_list", "symbols": ["platform_rule", "platform_rule_list$ebnf$1"], "postprocess": data => [data[0], ...data[1].map(e => e[1])]},
    {"name": "platform_rule", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "__", {"literal":"when"}, "__", {"literal":"screen"}, "__", {"literal":"between"}, "__", (lexer.has("number") ? {type: "number"} : number), "__", {"literal":"and"}, "__", (lexer.has("number") ? {type: "number"} : number)], "postprocess":  data => ({
          type: "platform_rule",
          name: data[0],
          between: [data[8].value, data[12].value]
        }) },
    {"name": "global_style_list$ebnf$1", "symbols": []},
    {"name": "global_style_list$ebnf$1$subexpression$1", "symbols": ["__tab", "global_style"]},
    {"name": "global_style_list$ebnf$1", "symbols": ["global_style_list$ebnf$1", "global_style_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "global_style_list", "symbols": ["global_style", "global_style_list$ebnf$1"], "postprocess": data => [data[0], ...data[1].map(e => e[1])]},
    {"name": "global_style$subexpression$1", "symbols": ["elementType"]},
    {"name": "global_style$subexpression$1", "symbols": [{"literal":"*"}]},
    {"name": "global_style$subexpression$2", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "global_style$subexpression$2", "symbols": ["style_new_instance"]},
    {"name": "global_style", "symbols": [{"literal":"for"}, "__", "global_style$subexpression$1", "__", {"literal":"elements"}, "__", {"literal":"apply"}, "__", "global_style$subexpression$2"], "postprocess":  
        data => ({
          type: "global_style",
          target: data[2],
          styleGroup: data[8]
        })
                },
    {"name": "global_style", "symbols": ["style_assignment"]},
    {"name": "statements$ebnf$1", "symbols": []},
    {"name": "statements$ebnf$1$subexpression$1", "symbols": ["_", "__enter", "statement"]},
    {"name": "statements$ebnf$1", "symbols": ["statements$ebnf$1", "statements$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "statements", "symbols": ["statement", "statements$ebnf$1", "_"], "postprocess": 
        data => {
          const repeated = data[1]
          const rest = repeated.map(e => e[2])
          return [data[0], ...rest]
        }
          },
    {"name": "statement", "symbols": ["element_assignment"], "postprocess": id},
    {"name": "statement", "symbols": ["element_write_text"], "postprocess": id},
    {"name": "statement", "symbols": ["style_assignment"], "postprocess": id},
    {"name": "statement", "symbols": ["style_applyment"], "postprocess": id},
    {"name": "statement", "symbols": ["function_assignment"], "postprocess": id},
    {"name": "statement", "symbols": ["event_handler"], "postprocess": id},
    {"name": "event_handler$subexpression$1", "symbols": [{"literal":"new"}, "__", (lexer.has("jsfunction") ? {type: "jsfunction"} : jsfunction)]},
    {"name": "event_handler$subexpression$1", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "event_handler", "symbols": [{"literal":"on"}, "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), "__", {"literal":"in"}, "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), "__", {"literal":"execute"}, "__", "event_handler$subexpression$1"], "postprocess": 
        data => ({
          type: 'event_handler',
          event: data[2].value,
          target: data[6].value,
          function: data[10].length > 1 ? data[10][2] : data[10][0]
        })
        },
    {"name": "element_assignment$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("number") ? {type: "number"} : number)]},
    {"name": "element_assignment$ebnf$1", "symbols": ["element_assignment$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "element_assignment$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "element_assignment", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"="}, "_", {"literal":"new"}, "element_assignment$ebnf$1", "__", "elementType", "__", {"literal":"in"}, "__", (lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": 
        (data) => {
          return {
            type: "element_assignment",
            elementName: data[0],
            elementType: data[7],
            parentElement: data[11],
            repeat: data[5] ? data[5][1] : 1
          }
        }
        },
    {"name": "element_assignment$ebnf$2$subexpression$1", "symbols": ["__", (lexer.has("number") ? {type: "number"} : number)]},
    {"name": "element_assignment$ebnf$2", "symbols": ["element_assignment$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "element_assignment$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "element_assignment$subexpression$1", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "element_assignment$subexpression$1", "symbols": ["style_new_instance"]},
    {"name": "element_assignment", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"="}, "_", {"literal":"new"}, "element_assignment$ebnf$2", "__", "elementType", "__", {"literal":"in"}, "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), "__", {"literal":"apply"}, "__", "element_assignment$subexpression$1"], "postprocess": 
        (data) => ({
          type: "element_assignment_inline_applyment",
          elementName: data[0],
          elementType: data[7],
          parentElement: data[11],
          repeat: data[5] ? data[5][1] : 0,
          styleGroup: data[15][0]
        })
        },
    {"name": "element_write_text", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "__", {"literal":"write"}, "__", (lexer.has("string") ? {type: "string"} : string)], "postprocess": 
        data => ({
          type: "element_write_text",
          target: data[0],
          text: data[4]
        })
        },
    {"name": "style_assignment$subexpression$1", "symbols": ["__", "style_line"]},
    {"name": "style_assignment$subexpression$1", "symbols": ["_", "style_body"]},
    {"name": "style_assignment", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"="}, "_", {"literal":"new"}, "__", {"literal":"style"}, "style_assignment$subexpression$1"], "postprocess": 
        data => ({
          type: "style_assignment",
          styleName: data[0],
          body: data[7][1].length ? data[7][1] : [data[7][1]]
        })
        },
    {"name": "style_body", "symbols": [{"literal":"{"}, "_ml", "style_line_list", "_ml", {"literal":"}"}], "postprocess": data => data[2]},
    {"name": "style_line_list$ebnf$1", "symbols": []},
    {"name": "style_line_list$ebnf$1$subexpression$1", "symbols": ["__ml", "style_line"]},
    {"name": "style_line_list$ebnf$1", "symbols": ["style_line_list$ebnf$1", "style_line_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "style_line_list$ebnf$2", "symbols": []},
    {"name": "style_line_list$ebnf$2$subexpression$1", "symbols": ["__ml", "conditional_style_definition"]},
    {"name": "style_line_list$ebnf$2", "symbols": ["style_line_list$ebnf$2", "style_line_list$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "style_line_list", "symbols": ["style_line", "style_line_list$ebnf$1", "style_line_list$ebnf$2"], "postprocess": data => [data[0], ...data[1].map(e => e[1]), ...data[2].map(e => e[1])]},
    {"name": "style_line", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), (lexer.has("styleValue") ? {type: "styleValue"} : styleValue)], "postprocess":  
        data => ({
          type: "style_line",
          propertie: {
            ...data[0],
            expression: data[1].value
          }
        })
            },
    {"name": "conditional_style_definition$subexpression$1", "symbols": ["__", "style_line"]},
    {"name": "conditional_style_definition$subexpression$1", "symbols": ["_", "style_body"]},
    {"name": "conditional_style_definition", "symbols": [{"literal":"in"}, "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), "__", {"literal":"overwrite"}, "conditional_style_definition$subexpression$1"], "postprocess": 
        data => ({
          type: 'conditional_style_definition',
          platformRule: data[2],
          styleBody: data[5][1]
        })
            },
    {"name": "style_applyment$subexpression$1", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "style_applyment$subexpression$1", "symbols": ["style_new_instance"]},
    {"name": "style_applyment", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "__", {"literal":"apply"}, "__", "style_applyment$subexpression$1"], "postprocess":  
        data => ({
          type: "style_applyment",
          target: data[0],
          styleGroup: data[4][0]
        })
        },
    {"name": "style_new_instance$subexpression$1", "symbols": ["__", "style_line"]},
    {"name": "style_new_instance$subexpression$1", "symbols": ["_", "style_body"]},
    {"name": "style_new_instance", "symbols": [{"literal":"new"}, "__", {"literal":"style"}, "style_new_instance$subexpression$1"], "postprocess": 
        data => ({
          type: "style_new_instance",
          body: data[3][1].length ? data[3][1] : [data[3][1]]
        })
        },
    {"name": "function_assignment", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "__", {"literal":"="}, "__", {"literal":"new"}, "__", (lexer.has("jsfunction") ? {type: "jsfunction"} : jsfunction)], "postprocess": 
        data => ({
          type: 'function_assignment',
          name: data[0].value,
          body: data[6].value
        })
        },
    {"name": "function_call", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), {"literal":"("}, {"literal":")"}], "postprocess": 
        data => ({
          type: 'function_call',
          name: data[0].value,
          params: []
        })
        },
    {"name": "elementType$subexpression$1", "symbols": [{"literal":"div"}]},
    {"name": "elementType$subexpression$1", "symbols": [{"literal":"h1"}]},
    {"name": "elementType$subexpression$1", "symbols": [{"literal":"p"}]},
    {"name": "elementType", "symbols": ["elementType$subexpression$1"], "postprocess": data => data[0][0]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "_ml$ebnf$1", "symbols": []},
    {"name": "_ml$ebnf$1$subexpression$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "_ml$ebnf$1$subexpression$1", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "_ml$ebnf$1", "symbols": ["_ml$ebnf$1", "_ml$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_ml", "symbols": ["_ml$ebnf$1"]},
    {"name": "__ml$ebnf$1$subexpression$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__ml$ebnf$1$subexpression$1", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "__ml$ebnf$1", "symbols": ["__ml$ebnf$1$subexpression$1"]},
    {"name": "__ml$ebnf$1$subexpression$2", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__ml$ebnf$1$subexpression$2", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "__ml$ebnf$1", "symbols": ["__ml$ebnf$1", "__ml$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__ml", "symbols": ["__ml$ebnf$1"]},
    {"name": "_enter$ebnf$1", "symbols": []},
    {"name": "_enter$ebnf$1", "symbols": ["_enter$ebnf$1", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_enter", "symbols": ["_enter$ebnf$1"]},
    {"name": "__enter$ebnf$1", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "__enter$ebnf$1", "symbols": ["__enter$ebnf$1", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__enter", "symbols": ["__enter$ebnf$1"]},
    {"name": "_tab$ebnf$1", "symbols": []},
    {"name": "_tab$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "_tab$ebnf$1", "symbols": ["_tab$ebnf$1", "_tab$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_tab", "symbols": ["_tab$ebnf$1", "_"]},
    {"name": "__tab$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "__tab$ebnf$1", "symbols": ["__tab$ebnf$1$subexpression$1"]},
    {"name": "__tab$ebnf$1$subexpression$2", "symbols": ["_", (lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "__tab$ebnf$1", "symbols": ["__tab$ebnf$1", "__tab$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__tab", "symbols": ["__tab$ebnf$1", "_"]}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
