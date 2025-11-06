//Starts the one way socket so we can detect the game state (true or false
//brushing motion)

//IDEAS FOR FLOSSING DITCH RFID:
//stretch sensor for flossing with rubber for the floss and say if they are flossing that
//way or not
//look into stretch sensor 
//get rubber cord and pick us resistance of it for which tooth we
//are on or brushing (conductive thread detection from travis (he has the thread))

//IDEAS FOR ANIMATION FOR BRUSH DETECTION:

//have animation be non-obvious for the first brush or like at the start motion 
//(like have a delay because we may just be moving our brush from one tooth
//to another and it may not exactly be brushing one tooth)
//when we keep up the brushing then we can do the animation (after the first brush motion)
//we can have a delay for if we are detecting brushing for the animaton (so we 
//do the animation when we recieve the second brush motion (skip the first brushing motion because we may just be
//moving from one tooth to another and not exactly brushing that tooth))

//ANIMATION STUFF from travis:
//do the animation for the first tooth 
//find web front end run time RIVE library (so we can use something more
//native to RIVE to incorporate animations)(so we can incorporate RIVE files in
//our project) 
//tell RIVE to change its state instead of directly editing the HTML to
//change animations (like changing state to ready, set, then go for the game screen
//before starting the game)
//for devs we just hit the play button and play the animation its up to the designers
//to make the animation fully
//with using the SVG files we have to time everything and its morE complicated
//so use the library and have designers make the animation perfect so we can just
//put it in and press play
//should be one liners to change state for brushing, dirty teeth, or clean teeth

//BY TUESDAY HAVE EVERYTHING DONE JUST GOING TO DO DEBUGGING (FULL (MULTIPLE) ROUNDS SHOULD BE PLAYABLE)
//(AND HAVE END SCREEN WITH THE DATA FROM THE ROUND PLAYED)
//CAN JUST HAVE 2 TEETH BE ACTIVE 

