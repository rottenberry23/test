window.zombie = {
  atk: {
    src: "/atk.png",
    frameCount: 5,
    frameDelay: 0.7,
    boxes: {
      "0": [
        { x: 48, y: 62.1607, width: 27, height: 64, type: "hurtbox" }
      ],
      "1": [
        { x: 47, y: 61.1607, width: 31, height: 67, type: "hurtbox" }
      ],
      "2": [
        { x: 48, y: 64.1607, width: 39, height: 63, type: "attack", damage: 5 }
      ],
      "3": [
        { x: 50, y: 61.1607, width: 44, height: 46, type: "attack", damage: 5 }
      ],
      "4": [
        { x: 48, y: 61.1607, width: 27, height: 66, type: "hurtbox" }
      ]
    }
  },

  death: {
    src: "/death.png",
    frameCount: 5,
    frameDelay: 0.7,
    boxes: null
  },

  hurt: {
    src: "/hurt.png",
    frameCount: 4,
    frameDelay: 0.4,
    boxes: null
  },

  idle: {
    src: "/idle.png",
    frameCount: 6,
    frameDelay: 1.1,
    boxes: {
      "0": [
        { x: 49, y: 60.1607, width: 30, height: 68, type: "hurtbox" }
      ],
      "1": [
        { x: 52, y: 69.1607, width: 27, height: 59, type: "hurtbox" }
      ],
      "2": [
        { x: 50, y: 68.1607, width: 29, height: 58, type: "hurtbox" }
      ],
      "3": [
        { x: 48, y: 65.1607, width: 30, height: 63, type: "hurtbox" }
      ],
      "4": [
        { x: 49, y: 64.1607, width: 30, height: 64, type: "hurtbox" }
      ],
      "5": [
        { x: 50, y: 64.1607, width: 26, height: 63, type: "hurtbox" }
      ]
    }
  },

  walk: {
    src: "/walk.png",
    frameCount: 10,
    frameDelay: 1.5,
    boxes: {
      "0": [
        { x: 46, y: 61.1607, width: 29, height: 67, type: "hurtbox" }
      ],
      "1": [
        { x: 48, y: 60.1607, width: 22, height: 66, type: "hurtbox" }
      ],
      "2": [
        { x: 50, y: 63.1607, width: 22, height: 65, type: "hurtbox" }
      ],
      "3": [
        { x: 47, y: 63.1607, width: 28, height: 65, type: "hurtbox" }
      ],
      "4": [
        { x: 48, y: 62.1607, width: 29, height: 66, type: "hurtbox" }
      ],
      "5": [
        { x: 48, y: 64.1607, width: 24, height: 63, type: "hurtbox" }
      ],
      "6": [
        { x: 48, y: 62.1607, width: 20, height: 66, type: "hurtbox" }
      ],
      "7": [
        { x: 48, y: 63.1607, width: 18, height: 65, type: "hurtbox" }
      ],
      "8": [
        { x: 46, y: 64.1607, width: 23, height: 63, type: "hurtbox" }
      ],
      "9": [
        { x: 46, y: 63.1607, width: 26, height: 65, type: "hurtbox" }
      ]
    }
  }
};


// 128x128