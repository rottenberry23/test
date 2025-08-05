// Home screen Play button logic
let gameActive = false;
let animationFrameId = null;
let isPaused = false;
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    // Pause button click handler
    canvas.addEventListener('mousedown', function(e) {
        // Get bounding rect for canvas
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        // Mouse coordinates relative to canvas
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        // Check if click is inside pause button
        if (
            mouseX >= pauseBtn.x && mouseX <= pauseBtn.x + pauseBtn.width &&
            mouseY >= pauseBtn.y && mouseY <= pauseBtn.y + pauseBtn.height
        ) {
            // Show home screen overlay, pause game
            const homeScreen = document.getElementById('home-screen');
            if (homeScreen) homeScreen.style.zIndex = 10;
            gameActive = false;
            isPaused = true;
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
    });
    const homeScreen = document.getElementById('home-screen');
    const playBtn = document.getElementById('play-btn');
    const controlsBtn = document.getElementById('controls-btn');
    const controlsModal = document.getElementById('controls-modal');
    const closeControlsBtn = document.getElementById('close-controls-btn');
    let controlsOpen = false;

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (homeScreen) homeScreen.style.zIndex = -10;
            gameActive = true;
            // Resume main loop if paused
            if (isPaused) {
                isPaused = false;
                lastTimestamp = performance.now();
                animationFrameId = requestAnimationFrame(mainLoop);
            }
        });
    }
    if (controlsBtn && controlsModal) {
    // --- GAME OVER: Play Again logic ---
    const gameoverScreen = document.getElementById('gameover-screen');
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            // Hide overlay
            if (gameoverScreen) gameoverScreen.style.display = 'none';
            // Reset player state
            Object.assign(playerState, {
                x: 100,
                y: canvas.height - 140,
                width: 120,
                height: 80,
                displayWidth: 120,
                displayHeight: 80,
                frameX: 0,
                currentAnimation: 'idle',
                flipped: false,
                lastFrameTime: 0,
                speed: 4,
                vx: 0,
                vy: 0,
                gravity: 0.6,
                jumpStrength: 10,
                attacking: false,
                rolling: false,
                rollCooldown: 1.5,
                rollCooldownTimer: 0,
                rollSpeed: 4,
                attackType: null,
                health: 100,
                dead: false,
                takingDamage: false,
                invulnTimer: 0,
                invulnDuration: 0.6,
                jumping: false
            });
            // Reset zombies
            resetZombies();
            // Hide all overlays
            const homeScreen = document.getElementById('home-screen');
            if (homeScreen) homeScreen.style.zIndex = -10;
            // Resume game
            gameActive = true;
            isPaused = false;
            // Prevent multiple main loops: cancel any previous frame
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            lastTimestamp = performance.now();
            animationFrameId = requestAnimationFrame(mainLoop);
        });
    }
        controlsBtn.addEventListener('click', () => {
            controlsModal.style.display = 'flex';
            controlsOpen = true;
        });
    }
    if (closeControlsBtn && controlsModal) {
        closeControlsBtn.addEventListener('click', () => {
            controlsModal.style.display = 'none';
            controlsOpen = false;
        });
    }
    // Prevent Play/game input while controls modal is open
    document.addEventListener('keydown', (e) => {
        if (controlsOpen) e.preventDefault();
    }, true);
});

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Layered Transparent Backgrounds
const bgLayers = [
    'sprites/map/l1.png',
    'sprites/map/l2.png',
    'sprites/map/l3.png'
];

const loadedBgs = [];
let loadedCount = 0;

bgLayers.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        loadedBgs[i] = img;
        loadedCount++;
        if (loadedCount === bgLayers.length) {
            tryDrawTileMap();
        }
    };
    img.onerror = () => {};
});

function drawBackgrounds() {
    loadedBgs.forEach(img => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    });
}

// Tile-Based Floor
const tileset = new Image();
tileset.src = 'sprites/map/tiles.png';
tileset.onload = function() {
    
    tryDrawTileMap();
};
tileset.onerror = function() {
    
};

function tryDrawTileMap() {

    if (
        tileset.complete && tileset.naturalWidth !== 0 &&
        window.tiledMapData &&
        loadedCount === bgLayers.length
    ) {
        
        drawBackgrounds();
        drawTileMap();
    } else {
        setTimeout(tryDrawTileMap, 30);
    }
}

function drawTileMap() {
    if (!window.tiledMapData) {
        console.warn('tiledMapData not loaded');
        return;
    }
    if (!tileset.complete || tileset.naturalWidth === 0) {
        console.warn('tileset not loaded');
        return;
    }
    const { width, height, tilewidth, tileheight, layers } = tiledMapData;
    const tileData = layers[0].data;
    const tilesPerRow = Math.floor(tileset.width / tilewidth);
    const tilesetOffsetX = 16; // First tile starts at x=16

    let drawnTileIndices = [];
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const tileIndex = tileData[row * width + col];
            if (tileIndex > 0) { // 0 = empty
                const idx = tileIndex - 1; // Tiled is 1-based
                const sx = tilesetOffsetX + (idx % tilesPerRow) * tilewidth;
                const sy = Math.floor(idx / tilesPerRow) * tileheight;
                ctx.drawImage(
                    tileset,
                    sx, sy, tilewidth, tileheight,
                    col * tilewidth, row * tileheight, tilewidth, tileheight
                );
                drawnTileIndices.push(tileIndex);
            }
        }
    }
}

