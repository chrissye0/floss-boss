//js for index.html

function resizeGame() {

    const GAME_RATIO = 16/9;
    const GAME_WIDTH = window.innerWidth;
    const GAME_HEIGHT = GAME_WIDTH/16*9;

    const bars = document.querySelectorAll(".blackBar");
    bars.forEach(bar => {
        bar.style.height = `${(window.innerHeight-GAME_HEIGHT)/2}px`;
        bar.style.width = `${GAME_WIDTH}px`;
    });

};

resizeGame()

document.addEventListener("DOMContentLoaded", () => {
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