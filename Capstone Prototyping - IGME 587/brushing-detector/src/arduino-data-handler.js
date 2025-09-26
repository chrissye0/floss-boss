
const gameState = require('./game-state')

const handleData = (data) => {
if (data === 'Brushing motion detected!') {
    console.log('⚡️ ALERT: Brushing motion detected!')
    gameState.isBrushing = true
  }
  else {
    gameState.isBrushing = false
  }

}

module.exports = handleData;