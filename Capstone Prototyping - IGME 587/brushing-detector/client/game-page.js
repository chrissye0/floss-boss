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

    const startSeconds = 120;

    let remaining = startSeconds;
    // let timerId = null;
    // let running = false;

    const display = document.getElementById('timer-text');

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return minutes + ":" + String(seconds).padStart(2, '0');
    }

    const updateTimeDisplay = () => {
        display.textContent = formatTime(remaining);
    }

    function tick() {
        if (remaining <= 0) {
            stopTimer();
            remaining = 0;
            updateTimeDisplay();
            return;
        }
        remaining -= 1;
        updateTimeDisplay();
    }

    // tick();
}

window.onload = init;

//start working here for game page html page 