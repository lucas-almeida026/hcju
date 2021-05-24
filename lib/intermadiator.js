const $state = new Proxy({}, {
  set: function (target, key, value) {
    onStateChange(key, value)
    target[key] = value
    return true
  }
})
const setState = obj => Object.keys(obj).forEach(k => $state[k] = obj[k])
// const getState = () => $state

function onStateChange(key, value){
  // console.log(key, value)
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

const createElement = (type, parent, repeat = 0) => {
  if(repeat > 0){
    let group = []
    for(let i = 0; i < repeat; i++){
      const el = document.createElement(type)
      parent.appendChild(el)
      group.push(el)
    }
    return group
  }else{
    const el = document.createElement(type)
    parent.appendChild(el)
    return el
  }  
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
  background: cssBg
}
const createStyleGroup = (styleInstructions) => {
  let res = {}
  const tmp = document.createElement('div')
  const instructions = styleInstructions.split(';')
  instructions.forEach(e => {
    const pair = e.split(':')
    if(!!dictionaryCSSProperties[pair[0]]){
      res = {...res, ...dictionaryCSSProperties[pair[0]](pair)}
    }else if(pair[1].split(' ').length < 2){
      if (Object.keys(tmp.style).includes(pair[0])) {
        res[pair[0]] = pair[1]
      }else{
        throw new Error(`Invalid css propertie "${pair[0]}"`)
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

export default {
  createElement,
  applyStyleGroupInElement,
  insertTextInElement,
  createStyleGroup,
  setPlatformRules
}

//Style Interpretation Functions
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

  /**
   * if position = 0 & contem (row | col | colum)
   *  -> flexDirection
   * 
   * if position = 1 & contem (start | center | end | evenly | around | between)   
   *  -> se --position = row -> justifyContent
   *  -> se --position = column -> alignItems
   * 
   * if position = 2 & contem (start | center | end | evenly | around | between)   
   *  -> se --position = row -> alignItems
   *  -> se --position = column -> justifyContent
   * 
   * if position = 1 & sou wrap
   *  -> se ++position = normal -> flexWrap
   *  -> se ++position = reverse -> flexWrap
   *  -> se ++position is undefined -> flexWrap normal
   */
  const directions = ['column', 'row']
  if(expr.includes('col')) expr[expr.indexOf('col')] = 'column'
  expr.forEach((e, i, arr) => {
    if(i == 0){
      if(!directions.includes(e)) 
        throw new Error(`The style expression "${pair.join(': ')}" contains error\nUnexpected -> "${e}"`)
      res.flexDirection = e
    }
    if(i == 1 && e !== "wrap"){
      if(arr[i-1] == "row"){
        if(!Object.keys(justifyContent).includes(e)) 
          throw new Error(`The style expression "${pair.join(': ')}" contains error\nUnexpected -> "${e}"`)
        res.justifyContent = justifyContent[e]
      }else{
        if(!Object.keys(alignItems).includes(e)) 
          throw new Error(`The style expression "${pair.join(': ')}" contains error\nUnexpected -> "${e}"`)
        res.alignItems = alignItems[e]
      }
    }
    if(i == 2){
      if(e == "wrap"){
        throw new Error(`The style expression "${pair.join(': ')}" contains error\nUnexpected -> "${e}"`)
      }else{
        if(arr[i-2] == "row"){
          if(!Object.keys(alignItems).includes(e)) 
            // throw new Error(`The style expression "${pair.join(': ')}" contains error\nUnexpected -> "${e}"`)
          res.alignItems = alignItems[e]        
        }else{
          if(!Object.keys(justifyContent).includes(e)) 
            throw new Error(`The style expression "${pair.join(': ')}" contains error\nUnexpected -> "${e}"`)
          res.justifyContent = justifyContent[e]
        }
      }
    }
    if(i == 1 && e === "wrap"){
      console.log(e, arr[i+1])
      if(!!arr[i+1]){
        if(arr[i+1] != "normal" || arr[i+1] != "reverse") 
          // throw new Error(`The style expression "${pair.join(': ')}" contains error\nUnexpected -> "${arr[i+1]}"`)
        if(arr[i+1] == "normal") res.flexWrap = 'wrap'
        if(arr[i+1] == "reverse") res.flexWrap = 'wrap-reverse'
      }else{
        res.flexWrap = 'wrap'
      }
    }
  })

  // if(expr[0] === 'col') expr[0] = 'column'
  // if(expr.length == 1){
  //   res.flexDirection = expr[0]
  // }else if(expr.length == 2){
  //   if(!['row', 'column'].includes(expr[0])) throw new Error(`The style expression "${pair.join(': ')}" contains error`)
  //   if(expr[1] === 'wrap'){
  //     if(!!expr[2]){

  //     }else{

  //     }
  //   }
  // }else if(expr.length == 3){

  // }

  function setWrap(){

  }
  // if(e[0] === "row" || (e[0] === "column" || e[0] === "col")){
  //   if(e[0] === 'col') e[0] = 'column'
  //   res.flexDirection = e[0]
  // }else{
  //   throw new Error(`Invalid value for ${pair[0]} in "${pair[0]}: ${pair[1]}"`)
  // }
  // if(e[1]){
  //   if(e[0] == "column"){
  //     if(availableAI[e[1]]) res.alignItems = availableAI[e[1]]
  //     if(!availableAI[e[1]]) console.warn(`Unavailable value '${e[1]}' in '${pair.join(': ')}' was replaced by 'center' \nExpected values: ${Object.entries(availableAI).map(e => `"${e[0]}"`).join(' | ')}`)
  //   }else{
  //     if(availableJC[e[1]]) res.justifyContent = availableJC[e[1]]
  //     if(!availableJC[e[1]]) console.warn(`Unavailable value '${e[1]}' in '${pair.join(': ')}' was replaced by 'center' \nExpected values: ${Object.entries(availableJC).map(e => `"${e[0]}"`).join(' | ')}`)
  //   }          
  // }
  // if(e[2]){
  //   if(e[0] == "row"){
  //     if(availableAI[e[2]]) res.alignItems = availableAI[e[2]]
  //     if(!availableAI[e[2]]) console.warn(`Unavailable value '${e[2]}' in '${pair.join(': ')}' was replaced by 'center' \nExpected values: ${Object.entries(availableAI).map(e => `"${e[0]}"`).join(' | ')}`)
  //   }else{
  //     if(availableJC[e[2]]) res.justifyContent = availableJC[e[2]]
  //     if(!availableJC[e[2]]) console.warn(`Unavailable value '${e[2]}' in '${pair.join(': ')}' was replaced by 'center' \nExpected values: ${Object.entries(availableJC).map(e => `"${e[0]}"`).join(' | ')}`)              
  //   }          
  // }
  return res
}

function cssWidth(pair){
  const res = {}
  res[pair[0]] = pair[1]
  return res
}

function cssHeight(pair){
  const res = {}
  res[pair[0]] = pair[1]
  return res
}

function cssBg(pair){
  const res = {}
  res.background = pair[1]
  return res
}