// --- ZOMBIE ENEMY SYSTEM ---

// 1. Load zombie animation data
const zombieAnimations = window.zombie;

// Multi-zombie system
const MAX_ZOMBIES = 3;
let zombies = [];
let zombiesKilled = 0;

function spawnZombie() {
    // Spawn at random x, always on ground
    const spawnX = 400 + Math.floor(Math.random() * 400) * (Math.random() < 0.5 ? 1 : -1);
    zombies.push({
        x: Math.max(80, Math.min(800, spawnX)),
        y: canvas.height - 130,
        width: 128,
        height: 128,
        displayWidth: 128,
        displayHeight: 128,
        frameX: 0,
        currentAnimation: 'idle',
        flipped: false,
        lastFrameTime: 0,
        health: 30,
        dead: false,
        takingDamage: false,
        aiTimer: 0,
        scored: false
    });
}

function resetZombies() {
    zombies = [];
    zombiesKilled = 0;
    for (let i = 0; i < 2; ++i) spawnZombie();
}

// --- ZOMBIE AI STEP 1: Always look at player ---
function updateZombiesAI() {
    if (!gameActive) return;
    zombies.forEach(zombie => {
        if (zombie.dead) return;
        if (playerState.dead) {
            if (zombie.currentAnimation !== 'idle') {
                zombie.currentAnimation = 'idle';
                zombie.frameX = 0;
                zombie.lastFrameTime = 0;
            }
            return;
        }
        if (zombie.takingDamage && zombie.currentAnimation === 'hurt') {
            return;
        }
        const zombieVisualCenter = zombie.x + 65 * 0.55;
        const playerCenter = playerState.x + playerState.width / 2;
        const dist = Math.abs(playerCenter - zombieVisualCenter);
        if (dist > 250) {
            // Too far: idle
            if (zombie.currentAnimation !== 'idle') {
                zombie.currentAnimation = 'idle';
                zombie.frameX = 0;
                zombie.lastFrameTime = 0;
            }
            return;
        }
        // Within 250: target and attack as before
        if (playerCenter > zombieVisualCenter) {
            zombie.flipped = false;
        } else {
            zombie.flipped = true;
        }
        if (dist <= 15) {
            if (zombie.currentAnimation !== 'atk') {
                zombie.currentAnimation = 'atk';
                zombie.frameX = 0;
                zombie.lastFrameTime = 0;
            }
        } else {
            if (zombie.currentAnimation !== 'walk') {
                zombie.currentAnimation = 'walk';
                zombie.frameX = 0;
                zombie.lastFrameTime = 0;
            }
            const walkSpeed = 1.2;
            if (playerCenter > zombieVisualCenter) {
                zombie.x += walkSpeed;
            } else {
                zombie.x -= walkSpeed;
            }
        }
    });
    // Spawn new zombies if needed
    if (zombies.length < MAX_ZOMBIES && gameActive && !playerState.dead) {
        if (Math.random() < 0.01) spawnZombie();
    }
}

function updateZombiesAnimation(dt) {
    zombies.forEach(zombie => {
        if (zombie.dead && zombie.currentAnimation !== 'death') {
            zombie.currentAnimation = 'death';
            zombie.frameX = 0;
            zombie.lastFrameTime = 0;
        }
        const anim = zombieAnimations[zombie.currentAnimation];
        if (!anim) return;
        const perFrameDelay = anim.frameDelay / anim.frameCount;
        zombie.lastFrameTime += dt;
        if (zombie.lastFrameTime >= perFrameDelay) {
            if (zombie.currentAnimation === 'death') {
                // Freeze on last frame
                zombie.frameX = anim.frameCount - 1;
            } else if (zombie.currentAnimation === 'hurt') {
                // If hurt animation finished, return to AI state
                if (zombie.frameX >= anim.frameCount - 1) {
                    zombie.takingDamage = false;
                    // Resume previous or default AI animation
                    if (zombie.prevAnimation && !zombie.dead) {
                        zombie.currentAnimation = zombie.prevAnimation;
                        zombie.frameX = 0;
                        zombie.lastFrameTime = 0;
                    } else if (!zombie.dead) {
                        zombie.currentAnimation = 'idle';
                        zombie.frameX = 0;
                        zombie.lastFrameTime = 0;
                    }
                } else {
                    zombie.frameX++;
                }
            } else {
                zombie.frameX = (zombie.frameX + 1) % anim.frameCount;
            }
            zombie.lastFrameTime = 0;
        }
        // If just died, count score
        if (zombie.dead && !zombie.scored) {
            zombiesKilled++;
            zombie.scored = true;
        }
    });
}

