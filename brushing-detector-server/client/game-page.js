const init = () => {
  const GAME_RATIO = 16 / 9;

  function resizeGame() {
    const GAME_RATIO = 16 / 9;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const viewportRatio = vw / vh;

    const game = document.getElementById("game-root");

    let gameWidth, gameHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (viewportRatio > GAME_RATIO) {
      // Screen is wider than 16:9
      gameHeight = vh;
      gameWidth = vh * GAME_RATIO;

      offsetX = (vw - gameWidth) / 2;
    } else {
      // Screen is taller than 16:9
      gameWidth = vw;
      gameHeight = vw / GAME_RATIO;

      offsetY = (vh - gameHeight) / 2;
    }

    // Apply size
    game.style.width = `${gameWidth}px`;
    game.style.height = `${gameHeight}px`;

    // Apply centering
    game.style.left = `${offsetX}px`;
    game.style.top = `${offsetY}px`;
  }


  resizeGame();

  window.addEventListener("resize", resizeGame);
  // window.addEventListener("load", resizeGame);

  const bgMusic = document.getElementById("background-music");
  bgMusic.volume = 0.4;

  const pointDisplay = document.getElementById("points-text");
  // const skipButton = document.getElementById('skipbutton');
  document.getElementById("skipButton").onclick = function () {
    storeVars();
    location.href = "end-screen.html";
  };

  // variables for point and score displays on end screen

  let pointValue = 0;
  let teethCleaned = 0; //increases with each tooth cleaned
  let teethFlossed = 0; //add logic when we have bacterias
  let toothPointVal = 500; //how many points to add per tooth cleaned
  let flossPointVal = 500; // how many points per tooth flossed (change as needed)

  // FOR FIRST COUNTDOWN

  const startSeconds = 60;

  let remaining = startSeconds;

  const display = document.getElementById("timer-text");

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes + ":" + String(seconds).padStart(2, "0");
  };

  let count = 4;
  const countdown = document.getElementById("countdown");

  // LOADING RIVE FILES

  let riveFilesToLoad = 7; // 6 teeth + 1 progress bar

  // function for starting game only after all rive files are loaded
  const onRiveLoaded = () => {
    riveFilesToLoad--;
    if (riveFilesToLoad === 0) {
      startCountdownAndTimer();
    }
  };

  // 3-2-1-GO COUNTDOWN AT THE BEGINNING
  const startCountdownAndTimer = () => {
    const interval = setInterval(() => {
      count--;
      if (count > 1) {
        countdown.textContent = count - 1;
      } else if (count == 1) {
        countdown.style.left = "44%";
        countdown.textContent = "Go!";
      } else if (count == 0) {
        countdown.textContent = "";
        clearInterval(interval);
      }
    }, 1000);
  };

  // change time display, start progress bar when the game starts, and redirect to end screen when timer ends
  const updateTimeDisplay = () => {
    display.textContent = formatTime(remaining);
    if (count == 0) {
      progressBar.timerBoolean.value = true;
      progressBar.play();
      if (remaining > 0) {
        remaining--;
      } else {
        clearInterval(timerInterval);
        storeVars();
        window.location.href = "end-screen.html";
      }
    }
  };

  const timerInterval = setInterval(updateTimeDisplay, 1000);

  // PROGRESS BAR RIVE

  const progressBar = new rive.Rive({
    src: "game-page-assets/animations/FB-PROGRESS_BAR.riv",
    canvas: document.getElementById("progress-bar"),
    stateMachines: ["State Machine"],
    onLoad: () => {
      progressBar.resizeDrawingSurfaceToCanvas();
      const inputs = progressBar.stateMachineInputs("State Machine");
      console.log(inputs);
      progressBar.timerBoolean = inputs.find((input) => input.type === 59);
      console.log(progressBar.timerBoolean);
      onRiveLoaded();
    },
  });

  // add teeth obj literals to array
  const teeth = [];
  for (let i = 1; i < 7; i++) {
    teeth.push({
      id: `tooth-${i}`,
      riveInstance: null,
      cleaningInput: null,
      decayingTrigger: null,
      flossingTrigger: null,
      dirtTimer: null,
      flossTimer: null,
      needsBrushing: false,
      needsFlossing: false,
      scored: false,
      scrubTimer: null,
      scrubbing: false,
    });
  }

  // riveInstance properties for each tooth!
  teeth.forEach((tooth, index) => {
    tooth.riveInstance = new rive.Rive({
      src:
        tooth.id === "tooth-1" || tooth.id === "tooth-6"
          ? "game-page-assets/animations/FB-FANG.riv"
          : tooth.id === "tooth-2"
            ? "game-page-assets/animations/FB-TOOTH-1.riv"
            : tooth.id === "tooth-3"
              ? "game-page-assets/animations/FB-TOOTH-2.riv"
              : tooth.id === "tooth-4"
                ? "game-page-assets/animations/FB-TOOTH-3.riv"
                : tooth.id === "tooth-5"
                  ? "game-page-assets/animations/FB-TOOTH-4.riv"
                  : "game-page-assets/animations/FB-TOOTH-3.riv", // default to blue one
      canvas: document.getElementById(tooth.id),
      stateMachines: ["State Machine"],
      onLoad: () => {
        tooth.riveInstance.resizeDrawingSurfaceToCanvas();
        const inputs = tooth.riveInstance.stateMachineInputs("State Machine");
        console.log(inputs);
        tooth.cleaningInput = inputs.find(
          (input) => input.name === "isCleaning" && input.type === 59,
        );
        tooth.flossingInput = inputs.find(
          (input) => input.name === "isFlossing" && input.type === 59,
        );
        tooth.decayingTrigger = inputs.find(
          (input) => input.name === "triggerDecay" && input.type === 58,
        );
        tooth.flossingTrigger = inputs.find(
          (input) => input.name === "triggerFlossDecay" && input.type === 58,
        );
        console.log(tooth);
        console.log(tooth.cleaningInput);
        console.log(tooth.flossingInput);
        // assign random delays before getting dirty
        const decayDelay = Math.random() * 9000 + 1000; // between 1s–10s
        const flossDelay = Math.random() * 9000 + 1000; // between 1s–10s

        if (Math.random() > 0.5) {
          tooth.needsBrushing = true;
        } else {
          tooth.needsFlossing = true;
        }

        if (tooth.decayingTrigger && tooth.needsFlossing == false) {
          setTimeout(() => {
            console.log("tooth decay on " + tooth.id);
            tooth.decayingTrigger.fire(); // trigger decay!
            tooth.riveInstance.play(); // start dirt animation
          }, decayDelay);
        }

        if (tooth.flossingTrigger && tooth.needsBrushing == false) {
          setTimeout(() => {
            // force it to happen a frame later if decay also fired that frame
            requestAnimationFrame(() => {
              tooth.flossingTrigger.fire();
              tooth.riveInstance.play();
              console.log("floss decay on " + tooth.id);
            });
          }, flossDelay);
        }

        onRiveLoaded();
      },
    });
  });

  // make tooth dirty!
  const dirtyTooth = (index) => {
    const tooth = teeth[index];
    clearTimeout(tooth.dirtTimer);

    const time = Math.floor(Math.random() * 5000) + 5000; // between 5s and 10s
    tooth.dirtTimer = setTimeout(() => {
      if (tooth.decayingTrigger && tooth.needsFlossing == false) {
        tooth.needsBrushing = true;
        console.log(
          `tooth ${index + 1} needs brushing? ${tooth.needsBrushing}`,
        );
        tooth.decayingTrigger.fire(); // trigger decay!
        tooth.cleaningInput.value = false;
        tooth.scored = false; // allow scoring again next time
      }
    }, time);
  };

  // make tooth dirty!
  const dirtyGums = (index) => {
    // if (index === 3) return;
    const tooth = teeth[index];
    clearTimeout(tooth.flossTimer);

    const time = Math.floor(Math.random() * 5000) + 5000; // between 5s and 10s
    tooth.flossTimer = setTimeout(() => {
      if (tooth.flossingTrigger && tooth.needsBrushing == false) {
        tooth.needsFlossing = true;
        tooth.flossingTrigger.fire(); // trigger floss decay
        console.log("trigger floss decay!");
        tooth.scored = false; // allow scoring again next time
      }
    }, time);
    if (tooth.flossingInput) {
      tooth.flossingInput.value = false;
    }
  };

  // detect scrubbing
  const startScrubbing = (index) => {
    const tooth = teeth[index];
    // if (!tooth.needsBrushing || tooth.scrubbing) return;

    tooth.scrubbing = true;

    tooth.scrubTimer = setTimeout(() => {
      if (tooth.scrubbing && tooth.needsBrushing && !tooth.scored) {
        console.log("scrubbing tooothhhh");
        cleanTooth(index);
      }
    }, 500); // must scrub for 0.5 second
  };

  // when user stops scrubbing
  const stopScrubbing = (index) => {
    const tooth = teeth[index];
    if (tooth.scrubbing) {
      clearTimeout(tooth.scrubTimer);
      tooth.scrubbing = false;
    }
  };

  // clean tooth!
  const cleanTooth = (index) => {
    const tooth = teeth[index];
    console.log(tooth.needsBrushing);
    if (tooth.cleaningInput && tooth.needsBrushing) {
      clearTimeout(tooth.dirtTimer);
      tooth.cleaningInput.value = true;
      // Mark tooth as clean (can’t score again until dirty)
      tooth.needsBrushing = false;
      tooth.scored = true;
      tooth.scrubbing = false;

      setTimeout(() => {
        pointValue += toothPointVal;
        updatePointDisplay();
        teethCleaned++;
        dirtyTooth(index);
        dirtyGums(index);
        tooth.cleaningInput.value = false;
      }, 3000);
    }
  };

  // FLOSSING TEETH
  const flossTooth = (index) => {
    const tooth = teeth[index];
    if (tooth.flossingInput) {
      clearTimeout(tooth.dirtTimer);
      tooth.flossingInput.value = true;
      tooth.needsFlossing = false;
      console.log(`flossing tooth ${index}`);

      setTimeout(() => {
        pointValue += flossPointVal;
        updatePointDisplay();
        teethFlossed++;
        dirtyTooth(index);
        dirtyGums(index);
        tooth.flossingInput.value = false;
      }, 3000);
    }
  };

  const updatePointDisplay = () => {
    pointDisplay.innerHTML = pointValue;
    if (pointValue >= 10000) {
      pointDisplay.style.left = "90px";
    }
  };

  storeVars = () => {
    localStorage.setItem("finalPoints", pointValue); //sends point value
    localStorage.setItem("cleanedTotal", teethCleaned); //sends teeth count
    localStorage.setItem("flossedTotal", teethFlossed); //sends teeth count
  };

  //fixing chrissy's silly indexes - FLOSSING
  const mapSensorToAnimationIndex = (sensorIndex) => {
    if (sensorIndex === null || sensorIndex === undefined) return null;

    // if (sensorIndex <= 1) {
    //   return 1;
    // } else if (sensorIndex < 3) {
    //   return 2;
    // } else if (sensorIndex >= 5) {
    //   return 4;
    // } else if (sensorIndex > 3) {
    //   return 3;
    // }
    if (sensorIndex <= 1) {
      return 1;
    } else if (sensorIndex < 3) {
      return 2;
    } else if (sensorIndex < 4) {
      return 3;
    } else if (sensorIndex < 5) {
      return 4;
    }
  };


  const evtSource = new EventSource("/gamedata");
  evtSource.onmessage = (event) => {
    const gamestate = JSON.parse(event.data).gameState;
    console.log(JSON.stringify(gamestate, null, 2));
    if (count != 0) return;

    const brush = gamestate;
    const floss = gamestate.flossing;

    teeth.forEach((tooth, index) => {
      if (!tooth.cleaningInput) return;
      if (!tooth.decayingTrigger) return;

      if (brush && brush.activeToothIndex === index && brush.isBrushing) {
        startScrubbing(index);

        // turn on the cleaning animation while brushing
        if (tooth.cleaningInput && !tooth.scrubbingAnimation) {
          tooth.cleaningInput.value = true;
          tooth.scrubbingAnimation = true;
        }
      } else {
        stopScrubbing(index);

        // turn off the cleaning animation when brushing stops
        if (tooth.cleaningInput && tooth.scrubbingAnimation) {
          tooth.cleaningInput.value = false;
          tooth.scrubbingAnimation = false;
        }
      }

      // FLOSSING - sensor triggering
      const mappedFlossIndex = mapSensorToAnimationIndex(floss?.flossToothIndex);

      if (
        floss &&
        floss.isFlossing &&
        mappedFlossIndex === index &&
        tooth.needsFlossing &&
        !tooth.flossingActive
      ) {
        tooth.flossingActive = true;
        flossTooth(index);

        // reset checks
        setTimeout(() => {
          tooth.flossingActive = false;
        }, 350);
      }
    });
  };

  //KEY PRESS TESTING
  //scrubbing dfghjk tooth 1-6
  document.addEventListener("keydown", (event) => {
    console.log("key pressed!!!");
    if (event.key === "d" || event.key === "D") {
      console.log("Scrubbing tooth 1");
      cleanTooth(0); // tooth 1 = index 0
    }

    if (event.key === "f" || event.key === "F") {
      console.log("Scrubbing tooth 2");
      cleanTooth(1); // tooth 2 = index 1
    }

    if (event.key === "g" || event.key === "G") {
      console.log("Scrubbing tooth 3");
      cleanTooth(2); // tooth 3 = index 2
    }

    if (event.key === "h" || event.key === "H") {
      console.log("Scrubbing tooth 4");
      cleanTooth(3); // tooth 4 = index 3
    }

    if (event.key === "j" || event.key === "J") {
      console.log("Scrubbing tooth 5");
      cleanTooth(4); // tooth 5 = index 4
    }

    if (event.key === "k" || event.key === "K") {
      console.log("Scrubbing tooth 6");
      cleanTooth(5); // tooth 6 = index 5
    }

    // FLOSSING MAPPED TO CVBN
    if (event.key === "c" || event.key === "C") {
      console.log("Flossing between 1 and 2");
      flossTooth(1); // gap 1 (between tooth 1 and tooth 2)
    }

    if (event.key === "v" || event.key === "V") {
      console.log("Flossing between 2 and 3");
      flossTooth(2); // gap 2 (between tooth 2 and tooth 3)
    }

    if (event.key === "b" || event.key === "B") {
      console.log("Flossing between 3 and 4");
      flossTooth(3); // gap 3 (between tooth 4 and tooth 5)
    }

    if (event.key === "n" || event.key === "N") {
      console.log("Flossing between 4 and 5");
      flossTooth(4); // gap 4 (between tooth 5 and tooth 6)
    }

    // skipButton.addEventListener('click', () => {

    //     storeVars();
    //     console.log('skipButton clicked!');
    //     window.location = "end-screen.html";

    // });

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
};

window.onload = init;