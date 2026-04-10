// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB2rzEX1OA1aIZ8BkJ9hLcNeCUipmPNfAk",
  authDomain: "floss-boss-d2ea8.firebaseapp.com",
  projectId: "floss-boss-d2ea8",
  storageBucket: "floss-boss-d2ea8.firebasestorage.app",
  messagingSenderId: "876756088999",
  appId: "1:876756088999:web:c5bf9e3bcc79a053f64382",
  measurementId: "G-R3X1RMB0GT"
};

// Firebase Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function generateInitials(existingInitials) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let initials = "";

  do {
    initials = "";
    for (let i = 0; i < 3; i++) {
      initials += letters[Math.floor(Math.random() * letters.length)];
    }
  } while (existingInitials.includes(initials));

  return initials;
}

async function submitScore(points) {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const existingInitials = [];
    const existingUserIds = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.initials) existingInitials.push(data.initials);
      existingUserIds.push(doc.id);
    });

    // If only user0 exists, fill placeholders user00 → user0000000000
    if (snapshot.empty || (snapshot.size === 1 && existingUserIds.includes("user0"))) {
      for (let i = 2; i <= 10; i++) { // 2 → "00", 3 → "000", ..., 10 → "0000000000"
        const zeros = "0".repeat(i);
        const placeholderId = `user${zeros}`;
        await setDoc(doc(db, "users", placeholderId), {
          initials: "---",
          score: 0
        });
      }

      // Add first real player as user1
      const initials = generateInitials([]);
      const userId = "user1";

      await setDoc(doc(db, "users", userId), {
        initials: initials,
        score: points,
        createdAt: Date.now()
      });

      console.log("Placeholders created + first real score submitted:", userId, initials, points);
      return;
    }

    // Otherwise proceed normally
    const initials = generateInitials(existingInitials);
    const nextUserNumber = Math.max(...existingUserIds
      .map(id => parseInt(id.replace("user", "")))
      .filter(n => !isNaN(n))
    ) + 1;

    const userId = `user${nextUserNumber}`;

    await setDoc(doc(db, "users", userId), {
      initials: initials,
      score: points,
      createdAt: Date.now()
    });

    console.log("Score submitted:", userId, initials, points);

  } catch (error) {
    console.error("Error submitting score:", error);
  }
}

async function incrementPlayerCount() {
  try {
    const statsRef = doc(db, "stats", "global");

    await updateDoc(statsRef, {
      playerCount: increment(1)
    });

    console.log("Player count incremented");

  } catch (error) {
    console.error("Error updating player count:", error);
  }
}


function resizeGame() {
  const GAME_RATIO = 16 / 9;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const viewportRatio = vw / vh;

  const game = document.getElementById("end-root");

  let gameWidth, gameHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (viewportRatio > GAME_RATIO) {
    gameHeight = vh;
    gameWidth = vh * GAME_RATIO;
    offsetX = (vw - gameWidth) / 2;
  } else {
    gameWidth = vw;
    gameHeight = vw / GAME_RATIO;
    offsetY = (vh - gameHeight) / 2;
  }

  game.style.width = `${gameWidth}px`;
  game.style.height = `${gameHeight}px`;
  game.style.left = `${offsetX}px`;
  game.style.top = `${offsetY}px`;
}


const init = () => {

  // Setup resize
  resizeGame();
  if (!sessionStorage.getItem("counted")) {
    incrementPlayerCount();
    sessionStorage.setItem("counted", "true");
  }
  window.addEventListener("resize", resizeGame);

  // et stored values
  const points = Number(localStorage.getItem("finalPoints")) || 0;
  const teethCleaned = Number(localStorage.getItem("cleanedTotal")) || 0;
  const bactCount = Number(localStorage.getItem("flossedTotal")) || 0;

  // Update score display
  const score = document.getElementById('finalScore');
  score.textContent = points.toLocaleString();

  // Submit score
  // if (!sessionStorage.getItem("scoreSubmitted")) {
    submitScore(points);
  //   sessionStorage.setItem("scoreSubmitted", "true");
  // }

  // Star rating logic
  const starRating = () => {
    console.log("score " + points);

    if (points >= 8000) return 3;
    else if (points < 2000 || isNaN(points)) return 0;

    console.log("starCount " + ((Math.floor(points / 1000)) - 2) * .5);
    return ((Math.floor(points / 1000)) - 2) * .5;
  };

  // DOM references
  const starsContainer = document.querySelector('#stars');
  starsContainer.innerHTML = '';

  const stat1Heading = document.querySelector('#stat1 h1');
  const stat2Heading = document.querySelector('#stat2 h1');

  stat1Heading.textContent = bactCount;
  stat2Heading.textContent = teethCleaned;

  // Star creators
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

  // Render stars
  const numStars = starRating();
  console.log(numStars);

  for (let i = Math.floor(numStars); i > 0; i--) {
    createFullStar();
  }

  if (!Number.isInteger(numStars)) {
    createHalfStar();
  }

  for (let i = 3 - Math.ceil(numStars); i > 0; i--) {
    createEmptyStar();
  }

  // Controls
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      window.location.href = "game-page.html";
    }

    if (event.key === "e" || event.key === "E") {
      window.location.href = "index.html";
    }
  });
};


// Run
window.onload = init;