function checkZombiesHitByPlayer() {
    if (!playerState.attacking) return;
    const playerAnim = animations[playerState.attackType];
    if (!playerAnim || !playerAnim.boxes) return;
    const hitboxes = (playerAnim.boxes && playerAnim.boxes[playerState.frameX]) ? playerAnim.boxes[playerState.frameX] : [];
    zombies.forEach(zombie => {
        if (zombie.dead || zombie.takingDamage) return;
        const scale = 0.55;
        const zombieAnim = zombieAnimations[zombie.currentAnimation];
        const hurtboxes = (zombieAnim.boxes && zombieAnim.boxes[zombie.frameX]) ? zombieAnim.boxes[zombie.frameX] : [];
        hitboxes.forEach(hitbox => {
            if (hitbox.type !== 'attack') return;
            let px = playerState.x + (playerState.flipped ? (playerState.width - hitbox.x - hitbox.width) : hitbox.x);
            let py = playerState.y + hitbox.y;
            let pw = hitbox.width;
            let ph = hitbox.height;
            hurtboxes.forEach(hurtbox => {
                let zx = zombie.x + (zombie.flipped ? (zombie.width - hurtbox.x - hurtbox.width) : hurtbox.x);
                let zy = zombie.y + hurtbox.y;
                let zw = hurtbox.width * scale;
                let zh = hurtbox.height * scale;
                zx = zombie.x + (zx - zombie.x) * scale;
                zy = zombie.y + (zy - zombie.y) * scale;
                if (rectsOverlap(px, py, pw, ph, zx, zy, zw, zh)) {
                    zombie.health -= hitbox.damage || 1;
                    zombie.takingDamage = true;
                    // Set hurt animation and reset frame
                    if (zombie.currentAnimation !== 'hurt') {
                        zombie.prevAnimation = zombie.currentAnimation;
                        zombie.currentAnimation = 'hurt';
                        zombie.frameX = 0;
                        zombie.lastFrameTime = 0;
                    }
                    if (zombie.health <= 0) {
                        zombie.dead = true;
                        zombie.health = 0;
                    }
                }
            });
        });
    });
}

function checkPlayerHitByZombies() {
    if (playerState.dead || playerState.invulnTimer > 0) return;
    zombies.forEach(zombie => {
        if (zombie.dead) return;
        if (zombie.currentAnimation !== 'atk') return;
        const scale = 0.55;
        const zombieAnim = zombieAnimations['atk'];
        const hitboxes = (zombieAnim.boxes && zombieAnim.boxes[zombie.frameX]) ? zombieAnim.boxes[zombie.frameX] : [];
        const playerAnim = animations[playerState.currentAnimation];
        const hurtboxes = (playerAnim.boxes && playerAnim.boxes[playerState.frameX]) ? playerAnim.boxes[playerState.frameX].filter(b => b.type === 'hurtbox') : [];
        if (!hurtboxes || hurtboxes.length === 0) return;
        hitboxes.forEach(hitbox => {
            if (hitbox.type !== 'attack') return;
            let zx = zombie.x + (zombie.flipped ? (zombie.width - hitbox.x - hitbox.width) : hitbox.x);
            let zy = zombie.y + hitbox.y;
            let zw = hitbox.width * scale;
            let zh = hitbox.height * scale;
            zx = zombie.x + (zx - zombie.x) * scale;
            zy = zombie.y + (zy - zombie.y) * scale;
            hurtboxes.forEach(hurtbox => {
                let px = playerState.x + (playerState.flipped ? (playerState.width - hurtbox.x - hurtbox.width) : hurtbox.x);
                let py = playerState.y + hurtbox.y;
                let pw = hurtbox.width;
                let ph = hurtbox.height;
                if (rectsOverlap(zx, zy, zw, zh, px, py, pw, ph)) {
                    playerState.health -= hitbox.damage || 1;
                    playerState.takingDamage = true;
                    playerState.invulnTimer = playerState.invulnDuration;
                    if (playerState.health <= 0) {
                        playerState.dead = true;
                        playerState.health = 0;
                    } else {
                        playerState.takingDamage = true;
                    }
                }
            });
        });
    });
}

function drawZombies() {
    zombies.forEach(zombie => {
        const anim = zombieAnimations[zombie.currentAnimation];
        const img = zombieImages[zombie.currentAnimation];
        if (!anim || !img.complete) return;
        const scale = 0.55;
        ctx.save();
        ctx.translate(zombie.x, zombie.y);
        ctx.scale(zombie.flipped ? -scale : scale, scale);
        ctx.drawImage(
            img,
            zombie.frameX * zombie.width, 0, zombie.width, zombie.height,
            zombie.flipped ? -zombie.displayWidth : 0, 0, zombie.displayWidth, zombie.displayHeight
        );
        const frameBoxes = (anim.boxes && anim.boxes[zombie.frameX]) ? anim.boxes[zombie.frameX] : [];
        frameBoxes.forEach(box => {
            let drawX = zombie.flipped ? -(box.x + box.width) : box.x;
            let drawY = box.y;
            ctx.strokeStyle = box.type === 'hurtbox' ? 'blue' : 'red';
            ctx.strokeRect(drawX, drawY, box.width, box.height);
        });
        ctx.restore();
    });
}

