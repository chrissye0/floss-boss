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

  const video = document.getElementById("tutorial-video-1");
  const secondVideo = document.getElementById("tutorial-video-2");
  const thirdVideo = document.getElementById("tutorial-video-3");

  secondVideo.pause();
  secondVideo.currentTime = 0;
  secondVideo.style.zIndex = "0";

  thirdVideo.pause();
  thirdVideo.currentTime = 0;
  thirdVideo.style.zIndex = "-1";

  video.addEventListener("ended", () => {
    playSecondVideo();
    
  });

  secondVideo.addEventListener("ended", () => {
    playThirdVideo();
  });

  thirdVideo.addEventListener("ended", () => {
    window.location.href = "game-page.html";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (secondVideo.style.zIndex === "0") {
        // If we're on the first video, jump to second
        playSecondVideo();
      } else if (thirdVideo.style.zIndex === "-1") {
        // If we're on the first video, jump to second
        playThirdVideo();
      } else{
        // If we're already on the second, go to game page
        window.location.href = "game-page.html";
      }
    }
  });

  function playSecondVideo() {
    secondVideo.currentTime = 0;
    secondVideo.style.zIndex = "2";
    secondVideo.play();
  }

  function playThirdVideo() {
    thirdVideo.currentTime = 0;
    thirdVideo.style.zIndex = "5";
    thirdVideo.play();
  }

}

window.onload = init;
