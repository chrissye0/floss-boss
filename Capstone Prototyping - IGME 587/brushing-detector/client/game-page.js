//Starts the one way socket so we can detect the game state (true or false
//brushing motion)
const init = () => {
    const content = document.getElementById('content');

    const evtSource = new EventSource("/gamedata");
    evtSource.onmessage = (event) => {
        const gamestate = JSON.parse(event.data).gameState;
        console.log(gamestate)
        content.innerText = gamestate.isBrushing;
    };
}

window.onload = init;

//start working here for game page html page 