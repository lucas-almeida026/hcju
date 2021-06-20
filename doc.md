# HCJU Doc

A simple documentation for HCJU

## First install the cli
`npm i hcju-cli -g` to install globally

## Creating a project
`hcju new <project_name>` to create a new hcju project folder in the current path
Then enter the project folder `cd <project_name>`
`npm i | yarn add` to install all dependencies
`hcju serve` to start de nodemon, you must have nodemon installed globally
Finally enter open the VS code in the project folder and start the live server extension

## File tree

📦<project_name> <br>
 ┣ 📂compiler //ignore <br>
 ┣ 📜index.hcju <br>
 ┣ 📜index.html <br>
 ┣ 📜index.js <br>
 ┣ 📜nodemon.json //ignore <br>
 ┗ 📜package.json //ignore <br>

All files of compile folder are used to build the final index.js file.

After runnig the `hcju serve` command any changes to `index.hcju` will be updated in `index.js`
You don't have to worry about the HTML file, all styles and components are post processed by the JS file

## Summary
* [Creating an element](#creating-an-element)
* [Creating multiple elements](#creating-multiple-elements)
* [Creating styles](#creating-styles)
* [Styling multiple elements](#styling-multiple-elements)
* [Head](#head)
* [Defining platform rules](#defining-platform-rules)
* [Specifying styles by platform](#specifying-styles-by-platform)
* [CSS styles](#css-styles)

## Creating an element
Command: <element_name> = new <html_tag_name> in <parent_element | window>

* element_name: Name of the constant that will store the element
* html_tag_name: The tag name such as "div", "h1", "p", etc.
* parent_element | window: Name of the constant that contains the element you want to append the new element to OR the literal name "window" that will append the new element directly to the body tag.

```
bg = new div in window
title = new h1 in bg
```

## Creating multiple elements
Command: <element_name> = new <number_of_elements> <html_tag_name> in <parent_element | window>
* element_name: Name of the constant that will store the element
* number_of_elements: a positive integer number.
* html_tag_name: The tag name such as "div", "h1", "p", etc.
* parent_element | window: Name of the constant that contains the element you want to append the new element to OR the literal name "window" that will append the new element directly to the body tag.

```
bg = new div in window
block = new 5 div in bg
```
## Creating styles
### Inline style:
Command: <style_name> = new style <inline_style>
* style_name: Name of the constant that will store the style group.
* inline_style: A css instruction.

```
myStyle = new style background: #fff
```

### Block of styles:
Command: <style_name> = new style <block_of_styles>
* style_name: Name of the constant that will store the style group.
* block_of_styles: One or more css instruction wrapped by braces.

```
myStyle = new style {
  background: #fff
  color: red
  fontSize: 1rem
}
```

## Styling multiple elements
Command: <element_name | element_group_name> apply <style_name | new_style>
* element_name | element_group_name: Name of the constant that represents an element or a group of elements
* style_name | new_style: Name of the constant that represents a style or a new style

### Using previously created style:
```
bg = new div in window
bgStyle = new style {
  background: #333
  width: 100%
  heigth: 100vh
}
bg apply bgStyle
```

### Using instantly created style:
```
bg = new div in window
bg apply new style {
  background: #333
  width: 100%
  heigth: 100vh
}
```

## Head
The HEAD section is an optional section that you can use to define platform rules, that will be used to make your site responsive.
### Defining platform rules
Commnad: <platform_name> when screen between <number1> and <number2>
* platform_name: Name of the constant that will store the condition
* number1: any integer posivite number
* number2: any integer posivite number

THE TRANSPILER AUTOMATICALLY COMPARES THE HIGHEST VALUE WITH THE SMALLEST
```
HEAD{
  def PLATFORM_RULES{
    mobile when screen between 0 and 400
  }
}
```

## Specifying styles by platform
Once the platform rules has been setted, you can easily add conditional styles based in the rules
```
bg apply new style {
  background: black
  in mobile overwrite {
    background: red
  }
}
```

## CSS styles
To create your styles ypu can use all of the css properties from javascript (camel case) like "width", "background", "backgroundColor", "fontSize", ect.
```
myStyle = new style {
  backgroundColor: red
}
```
But you can also use some shortcuts and others properties:
```
myStyle = new style {
  bg: red
}
```

## Shortcuts
* bg: abreviation for background

## New or edited properties
* **alignment**: 
Command: alignment: (row | column | col) ((start | center | end)? | (start | center | end | evenly | around | between)?)? (wrap)? (normal | reverse)?
Automatically set the display to flex, use `row` to set flex-direction to row, use `column` ou `col` to set flex-direction to column, use `start`, `center`, `end` | `start`, `center`, `end`, `evenly`, `around`, `between` to set justify-content and align-items, use `wrap` to set flex-wrap (automatically set to normal), use `normal` | `reverse` after `wrap` to modify it.

* **width**: 
Command: width: (<value_with_unit> | <percent_value> of (<element_name> | window)) (min <value_with_unit>)? (max <value_with_unit>)?
Set the width, `min` set the min width, `max` set the max width, <percent_value> of (<element_name> | window) set the width relative to another element or the body
  * value_with_unit: < number > (px | % | vw | vh | rem | em)
  * percent_value: < number > %

* **height**: 
Command: height: (<value_with_unit> | <percent_value> of (<element_name> | window)) (min <value_with_unit>)? (max <value_with_unit>)?
Set the width, `min` set the min height, `max` set the max height, <percent_value> of (<element_name> | window) set the height relative to another element or the body
  * value_with_unit: < number > (px | % | vw | vh | rem | em)
  * percent_value: < number > %

* **shape**: 
Command: shape: (square | circle) < number > (px | vw | vh | rem | em)
Automatically set the width and the height to the value < number >