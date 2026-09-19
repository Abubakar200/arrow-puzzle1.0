import { levelData, levels } from "./levels.js";

const MAX_LIVES = 3;

// GAME STATE
let currentGame = null;
let onLevelComplete = null;
let onGameOverExit = null;
let overlayBound = false;

export function setLevelCompleteCallback(callback) {
  onLevelComplete = callback;
}

export function setGameOverExitCallback(callback) {
  onGameOverExit = callback;
}

export function hideGameOver() {
  const overlay = document.getElementById("game-over-overlay");
  if (!overlay) {
    return;
  }
  overlay.classList.remove("visible");
  overlay.setAttribute("aria-hidden", "true");
}

// START LEVEL
export function startGame(levelId) {
  const data = levelData[levelId];
  if (!data) {
    console.error(`Level ${levelId} does not exist.`);
    return;
  }
  bindGameOverOverlay();
  hideGameOver();
  currentGame = {
    levelId,
    gridSize: data.gridSize,
    lives: MAX_LIVES,
    gameOver: false,
    arrows: data.arrows.map((arrow, index) => ({
      id: index,
      row: arrow.row,
      col: arrow.col,
      direction: arrow.direction,
      moving: false,
    })),
  };
  renderBoard();
  updateArrowCounter();
  renderLives();
}

// RENDER BOARD
function renderBoard() {
  const board = document.getElementById("puzzle-board");
  if (!board || !currentGame) {
    return;
  }
  board.innerHTML = "";
  const size = currentGame.gridSize;
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  // CREATE CELLS
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = document.createElement("div");
      cell.className = "puzzle-cell";
      cell.dataset.row = row;
      cell.dataset.col = col;
      const arrow = currentGame.arrows.find(
        (item) => item.row === row && item.col === col,
      );
      if (arrow) {
        createArrow(cell, arrow);
      }
      board.appendChild(cell);
    }
  }
}

// CREATE ARROW
function createArrow(cell, arrowData) {
  const arrow = document.createElement("div");

  arrow.className = "board-arrow";
  arrow.dataset.arrowId = arrowData.id;

  const visual = document.createElement("div");
  visual.className = `arrow-visual ${arrowData.direction}`;
  visual.innerHTML = `
    <svg class="arrow-graphic" viewBox="0 0 100 100" aria-hidden="true">
      <line class="arrow-shaft" x1="50" y1="90" x2="50" y2="30" />
      <polyline class="arrow-head" points="28,48 50,18 72,48" />
    </svg>
  `;

  arrow.appendChild(visual);

  arrow.addEventListener("click", () => {
    moveArrow(arrowData.id);
  });

  cell.appendChild(arrow);
}
// MOVE ARROW

function moveArrow(arrowId) {
  if (!currentGame || currentGame.gameOver) {
    return;
  }
  const arrow = currentGame.arrows.find((item) => item.id === arrowId);
  if (!arrow || arrow.moving) {
    return;
  }

  // Check whether the arrow
  // has a clear path to exit.
  if (!canArrowExit(arrow)) {
    playCollision(arrow);
    loseLife();
    return;
  }
  arrow.moving = true;
  animateArrowExit(arrow);
}

// CHECK PATH
function canArrowExit(arrow) {
  let row = arrow.row;
  let col = arrow.col;
  const direction = getDirectionOffset(arrow.direction);
  while (true) {
    row += direction.row;
    col += direction.col;

    // Arrow reached outside board
    if (
      row < 0 ||
      row >= currentGame.gridSize ||
      col < 0 ||
      col >= currentGame.gridSize
    ) {
      return true;
    }

    // Check if another arrow
    // is occupying this cell

    if (getArrowAt(row, col, arrow.id)) {
      return false;
    }
  }
}

// DIRECTION

function getDirectionOffset(direction) {
  switch (direction) {
    case "up":
      return {
        row: -1,
        col: 0,
      };

    case "down":
      return {
        row: 1,
        col: 0,
      };

    case "left":
      return {
        row: 0,
        col: -1,
      };

    case "right":
      return {
        row: 0,
        col: 1,
      };

    default:
      return {
        row: 0,
        col: 0,
      };
  }
}

// EXIT ANIMATION

