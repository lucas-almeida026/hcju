import myLib from './lib/intermadiator.js'
myLib.setPlatformRules([{identifier: 'mobile', expression: (value) => value <= 400 && value > 0}, {identifier: 'tablet', expression: (value) => value <= 900 && value > 400}])


const body = myLib.createElement('div', document.body, NaN)
myLib.applyStyleGroupInElement(body, myLib.createStyleGroup('width:100%;height:100vh;bg:gray;alignment:col'))
const card = myLib.createElement('div', body, NaN)
myLib.applyStyleGroupInElement(card, myLib.createStyleGroup('width:90%;maxWidth:400px;bg:white;height:300px;alignment:row wrap'))
const cardItemStl = myLib.createStyleGroup('width:30px;height:30px;bg:#0078aa;margin:10px')
const a = myLib.createElement('div', card, 4)
myLib.applyStyleGroupInElement(a, cardItemStl)
const b = myLib.createElement('div', card, 3)
myLib.applyStyleGroupInElement(b, myLib.createStyleGroup('width:30px;height:30px;borderRadius:50%;bg:green;margin:35px'))