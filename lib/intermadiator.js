const $state = new Proxy({}, {
  set: function (target, key, value) {
    onStateChange(key, value)
    target[key] = value
    return true
  }
})
const setState = obj => Object.keys(obj).forEach(k => $state[k] = obj[k])
const getState = () => $state

const $conditionalStyles = []

function onStateChange(key, value){
  $conditionalStyles.forEach(e => {
    if(`$${e.key}` === key && value === true){
      applyStyleGroupInElement(e.ref, e.styleGroup)
    }
  })
}

class Observable {
  constructor() {
    let observers = []
    this.subscribe = function (fn) {
      observers.push(fn)
    }
    this.unsubscribe = function (fn) {
      observers = observers.filter(e => e !== fn)
    }
    this.notify = function (e) {
      observers.forEach(fn => fn(e))
    }
    this.clear = function () {
      observers = []
    }
  }
}

const createElement = (type, parent, repeat = 1) => {
  let group = []
  if(parent.forEach){
    parent.forEach(p => {
      for(let i = 0; i < repeat; i++){
        const el = document.createElement(type)
        p.appendChild(el)
        group.push(el)
      }
    })
    return group
  }
  for(let i = 0; i < repeat; i++){
    const el = document.createElement(type)
    parent.appendChild(el)
    group.push(el)
  }
  if(group.length === 1) group = group[0]
  return group
}

const insertTextInElement = (target, text) => {
  if (!target) throw new Error('Element required')
  if (!text) throw new Error('Element required')
  if (typeof target !== 'object') throw new Error('Element must be a object')
  if (!target.nodeName) throw new Error('Element must be a html element')
  if (typeof text !== 'string') throw new Error('Text must be a string')
  if (!!target.children) {
    target.appendChild(document.createTextNode(text))
  } else {
    target.innerText = text
  }
}

const dictionaryCSSProperties = {
  alignment: cssAlignment,
  width: cssWidth,
  height: cssHeight,
  bg: cssBg,
  background: cssBg,
  shape: cssShape,
}
const createStyleGroup = (styleInstructions, references) => {
  let res = {}
  const tmp = document.createElement('div')
  const instructions = styleInstructions.split(';')
  instructions.forEach(e => {
    const pair = e.split(':')
    if(pair.length == 2) {
      if(!!dictionaryCSSProperties[pair[0]]){
        res = {...res, ...dictionaryCSSProperties[pair[0]](pair, references)}
      }else if(pair[1].split(' ').length < 2){
        if (Object.keys(tmp.style).includes(pair[0])) {
          res[pair[0]] = pair[1]
        }else{
          throw new Error(`Invalid css propertie "${pair[0]}"`)
        }
      }
    }    
  })
  return res
}

const applyStyleGroupInElement = (el, styles) => {
  if(el.length > 0){
    el.forEach(element => {      
      Object.entries(styles).forEach(e => element.style[e[0]] = e[1])
    })
  }else{
    Object.entries(styles).forEach(e => el.style[e[0]] = e[1])
  }
}

const compareStates = (newState, oldState) => {
  return Object.keys(newState).reduce((acm, k) => {
    if(!acm) return false
    return newState[k] === oldState[k]
  }, true)
}

const setPlatformRules = (rules) => {
  const preState = {}
  let lastState = $state
  rules.forEach(r => {
    preState[`$${r.identifier}`] = r.expression(window.innerWidth)
  })
  setState(preState)
  window.addEventListener('resize', () => {
    const preState = {}
    rules.forEach(r => {
      preState[`$${r.identifier}`] = r.expression(window.innerWidth)
    })
    if(!compareStates(preState, lastState)){
      lastState = preState
      setState(preState)
    }
  })
}

const setConditionalStyle = (key, element, styleGroup) => {
  $conditionalStyles.push({
    key,
    ref: element,
    styleGroup
  })
  return () => applyStyleGroupInElement(element, styleGroup)
}

export default {
  createElement,
  applyStyleGroupInElement,
  insertTextInElement,
  createStyleGroup,
  setPlatformRules,
  onStateChange,
  setConditionalStyle,
  getState
}

