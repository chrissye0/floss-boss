const init = () => {
    
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
