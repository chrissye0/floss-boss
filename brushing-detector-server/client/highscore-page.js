// 🔥 Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔑 Your Firebase config
const firebaseConfig = {
  // paste your config here
  apiKey: "AIzaSyB2rzEX1OA1aIZ8BkJ9hLcNeCUipmPNfAk",
  authDomain: "floss-boss-d2ea8.firebaseapp.com",
  projectId: "floss-boss-d2ea8",
  storageBucket: "floss-boss-d2ea8.firebasestorage.app",
  messagingSenderId: "876756088999",
  appId: "1:876756088999:web:c5bf9e3bcc79a053f64382",
  measurementId: "G-R3X1RMB0GT"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🎯 Resize function
function resizeGame() {
  const GAME_RATIO = 9 / 16;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const viewportRatio = vw / vh;

  const game = document.getElementById("page-root");

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

// 🏆 Realtime TOP 10 highscores
function loadHighscoresRealtime() {
  const q = query(
    collection(db, "users"),
    orderBy("score", "desc"),
    limit(10) // ⭐ top 10 only
  );

  onSnapshot(q, (snapshot) => {
    const scores = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      scores.push({
        initials: data.initials || "---",
        score: data.score || 0
      });
    });

    displayScores(scores);
  }, (error) => {
    console.error("Realtime error:", error);
  });
}

// 🖥️ Display scores
function displayScores(scores) {
  const top3 = document.getElementById("top3");
  const rest = document.getElementById("rest");

  if (!top3 || !rest) {
    console.error("Missing leaderboard containers");
    return;
  }

  top3.innerHTML = "";
  rest.innerHTML = "";

  scores.forEach((entry, index) => {
    const row = document.createElement("div");
    row.classList.add("score-row");

    row.innerHTML = `
      <span class="initials">${entry.initials}</span>
      <span class="score">${entry.score.toLocaleString()}</span>
    `;

    if (index < 3) {
      top3.appendChild(row);   // 🥇🥈🥉
    } else {
      rest.appendChild(row);   // 4–10
    }
  });
}

// 🚀 Init (cleaner than window.onload)
function init() {
  resizeGame();
  loadHighscoresRealtime();
}

// ✅ Run on load + resize
window.addEventListener("load", init);
window.addEventListener("resize", resizeGame);