//Style Interpretation Functions
  //Util functions
  const isTypeOfNumberWithUnit = (string) => !!string.match(/(0|\d+(px|%|vw|vh|rem|em))/g)[0] ? string === string.match(/(0|\d+(px|%|vw|vh|rem|em))/g)[0] : false

function cssAlignment(pair){
  const res = {}
  //default
  res.display = 'flex'
  res.justifyContent = 'center'
  res.alignItems = 'center'
  //---
  const alignItems = {'start': 'flex-start', 'center': 'center', 'end': 'flex-end'}
  const justifyContent = {
    'start': 'flex-start', 
    'center': 'center', 
    'end': 'flex-end', 
    'evenly': 'space-evenly', 
    'around': 'space-around', 
    'between': 'space-between'
  }
  const expr = pair[1].split(' ')
  const directions = ['column', 'row']
  if(expr.includes('col')) expr[expr.indexOf('col')] = 'column'
  expr.forEach((e, i, arr) => {
    if(i == 0){
      if(!directions.includes(e)) 
        throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${e}"`)
      res.flexDirection = e
    }
    if(i == 1 && e !== "wrap"){
      if(arr[i-1] == "row"){
        if(!Object.keys(justifyContent).includes(e)) 
          throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${e}"`)
        res.justifyContent = justifyContent[e]
      }else{
        if(!Object.keys(alignItems).includes(e)) 
          throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${e}"`)
        res.alignItems = alignItems[e]
      }
    }
    if(i == 2){
      if(e == "wrap"){
        throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${e}"`)
      }else{
        if(arr[i-2] == "row"){
          if(!Object.keys(alignItems).includes(e)) 
            throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${e}"`)
          res.alignItems = alignItems[e]        
        }else{
          if(!Object.keys(justifyContent).includes(e)) 
            throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${e}"`)
          res.justifyContent = justifyContent[e]
        }
      }
    }
    if((i == 1 || i == 3) && e === "wrap"){
      if(!!arr[i+1]){
        if(arr[i+1] != "normal" && arr[i+1] != "reverse") 
          throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${arr[i+1]}"`)
        if(arr[i+1] == "normal") res.flexWrap = 'wrap'
        if(arr[i+1] == "reverse") res.flexWrap = 'wrap-reverse'
      }else{
        res.flexWrap = 'wrap'
      }
    }
  })
  return res
}

function cssWidth(pair, references){  
  const res = {}
  const expr = pair[1].split(' ')
  expr.forEach((e, i, arr) => {
    if(!isTypeOfNumberWithUnit(arr[0])) throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${arr[0]}"\nExpecting 0 | <number> + (px | % | vw | vh | rem | em)`)

    if(i == 0) res.width = e

    if(i == 1 && e === "of"){
      if(isTypeOfNumberWithUnit(arr[0].replace('%', ''))) throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${arr[0]}"\nExpecting some percentual value`)
      if(!arr[2]) throw new Error(`The style expression "${pair.join(': ')}"\nExpecting a reference to compair"`)

      let percentual = +arr[0].replace('%', '') !== 0 ? +arr[0].replace('%', '') / 100 : 0
      if(arr[2] === 'window') {
        res.width = Math.floor(window.innerWidth * percentual) + 'px'
        return res
      }
        
      const resRef = references.filter(e => e.name === arr[2])
      if(!!resRef.length) {
        res.width = Math.floor(resRef[0].ref.offsetWidth * percentual) + 'px'
      }else{
        throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${arr[2]}" - the variable reference does not exist`)
      }
    }
  })

  if(expr.includes('max') || expr.includes('min')){
    const rest = expr.includes('of') ? expr.slice(3, expr.length) : expr.slice(1, expr.length)
    rest.forEach((e, i, arr) => {
      const isKey = i % 2 == 0 && i != 1
      if(isKey){
        if(!['max', 'min'].includes(e))throw new Error(`The style expression "${pair.join(': ')}" contains an erro\nUnexpected -> "${e}"\nExpecting (min | max) as flag key`)
        if(!arr[i + 1]) throw new Error(`The style expression "${pair.join(': ')}" contains an erro\nExpecting a value assignment for ${e} flag`)
        if(!isTypeOfNumberWithUnit(arr[i + 1])) throw new Error(`The style expression "${pair.join(': ')}" contains an erro\nUnexpected -> "${arr[i + 1]}"\nExpecting 0 | <number> + (px | % | vw | vh | rem | em)`)
          e === 'max' ? res.maxWidth = arr[i + 1] : res.minWidth = arr[i + 1]
      }
    })
  }

  return res
}

