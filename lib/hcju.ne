@{%
  const lexer = require('./lexer.js')
%}

@lexer lexer

program
-> program_head:? _enter statements _enter
{% (data) => ({
  head: data[0],
  statements: data[2]
}) %}

# PROGRAM DEFINITIONS START
program_head
-> _enter "HEAD" _ "{" _ml definition_block_list:? _ml "}" {% data => data[5] %}

  definition_block_list
  -> definition_block (_tab definition_block):* {% data => [data[0], ...data[1].map(e => e[1])] %}

    definition_block
    -> "def" __ ("PLATFORM_RULES" | "GLOBAL_STYLES") _ "{" _ml definition_statement_list _ml "}" {% data => data[6] %}

      definition_statement_list
      -> global_style_list 
      {% data => ({
        type: "global_style_statements",
        body: data[0]
      }) %}
      | platform_rule_list
      {% data => ({
        type: "platform_rules_statements",
        body: data[0]
      }) %}

      platform_rule_list
      -> platform_rule (__tab platform_rule):* {% data => [data[0], ...data[1].map(e => e[1])] %}

        platform_rule
        -> %identifier __ "when" __ "screen" __ "between" __ %number __ "and" __ %number
        {% data => ({
          type: "platform_rule",
          name: data[0],
          between: [data[8].value, data[12].value]
        }) %}

      global_style_list
      -> global_style (__tab global_style):* {% data => [data[0], ...data[1].map(e => e[1])] %}

        global_style
        -> "for" __ (elementType | "*") __ "elements" __ "apply" __ (%identifier | style_new_instance) 
        {% 
          data => ({
            type: "global_style",
            target: data[2],
            styleGroup: data[8]
          })
        %}
        | style_assignment
# PROGRAM DEFINITIONS END

statements
-> statement (_ __enter statement):*
  {%
    data => {
      const repeated = data[1]
      const rest = repeated.map(e => e[2])
      return [data[0], ...rest]
    }
  %}

statement
-> element_assignment {% id %}
| element_write_text {% id %}
| style_assignment {% id %}
| style_applyment {% id %}

# STATEMENT DEFINITIONS START
element_assignment
-> %identifier _ "=" _ "new" (__ %number):? __ elementType __ "in" __ %identifier
{%
  (data) => {
    return {
      type: "element_assignment",
      elementName: data[0],
      elementType: data[7],
      parentElement: data[11],
      repeat: data[5] ? data[5][1] : 0
    }
  }
%}
| %identifier _ "=" _ "new" (__ %number):? __ elementType __ "in" __ %identifier __ "apply" __ (%identifier | style_new_instance)
{%
  (data) => ({
    type: "element_assignment_inline_applyment",
    elementName: data[0],
    elementType: data[7],
    parentElement: data[11],
    repeat: data[5] ? data[5][1] : 0,
    styleGroup: data[15][0]
  })
%}

element_write_text
-> %identifier __ "write" __ %string
{%
  data => ({
    type: "element_write_text",
    target: data[0],
    text: data[4]
  })
%}

style_assignment
-> %identifier _ "=" _ "new" __ "style" (__ style_line | _ style_body)
{%
  data => ({
    type: "style_assignment",
    styleName: data[0],
    body: data[7][1].length ? data[7][1] : [data[7][1]]
  })
%}

  style_body
  -> "{" _ml style_line_list _ml "}" {% data => data[2] %}

    style_line_list
    -> style_line (__ml style_line):* {%  data => [data[0], ...data[1].map(e => e[1])] %}

  style_line
  -> %identifier %styleValue 
  {% 
    data => ({
      type: "style_line",
      propertie: {
        ...data[0],
        expression: data[1].value.replace(':', '').trim()
      }
    })
  %}

style_applyment
-> %identifier __ "apply" __ (%identifier | style_new_instance)
{% 
  data => ({
    type: "style_applyment",
    target: data[0],
    styleGroup: data[4][0]
  })
%}

style_new_instance
-> "new" __ "style" (__ style_line | _ style_body)
{%
  data => ({
    type: "style_new_instance",
    body: data[3][1].length ? data[3][1] : [data[3][1]]
  })
%}
# STATEMENT DEFINITIONS END



elementType
-> ("div" | "h1" | "p") {% data => data[0][0] %}

_ -> %WS:*
__ -> %WS:+
_ml -> (%WS | %NL):*
__ml -> (%WS | %NL):+
_enter -> %NL:*
__enter -> %NL:+
_tab -> (_ %NL):* _
__tab -> (_ %NL):+ _