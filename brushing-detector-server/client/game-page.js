//Starts the one way socket so we can detect the game state (true or false
//brushing motion)

const init = () => {

    const indicator = document.getElementById('brush-indicator')

    const evtSource = new EventSource("/gamedata");
    evtSource.onmessage = (event) => {
        const gamestate = JSON.parse(event.data).gameState;
        // console.log(gamestate)
        //based on the activetooth index change the svg for animations 
        if(gamestate.activeToothIndex === 0 && gamestate.isBrushing) {
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

            //try the ready,set, go animation on RIVE
            //for now you can put a germ or something if a tooth is detected 

            //next thursday have animations with bruhing motion and having that working with specific teeth 
            
            indicator.style.backgroundColor = 'blue'

        }
        if(gamestate.activeToothIndex === 1 && gamestate.isBrushing) {
            //do the animation for the second tooth 
            indicator.style.backgroundColor = 'red'
        }
        //not working for the else (same for above statements)**
        else{
            indicator.style.backgroundColor = 'gray'
        }
    };

    const startSeconds = 120;

    let remaining = startSeconds;

    const display = document.getElementById('timer-text');

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return minutes + ":" + String(seconds).padStart(2, '0');
    }

    const updateTimeDisplay = () => {
        display.textContent = formatTime(remaining);
        if (remaining > 0) {
            remaining--;
        } else {
            clearInterval(timerInterval);
            window.location.href = 'end-screen.html';
        }
    }
    
    updateTimeDisplay();
    const timerInterval = setInterval(updateTimeDisplay, 1000);
}

window.onload = init;

//start working here for game page html page 