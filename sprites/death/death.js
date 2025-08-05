const deathAnimations = {
  atk1: {
    src: "sprites/death/atk1.png",
    frameCount: 4,
    frameDelay: 0.7,
    hurtboxes: [
      [{ x: 28, y: 28.4464, width: 6, height: 19 }],
      null,
      null,
      [{ x: 27, y: 27.4464, width: 9, height: 17 }],
    ],
    hitboxes: [
      null,
      [{ x: 9, y: 23.4464, width: 54, height: 25, damage: 5 }],
      [{ x: 23, y: 24.4464, width: 33, height: 24, damage: 2 }],
      null,
    ],
  },

  atk2: {
    src: "sprites/death/atk2.png",
    frameCount: 7,
    frameDelay: 0.9,
    hurtboxes: [
      [{ x: 28, y: 27.4464, width: 7, height: 20 }],
      null,
      null,
      [{ x: 27, y: 28.4464, width: 8, height: 17 }],
      [{ x: 27, y: 27.4464, width: 9, height: 19 }],
      [{ x: 30, y: 28.4464, width: 6, height: 19 }],
      [{ x: 29, y: 28.4464, width: 7, height: 18 }],
    ],
    hitboxes: [
      null,
      [{ x: 12, y: 20.4464, width: 42, height: 28, damage: 7 }],
      [{ x: 16, y: 19.4464, width: 36, height: 28, damage: 3 }],
      null,
      null,
      null,
      null,
    ],
  },

  atk3: {
    src: "sprites/death/atk3.png",
    frameCount: 4,
    frameDelay: 0.6,
    hurtboxes: [
      [{ x: 29, y: 33.4464, width: 6, height: 7 }],
      [{ x: 29, y: 34.4464, width: 7, height: 7 }],
      null,
      null,
    ],
    hitboxes: [
      null,
      null,
      [{ x: 18, y: 22.4464, width: 42, height: 26, damage: 10 }],
      [{ x: 35, y: 24.4464, width: 25, height: 24, damage: 5 }],
    ],
  },

  dash_end: {
    src: "sprites/death/dash_end.png",
    frameCount: 1,
    frameDelay: 0.2,
    hurtboxes: [null],
    hitboxes: [[{ x: 101, y: 29.4464, width: 17, height: 18, damage: 2 }]],
  },

  dash: {
    src: "sprites/death/dash.png",
    frameCount: 1,
    frameDelay: 0.4,
    hurtboxes: [null],
    hitboxes: [[{ x: 77, y: 26.4464, width: 46, height: 23, damage: 5 }]],
  },

  death: {
    src: "sprites/death/death.png",
    frameCount: 9,
    frameDelay: 2,
    hurtboxes: Array(9).fill(null),
    hitboxes: Array(9).fill(null),
  },

  hurt: {
    src: "sprites/death/hurt.png",
    frameCount: 2,
    frameDelay: 0.4,
    hurtboxes: Array(2).fill(null),
    hitboxes: Array(2).fill(null),
  },

  idle: {
    src: "sprites/death/idle.png",
    frameCount: 7,
    frameDelay: 1,
    hurtboxes: [
      [{ x: 28, y: 27.4464, width: 8, height: 20 }],
      [{ x: 27, y: 26.4464, width: 9, height: 20 }],
      [{ x: 28, y: 25.4464, width: 8, height: 21 }],
      [{ x: 28, y: 26.4464, width: 8, height: 21 }],
      [{ x: 28, y: 26.4464, width: 7, height: 20 }],
      [{ x: 29, y: 27.4464, width: 6, height: 20 }],
      [{ x: 30, y: 27.4464, width: 6, height: 17 }],
    ],
    hitboxes: Array(7).fill(null),
  },

  run_1: {
    src: "sprites/death/run_1.png",
    frameCount: 4,
    frameDelay: 0.4,
    hurtboxes: [
      [{ x: 30, y: 26.4464, width: 6, height: 19 }],
      [{ x: 28, y: 27.4464, width: 8, height: 19 }],
      [{ x: 28, y: 26.4464, width: 8, height: 18 }],
      [{ x: 28, y: 26.4464, width: 9, height: 20 }],
    ],
    hitboxes: Array(4).fill(null),
  },

  run_2: {
    src: "sprites/death/run_2.png",
    frameCount: 8,
    frameDelay: 0.6,
    hurtboxes: [
      [{ x: 28, y: 26.4464, width: 7, height: 20 }],
      [{ x: 29, y: 26.4464, width: 7, height: 20 }],
      [{ x: 29, y: 26.4464, width: 7, height: 21 }],
      [{ x: 28, y: 27.4464, width: 7, height: 20 }],
      [{ x: 30, y: 26.4464, width: 6, height: 20 }],
      [{ x: 28, y: 25.4464, width: 7, height: 22 }],
      [{ x: 28, y: 26.4464, width: 8, height: 20 }],
      [{ x: 28, y: 26.4464, width: 8, height: 22 }],
    ],
    hitboxes: Array(8).fill(null),
  },

  walk: {
    src: "sprites/death/walk.png",
    frameCount: 7,
    frameDelay: 0.6,
    hurtboxes: [
      [{ x: 30, y: 26.4464, width: 5, height: 19 }],
      [{ x: 27, y: 27.4464, width: 9, height: 19 }],
      [{ x: 28, y: 26.4464, width: 8, height: 19 }],
      [{ x: 28, y: 26.4464, width: 7, height: 21 }],
      [{ x: 26, y: 27.4464, width: 12, height: 20 }],
      [{ x: 28, y: 27.4464, width: 8, height: 19 }],
      [{ x: 28, y: 27.4464, width: 9, height: 18 }],
    ],
    hitboxes: Array(7).fill(null),
  },
};
