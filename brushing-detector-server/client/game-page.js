const init = () => {
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
  let teethFlossed = 0; //increases with each tooth flossed
  let toothPointVal = 500; //how many points to add per tooth cleaned

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

  const timesUpVideo = document.getElementById("times-up");
  const timesUpAudio = document.getElementById("times-up-audio");

  const showTimesUp = () => {
    // Stop game logic
    clearInterval(timerInterval);
    evtSource.close();

    // Show overlay
    timesUpVideo.style.display = "block";
    timesUpAudio.play();

    setTimeout(() => {
      storeVars();
      window.location.href = "end-screen.html";
    }, 3000);
  };

  // change time display, start progress bar when the game starts, redirect to end screen when timer ends, trigger shrimply voice lines
  const updateTimeDisplay = () => {
    display.textContent = formatTime(remaining);
    if (count == 0) {
      progressBar.timerBoolean.value = true;
      progressBar.play();
      if (remaining > 0) {
        remaining--;
        shrimply();
      } else {
        showTimesUp();
        console.log("time's up!");
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
      dirtTimer: null,
      needsBrushing: false,
      scored: false,
      scrubTimer: null,
      scrubbing: false,
    });
  }

  // riveInstance properties for each tooth!
  teeth.forEach((tooth) => {
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
        tooth.decayingTrigger = inputs.find(
          (input) => input.name === "triggerDecay" && input.type === 58,
        );
        console.log(tooth);
        console.log(tooth.cleaningInput);
        // assign random delays before getting dirty
        const decayDelay = Math.random() * 9000 + 1000; // between 1s–10s

        tooth.needsBrushing = true;

        if (tooth.decayingTrigger) {
          setTimeout(() => {
            console.log("tooth decay on " + tooth.id);
            tooth.decayingTrigger.fire(); // trigger decay!
            tooth.riveInstance.play(); // start dirt animation
          }, decayDelay);
        }

        onRiveLoaded();
      },
    });
  });

  const restartAnimation = (el) => {
    el.classList.remove("shrimply-animation");
    void el.offsetWidth; // force reflow
    el.classList.add("shrimply-animation");
    console.log("restart animation!");
  };

  // shrimply voice lines
  const shrimply = () => {
    const shrimplyArray = [
      "game-page-assets/sound/shrimply/FB-SHRIMPLY-(Keep_Going).mp3",
      "game-page-assets/sound/shrimply/FB-SHRIMPLY-(Keep_It_Up).mp3",
      "game-page-assets/sound/shrimply/FB-SHRIMPLY-(Krilling_It).mp3",
      "game-page-assets/sound/shrimply/FB-SHRIMPLY-(Nice_Job).mp3",
      "game-page-assets/sound/shrimply/FB-SHRIMPLY-(Shell_Yeah).mp3",
      "game-page-assets/sound/shrimply/FB-SHRIMPLY-(Shrimply_Cool).mp3",
      "game-page-assets/sound/shrimply/FB-SHRIMPLY-(Shrimptastic).mp3",
      "game-page-assets/sound/shrimply/FB-SHRIMPLY-(So_Shrimple).mp3",
      "game-page-assets/sound/shrimply/FB-SHRIMPLY-(You're_A_Floss_Boss).mp3",
    ];

    const shrimplyAudio = document.getElementById("shrimply-audio");
    const shrimply = document.getElementById("shrimply");

    switch (remaining) {
      case 49: // 0:50
        restartAnimation(shrimply);
        shrimplyAudio.src =
          shrimplyArray[Math.floor(Math.random() * shrimplyArray.length)];
        shrimplyAudio.play();
        break;
      case 29: // 0:30
        restartAnimation(shrimply);
        shrimplyAudio.src =
          shrimplyArray[Math.floor(Math.random() * shrimplyArray.length)];
        shrimplyAudio.play();
        break;
      case 14: // 0:15
        restartAnimation(shrimply);
        shrimplyAudio.src =
          shrimplyArray[Math.floor(Math.random() * shrimplyArray.length)];
        shrimplyAudio.play();
        break;
      case 6: // 0:07
        restartAnimation(shrimply);
        shrimplyAudio.src =
          "game-page-assets/sound/shrimply/FB-SHRIMPLY-(Hurry_Up).mp3"; // "Hurry Up!" at 0:07
        shrimplyAudio.play();
      default:
        return;
    }
  };

  // make tooth dirty!
  const dirtyTooth = (index) => {
    const tooth = teeth[index];
    clearTimeout(tooth.dirtTimer);

    const time = Math.floor(Math.random() * 5000) + 5000; // between 5s and 10s
    tooth.dirtTimer = setTimeout(() => {
      if (tooth.decayingTrigger) {
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
        tooth.cleaningInput.value = false;
      }, 3000);
    }
  };

  const updatePointDisplay = () => {
    pointDisplay.innerHTML = pointValue;
    // if (pointValue >= 10000) {
    //   pointDisplay.style.left = "90px";
    // }
  };

  storeVars = () => {
    localStorage.setItem("finalPoints", pointValue); //sends point value
    localStorage.setItem("cleanedTotal", teethCleaned); //sends teeth count
    localStorage.setItem("flossedTotal", teethFlossed); //sends teeth count
  };

  const evtSource = new EventSource("/gamedata");
  evtSource.onmessage = (event) => {
    const gamestate = JSON.parse(event.data).gameState;
    console.log(JSON.stringify(gamestate, null, 2));
    if (count != 0) return;

    const brush = gamestate;

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
