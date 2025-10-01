//Starts the one way socket so we can detect the game state (true or false
//brushing motion)

const init = () => {

    const evtSource = new EventSource("/gamedata");
    evtSource.onmessage = (event) => {
        const gamestate = JSON.parse(event.data).gameState;
        console.log(gamestate)
        //based on the activetooth index change the svg for animations 
        if(gamestate.activeToothIndex === 0) {
            //do the animation for the first tooth 
            //find web front end run time RIVE library (so we can use something more
            //native to RIVE to incorporate animations)(so we can incorporate RIVE files in
            //our project) 
            //tell RIVE to change its state instead of directly editing the HTML to
            //change animations (like changing state to ready, set, then go for the game screen
            //before starting the game)
            //for devs we just hit the play button and play the animation its up to the designers
            //to make the animation fully
            //with using the SVG files we have to time everything and its mor complicated
            //so use the library and have designers make the animation perfect so we can just
            //put it in and press play
            //should be one liners to change state for brushing, dirty teeth, or clean teeth

            

        }
         if(gamestate.activeToothIndex === 1) {
            //do the animation for the second tooth 
        }
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