window.player = {
    atk1: {
      src: "atk1.png",
      frameCount: 4,
      frameDelay: 0.4,
      boxes: {
        "0": [{ x: 48, y: 45.446, width: 11, height: 33, type: "hurtbox" }],
        "1": [{ x: 60, y: 35.446, width: 44, height: 44, type: "attack", damage: 5 }],
        "3": [{ x: 48, y: 47.446, width: 19, height: 28, type: "hurtbox" }]
      }
    },
    atk2: {
      src: "atk2.png",
      frameCount: 6,
      frameDelay: 0.7,
      boxes: {
        "0": [{ x: 43, y: 44.446, width: 20, height: 35, type: "hurtbox" }],
        "1": [{ x: 44, y: 44.446, width: 17, height: 35, type: "hurtbox" }],
        "2": [{ x: 36, y: 33.446, width: 67, height: 47, type: "attack", damage: 7 }],
        "3": [{ x: 27, y: 58.446, width: 59, height: 21, type: "attack", damage: 3 }],
        "5": [{ x: 51, y: 45.446, width: 10, height: 34, type: "hurtbox" }]
      }
    },
    atkCombo: {
      src: "atkcombo.png",
      frameCount: 10,
      frameDelay: 1.2,
      boxes: {
        "0": [{ x: 48, y: 46.446, width: 11, height: 32, type: "hurtbox" }],
        "1": [{ x: 49, y: 39.446, width: 55, height: 41, type: "attack", damage: 7 }],
        "2": [{ x: 68, y: 44.446, width: 37, height: 35, type: "attack", damage: 3 }],
        "3": [{ x: 47, y: 47.446, width: 19, height: 30, type: "hurtbox" }],
        "4": [{ x: 47, y: 44.446, width: 15, height: 31, type: "hurtbox" }],
        "5": [{ x: 47, y: 44.446, width: 15, height: 35, type: "hurtbox" }],
        "6": [{ x: 32, y: 39.446, width: 71, height: 40, type: "attack", damage: 8 }],
        "7": [{ x: 30, y: 54.446, width: 56, height: 26, type: "attack", damage: 5 }],
        "9": [{ x: 43, y: 45.446, width: 24, height: 32, type: "hurtbox" }]
      }
    },
    death: {
      src: "death.png",
      frameCount: 10,
      frameDelay: 1.1,
      boxes: null
    },
    hurt: {
      src: "hurt.png",
      frameCount: 1,
      frameDelay: 0.3,
      boxes: null
    },
    fall: {
      src: "fall.png",
      frameCount: 3,
      frameDelay: 0.5,
      boxes: {
        "0": [{ x: 45, y: 44.446, width: 21, height: 35, type: "hurtbox" }],
        "1": [{ x: 47, y: 44.446, width: 15, height: 36, type: "hurtbox" }],
        "2": [{ x: 42, y: 42.446, width: 24, height: 38, type: "hurtbox" }]
      }
    },
    idle: {
      src: "idle.png",
      frameCount: 10,
      frameDelay: 1.4,
      boxes: {
        "0": [{ x: 46, y: 43.446, width: 18, height: 36, type: "hurtbox" }],
        "1": [{ x: 48, y: 43.446, width: 15, height: 36, type: "hurtbox" }],
        "2": [{ x: 48, y: 43.446, width: 16, height: 36, type: "hurtbox" }],
        "3": [{ x: 48, y: 43.446, width: 15, height: 36, type: "hurtbox" }],
        "4": [{ x: 48, y: 44.446, width: 15, height: 35, type: "hurtbox" }],
        "5": [{ x: 48, y: 43.446, width: 14, height: 37, type: "hurtbox" }],
        "6": [{ x: 48, y: 43.446, width: 15, height: 36, type: "hurtbox" }],
        "7": [{ x: 48, y: 43.446, width: 14, height: 36, type: "hurtbox" }],
        "8": [{ x: 48, y: 43.446, width: 14, height: 37, type: "hurtbox" }],
        "9": [{ x: 49, y: 44.446, width: 14, height: 35, type: "hurtbox" }]
      }
    },
    jumpFall: {
      src: "jump_fall.png",
      frameCount: 2,
      frameDelay: 0.8,
      boxes: {
        "0": [{ x: 50, y: 43.446, width: 11, height: 33, type: "hurtbox" }],
        "1": [{ x: 47, y: 43.446, width: 13, height: 33, type: "hurtbox" }]
      }
    },
    jump: {
      src: "jump.png",
      frameCount: 3,
      frameDelay: 0.5,
      boxes: {
        "0": [{ x: 49, y: 43.446, width: 13, height: 31, type: "hurtbox" }],
        "1": [{ x: 51, y: 43.446, width: 11, height: 30, type: "hurtbox" }],
        "2": [{ x: 48, y: 43.446, width: 14, height: 30, type: "hurtbox" }]
      }
    },
    roll: {
      src: "roll.png",
      frameCount: 12,
      frameDelay: 0.5,
      boxes: null
    },
    run: {
      src: "run.png",
      frameCount: 10,
      frameDelay: 0.79,
      boxes: {
        "0": [{ x: 47, y: 43.446, width: 19, height: 37, type: "hurtbox" }],
        "1": [{ x: 48, y: 43.446, width: 18, height: 36, type: "hurtbox" }],
        "2": [{ x: 50, y: 42.446, width: 12, height: 37, type: "hurtbox" }],
        "3": [{ x: 51, y: 43.446, width: 11, height: 33, type: "hurtbox" }],
        "4": [{ x: 52, y: 42.446, width: 15, height: 34, type: "hurtbox" }],
        "5": [{ x: 48, y: 42.446, width: 20, height: 36, type: "hurtbox" }],
        "6": [{ x: 52, y: 43.446, width: 14, height: 36, type: "hurtbox" }],
        "7": [{ x: 53, y: 44.446, width: 5, height: 34, type: "hurtbox" }],
        "8": [{ x: 49, y: 43.446, width: 13, height: 35, type: "hurtbox" }],
        "9": [{ x: 48, y: 42.446, width: 15, height: 33, type: "hurtbox" }]
      }
    },
    turnAround: {
      src: "turn_around.png",
      frameCount: 3,
      frameDelay: 0.3,
      boxes: {
        "0": [{ x: 52, y: 47.446, width: 22, height: 32, type: "hurtbox" }],
        "1": [{ x: 52, y: 45.446, width: 20, height: 34, type: "hurtbox" }],
        "2": [{ x: 50, y: 44.446, width: 20, height: 34, type: "hurtbox" }]
      }
    }
  };