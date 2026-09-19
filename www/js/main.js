
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


    // =========================
    // SPLASH
    // =========================

    const loadingProgress =
        document.getElementById("loading-progress");

    const loadingText =
        document.getElementById("loading-text");


    // =========================
    // BUTTONS
    // =========================

    const playButton =
        document.getElementById("play-btn");

    const levelBackButton =
        document.getElementById("level-back-btn");


    // =========================
    // LEVEL ELEMENTS
    // =========================

    const levelsGrid =
        document.getElementById("levels-grid");

    const progressText =
        document.getElementById("level-progress-text");

    const progressBar =
        document.getElementById("level-progress-bar");


    // =========================
    // LOADING
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
    // BACK
    // =========================

    levelBackButton.addEventListener("click", () => {

        showScreen(homeScreen);

    });


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

    function selectLevel(levelId) {

        console.log(
            `Level ${levelId} selected`
        );


        // Actual game screen
        // will be added next.


        alert(
            `Level ${levelId} selected!`
        );

    }

});