function drawZombiesKilledScore() {
    ctx.save();
    ctx.font = 'bold 26px DigitalDisco, Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.globalAlpha = 0.96;
    ctx.fillText(`zombies killed: ${zombiesKilled}`, pauseBtn.x - 20, pauseBtn.y + 32);
    ctx.restore();
}




// 3. Load Zombie Animation Spritesheets
const zombieImages = {};
for (const anim in zombieAnimations) {
    zombieImages[anim] = new Image();
    const src = zombieAnimations[anim].src;
    zombieImages[anim].src = src.startsWith('./') ? src : `./sprites/zombie/${src.replace(/^\//, '')}`;
}

// 4. Zombie Animation Update
function updateZombieAnimation(dt) {
    if (zombieState.dead) {
        // Play death animation, freeze on last frame
        const anim = zombieAnimations['death'];
        if (zombieState.currentAnimation !== 'death') {
            zombieState.currentAnimation = 'death';
            zombieState.frameX = 0;
            zombieState.lastFrameTime = 0;
        }
        const perFrameDelay = anim.frameDelay / anim.frameCount;
        zombieState.lastFrameTime += dt;
        if (zombieState.lastFrameTime >= perFrameDelay && zombieState.frameX < anim.frameCount - 1) {
            zombieState.frameX++;
            zombieState.lastFrameTime = 0;
        }
        return;
    }

    // If taking damage, play hurt animation
    if (zombieState.takingDamage) {
        const anim = zombieAnimations['hurt'];
        // Store previous animation only when switching to hurt
        if (zombieState.currentAnimation !== 'hurt') {
            zombieState.prevAnimation = zombieState.currentAnimation;
            zombieState.currentAnimation = 'hurt';
            zombieState.frameX = 0;
            zombieState.lastFrameTime = 0;
        }
        const perFrameDelay = anim.frameDelay / anim.frameCount;
        zombieState.lastFrameTime += dt;
        if (zombieState.lastFrameTime >= perFrameDelay) {
            zombieState.frameX++;
            zombieState.lastFrameTime = 0;
        }
        if (zombieState.frameX >= anim.frameCount) {
            zombieState.takingDamage = false;
            // Return to previous animation (AI will immediately override if needed)
            zombieState.currentAnimation = zombieState.prevAnimation || 'idle';
            zombieState.frameX = 0;
            zombieState.lastFrameTime = 0;
        }
        return;
    }

    // Animate whatever animation is set by AI (idle, atk, etc)
    const anim = zombieAnimations[zombieState.currentAnimation];
    if (!anim) return;
    const perFrameDelay = anim.frameDelay / anim.frameCount;
    zombieState.lastFrameTime += dt;
    if (zombieState.lastFrameTime >= perFrameDelay) {
        zombieState.frameX = (zombieState.frameX + 1) % anim.frameCount;
        zombieState.lastFrameTime = 0;
    }
}

// Helper: AABB collision
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return !(ax + aw < bx || ax > bx + bw || ay + ah < by || ay > by + bh);
}

// Check if zombie is hit by player attack
function checkZombieHitByPlayer() {
    if (zombieState.dead || zombieState.takingDamage) return;
    if (!playerState.attacking) return;
    // Only check during attack animations
    const playerAnim = animations[playerState.attackType];
    if (!playerAnim || !playerAnim.boxes) return;
    const scale = 0.55; // must match zombie draw scale
    // Get player's active hitboxes for this frame
    const hitboxes = (playerAnim.boxes && playerAnim.boxes[playerState.frameX]) ? playerAnim.boxes[playerState.frameX] : [];
    // Get zombie's current hurtboxes for this frame
    const zombieAnim = zombieAnimations[zombieState.currentAnimation];
    const hurtboxes = (zombieAnim.boxes && zombieAnim.boxes[zombieState.frameX]) ? zombieAnim.boxes[zombieState.frameX] : [];
    hitboxes.forEach(hitbox => {
        if (hitbox.type !== 'attack') return;
        // Player hitbox global coords
        let px = playerState.x + (playerState.flipped ? (playerState.width - hitbox.x - hitbox.width) : hitbox.x);
        let py = playerState.y + hitbox.y;
        let pw = hitbox.width;
        let ph = hitbox.height;
        // Check against all zombie hurtboxes
        hurtboxes.forEach(hurtbox => {
            // Zombie hurtbox global coords, scaled
            let zx = zombieState.x + (zombieState.flipped ? (zombieState.width - hurtbox.x - hurtbox.width) : hurtbox.x);
            let zy = zombieState.y + hurtbox.y;
            let zw = hurtbox.width * scale;
            let zh = hurtbox.height * scale;
            zx = zombieState.x + (zx - zombieState.x) * scale;
            zy = zombieState.y + (zy - zombieState.y) * scale;
            if (rectsOverlap(px, py, pw, ph, zx, zy, zw, zh)) {
                // Apply damage
                zombieState.health -= hitbox.damage || 1;
                zombieState.takingDamage = true;
                // If dead, flag dead
                if (zombieState.health <= 0) {
                    zombieState.dead = true;
                    zombieState.health = 0;
                }
            }
        });
    });
}

