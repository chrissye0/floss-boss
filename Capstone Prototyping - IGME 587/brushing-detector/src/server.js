const express = require('express')
const app = express()
const PORT = 3000
const gameState = require('./serial/index.js')

app.use(express.static('public'))

app.listen(PORT, () => {
  console.log(`🚀 eServer is running at http://localhost:${PORT}`)
})