function cssHeight(pair){
  const res = {}
  const expr = pair[1].split(' ')
  expr.forEach((e, i, arr) => {
    if(!isTypeOfNumberWithUnit(arr[0])) throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${arr[0]}"\nExpecting 0 | <number> + (px | % | vw | vh | rem | em)`)

    if(i == 0) res.height = e

    if(i == 1 && e === "of"){
      if(isTypeOfNumberWithUnit(arr[0].replace('%', ''))) throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${arr[0]}"\nExpecting some percentual value`)
      if(!arr[2]) throw new Error(`The style expression "${pair.join(': ')}"\nExpecting a reference to compair"`)

      let percentual = +arr[0].replace('%', '') !== 0 ? +arr[0].replace('%', '') / 100 : 0
      if(arr[2] === 'window') {
        res.height = Math.floor(window.innerHeight * percentual) + 'px'
        return res
      }
        
      const resRef = references.filter(e => e.name === arr[2])
      if(!!resRef.length) {
        res.height = Math.floor(resRef[0].ref.offsetHeight * percentual) + 'px'
      }else{
        throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${arr[2]}" - the variable reference does not exist`)
      }
    }
  })

  if(expr.includes('max') || expr.includes('min')){
    const rest = expr.includes('of') ? expr.slice(3, expr.length) : expr.slice(1, expr.length)
    rest.forEach((e, i, arr) => {
      const isKey = i % 2 == 0 && i != 1
      if(isKey){
        if(!['max', 'min'].includes(e))throw new Error(`The style expression "${pair.join(': ')}" contains an erro\nUnexpected -> "${e}"\nExpecting (min | max) as flag key`)
        if(!arr[i + 1]) throw new Error(`The style expression "${pair.join(': ')}" contains an erro\nExpecting a value assignment for ${e} flag`)
        if(!isTypeOfNumberWithUnit(arr[i + 1])) throw new Error(`The style expression "${pair.join(': ')}" contains an erro\nUnexpected -> "${arr[i + 1]}"\nExpecting 0 | <number> + (px | % | vw | vh | rem | em)`)
          e === 'max' ? res.maxHeight = arr[i + 1] : res.minHeight = arr[i + 1]
      }
    })
  }
  return res
}

function cssShape(pair){
  const res = {}
  const expr = pair[1].split(' ')

  if(expr.length > 2) throw new Error(`The style expression "${pair.join(': ')}" contains an error\nExpects (circle | square) && <number> + (px | vw | vh | rem | em)`)

  if(expr.length == 1) throw new Error(`The style expression "${pair.join(': ')}" contains an error\nOne argument is missing`)

  if(!['circle', 'square'].includes(expr[0])) throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${expr[0]}"\nExpecting (circle | square)`)

  if(!isTypeOfNumberWithUnit(expr[1])) throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${expr[1]}"\nExpecting <number> + (px | vw | vh | rem | em)`)

  if(expr[1] == '0') throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${expr[1]}"\nExpecting a value greater then 0`)

  if(!isTypeOfNumberWithUnit(expr[1].replace('%', ''))) throw new Error(`The style expression "${pair.join(': ')}" contains an error\nUnexpected -> "${expr[1]}"\nPercentage values are not allowed`)
  
  res.width = expr[1]
  res.height = expr[1]
  if(expr[0] == 'circle') res.borderRadius = '50%'
  return res
}

function cssBg(pair){
  const res = {}
  res.background = pair[1]
  return res
}