// EXIT ANIMATION
function animateArrowExit(arrow) {
  const element = document.querySelector(
    `.board-arrow[data-arrow-id="${arrow.id}"]`,
  );

  const board = document.getElementById("puzzle-board");

  if (!element || !board) {
    return;
  }

  const cell = element.closest(".puzzle-cell");

  if (!cell) {
    return;
  }

  const cellRect = cell.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  /*
   * Distance is calculated from the arrow's
   * current cell to the COMPLETE board edge.
   */

  let distance = 0;

  switch (arrow.direction) {
    case "up":
      distance =
        cellRect.top -
        boardRect.top +
        cellRect.height;
      break;

    case "down":
      distance =
        boardRect.bottom -
        cellRect.top;
      break;

    case "left":
      distance =
        cellRect.left -
        boardRect.left +
        cellRect.width;
      break;

    case "right":
      distance =
        boardRect.right -
        cellRect.left;
      break;
  }

  let x = 0;
  let y = 0;

  switch (arrow.direction) {
    case "up":
      y = -distance;
      break;

    case "down":
      y = distance;
      break;

    case "left":
      x = -distance;
      break;

    case "right":
      x = distance;
      break;
  }

  /*
   * Move the ENTIRE arrow across the
   * puzzle board.
   */

  element.style.transition =
    "transform 0.65s cubic-bezier(0.22, 0.61, 0.36, 1)";

  element.style.transform =
    `translate3d(${x}px, ${y}px, 0)`;

  element.style.pointerEvents = "none";

  /*
   * Remove arrow after animation.
   */

  setTimeout(() => {
    if (!currentGame) {
      return;
    }

    currentGame.arrows =
      currentGame.arrows.filter(
        (item) => item.id !== arrow.id,
      );

    updateArrowCounter();

    renderBoard();

    checkLevelComplete();

  }, 650);
}
function getArrowAt(row, col, exceptId) {
  return currentGame.arrows.find(
    (other) =>
      other.id !== exceptId && other.row === row && other.col === col,
  );
}

function findBlockingArrow(arrow) {
  let row = arrow.row;
  let col = arrow.col;
  const direction = getDirectionOffset(arrow.direction);

  while (true) {
    row += direction.row;
    col += direction.col;

    if (
      row < 0 ||
      row >= currentGame.gridSize ||
      col < 0 ||
      col >= currentGame.gridSize
    ) {
      return null;
    }

    const blocker = getArrowAt(row, col, arrow.id);
    if (blocker) {
      return blocker;
    }
  }
}

function playCollision(arrow) {
  const element = document.querySelector(
    `.board-arrow[data-arrow-id="${arrow.id}"]`,
  );
  const blocker = findBlockingArrow(arrow);
  const blockerElement = blocker
    ? document.querySelector(`.board-arrow[data-arrow-id="${blocker.id}"]`)
    : null;

  if (!element) {
    return;
  }

  arrow.moving = true;

  const direction = getDirectionOffset(arrow.direction);
  const cell = element.closest(".puzzle-cell");
  const lunge = (cell ? cell.offsetWidth : 48) * 0.32;
  const x = direction.col * lunge;
  const y = direction.row * lunge;

  element.classList.remove("arrow-collision");
  blockerElement?.classList.remove("arrow-collision");

  element.style.transition =
    "transform 0.11s cubic-bezier(0.2, 0.7, 0.3, 1)";
  element.style.transform = `translate3d(${x}px, ${y}px, 0)`;

  setTimeout(() => {
    spawnCollisionBurst(element, direction);
    element.classList.add("arrow-collision");
    blockerElement?.classList.add("arrow-collision");

    element.style.transition =
      "transform 0.2s cubic-bezier(0.18, 0.85, 0.32, 1)";
    element.style.transform = "translate3d(0, 0, 0)";

    setTimeout(() => {
      element.classList.remove("arrow-collision");
      blockerElement?.classList.remove("arrow-collision");
      element.style.transition = "";
      element.style.transform = "";
      if (arrow) {
        arrow.moving = false;
      }
    }, 280);
  }, 110);
}

function spawnCollisionBurst(element, direction) {
  const board = document.getElementById("puzzle-board");
  if (!board) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();
  const burst = document.createElement("div");

  burst.className = "collision-burst";
  burst.style.left = `${
    rect.left -
    boardRect.left +
    rect.width / 2 +
    direction.col * rect.width * 0.42
  }px`;
  burst.style.top = `${
    rect.top -
    boardRect.top +
    rect.height / 2 +
    direction.row * rect.height * 0.42
  }px`;

  board.appendChild(burst);
  setTimeout(() => burst.remove(), 420);
}

function loseLife() {
  if (!currentGame || currentGame.gameOver || currentGame.lives <= 0) {
    return;
  }

  currentGame.lives -= 1;
  renderLives(currentGame.lives);

  if (currentGame.lives <= 0) {
    currentGame.gameOver = true;
    setTimeout(showGameOver, 520);
  }
}

