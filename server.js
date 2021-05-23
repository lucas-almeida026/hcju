const express = require('express')
// import asd from './lib/index.js'

const app = express()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/index.js', (req, res) => {
  res.sendFile(__dirname + '/index.js')
})

app.get('/lib/intermadiator.js', (req, res) => {
  res.sendFile(__dirname + '/lib/intermadiator.js')
})

app.listen(8000, () => console.log('listening at por 8000'))