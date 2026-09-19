import { levelData, levels } from "./levels.js";

// GAME STATE
let currentGame = null;
let onLevelComplete = null;
export function setLevelCompleteCallback(callback) {
    onLevelComplete = callback;
}
// START LEVEL
export function startGame(levelId) {
    const data = levelData[levelId];
    if (!data) {
        console.error(`Level ${levelId} does not exist.`);
        return;
    }   
    currentGame = {
        levelId,
        gridSize: data.gridSize,
        arrows: data.arrows.map((arrow, index) => ({
            id: index,
            row: arrow.row,
            col: arrow.col,
            direction: arrow.direction,
            moving: false
        }))
    };
    renderBoard();
    updateArrowCounter();

}

// RENDER BOARD
function renderBoard() {
    const board =
        document.getElementById("puzzle-board");
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
            const arrow =currentGame.arrows.find( item => item.row === row && item.col === col);
            if (arrow) {
                createArrow( cell,arrow);
            }
            board.appendChild(cell);
        }
    }
}

// CREATE ARROW
function createArrow(cell, arrowData) {
    const arrow = document.createElement("div");
    arrow.className = `board-arrow ${arrowData.direction}`;
    arrow.dataset.arrowId =
        arrowData.id;
    arrow.addEventListener( "click", () => {
            moveArrow(arrowData.id);
        }
    );
    cell.appendChild(arrow);
}
// MOVE ARROW

function moveArrow(arrowId) {
    if (!currentGame) {
        return;
    }
    const arrow = currentGame.arrows.find(item => item.id === arrowId);
    if (!arrow || arrow.moving) {
        return;
    }

    // Check whether the arrow
    // has a clear path to exit.
    if (!canArrowExit(arrow)) {
        // For now we simply give
        // a small visual feedback.
        shakeArrow(arrow.id);
        return;
    }
    arrow.moving = true;
    animateArrowExit(arrow);
}

// CHECK PATH
function canArrowExit(arrow) {
    let row = arrow.row;
    let col = arrow.col;
    const direction =  getDirectionOffset(
            arrow.direction
        );
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

        const blocked = currentGame.arrows.some(
                other =>
                    other.id !== arrow.id &&
                    other.row === row &&
                    other.col === col
            );

        if (blocked) {
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
                col: 0
            };

        case "down":
            return {
                row: 1,
                col: 0
            };

        case "left":
            return {
                row: 0,
                col: -1
            };

        case "right":
            return {
                row: 0,
                col: 1
            };

        default:
            return {
                row: 0,
                col: 0
            };

    }

}



// EXIT ANIMATION


// EXIT ANIMATION
function animateArrowExit(arrow) {
    const element = document.querySelector(
        `.board-arrow[data-arrow-id="${arrow.id}"]`
    );

    const board = document.getElementById("puzzle-board");

    if (!element || !board) {
        return;
    }

    // Get positions relative to the viewport
    const elementRect = element.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    // Current center of the arrow
    const arrowCenterX =
        elementRect.left + elementRect.width / 2;

    const arrowCenterY =
        elementRect.top + elementRect.height / 2;

    // Distance from arrow center to the board edge
    let distance = 0;

    switch (arrow.direction) {
        case "up":
            distance =
                arrowCenterY - boardRect.top +
                elementRect.height;
            break;

        case "down":
            distance =
                boardRect.bottom - arrowCenterY +
                elementRect.height;
            break;

        case "left":
            distance =
                arrowCenterX - boardRect.left +
                elementRect.width;
            break;

        case "right":
            distance =
                boardRect.right - arrowCenterX +
                elementRect.width;
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

    // Keep the arrow pointing in its original direction
    const rotation = {
        up: 0,
        right: 90,
        down: 180,
        left: 270
    };

    element.style.transition =
        "transform 0.65s cubic-bezier(0.22, 0.61, 0.36, 1)";

    element.style.transform =
        `translate3d(${x}px, ${y}px, 0) rotate(${rotation[arrow.direction]}deg)`;

    element.style.pointerEvents = "none";

    setTimeout(() => {
        currentGame.arrows =
            currentGame.arrows.filter(
                item => item.id !== arrow.id
            );

        updateArrowCounter();
        renderBoard();
        checkLevelComplete();
    }, 650);
}
// SHAKE BLOCKED ARROW
function shakeArrow(arrowId) {  
    const element = document.querySelector( `.board-arrow[data-arrow-id="${arrowId}"]`);
    if (!element) {
        return;
    }
    element.classList.remove("arrow-blocked");

    // Force browser reflow
    void element.offsetWidth;
    element.classList.add("arrow-blocked");
    setTimeout(() => {
        element.classList.remove(
            "arrow-blocked"
        );
    }, 300);

}

// UPDATE COUNTER
function updateArrowCounter() {

    const counter =
        document.getElementById(
            "arrow-count"
        );
    if (!counter || !currentGame) {

        return;
    }
    counter.textContent =
        currentGame.arrows.length;

}

// LEVEL COMPLETE
function checkLevelComplete() {

    if (
        !currentGame ||
        currentGame.arrows.length !== 0
    ) {
        return;
    }

    const completedLevel =
        currentGame.levelId;

    // Save completed level
    saveCompletedLevel(completedLevel);

    // Unlock next level
    unlockNextLevel(completedLevel);

    // 🎉 Show confetti
    showConfetti();

    const nextLevel =
        completedLevel + 1;

    // Wait for confetti, then tell main.js
    // to open the next level.
    setTimeout(() => {

        if (levelData[nextLevel]) {

            if (onLevelComplete) {
                onLevelComplete(nextLevel);
            }

        } else {

            console.log(
                "🎉 All levels completed!"
            );

        }

    }, 1800);
}
function unlockNextLevel(levelId) {

    const nextLevelId =
        levelId + 1;

    const nextLevel =
        levels.find(
            level => level.id === nextLevelId
        );

    if (nextLevel) {

        nextLevel.unlocked = true;

        console.log(
            `Level ${nextLevelId} unlocked!`
        );
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
    return JSON.parse(
        localStorage.getItem("arrowPuzzleCompletedLevels") || "[]"
    );
}

function saveCompletedLevel(levelId) {
    const completedLevels = getCompletedLevels();

    if (!completedLevels.includes(levelId)) {
        completedLevels.push(levelId);

        localStorage.setItem(
            "arrowPuzzleCompletedLevels",
            JSON.stringify(completedLevels)
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

    const container =
        document.createElement("div");

    container.className =
        "confetti-container";

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
        "#ff9500"
    ];

    // Create confetti pieces
    for (let i = 0; i < 120; i++) {

        const piece =
            document.createElement("div");

        piece.className =
            "confetti";

        // Random position
        piece.style.left =
            `${Math.random() * 100}%`;

        // Random color
        piece.style.backgroundColor =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];

        // Random size
        const width =
            Math.random() * 7 + 5;

        const height =
            Math.random() * 12 + 7;

        piece.style.width =
            `${width}px`;

        piece.style.height =
            `${height}px`;

        // Random fall speed
        piece.style.animationDuration =
            `${Math.random() * 1.5 + 1.5}s`;

        // Random delay
        piece.style.animationDelay =
            `${Math.random() * 0.5}s`;

        // Random rotation
        piece.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        container.appendChild(piece);
    }

    document.body.appendChild(container);

    // Remove after animation
    setTimeout(() => {

        container.remove();

    }, 3500);
}