// Check if player is hit by zombie attack
function checkPlayerHitByZombie() {
    if (playerState.dead) return;
    if (zombieState.dead) return;
    if (playerState.invulnTimer > 0) return;
    // Only check during zombie attack animation
    if (zombieState.currentAnimation !== 'atk') return;
    const scale = 0.55;
    const zombieAnim = zombieAnimations['atk'];
    const hitboxes = (zombieAnim.boxes && zombieAnim.boxes[zombieState.frameX]) ? zombieAnim.boxes[zombieState.frameX] : [];
    const playerAnim = animations[playerState.currentAnimation];
    const hurtboxes = (playerAnim.boxes && playerAnim.boxes[playerState.frameX]) ? playerAnim.boxes[playerState.frameX].filter(b => b.type === 'hurtbox') : [];
    // If there are no hurtboxes for this frame, player is invulnerable
    if (!hurtboxes || hurtboxes.length === 0) return;
    hitboxes.forEach(hitbox => {
        if (hitbox.type !== 'attack') return;
        // Zombie hitbox global coords, scaled
        let zx = zombieState.x + (zombieState.flipped ? (zombieState.width - hitbox.x - hitbox.width) : hitbox.x);
        let zy = zombieState.y + hitbox.y;
        let zw = hitbox.width * scale;
        let zh = hitbox.height * scale;
        zx = zombieState.x + (zx - zombieState.x) * scale;
        zy = zombieState.y + (zy - zombieState.y) * scale;
        // Check against all player hurtboxes
        hurtboxes.forEach(hurtbox => {
            let px = playerState.x + (playerState.flipped ? (playerState.width - hurtbox.x - hurtbox.width) : hurtbox.x);
            let py = playerState.y + hurtbox.y;
            let pw = hurtbox.width;
            let ph = hurtbox.height;
            if (rectsOverlap(zx, zy, zw, zh, px, py, pw, ph)) {
                // Apply damage
                playerState.health -= hitbox.damage || 1;
                playerState.takingDamage = true;
                playerState.invulnTimer = playerState.invulnDuration;
                if (playerState.health <= 0) {
                    playerState.dead = true;
                    playerState.health = 0;
                    // Death animation will be handled in updatePlayer
                } else {
                    playerState.takingDamage = true;
                }
            }
        });
    });
}
// 5. Draw Zombie
function drawZombie() {
    const anim = zombieAnimations[zombieState.currentAnimation];
    const img = zombieImages[zombieState.currentAnimation];
    if (!anim || !img.complete) return;
    const scale = 0.55;
    ctx.save();
    ctx.translate(zombieState.x, zombieState.y);
    ctx.scale(zombieState.flipped ? -scale : scale, scale);
    // Draw sprite
    ctx.drawImage(
        img,
        zombieState.frameX * zombieState.width, 0, zombieState.width, zombieState.height,
        zombieState.flipped ? -zombieState.displayWidth : 0, 0, zombieState.displayWidth, zombieState.displayHeight
    );
    // Draw hitboxes and hurtboxes for current frame (scaled and flipped)
    const frameBoxes = (anim.boxes && anim.boxes[zombieState.frameX]) ? anim.boxes[zombieState.frameX] : [];
    // Draw debug boxes inside local transform, matching sprite flip/scale
    frameBoxes.forEach(box => {
        let drawX = zombieState.flipped ? -(box.x + box.width) : box.x;
        let drawY = box.y;
        ctx.strokeStyle = box.type === 'hurtbox' ? 'blue' : 'red';
        ctx.strokeRect(drawX, drawY, box.width, box.height);
    });
    ctx.restore();
}

// --- END ZOMBIE SYSTEM ---


// --- PLAYER CHARACTER SYSTEM ---
const animations = window.player;

// 2. Player State Object
const playerState = {
    x: 100,
    y: canvas.height - 140,
    width: 120,
    height: 80,
    displayWidth: 120,
    displayHeight: 80,
    frameX: 0,
    currentAnimation: 'idle',
    flipped: false,
    lastFrameTime: 0,
    speed: 4,
    vx: 0,
    vy: 0,
    gravity: 0.6,
    jumpStrength: 10,
    attacking: false,
    rolling: false,
    rollCooldown: 1.5, // seconds, change this for roll cooldown duration
    rollCooldownTimer: 0, // timer, do not edit manually
    rollSpeed: 4,
    attackType: null,
    health: 100,
    dead: false,
    takingDamage: false,
    invulnTimer: 0,
    invulnDuration: 0.6 // seconds
};

// 3. Load Animation Spritesheets
const playerImages = {};
for (const anim in animations) {
    playerImages[anim] = new Image();
    const src = animations[anim].src;
    // If not an absolute path, prepend folder
    playerImages[anim].src = src.startsWith('./') ? src : `./sprites/player/${src}`;
}

// 4. Animation Update Logic
function updatePlayerAnimation(dt) {
    const anim = animations[playerState.currentAnimation];
    if (!anim) return;
    // Calculate how long each frame should display (in seconds)
    const perFrameDelay = anim.frameDelay / anim.frameCount;
    playerState.lastFrameTime += dt;
    if (playerState.lastFrameTime >= perFrameDelay) {
        playerState.frameX = (playerState.frameX + 1) % anim.frameCount;
        playerState.lastFrameTime = 0;
    }
}

