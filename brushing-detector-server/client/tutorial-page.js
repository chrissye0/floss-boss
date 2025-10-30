const init = () => {
    
  const video = document.getElementById("tutorial-video-1");
  const secondVideo = document.getElementById("tutorial-video-2");

  secondVideo.pause();
  secondVideo.currentTime = 0;
  secondVideo.style.zIndex = "0";

  video.addEventListener("ended", () => {
    playSecondVideo();
    
  });

  secondVideo.addEventListener("ended", () => {
    window.location.href = "game-page.html";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (secondVideo.style.zIndex === "0") {
        // If we're on the first video, jump to second
        playSecondVideo();
      } else {
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


}

window.onload = init;
