import level1 from "./levels/level1.js";
import level2 from "./levels/level2.js";
import level3 from "./levels/level3.js";
import level4 from "./levels/level4.js";
import level5 from "./levels/level5.js";
import level6 from "./levels/level6.js";
import level7 from "./levels/level7.js";
import level8 from "./levels/level8.js";
import level9 from "./levels/level9.js";
import level10 from "./levels/level10.js";
import level11 from "./levels/level11.js";
import level12 from "./levels/level12.js";
import level13 from "./levels/level13.js";
import level14 from "./levels/level14.js";
import level15 from "./levels/level15.js";
import level16 from "./levels/level16.js";
import level17 from "./levels/level17.js";
import level18 from "./levels/level18.js";
import level19 from "./levels/level19.js";
import level20 from "./levels/level20.js";
import level21 from "./levels/level21.js";
import level22 from "./levels/level22.js";
import level23 from "./levels/level23.js";
import level24 from "./levels/level24.js";
import level25 from "./levels/level25.js";
import level26 from "./levels/level26.js";
import level27 from "./levels/level27.js";
import level28 from "./levels/level28.js";
import level29 from "./levels/level29.js";
import level30 from "./levels/level30.js";
import level31 from "./levels/level31.js";
import level32 from "./levels/level32.js";
import level33 from "./levels/level33.js";
import level34 from "./levels/level34.js";
import level35 from "./levels/level35.js";
import level36 from "./levels/level36.js";

import level37 from "./levels/level37.js";
import level38 from "./levels/level38.js";
import level39 from "./levels/level39.js";
import level40 from "./levels/level40.js";
import level41 from "./levels/level41.js";
import level42 from "./levels/level42.js";
import level43 from "./levels/level43.js";
import level44 from "./levels/level44.js";
import level45 from "./levels/level45.js";
import level46 from "./levels/level46.js";
import level47 from "./levels/level47.js";
import level48 from "./levels/level48.js";
import level49 from "./levels/level49.js";
import level50 from "./levels/level50.js";

// =========================
// LEVEL CONFIGURATION
// =========================

export const TOTAL_LEVELS = 50;

// =========================
// ALL LEVEL DATA
// =========================

export const levelData = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5,
  6: level6,
  7: level7,
  8: level8,
  9: level9,
  10: level10,

  11: level11,
  12: level12,
  13: level13,
  14: level14,
  15: level15,
  16: level16,
  17: level17,
  18: level18,
  19: level19,
  20: level20,

  21: level21,
  22: level22,
  23: level23,
  24: level24,
  25: level25,
  26: level26,
  27: level27,
  28: level28,
  29: level29,
  30: level30,

  31: level31,
  32: level32,
  33: level33,
  34: level34,
  35: level35,
  36: level36,
  37: level37,
  38: level38,
  39: level39,
  40: level40,

  41: level41,
  42: level42,
  43: level43,
  44: level44,
  45: level45,
  46: level46,
  47: level47,
  48: level48,
  49: level49,
  50: level50,
};

// =========================
// LEVEL LIST
// =========================

export const levels = [];

for (let i = 1; i <= TOTAL_LEVELS; i++) {
  levels.push({
    id: i,

    unlocked: i === 1,

    completed: false,
  });
}
