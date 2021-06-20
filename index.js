import myLib from './lib/intermadiator.js'
const $elementStyles = []
const applyConditionalStyles = () => {if($elementStyles.length > 0)$elementStyles.forEach(e => e.conditionalStyles.length > 0?(e.conditionalStyles.forEach(s => {myLib.getState()[`$${s.conditionalKey}`]?eval(s.conditionalFunction):eval(e.styleFunction)})):eval(e.styleFunction))}
window.addEventListener('resize', () => {applyConditionalStyles()})
const $references=[]
const bg=myLib.createElement('div',document.body, 1)
$references.push({name:'bg',ref:bg})
const t=myLib.createElement('div',bg,1)
$references.push({name:'t',ref:t})
applyConditionalStyles()