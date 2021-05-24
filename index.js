import myLib from './lib/intermadiator.js'
const $elementStyles = []
window.addEventListener('resize', () => $elementStyles.forEach(fn => fn()))
const $references=[]
const body=myLib.createElement('div',document.body, NaN)
$references.push({name:'body',ref:body})
myLib.applyStyleGroupInElement(body,myLib.createStyleGroup('width:100vw;height:100vh;bg:gray;alignment:col',$references))
$elementStyles.push(() => myLib.applyStyleGroupInElement(body,myLib.createStyleGroup('width:100vw;height:100vh;bg:gray;alignment:col',$references)))
const card=myLib.createElement('div',body,NaN)
$references.push({name:'card',ref:card})
myLib.applyStyleGroupInElement(card,myLib.createStyleGroup('width:70% max 700px min 400px;bg:white;height:70% max 700px min 400px;alignment:row center center wrap',$references))
$elementStyles.push(() => myLib.applyStyleGroupInElement(card,myLib.createStyleGroup('width:70% max 700px min 400px;bg:white;height:70% max 700px min 400px;alignment:row center center wrap',$references)))
const cardItemStl=myLib.createStyleGroup('width:30px;height:30px;bg:#0078aa;margin:10px')
const a=myLib.createElement('div',card,4)
myLib.applyStyleGroupInElement(a,cardItemStl)
$references.push({name:'a',ref:a})
const b=myLib.createElement('div',card,3)
myLib.applyStyleGroupInElement(b,myLib.createStyleGroup('width:30px;height:30px;borderRadius:50%;bg:green;margin:35px',$references))
$references.push({name:'b',ref:b})