const express = require('express')
const app = express()
const path = require('path')
const PORT = 3000
const connect = require('./arduino-connect.js')
const handleData = require('./arduino-data-handler.js')
const gameState = require('./game-state.js')


connect(handleData)


app.use('/assets', express.static(path.resolve(`${__dirname}/../client/`)))

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '/../client', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 eServer is running at http://localhost:${PORT}`)
})

//shows the data from the arduino onto the index.html page
app.get('/gamedata', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    //res.write('data: ' + JSON.stringify({message: 'Hello world'}) + '\n\n');

    //send in gamestate
    const sendData = () => {
        const data = JSON.stringify({gameState});
        res.write(`data: ${data}\n\n`);
    }
    const intervalId = setInterval(sendData, 50);

    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
});

app.listen(3000, () => {
    console.log('Running');
});