// 5. Draw Player
function drawPlayer() {
    const anim = animations[playerState.currentAnimation];
    const img = playerImages[playerState.currentAnimation];
    if (!anim || !img.complete) return;
    ctx.save();
    if (playerState.flipped) {
        ctx.scale(-1, 1);
        ctx.drawImage(
            img,
            playerState.frameX * playerState.width, 0, playerState.width, playerState.height,
            -playerState.x - playerState.displayWidth, playerState.y, playerState.displayWidth, playerState.displayHeight
        );
    } else {
        ctx.drawImage(
            img,
            playerState.frameX * playerState.width, 0, playerState.width, playerState.height,
            playerState.x, playerState.y, playerState.displayWidth, playerState.displayHeight
        );
    }
    ctx.restore();
}

// 6. Draw Hitboxes/Hurtboxes (debug)
function drawPlayerBoxes() {
    const anim = animations[playerState.currentAnimation];
    if (!anim) return;
    const frame = playerState.frameX;
    // --- Draw attack hitbox if attacking ---
    if (playerState.attacking && anim.boxes && anim.boxes[frame]) {
        anim.boxes[frame].forEach(box => {
            if (box.type === 'attack') {
                let drawX = playerState.x + box.x;
                if (playerState.flipped) drawX = playerState.x + (playerState.width - box.x - box.width);
                ctx.strokeStyle = 'red';
                ctx.strokeRect(drawX, playerState.y + box.y, box.width, box.height);
            }
        });
    }
    // Draw hurtboxes
    if (anim.boxes && anim.boxes[frame]) {
        anim.boxes[frame].forEach(box => {
            if (box.type === 'hurtbox') {
                let drawX = playerState.x + box.x;
                if (playerState.flipped) drawX = playerState.x + (playerState.width - box.x - box.width);
                ctx.strokeStyle = 'blue';
                ctx.strokeRect(drawX, playerState.y + box.y, box.width, box.height);
            }
        });
    }
}

// 7. Main Player Update/Draw Entry Points
// --- CONTROLS SETUP ---
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    KeyZ: false, // atk1
    KeyX: false, // atk2
    KeyC: false, // atkCombo
    Space: false // roll
};

document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    if (playerState.dead) return;
    if (e.code === 'ArrowLeft') keys.ArrowLeft = true;
    if (e.code === 'ArrowRight') keys.ArrowRight = true;
    if (e.code === 'ArrowUp') keys.ArrowUp = true;
    if (e.code === 'KeyZ') keys.KeyZ = true;
    if (e.code === 'KeyX') keys.KeyX = true;
    if (e.code === 'KeyC') keys.KeyC = true;
    if (e.code === 'Space') keys.Space = true;
    // Attack/roll input
    if (!playerState.attacking && !playerState.rolling) {
        if (e.code === 'KeyZ') {
            playerState.attacking = true;
            playerState.attackType = 'atk1';
            playerState.currentAnimation = 'atk1';
            playerState.frameX = 0;
            playerState.lastFrameTime = 0;
        } else if (e.code === 'KeyX') {
            playerState.attacking = true;
            playerState.attackType = 'atk2';
            playerState.currentAnimation = 'atk2';
            playerState.frameX = 0;
            playerState.lastFrameTime = 0;
        } else if (e.code === 'KeyC') {
            playerState.attacking = true;
            playerState.attackType = 'atkCombo';
            playerState.currentAnimation = 'atkCombo';
            playerState.frameX = 0;
            playerState.lastFrameTime = 0;
        } else if (e.code === 'Space' && playerState.rollCooldownTimer <= 0 && !playerState.jumping) {
            playerState.rolling = true;
            playerState.currentAnimation = 'roll';
            playerState.frameX = 0;
            playerState.lastFrameTime = 0;
            playerState.rollCooldownTimer = playerState.rollCooldown;
        }
    }
});
document.addEventListener('keyup', (e) => {
    if (!gameActive) return;
    if (playerState.dead) return;
    if (e.code === 'ArrowLeft') keys.ArrowLeft = false;
    if (e.code === 'ArrowRight') keys.ArrowRight = false;
    if (e.code === 'ArrowUp') keys.ArrowUp = false;
    if (e.code === 'KeyZ') keys.KeyZ = false;
    if (e.code === 'KeyX') keys.KeyX = false;
    if (e.code === 'KeyC') keys.KeyC = false;
    if (e.code === 'Space') keys.Space = false;
});

