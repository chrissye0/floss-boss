//js for index.html

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