//js for index.html

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("button");
    button.addEventListener("click", () => {
        window.location.href = "game-page.html";
    });
});