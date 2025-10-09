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
    let pointValue = 0;
    let teethCleaned = 0;//increases with each tooth cleaned
    let bactCount = 0; //add logic when we have bacterias
    let toothPointVal = 200;//how many points to add per tooth cleaned

    const startSeconds = 120;
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
    }

    const interval = setInterval(() => {
        count--;
        // console.log(count);
        if (count > 1) {
            countdown.textContent = count - 1;
        }
        if (count == 1) {
            countdown.textContent = "Go!";
        }
        if (count == 0) {
            countdown.textContent = " ";
            clearInterval(interval);
        }
    }, 1000);

    const timerInterval = setInterval(updateTimeDisplay, 1000);
    const progressBar = new rive.Rive({
        src: "game-page-assets/animations/fb-progress.riv",
        canvas: document.getElementById("progress-bar"),
        onLoad: () => {
            progressBar.resizeDrawingSurfaceToCanvas();
            progressBar.playbackSpeed = 1.2;
        },
    });

    const teeth = [
        {
            id: "tooth-1",
            riveInstance: null,
            doneInput: null,
            dirtTimer: null,
        },
        {
            id: "tooth-2",
            riveInstance: null,
            doneInput: null,
            dirtTimer: null,
        },
    ]

    teeth.forEach((tooth) => {
        tooth.riveInstance = new rive.Rive({
            src: "game-page-assets/animations/fb-tooth_animations.riv",
            canvas: document.getElementById(tooth.id),
            stateMachines: ['State Machine'],
            onLoad: () => {
                tooth.riveInstance.resizeDrawingSurfaceToCanvas();
                tooth.riveInstance.play();
                const inputs = tooth.riveInstance.stateMachineInputs("State Machine");
                tooth.doneInput = inputs.find(input => input.name === 'isCleaning' && input.type === 59);
                if (tooth.doneInput) {
                    tooth.doneInput.value = false; // start dirty
                }
                // dirtyTooth(index); // start random dirt cycle
            }
        });
    });

    // const tooth1 = new rive.Rive({
    //     src: "game-page-assets/animations/fb-tooth_animations.riv",
    //     canvas: document.getElementById("tooth-1"),
    //     stateMachines: ['State Machine'],
    //     onLoad: () => {
    //         tooth1.resizeDrawingSurfaceToCanvas();
    //         tooth1.playbackSpeed = 1.2;
    //         tooth1.play(); // ensure the state machine is active
    //         const inputs = tooth1.stateMachineInputs("State Machine");
    //         inputs.forEach(input => console.log("Input name:", input.name, "type:", input.type));
    //         console.log("Inputs available:", inputs);
    //         doneInput = inputs.find(input => input.name === 'isCleaning' && input.type == '59');
    //         if (doneInput) {
    //             doneInput.value = false;
    //         }
    //     },
    // });

    // const tooth2 = new rive.Rive({
    //     src: "game-page-assets/animations/fb-tooth_animations.riv",
    //     canvas: document.getElementById("tooth-2"),
    //     stateMachines: ['State Machine'],
    //     onLoad: () => {
    //         tooth2.resizeDrawingSurfaceToCanvas();
    //         tooth2.play(); // ensure the state machine is active
    //         const inputs = tooth2.stateMachineInputs("State Machine");
    //         // doneInput = inputs.find(input => input.name === 'isCleaning' && input.type == '59');
    //         // console.log("Found input:", doneInput);
    //     },
    // });

    // let dirtTime;
    // //dirtying tooth logic
    // const dirtyTooth = () => {
    //     clearTimeout(dirtTime)

    //     //rand time - CLEAR OUT LATER
    //     const time = Math.floor(Math.random() * (10000 - 7000 + 1)) + 7000;

    //     dirtTime = setTimeout(() => {
    //         doneInput.value = false;
    //         console.log("Tooth became dirty after", time, "ms");
    //     }, time);
    // }

    const dirtyTooth = (index) => {
        const tooth = teeth[index];
        clearTimeout(tooth.dirtTimer);

        const time = Math.floor(Math.random() * (10000 - 7000 + 1)) + 3000;
        tooth.dirtTimer = setTimeout(() => {
            if (tooth.doneInput) {
                tooth.doneInput.value = false;
                console.log(`🦷 Tooth ${index + 1} became dirty after ${time}ms`);
            }
            dirtyTooth(index);
        }, time);
    };

    const cleanTooth = (index) => {
        const tooth = teeth[index];
        if (tooth.doneInput) {
            tooth.doneInput.value = true;
            console.log(`🧼 Tooth ${index + 1} cleaned!`);
            teethCleaned++;
            pointValue+=toothPointVal;
            updatePointDisplay();
            dirtyTooth(index);
        }
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
        if (count != 0) return;
        // Reset indicator color
        // indicator.style.backgroundColor = 'gray';

        teeth.forEach((tooth, index) => {
            console.log(index)
            if (!tooth.doneInput) return;

            if (gamestate.activeToothIndex === index && gamestate.isBrushing) {
                cleanTooth(index);
                // indicator.style.backgroundColor = index === 0 ? 'blue' : 'red';
            }
        });
    };
}

window.onload = init;
