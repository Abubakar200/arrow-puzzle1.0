
import {
    levelData,
    levels,
    TOTAL_LEVELS
} from "./levels.js";
document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // SCREENS
    // =========================

    const splashScreen =
        document.getElementById("splash-screen");

    const homeScreen =
        document.getElementById("home-screen");

    const levelScreen =
        document.getElementById("level-screen");

    const gameScreen =
        document.getElementById("game-screen");


    // =========================
    // SPLASH
    // =========================

    const loadingProgress =
        document.getElementById("loading-progress");

    const loadingText =
        document.getElementById("loading-text");


    // =========================
    // HOME BUTTON
    // =========================

    const playButton =
        document.getElementById("play-btn");


    // =========================
    // LEVEL SCREEN
    // =========================

    const levelBackButton =
        document.getElementById("level-back-btn");

    const levelsGrid =
        document.getElementById("levels-grid");

    const progressText =
        document.getElementById("level-progress-text");

    const progressBar =
        document.getElementById("level-progress-bar");


    // =========================
    // GAME SCREEN
    // =========================

    const gameBackButton =
        document.getElementById("game-back-btn");

    const gameSettingsButton =
        document.getElementById("game-settings-btn");

    const levelSelectButton =
        document.getElementById("level-select-btn");

    const hintButton =
        document.getElementById("hint-btn");

    const currentLevelNumber =
        document.getElementById("current-level-number");


    // =========================
    // GAME STATE
    // =========================

    let currentLevel = 1;


    // =========================
    // SPLASH LOADING
    // =========================

    let progress = 0;


    const loadingInterval = setInterval(() => {

        progress += Math.floor(Math.random() * 8) + 3;


        if (progress >= 100) {

            progress = 100;

            clearInterval(loadingInterval);

            loadingText.textContent = "Ready!";


            setTimeout(() => {

                showScreen(homeScreen);

            }, 500);

        }


        loadingProgress.style.width =
            `${progress}%`;


        if (progress < 30) {

            loadingText.textContent =
                "Loading...";

        }
        else if (progress < 60) {

            loadingText.textContent =
                "Preparing puzzle...";

        }
        else if (progress < 90) {

            loadingText.textContent =
                "Loading levels...";

        }
        else {

            loadingText.textContent =
                "Almost ready...";

        }

    }, 120);


    // =========================
    // PLAY
    // =========================

    playButton.addEventListener("click", () => {

        showLevelScreen();

    });


    // =========================
    // LEVEL SCREEN BACK
    // =========================

    levelBackButton.addEventListener("click", () => {

        showScreen(homeScreen);

    });


    // =========================
    // GAME BACK
    // =========================

    gameBackButton.addEventListener("click", () => {

        showScreen(levelScreen);

    });


    // =========================
    // LEVEL SELECTION BUTTON
    // =========================

    levelSelectButton.addEventListener(
        "click",
        () => {

            showLevelScreen();

        }
    );


    // =========================
    // SETTINGS
    // =========================

    gameSettingsButton.addEventListener(
        "click",
        () => {

            console.log("Game settings clicked");

        }
    );


    // =========================
    // HINT
    // =========================

    hintButton.addEventListener(
        "click",
        () => {

            console.log("Hint clicked");

        }
    );


    // =========================
    // SHOW SCREEN
    // =========================

    function showScreen(screen) {

        document
            .querySelectorAll(".screen")
            .forEach(item => {

                item.classList.remove("active");

            });


        screen.classList.add("active");

    }


    // =========================
    // SHOW LEVEL SCREEN
    // =========================

    function showLevelScreen() {

        generateLevelButtons();

        updateLevelProgress();

        showScreen(levelScreen);

    }


    // =========================
    // GENERATE LEVELS
    // =========================

    function generateLevelButtons() {

        levelsGrid.innerHTML = "";


        levels.forEach(level => {

            const button =
                document.createElement("button");


            button.classList.add(
                "level-button"
            );


            // =========================
            // UNLOCKED
            // =========================

            if (level.unlocked) {

                button.classList.add(
                    "unlocked"
                );


                button.innerHTML = `
                    <span class="level-number">
                        ${level.id}
                    </span>

                    <span class="level-label">
                        LEVEL
                    </span>
                `;


                button.addEventListener(
                    "click",
                    () => {

                        selectLevel(level.id);

                    }
                );

            }


            // =========================
            // LOCKED
            // =========================

            else {

                button.classList.add(
                    "locked"
                );


                button.innerHTML = `
                    <span class="lock-icon">
                        🔒
                    </span>

                    <span class="level-number">
                        ${level.id}
                    </span>
                `;

            }


            // =========================
            // COMPLETED
            // =========================

            if (level.completed) {

                button.classList.add(
                    "completed"
                );


                const star =
                    document.createElement("span");

                star.className =
                    "completed-star";

                star.textContent = "★";


                button.appendChild(star);

            }


            levelsGrid.appendChild(button);

        });

    }


    // =========================
    // LEVEL PROGRESS
    // =========================

    function updateLevelProgress() {

        const unlockedLevels =
            levels.filter(
                level => level.unlocked
            ).length;


        progressText.textContent =
            `${unlockedLevels} / ${TOTAL_LEVELS}`;


        const percentage =
            (unlockedLevels / TOTAL_LEVELS) * 100;


        progressBar.style.width =
            `${percentage}%`;

    }


    // =========================
    // SELECT LEVEL
    // =========================

    // =========================
    // SELECT LEVEL
    // =========================

    function selectLevel(levelId) {

        currentLevel = levelId;

        currentLevelNumber.textContent =
            levelId;

        showGameBoard(levelId);

        showScreen(gameScreen);

    }


    // =========================
    // CREATE GAME BOARD
    // =========================

    function showGameBoard(levelId) {

        const board =
            document.getElementById("puzzle-board");


        const data =
            levelData[levelId];


        if (!data) {

            console.error(
                `Level ${levelId} does not exist yet.`
            );

            return;

        }


        // Clear previous board

        board.innerHTML = "";


        // Set grid size

        board.style.gridTemplateColumns =
            `repeat(${data.gridSize}, 1fr)`;

        board.style.gridTemplateRows =
            `repeat(${data.gridSize}, 1fr)`;


        // =========================
        // CREATE CELLS
        // =========================

        for (
            let row = 0;
            row < data.gridSize;
            row++
        ) {

            for (
                let col = 0;
                col < data.gridSize;
                col++
            ) {

                const cell =
                    document.createElement("div");


                cell.className =
                    "puzzle-cell";


                cell.dataset.row = row;
                cell.dataset.col = col;


                // Check whether
                // an arrow belongs here

                const arrow =
                    data.arrows.find(
                        item =>
                            item.row === row &&
                            item.col === col
                    );


                if (arrow) {

                    createArrow(
                        cell,
                        arrow.direction
                    );

                }


                board.appendChild(cell);

            }

        }


        // Update arrow counter

        updateArrowCounter(data.arrows.length);

    }


    // =========================
    // CREATE ARROW
    // =========================

    function createArrow(
        cell,
        direction
    ) {

        const arrow =
            document.createElement("div");


        arrow.className =
            `board-arrow ${direction}`;


        arrow.dataset.direction =
            direction;


        cell.appendChild(arrow);

    }


    // =========================
    // UPDATE ARROW COUNTER
    // =========================

    function updateArrowCounter(count) {

        const counter =
            document.getElementById(
                "arrow-count"
            );


        counter.textContent = count;

    }



});

