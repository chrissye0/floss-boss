const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')


//have a timer for if the tooth has a brushing pattern (true/false for like 1-2 sec
//make isburhsing true same for if it is all false for 1-2 sec then make it all false for isbrushing)
//doing on tuesday^^^^
//we can also look at the numerical light levels as well to determine the isbrushing state
//(if the true or false does not work)^^^^
//adding a line chart on the front end to see brushing (as a numerical value and also in the console)

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