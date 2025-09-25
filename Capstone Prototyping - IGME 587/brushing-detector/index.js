const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')


const gameState = {}

const port = new SerialPort({ path: 'COM3', baudRate: 9600 });

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))


port.on('open', () => {
  console.log('Serial port opened. Listening...\n')
})

parser.on('data', (line) => {
  const data = line.trim()
  console.log('Arduino says:', data)

  if (data === 'Brushing motion detected!') {
    console.log('⚡️ ALERT: Brushing motion detected!')
    gameState.isBrushing = true
  }
  else{
    gameState.isBrushing = false 
  }
})