// --- PLAYER UPDATE WITH MOVEMENT & ANIMATION LOGIC ---
function updatePlayer(dt) {
    if (!gameActive) return;
    // --- DEATH ANIMATION HANDLING ---
    if (playerState.dead) {
        if (playerState.currentAnimation !== 'death') {
            playerState.currentAnimation = 'death';
            playerState.frameX = 0;
            playerState.lastFrameTime = 0;
        }
        const anim = animations['death'];
        const perFrameDelay = anim.frameDelay / anim.frameCount;
        playerState.lastFrameTime += dt;
        if (playerState.frameX < anim.frameCount - 1 && playerState.lastFrameTime >= perFrameDelay) {
            playerState.frameX++;
            playerState.lastFrameTime = 0;
        }
        // When death animation finishes, show game over overlay (use zIndex logic like pause)
        if (playerState.frameX === anim.frameCount - 1) {
            const gameoverScreen = document.getElementById('gameover-screen');
            if (gameoverScreen) {
                gameoverScreen.style.display = 'flex';
                gameoverScreen.style.zIndex = 100;
            }
            gameActive = false;
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
        return;
    }
    // --- HURT ANIMATION HANDLING ---
    if (playerState.takingDamage) {
        if (playerState.currentAnimation !== 'hurt') {
            playerState.currentAnimation = 'hurt';
            playerState.frameX = 0;
            playerState.lastFrameTime = 0;
        }
        const anim = animations['hurt'];
        const perFrameDelay = anim.frameDelay / anim.frameCount;
        playerState.lastFrameTime += dt;
        if (playerState.lastFrameTime >= perFrameDelay) {
            playerState.frameX++;
            playerState.lastFrameTime = 0;
        }
        // End hurt after animation completes
        if (playerState.frameX >= anim.frameCount) {
            playerState.takingDamage = false;
            // Return to idle/run/jump/fall depending on state
            if (playerState.jumping) {
                playerState.currentAnimation = playerState.vy < 0 ? 'jump' : 'fall';
            } else if (keys.ArrowLeft || keys.ArrowRight) {
                playerState.currentAnimation = 'run';
            } else {
                playerState.currentAnimation = 'idle';
            }
            playerState.frameX = 0;
            playerState.lastFrameTime = 0;
        }
        return;
    }
    // Roll cooldown timer
    if (playerState.rollCooldownTimer > 0) {
        playerState.rollCooldownTimer -= dt;
        if (playerState.rollCooldownTimer < 0) playerState.rollCooldownTimer = 0;
    }

    // --- ROLLING (LOCK OUT OTHER ACTIONS) ---
    if (playerState.rolling) {
        playerState.vx = playerState.flipped ? -playerState.rollSpeed : playerState.rollSpeed;
        playerState.x += playerState.vx;
        // Clamp to screen
        if (playerState.x < 0) playerState.x = 0;
        if (playerState.x > canvas.width - playerState.displayWidth) playerState.x = canvas.width - playerState.displayWidth;
        // Animation timing
        const anim = animations['roll'];
        const perFrameDelay = anim.frameDelay / anim.frameCount;
        playerState.lastFrameTime += dt;
        if (playerState.lastFrameTime >= perFrameDelay) {
            playerState.frameX++;
            playerState.lastFrameTime = 0;
        }
        // End roll when animation is finished
        if (playerState.frameX >= anim.frameCount) {
            playerState.rolling = false;
            playerState.frameX = 0;
            playerState.currentAnimation = 'idle';
        }
        return; // Skip other actions while rolling
    }

    // --- ATTACKING (LOCK OUT OTHER ACTIONS) ---
    if (playerState.attacking) {
        const anim = animations[playerState.attackType];
        const perFrameDelay = anim.frameDelay / anim.frameCount;
        playerState.lastFrameTime += dt;
        if (playerState.lastFrameTime >= perFrameDelay) {
            playerState.frameX++;
            playerState.lastFrameTime = 0;
        }
        // End attack when animation is done
        if (playerState.frameX >= anim.frameCount) {
            playerState.attacking = false;
            playerState.attackType = null;
            playerState.currentAnimation = 'idle';
            playerState.frameX = 0;
            return;
        }
        // --- ACTIVE HITBOX DEBUG DRAW (NO ENEMY LOGIC YET) ---
        // (Collision with enemies would go here)
        return;
    }
    // ...rest of updatePlayer logic (jumping, movement, etc.) ...

    // Jumping physics
    if (playerState.jumping) {
        // Horizontal movement in air
        if (keys.ArrowLeft) {
            playerState.vx = -playerState.speed;
            playerState.flipped = true;
        } else if (keys.ArrowRight) {
            playerState.vx = playerState.speed;
            playerState.flipped = false;
        } else {
            playerState.vx = 0;
        }
        playerState.x += playerState.vx;
        // Clamp
        if (playerState.x < 0) playerState.x = 0;
        if (playerState.x > canvas.width - playerState.displayWidth) playerState.x = canvas.width - playerState.displayWidth;
        playerState.y += playerState.vy;
        playerState.vy += playerState.gravity;
        // Rising/falling animation
        if (playerState.vy < 0) {
            if (playerState.currentAnimation !== 'jump') {
                playerState.currentAnimation = 'jump';
                playerState.frameX = 0;
                playerState.lastFrameTime = 0;
            }
        } else {
            if (playerState.currentAnimation !== 'fall') {
                playerState.currentAnimation = 'fall';
                playerState.frameX = 0;
                playerState.lastFrameTime = 0;
            }
        }
        // Landed
        if (playerState.y >= canvas.height - 140) {
            playerState.y = canvas.height - 140;
            playerState.jumping = false;
            playerState.vy = 0;
            // Return to idle or run
            if (keys.ArrowLeft || keys.ArrowRight) {
                playerState.currentAnimation = 'run';
            } else {
                playerState.currentAnimation = 'idle';
            }
        }
        // Animation frame update
        const anim = animations[playerState.currentAnimation];
        const perFrameDelay = anim.frameDelay / anim.frameCount;
        playerState.lastFrameTime += dt;
        if (playerState.lastFrameTime >= perFrameDelay) {
            playerState.frameX = (playerState.frameX + 1) % anim.frameCount;
            playerState.lastFrameTime = 0;
        }
        return;
    }

    // Movement on ground
    let moving = false;
    if (keys.ArrowLeft) {
        playerState.vx = -playerState.speed;
        playerState.flipped = true;
        moving = true;
    } else if (keys.ArrowRight) {
        playerState.vx = playerState.speed;
        playerState.flipped = false;
        moving = true;
    } else {
        playerState.vx = 0;
    }
    playerState.x += playerState.vx;
    // Clamp
    if (playerState.x < 0) playerState.x = 0;
    if (playerState.x > canvas.width - playerState.displayWidth) playerState.x = canvas.width - playerState.displayWidth;

    // Jump
    if (keys.ArrowUp && !playerState.jumping) {
        playerState.jumping = true;
        playerState.vy = -playerState.jumpStrength;
        playerState.currentAnimation = 'jump';
        playerState.frameX = 0;
        playerState.lastFrameTime = 0;
    }

    // Animation state switching
    if (playerState.jumping) {
        // handled above
    } else if (moving) {
        if (playerState.currentAnimation !== 'run') {
            playerState.currentAnimation = 'run';
            playerState.frameX = 0;
            playerState.lastFrameTime = 0;
        }
    } else {
        if (playerState.currentAnimation !== 'idle') {
            playerState.currentAnimation = 'idle';
            playerState.frameX = 0;
            playerState.lastFrameTime = 0;
        }
    }

    // Animation frame update
    const anim = animations[playerState.currentAnimation];
    const perFrameDelay = anim.frameDelay / anim.frameCount;
    playerState.lastFrameTime += dt;
    if (playerState.lastFrameTime >= perFrameDelay) {
        playerState.frameX = (playerState.frameX + 1) % anim.frameCount;
        playerState.lastFrameTime = 0;
    }
}

function renderPlayer() {
    drawPlayer();
    drawPlayerBoxes(); // Comment out if not debugging
}

// 8. Integrate with Main Render Loop


let lastTimestamp = 0;
function mainLoop(timestamp) {
    updateZombiesAI();
    const dt = ((timestamp - lastTimestamp) / 1000) || 0;
    lastTimestamp = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackgrounds();
    drawTileMap();
    checkZombiesHitByPlayer();
    checkPlayerHitByZombies();
    updateZombiesAnimation(dt);
    drawZombies();
    updatePlayer(dt);
    renderPlayer();
    // Update player invulnerability timer
    if (playerState.invulnTimer > 0) {
        playerState.invulnTimer -= dt;
        if (playerState.invulnTimer <= 0) {
            playerState.invulnTimer = 0;
            playerState.takingDamage = false;
        }
    }
    // Draw health bar inside canvas
    drawCanvasHealthBar();
    drawZombiesKilledScore();
    // Draw pause button
    ctx.globalAlpha = 0.92;
    ctx.drawImage(pauseBtnImg, pauseBtn.x, pauseBtn.y, pauseBtn.width, pauseBtn.height);
    ctx.globalAlpha = 1.0;
    animationFrameId = requestAnimationFrame(mainLoop);
}


// Draw the health bar on the canvas, above ceiling tiles
const healthBarImg = new Image();
healthBarImg.src = './sprites/UI/hp.png';

// Pause button image
const pauseBtnImg = new Image();
pauseBtnImg.src = './sprites/UI/pause.png';

// Pause button position and size (match health bar style)
const pauseBtn = {
    // Pause button at far right, aligned with health bar
    x: 960 - 48 - 15, // canvas width - button width - margin
    y: 20, // align with health bar y
    width: 48,
    height: 40
};
function drawCanvasHealthBar() {
    const barWidth = 200;   // New PNG width
    const barHeight = 42;   // New PNG height
    const x = 15;
    const y = 20;

    // Adjust these based on the resized design
    const fillOffsetX = 30;         // Red fill starts after the heart (left edge, scaled)
    const fillOffsetY = 10;         // Vertically centered in the bar (scaled)
    const fillMaxWidth = 165;       // Width of the actual red area (scaled)
    const fillHeight = 22;          // Height of the red part (scaled)

    const healthPercent = Math.max(0, Math.min(1, playerState.health / 100));
    const fillWidth = fillMaxWidth * healthPercent;

    ctx.save();

    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#e53935';
    ctx.fillRect(x + fillOffsetX, y + fillOffsetY, fillWidth, fillHeight);

    ctx.globalAlpha = 1.0;
    ctx.drawImage(healthBarImg, x, y, barWidth, barHeight);

    ctx.restore();
}




requestAnimationFrame(mainLoop);
