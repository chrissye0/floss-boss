//js file for end screen html

const init = () => {

    let points = 10000;//GET DATA FROM GAME
    let bactCount = 32;//GET DATA FROM GAME
    let teethCleaned = 12;//GET DATA FROM GAME

    const score = document.getElementById('finalScore');
    score.textContent = points.toLocaleString();;

    const starRating = () => {
        if (points >= 7000) return 3;
        if (points >= 3000) return 2;
        return 1;
    };

    const starsContainer = document.querySelector('.stars');
    starsContainer.innerHTML = ''; // clear any existing stars in HTML

    const stat1Heading = document.querySelector('.stat1 h1');
    const stat2Heading = document.querySelector('.stat2 h1');

    stat1Heading.textContent = bactCount;
    stat2Heading.textContent = teethCleaned;

  const numStars = starRating();

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('img');
        star.src = 'game-page-assets/Star.svg';
        star.alt = 'star';
        star.classList.add('starImg');
    starsContainer.appendChild(star);
  }
};


window.onload = init;