const init = () => {

    // const indicator = document.getElementById('brush-indicator');

    const pointDisplay = document.getElementById('points-text');
    // const skipButton = document.getElementById('skipbutton');
    document.getElementById("skipButton").onclick = function () {
        storeVars();
        location.href = "end-screen.html";
    };


    let pointValue = 0;
    let teethCleaned = 0;//increases with each tooth cleaned
    let bactCount = 0; //add logic when we have bacterias
    let toothPointVal = 500;//how many points to add per tooth cleaned
    let flossPointVal = 500; // how many points per tooth flossed (change as needed)

    const startSeconds = 60;
    // const startSeconds = 4;//CHANGE BACK for testing points

    let remaining = startSeconds;

    const display = document.getElementById('timer-text');

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return minutes + ":" + String(seconds).padStart(2, '0');
    }

    let count = 4;
    const countdown = document.getElementById("countdown");

    let riveFilesToLoad = 7; // 6 teeth + 1 progress bar
    const onRiveLoaded = () => {
        riveFilesToLoad--;
        if (riveFilesToLoad === 0) {
            console.log("✅ All Rive files loaded. Starting countdown...");
            startCountdownAndTimer();
        }
    };

    const startCountdownAndTimer = () => {
        const interval = setInterval(() => {
            count--;
            if (count > 1) {
                countdown.textContent = count - 1;
            } else if (count == 1) {
                countdown.textContent = "Go!";
            } else if (count == 0) {
                countdown.textContent = "";
                clearInterval(interval);
            }
        }, 1000);
    };
    
    const updateTimeDisplay = () => {
        display.textContent = formatTime(remaining);
        if (count == 0) {
            progressBar.play();
            if (remaining > 0) {
                remaining--;
            } else {
                clearInterval(timerInterval);
                storeVars();
                window.location.href = 'end-screen.html';
            }
        }
    };

    const timerInterval = setInterval(updateTimeDisplay, 1000);

    const progressBar = new rive.Rive({
        src: "game-page-assets/animations/FB-PROGRESS_BAR.riv",
        canvas: document.getElementById("progress-bar"),
        onLoad: () => {
            progressBar.resizeDrawingSurfaceToCanvas();
            progressBar.playbackSpeed = 10;
            onRiveLoaded();
        },
    });

    const teeth = [];
    for (let i = 1; i < 7; i++) {
        teeth.push({
            id: `tooth-${i}`,
            riveInstance: null,
            cleaningInput: null,
            decayingTrigger: null,
            dirtTimer: null,
            isDirty: true,
            scored: false,
            scrubTimer: null,
            scrubbing: false
        });
    }

    teeth.forEach((tooth) => {
        tooth.riveInstance = new rive.Rive({
            // src: (tooth.id == 'tooth-1' || tooth.id == 'tooth-6') ?  "game-page-assets/animations/FB-FANG.riv" : "game-page-assets/animations/FB-TOOTH-3.riv",
            src: "game-page-assets/animations/FB-TOOTH-3.riv",
            canvas: document.getElementById(tooth.id),
            stateMachines: ['State Machine'],
            onLoad: () => {
                tooth.riveInstance.resizeDrawingSurfaceToCanvas();
                // tooth.riveInstance.play();
                const inputs = tooth.riveInstance.stateMachineInputs("State Machine");
                console.log(inputs);
                tooth.cleaningInput = inputs.find(input => input.name === 'isCleaning' && input.type === 59);
                tooth.decayingTrigger = inputs.find(input => input.name === 'triggerDecay' && input.type === 58);
                console.log(tooth.decayingTrigger);

                // assign random delay before getting dirty
                const randomDelay = Math.random() * 19000 + 1000; // between 1s–20s

                setTimeout(() => {
                    tooth.decayingTrigger.fire(); // trigger decay!
                    tooth.riveInstance.play(); // start dirt animation
                }, randomDelay);

                onRiveLoaded();
            }
        });
    });

    const dirtyTooth = (index) => {
        const tooth = teeth[index];
        clearTimeout(tooth.dirtTimer);

        const time = Math.floor(Math.random() * 5000) + 10000; // between 10s and 15s
        tooth.dirtTimer = setTimeout(() => {
            if (tooth.decayingTrigger) {
                tooth.isDirty = true;
                console.log(`tooth ${index} is dirty`)
                 tooth.decayingTrigger.fire(); // trigger decay!
                tooth.cleaningInput.value = false;
                tooth.scored = false; // allow scoring again next time
            }
        }, time);
    };

    const startScrubbing = (index) => {
        const tooth = teeth[index];
        // if (!tooth.isDirty || tooth.scrubbing) return;

        tooth.scrubbing = true;

        tooth.scrubTimer = setTimeout(() => {
            console.log("erm")
            if (tooth.scrubbing && tooth.isDirty && !tooth.scored) {
                console.log("scrubbing tooothhhh")
                cleanTooth(index);
            }
        }, 500); // must scrub for 0.5 second
    };

    const stopScrubbing = (index) => {
        const tooth = teeth[index];
        if (tooth.scrubbing) {
            clearTimeout(tooth.scrubTimer);
            tooth.scrubbing = false;
        }
    };

    const cleanTooth = (index) => {
        const tooth = teeth[index];
        console.log(tooth.isDirty);
        if (tooth.cleaningInput && tooth.isDirty) {
            clearTimeout(tooth.dirtTimer);
            tooth.cleaningInput.value = true;
            // Mark tooth as clean (can’t score again until dirty)
            tooth.isDirty = false;
            tooth.scored = true;
            tooth.scrubbing = false;

            teethCleaned++;
            pointValue += toothPointVal;
            updatePointDisplay();

            setTimeout(() => {
                    dirtyTooth(index);
                    tooth.cleaningInput.value = false;
                }, 3000);
        }
    };

    // FLOSSING TEETH
    // SKELETON CODE FOR NOW - UPDATE ONCE WE HAVE RIVE FILES
    const flossTooth = (index) => {
        console.log(`flossing tooth ${index}`);
        bactCount++;
        pointValue += flossPointVal;
        updatePointDisplay();
    }; 

    const updatePointDisplay = () => {
        pointDisplay.innerHTML = pointValue;
    }

    storeVars = () => {
        localStorage.setItem("finalPoints", pointValue);//sends point value
        localStorage.setItem("totalTeeth", teethCleaned);//sends teeth count
        localStorage.setItem("totalBact", bactCount);//sends teeth count
    }

    const evtSource = new EventSource("/gamedata");
    evtSource.onmessage = (event) => {
        const gamestate = JSON.parse(event.data).gameState;
        console.log(JSON.stringify(gamestate, null, 2));
        if (count != 0) return;
        // Reset indicator color
        // indicator.style.Color =x 'gray';

        teeth.forEach((tooth, index) => {
            if (!tooth.cleaningInput) return;
            if (!tooth.decayingTrigger) return;

            if (gamestate.activeToothIndex === index && gamestate.isBrushing) {
                startScrubbing(index);

                // turn on the cleaning animation while brushing
                if (tooth.leaningInput && !tooth.scrubbingAnimation) {
                    tooth.cleaningInput.value = true;
                    tooth.scrubbingAnimation = true;
                }
                // indicator.style.backgroundColor = index === 0 ? 'blue' : 'red';
            } else {
                stopScrubbing(index);

                // turn off the cleaning animation when brushing stops
                if (tooth.cleaningInput && tooth.scrubbingAnimation) {
                    tooth.cleaningInput.value = false;
                    tooth.scrubbingAnimation = false;
                }
            }
        });



    };

    //KEY PRESS TESTINGGGG
    //scrubbing dfghjk tooth 1-6 
    document.addEventListener('keydown', (event) => {
        console.log('key pressed!!!');
        if (event.key === 'd' || event.key === 'D') {
            console.log('Scrubbing tooth 1');
            cleanTooth(0); // tooth 1 = index 0
        }

        if (event.key === 'f' || event.key === 'F') {
            console.log('Scrubbing tooth 2');
            cleanTooth(1); // tooth 2 = index 1
        }

        if (event.key === 'g' || event.key === 'G') {
            console.log('Scrubbing tooth 3');
            cleanTooth(2); // tooth 3 = index 2
        }

        if (event.key === 'h' || event.key === 'H') {
            console.log('Scrubbing tooth 4');
            cleanTooth(3); // tooth 4 = index 3
        }

        if (event.key === 'j' || event.key === 'J') {
            console.log('Scrubbing tooth 5');
            cleanTooth(4); // tooth 5 = index 4
        }

        if (event.key === 'k' || event.key === 'K') {
            console.log('Scrubbing tooth 6');
            cleanTooth(5); // tooth 6 = index 5
        }

        // FLOSSING MAPPED TO CVBNM
        if (event.key === 'c' || event.key === 'C') {
            console.log('Flossing between 1 and 2');
            flossTooth(1);
        }

        if (event.key === 'v' || event.key === 'V') {
            console.log('Flossing between 2 and 3');
            flossTooth(2);
        }

        if (event.key === 'b' || event.key === 'B') {
            console.log('Flossing between 3 and 4');
            flossTooth(3);
        }

        if (event.key === 'n' || event.key === 'N') {
            console.log('Flossing between 4 and 5');
            flossTooth(4);
        }

        if (event.key === 'm' || event.key === 'M') {
            console.log('Flossing between 5 and 6');
            flossTooth(5);
        }

        // skipButton.addEventListener('click', () => {

        //     storeVars();
        //     console.log('skipButton clicked!');
        //     window.location = "end-screen.html";

        // });
    });


    //button shortcuts
    document.addEventListener("keydown", (event) => {
        //skip
        if (event.key === "Enter") {
        storeVars();
        window.location.href = "end-screen.html";
        }
        //refresh
        if (event.key === "r" || event.key === "R") {
            window.location.href = "game-page.html";
        }
        //home page
        if (event.key === "e" || event.key === "E") {
            window.location.href = "index.html";
        }
    });

}

window.onload = init;