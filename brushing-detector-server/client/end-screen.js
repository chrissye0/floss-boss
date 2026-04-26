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

// ===================== SUBMIT SCORE =====================
async function submitScore(points, initials) {
  try {
    //const snapshot = await getDocs(collection(db, "usersTest"));//COMMENT OUT AFTER DONE TESTING
    const snapshot = await getDocs(collection(db, "usersImagine"));//ADD FOR IMAGINE//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const existingUserIds = [];

    snapshot.forEach(doc => {
      existingUserIds.push(doc.id);
    });

    const numbers = existingUserIds
      .map(id => parseInt(id.replace("user", "")))
      .filter(n => !isNaN(n));

    const nextUserNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
    const userId = `user${nextUserNumber}`;

    await setDoc(doc(db, "usersImagine", userId), {
      initials: initials,
      score: points,
      createdAt: Date.now()
    });

    console.log("Score submitted:", userId, initials, points);

  } catch (error) {
    console.error("Error submitting score:", error);
  }
}

// ===================== PLAYER COUNT =====================
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

// ===================== RESIZE =====================
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

// ===================== INIT =====================
const init = () => {

  resizeGame();
  window.addEventListener("resize", resizeGame);

  if (!sessionStorage.getItem("counted")) {
    incrementPlayerCount();
    sessionStorage.setItem("counted", "true");
  }

  // ===== GET DATA =====
  const points = Number(localStorage.getItem("finalPoints")) || 0;
  const teethCleaned = Number(localStorage.getItem("cleanedTotal")) || 0;
  const bactCount = Number(localStorage.getItem("flossedTotal")) || 0;

  document.getElementById('finalScore').textContent = points.toLocaleString();
  document.querySelector('#stat1 h1').textContent = bactCount;
  document.querySelector('#stat2 h1').textContent = teethCleaned;

  // ===== STARS =====
  const starsContainer = document.querySelector('#stars');
  starsContainer.innerHTML = '';

  const starRating = () => {
    if (points >= 8000) return 3;
    if (points < 2000 || isNaN(points)) return 0;
    return ((Math.floor(points / 1000)) - 2) * 0.5;
  };

  const createStar = (type) => {
    const star = document.createElement('img');
    star.src = `game-page-assets/${type}.svg`;
    star.classList.add('starImg');
    starsContainer.appendChild(star);
  };

  const numStars = starRating();
  for (let i = Math.floor(numStars); i > 0; i--) createStar("star");
  if (!Number.isInteger(numStars)) createStar("starHalf");
  for (let i = 3 - Math.ceil(numStars); i > 0; i--) createStar("starEmpty");

  // ===== UI ELEMENTS =====
  const popup = document.getElementById("initialContainerDesign");
  const input = document.getElementById("initialsInput");
  const submitBtn = document.getElementById("submitInitials");

  const skipBtn = document.getElementById("openInitialsButton");
  const replayBtn = document.getElementById("replayButton");

  popup.style.display = "none";

  // INITIAL STATE
  replayBtn.style.display = "none"; // hide replay until submitted

  let scoreSubmitted = false;
  let popupOpen = false;

  // ===== OPEN POPUP =====
  const openPopup = () => {
    popup.style.display = "flex";
    popupOpen = true;
    input.focus();
  };

  // ===== SUBMIT =====
  const handleSubmit = async () => {
    let initials = input.value.toUpperCase().trim();

    if (initials.length < 1) {
      console.log("Enter at least 1 letter");
      return;
    }

    await submitScore(points, initials);

    scoreSubmitted = true;
    popupOpen = false;
    popup.style.display = "none";

    // swap buttons
    skipBtn.style.display = "none";
    replayBtn.style.display = "inline-block";

    console.log("Submitted:", initials);
  };

  // ===== INPUT CLEAN =====
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^A-Za-z!@#$%^&*+-1234567890]/g, "").toUpperCase();
  });

  // ===== BUTTON EVENTS =====
  skipBtn.addEventListener("click", openPopup);
  submitBtn.addEventListener("click", handleSubmit);

  // ===== KEY CONTROLS =====
  document.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

      // popup open → submit
      if (popupOpen) {
        handleSubmit();
        return;
      }

      // not submitted → open popup
      if (!scoreSubmitted) {
        openPopup();
        return;
      }

      // submitted → replay
      if (scoreSubmitted) {
        window.location.href = "game-page.html";
      }
    }

    if (event.key.toLowerCase() === "e") {
      if (scoreSubmitted) {
        window.location.href = "index.html";
      }
    }
  });
};

// Run
window.onload = init;