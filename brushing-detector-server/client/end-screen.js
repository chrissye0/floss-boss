//js file for end screen html

const init = () => {

    const points = Number(localStorage.getItem("finalPoints")) || 0;
    const teethCleaned = Number(localStorage.getItem("totalTeeth")) || 0;
    const bactCount = Number(localStorage.getItem("totalBact")) || 0;

    const score = 2000//document.getElementById('finalScore');
    score.textContent = points.toLocaleString();;

    const starRating = () => {
        if (score >= 8000) return 3;
        else if(score<2000) return 0;
        console.log("starCount "+((Math.floor(score/1000))-2)*.5);
        return ((Math.floor(score/1000))-2)*.5;
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

    
  // }


  // document.getElementById('restartButton').addEventListener('click', function() {
  //   this.style.backgroundImage = 'url("restartPress")';
  // });
};


window.onload = init;