const init = () => {
  function resizeGame() {
    const GAME_RATIO = 16 / 9;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const viewportRatio = vw / vh;

    const game = document.getElementById("tutorial-root");

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

  const tutorialTooth = {
    id: "tooth-3",
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
  };

  const video = document.getElementById("tutorial-video-1");
  video.addEventListener("ended", () => {
    video.pause();
    video.style.display = "none";
    tutorialTooth.riveInstance = new rive.Rive({
      src: "game-page-assets/animations/FB-TOOTH-3.riv",
      canvas: document.getElementById(tutorialTooth.id),
      stateMachines: ["State Machine"],
      onLoad: () => {
        tutorialTooth.riveInstance.resizeDrawingSurfaceToCanvas();
        const inputs =
          tutorialTooth.riveInstance.stateMachineInputs("State Machine");
        console.log(inputs);
        tutorialTooth.cleaningInput = inputs.find(
          (input) => input.name === "isCleaning" && input.type === 59,
        );
        tutorialTooth.flossingInput = inputs.find(
          (input) => input.name === "isFlossing" && input.type === 59,
        );
        tutorialTooth.decayingTrigger = inputs.find(
          (input) => input.name === "triggerDecay" && input.type === 58,
        );
        tutorialTooth.flossingTrigger = inputs.find(
          (input) => input.name === "triggerFlossDecay" && input.type === 58,
        );
        console.log(tutorialTooth);
        console.log(tutorialTooth.cleaningInput);
        console.log(tutorialTooth.flossingInput);
        // assign random delays before getting dirty

        // immediately start brushing decay for tutorial
        tutorialTooth.needsBrushing = true;
        setTimeout(() => {
          tutorialTooth.decayingTrigger.fire(); // trigger decay!
          tutorialTooth.riveInstance.play(); // start dirt animation
        }, 1000);

        if (
          tutorialTooth.flossingTrigger &&
          tutorialTooth.needsBrushing == false
        ) {
          tutorialTooth.flossingTrigger.fire();
          tutorialTooth.riveInstance.play();
        }
      },
    });
  });

  // clean tooth!
  const cleanTooth = () => {
    if (!tutorialTooth.needsBrushing) return;
    if (tutorialTooth.cleaningInput) {
      clearTimeout(tutorialTooth.dirtTimer);
      tutorialTooth.cleaningInput.value = true;
      // Mark tooth as clean (can’t score again until dirty)
      tutorialTooth.needsBrushing = false;
      tutorialTooth.scored = true;
      tutorialTooth.scrubbing = false;

      setTimeout(() => {
        document.getElementById("instructions").innerText =
          "MOVE THE FLOSSER UP AND DOWN TO FLOSS THE TEETH";
      }, 5000);
      setTimeout(() => {
        tutorialTooth.needsFlossing = true;
        tutorialTooth.flossingTrigger.fire(); // trigger decay!
        tutorialTooth.riveInstance.play(); // start dirt animation
        tutorialTooth.cleaningInput.value = false;
      }, 6000);
    }
  };

  // FLOSSING TEETH
  const flossTooth = () => {
    if (tutorialTooth.flossingInput && tutorialTooth.needsFlossing) {
      clearTimeout(tutorialTooth.dirtTimer);
      tutorialTooth.flossingInput.value = true;
      tutorialTooth.needsFlossing = false;
      setTimeout(() => {
        document.getElementById("instructions").innerText = "GOOD LUCK!";
      }, 3000);
      setTimeout(() => {
        window.location.href = "game-page.html";
      }, 5000);
    }
  };

  // const mapSensorToAnimationIndex = (sensorIndex) => {
  //   if (sensorIndex === null || sensorIndex === undefined) return null;

  //   if (sensorIndex <= 1) {
  //     return 1;
  //   } else if (sensorIndex < 3) {
  //     return 2;
  //   } else if (sensorIndex < 4) {
  //     return 3;
  //   } else if (sensorIndex < 5) {
  //     return 4;
  //   }
  // };

  const evtSource = new EventSource("/gamedata");
  evtSource.onmessage = (event) => {
    const gamestate = JSON.parse(event.data).gameState;
    console.log(JSON.stringify(gamestate, null, 2));

    const brush = gamestate;
    const floss = gamestate.flossing;

    if (!tutorialTooth.cleaningInput) return;
    if (!tutorialTooth.decayingTrigger) return;

    if (
      brush &&
      brush.activeToothIndex === 3 &&
      brush.isBrushing &&
      tutorialTooth.needsBrushing
    ) {
      cleanTooth(3);

      // turn on the cleaning animation while brushing
      if (tutorialTooth.cleaningInput) {
        tutorialTooth.cleaningInput.value = true;
        tutorialTooth.scrubbingAnimation = true;
      }
    } else {
      // stopScrubbing(4);

      // turn off the cleaning animation when brushing stops
      if (tutorialTooth.cleaningInput && tutorialTooth.scrubbingAnimation) {
        tutorialTooth.cleaningInput.value = false;
        tutorialTooth.scrubbingAnimation = false;
      }
    }

    // FLOSSING - sensor triggering
    // const mappedFlossIndex = mapSensorToAnimationIndex(floss?.flossToothIndex);

    if (
      floss &&
      floss.isFlossing &&
      tutorialTooth.needsFlossing &&
      !tutorialTooth.flossingActive
    ) {
      tutorialTooth.flossingActive = true;
      flossTooth(3);

      // reset checks
      setTimeout(() => {
        tutorialTooth.flossingActive = false;
      }, 350);
    }
  };

  document.addEventListener("keydown", (event) => {
    console.log("key pressed!!!");

    if (event.key === "h" || event.key === "H") {
      console.log("Scrubbing tooth 4");
      cleanTooth(3); // tooth 4 = index 3
    }

    if (event.key === "b" || event.key === "B") {
      console.log("Flossing between 3 and 4");
      flossTooth(3); // gap 3 (between tooth 4 and tooth 5)
    }

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

// const secondVideo = document.getElementById("tutorial-video-2");
// const thirdVideo = document.getElementById("tutorial-video-3");

// const tutorialAudio = document.getElementById("tutorial-audio");

// secondVideo.pause();
// secondVideo.currentTime = 0;
// secondVideo.style.zIndex = "0";

// thirdVideo.pause();
// thirdVideo.currentTime = 0;
// thirdVideo.style.zIndex = "-1";

// video.muted = false;
// secondVideo.muted = false;
// thirdVideo.muted = false;

// secondVideo.addEventListener("ended", () => {
//   playThirdVideo();
// });

// thirdVideo.addEventListener("ended", () => {
//   window.location.href = "game-page.html";
// });

// document.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     // if (secondVideo.style.zIndex === "0") {
//     //   playSecondVideo();
//     // } else if (thirdVideo.style.zIndex === "-1") {
//     //   playThirdVideo();
//     // } else{
//       window.location.href = "game-page.html";
//     // }
//   }
// });

// function playSecondVideo() {
//   secondVideo.currentTime = 0;
//   secondVideo.style.zIndex = "2";
//   secondVideo.play();

//   tutorialAudio.play();
//   tutorialAudio.loop = true;
// }

// function playThirdVideo() {
//   thirdVideo.currentTime = 0;
//   thirdVideo.style.zIndex = "5";
//   thirdVideo.play();
// }

window.onload = init;
