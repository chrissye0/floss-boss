const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const connect = (handler) => {
  let port = new SerialPort({ path: 'COM3', baudRate: 9600 });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

  port.on('open', () => {
    console.log('Serial port opened. Listening...\n')
  })

  parser.on('data', (line) => {
    // const data = line.trim().split(',')
    //console.log('Arduino says:', data)


    //pass in handler function from server.js
    handler(line)

  });

  port.on('error', (err) => {
    console.log('💣 Could not connect to Arduino on port COM3');
    console.log(err);
  });

  return port

}

module.exports = connect;