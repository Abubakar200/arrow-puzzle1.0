import { levelData } from "./levels.js";

// GAME STATE
let currentGame = null;

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


function animateArrowExit(arrow) {

    const element = document.querySelector( `.board-arrow[data-arrow-id="${arrow.id}"]`);
    if (!element) {
        return;
    }
    const cell = element.closest(".puzzle-cell");
    const board = document.getElementById("puzzle-board");
    if (!cell || !board) {
        return;
    }
    /*
       Get the actual size of one board cell.
    */
    const cellRect = cell.getBoundingClientRect();
    const cellSize = cellRect.width;
    /*
       Move exactly far enough for the
       arrow to leave its own cell and
       reach the board edge.

       Because the board has overflow:hidden,
       the arrow can NEVER visually cross
       the header or footer.
    */

    const cellsToEdge = {
        up:
            arrow.row + 1,
        down:
            currentGame.gridSize -
            arrow.row,
        left:
            arrow.col + 1,
        right:
            currentGame.gridSize -
            arrow.col
    };
    const distance = cellsToEdge[arrow.direction] * cellSize;

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
       Preserve the arrow direction.
    */
    const rotation = {
        up: 0,
        right: 90,
        down: 180,
        left: 270
    };
    element.style.transition = "transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)";
    element.style.transform = `translate3d(${x}px, ${y}px, 0)
         rotate(${rotation[arrow.direction]}deg)`;
    element.style.pointerEvents =
        "none";

    setTimeout(() => {
        currentGame.arrows =
            currentGame.arrows.filter(
                item =>
                    item.id !== arrow.id
            );
        updateArrowCounter();
        renderBoard();
        checkLevelComplete();
    }, 450);

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
        currentGame &&
        currentGame.arrows.length === 0
    ) {
        console.log(
            `Level ${currentGame.levelId} complete!`
        );

        // Completion screen will be added later.
    }
}