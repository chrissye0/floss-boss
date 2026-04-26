// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB2rzEX1OA1aIZ8BkJ9hLcNeCUipmPNfAk",
  authDomain: "floss-boss-d2ea8.firebaseapp.com",
  projectId: "floss-boss-d2ea8",
  storageBucket: "floss-boss-d2ea8.firebasestorage.app",
  messagingSenderId: "876756088999",
  appId: "1:876756088999:web:c5bf9e3bcc79a053f64382",
  measurementId: "G-R3X1RMB0GT"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Resize
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

// Load scores
function loadHighscoresRealtime() {
  const q = query(
    //collection(db, "usersTest"),
    collection(db, "usersImagine"), //ADD FOR IMAGINE//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    orderBy("score", "desc"),
  );

  onSnapshot(q, (snapshot) => {
    const allScores = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      allScores.push({
        initials: data.initials || "---",
        score: data.score || 0,
        createdAt: data.createdAt || 0
      });
    });

    if (allScores.length === 0) return;

    // newest overall score
    const newest = allScores.reduce((latest, current) => {
      return current.createdAt > latest.createdAt ? current : latest;
    }, allScores[0]);

    // now get top 10 by score
    const top10 = [...allScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    displayScores(top10, newest);
  }, (error) => {
    console.error("Realtime error:", error);
  });
}

function displayScores(scores, newest) {
  const top3 = document.getElementById("top3");
  const rest = document.getElementById("rest");

  if (!top3 || !rest) return;

  top3.innerHTML = "";
  rest.innerHTML = "";

  scores.forEach((entry, index) => {
    const row = document.createElement("div");
    row.classList.add("score-row");

    // ONLY highlight if this entry is the newest overall
    if (
      entry.createdAt === newest.createdAt &&
      entry.score === newest.score &&
      entry.initials === newest.initials
    ) {
      row.classList.add("new-score");
    }

    row.innerHTML = `
      <span class="initials">${entry.initials}</span>
      <span class="score">${entry.score.toLocaleString()}</span>
    `;

    if (index < 3) {
      top3.appendChild(row);
    } else {
      rest.appendChild(row);
    }
  });
}

// Init
function init() {
  resizeGame();
  loadHighscoresRealtime();
}

window.addEventListener("load", init);
window.addEventListener("resize", resizeGame);