function renderLives(justLostIndex) {
  const hearts = document.querySelectorAll("#lives-container .heart");

  hearts.forEach((heart, index) => {
    const alive = currentGame && index < currentGame.lives;
    heart.classList.toggle("active", Boolean(alive));
    heart.classList.toggle("lost", !alive);
    heart.classList.remove("just-lost");

    if (!alive && justLostIndex === index) {
      void heart.offsetWidth;
      heart.classList.add("just-lost");
    }
  });
}

function showGameOver() {
  const overlay = document.getElementById("game-over-overlay");
  if (!overlay) {
    return;
  }
  overlay.classList.add("visible");
  overlay.setAttribute("aria-hidden", "false");
}

function bindGameOverOverlay() {
  if (overlayBound) {
    return;
  }

  const retryButton = document.getElementById("game-over-retry-btn");
  const levelsButton = document.getElementById("game-over-levels-btn");

  if (!retryButton || !levelsButton) {
    return;
  }

  overlayBound = true;

  retryButton.addEventListener("click", () => {
    if (!currentGame) {
      return;
    }
    startGame(currentGame.levelId);
  });

  levelsButton.addEventListener("click", () => {
    hideGameOver();
    if (onGameOverExit) {
      onGameOverExit();
    }
  });
}

// UPDATE COUNTER
function updateArrowCounter() {
  const counter = document.getElementById("arrow-count");
  if (!counter || !currentGame) {
    return;
  }
  counter.textContent = currentGame.arrows.length;
}

// LEVEL COMPLETE
function checkLevelComplete() {
  if (!currentGame || currentGame.arrows.length !== 0) {
    return;
  }

  const completedLevel = currentGame.levelId;

  // Save completed level
  saveCompletedLevel(completedLevel);

  // Unlock next level
  unlockNextLevel(completedLevel);

  // 🎉 Show confetti
  showConfetti();

  const nextLevel = completedLevel + 1;

  // Wait for confetti, then tell main.js
  // to open the next level.
  setTimeout(() => {
    if (levelData[nextLevel]) {
      if (onLevelComplete) {
        onLevelComplete(nextLevel);
      }
    } else {
      console.log("🎉 All levels completed!");
    }
  }, 1800);
}
function unlockNextLevel(levelId) {
  const nextLevelId = levelId + 1;

  const nextLevel = levels.find((level) => level.id === nextLevelId);

  if (nextLevel) {
    nextLevel.unlocked = true;

    console.log(`Level ${nextLevelId} unlocked!`);
  }
}
function isLevelUnlocked(levelId) {
  // Level 1 is always unlocked
  if (levelId === 1) {
    return true;
  }

  // Previous level must be completed
  return isLevelCompleted(levelId - 1);
}
function getCompletedLevels() {
  return JSON.parse(localStorage.getItem("arrowPuzzleCompletedLevels") || "[]");
}

function saveCompletedLevel(levelId) {
  const completedLevels = getCompletedLevels();

  if (!completedLevels.includes(levelId)) {
    completedLevels.push(levelId);

    localStorage.setItem(
      "arrowPuzzleCompletedLevels",
      JSON.stringify(completedLevels),
    );
  }
}

export function isLevelCompleted(levelId) {
  return getCompletedLevels().includes(levelId);
}

export function getCompletedLevelList() {
  return getCompletedLevels();
}

function showConfetti() {
  const container = document.createElement("div");

  container.className = "confetti-container";

  // Random color palette
  const colors = [
    "#ff3b30",
    "#ffcc00",
    "#34c759",
    "#007aff",
    "#af52de",
    "#ff2d55",
    "#5856d6",
    "#00c7be",
    "#ff9500",
  ];

  // Create confetti pieces
  for (let i = 0; i < 120; i++) {
    const piece = document.createElement("div");

    piece.className = "confetti";

    // Random position
    piece.style.left = `${Math.random() * 100}%`;

    // Random color
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    // Random size
    const width = Math.random() * 7 + 5;

    const height = Math.random() * 12 + 7;

    piece.style.width = `${width}px`;

    piece.style.height = `${height}px`;

    // Random fall speed
    piece.style.animationDuration = `${Math.random() * 1.5 + 1.5}s`;

    // Random delay
    piece.style.animationDelay = `${Math.random() * 0.5}s`;

    // Random rotation
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    container.appendChild(piece);
  }

  document.body.appendChild(container);

  // Remove after animation
  setTimeout(() => {
    container.remove();
  }, 3500);
}
