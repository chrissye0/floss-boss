//js file for end screen html

const init = () => {

    const points = Number(localStorage.getItem("finalPoints")) || 0;
    const teethCleaned = Number(localStorage.getItem("totalTeeth")) || 0;
    const bactCount = Number(localStorage.getItem("totalBact")) || 0;

    const score = document.getElementById('finalScore');
    score.textContent = points.toLocaleString();

    const starRating = () => {
        console.log("score "+points);
        if (points >= 8000) return 3;
        else if(points<2000 || isNaN(points)) return 0;
        console.log("starCount "+((Math.floor(points/1000))-2)*.5);
        return ((Math.floor(points/1000))-2)*.5;
    };

    const starsContainer = document.querySelector('.stars');
    starsContainer.innerHTML = ''; // clear any existing stars in HTML

    const stat1Heading = document.querySelector('.stat1 h1');
    const stat2Heading = document.querySelector('.stat2 h1');

    stat1Heading.textContent = bactCount;
    stat2Heading.textContent = teethCleaned;

    
    const createFullStar = () => {
      const star = document.createElement('img');
        star.src = 'game-page-assets/star.svg';
        star.alt = 'star';
        star.classList.add('starImg');
      starsContainer.appendChild(star);
    };

    const createHalfStar = () => {
      const star = document.createElement('img');
        star.src = 'game-page-assets/starHalf.svg';
        star.alt = 'star';
        star.classList.add('starImg');
      starsContainer.appendChild(star);
    };

    const createEmptyStar = () => {
      const star = document.createElement('img');
        star.src = 'game-page-assets/starEmpty.svg';
        star.alt = 'star';
        star.classList.add('starImg');
      starsContainer.appendChild(star);
    };

    const numStars = starRating();
    console.log(numStars);

    for(let i = Math.floor(numStars); i>0; i--){
      createFullStar();
    }
    if(!Number.isInteger(numStars)){
      createHalfStar();
    }
    for(let i = 3-Math.ceil(numStars); i>0; i--){
      createEmptyStar();
    }

  

  document.addEventListener("keydown", (event) => {
        //skip
        if (event.key === "Enter") {
          window.location.href = "game-page.html";
        }
        //home page
        if (event.key === "e" || event.key === "E") {
            window.location.href = "index.html";
        }
    });
};


window.onload = init;