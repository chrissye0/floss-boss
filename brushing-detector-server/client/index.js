//js for index.html

  function resizeGame() {
    const GAME_RATIO = 16 / 9;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const viewportRatio = vw / vh;

    const game = document.getElementById("page-root");

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


document.addEventListener("DOMContentLoaded", () => {
  resizeGame();
  window.addEventListener("resize", resizeGame);

  const button = document.getElementById("button");
  button.addEventListener("click", () => {
      window.location.href = "tutorial-page.html";
  });
});


document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      window.location.href = "tutorial-page.html";
    }
  });