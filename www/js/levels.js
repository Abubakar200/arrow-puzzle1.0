
// =========================
// LEVEL CONFIGURATION
// =========================

const TOTAL_LEVELS = 50;


// =========================
// CREATE INITIAL LEVEL DATA
// =========================

const levels = [];

for (let i = 1; i <= TOTAL_LEVELS; i++) {

    levels.push({
        id: i,

        // Only level 1 is initially unlocked
        unlocked: i === 1,

        completed: false
    });

}

