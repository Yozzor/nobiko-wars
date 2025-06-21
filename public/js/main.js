// Nobiko Wars - Main Game Controller
// 90s-themed Slither.io Clone

class NobikoWars {
    constructor() {
        this.characterSystem = new CharacterSpriteSystem();
        this.playerCharacter = null;
        this.gameState = 'menu'; // 'menu', 'playing'
        this.socket = null;
        this.playerCount = 0;
        this.playerId = null;
        this.isMultiplayer = false;

        // Simple PNG assets for cat character
        this.catAssets = {
            head: null,
            body: null,
            tail: null,
            loaded: false
        };

        // 90s Silly Texts - Go Wild!
        this.sillyTexts = [
            "TOTALLY RADICAL WORM ACTION!",
            "SURF THE NET... OF DEATH!",
            "DIAL-UP YOUR DESTRUCTION!",
            "404: MERCY NOT FOUND!",
            "LOADING... PLEASE WAIT... FOREVER!",
            "PRESS ANY KEY... NO, NOT THAT ONE!",
            "WINNER WINNER, PIXEL DINNER!",
            "GET READY TO PARTY LIKE IT'S 1999!",
            "INFORMATION SUPERHIGHWAY ROADKILL!",
            "WORLD WIDE WEB OF PAIN!",
            "DOWNLOADING DOOM.EXE...",
            "CTRL+ALT+DELETE YOUR ENEMIES!",
            "WINDOWS 95 COMPATIBLE!",
            "NOW WITH 256 COLORS!",
            "REQUIRES 4MB RAM TO PLAY!",
            "FLOPPY DISK NOT INCLUDED!",
            "MODEM SPEEDS MAY VARY!",
            "NETSCAPE NAVIGATOR RECOMMENDED!",
            "Y2K COMPLIANT WARFARE!",
            "BEEP BOOP BEEP... CONNECTING...",
            "SCREENSAVER ACTIVATED!",
            "DEFRAGMENTING ENEMIES...",
            "SCANDISK COMPLETE: 0 ERRORS FOUND!",
            "RECYCLE BIN FULL OF LOSERS!",
            "BLUE SCREEN OF DEATH INCOMING!",
            "CLIPPY SAYS: 'LOOKS LIKE YOU'RE DYING!'",
            "MINESWEEPER CHAMPION DETECTED!",
            "SOLITAIRE SKILLS TRANSFERRING...",
            "PAINT.EXE MASTERPIECE MODE!",
            "SOUND BLASTER 16 READY!",
            "CD-ROM SPINNING AT MAXIMUM VELOCITY!",
            "TURBO BUTTON: ENGAGED!",
            "MATH CO-PROCESSOR CALCULATING PAIN!",
            "ISA SLOT EXPANSION PACK LOADED!",
            "VESA LOCAL BUS TO DESTRUCTION!",
            "PENTIUM PROCESSOR OVERCLOCKED!",
            "DOOM SHAREWARE VIBES DETECTED!",
            "QUAKE ENGINE PHYSICS ENABLED!",
            "DUKE NUKEM WOULD BE PROUD!",
            "WOLFENSTEIN 3D NOSTALGIA ACTIVATED!"
        ];

        this.currentSillyTextIndex = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startSillyTextRotation();
        this.generatePlayerCharacter();
        this.updatePlayerCount();

        // Add some retro startup sounds (optional)
        this.playStartupSound();
    }

    setupEventListeners() {
        // Play button
        const playBtn = document.getElementById('play-btn');
        playBtn.addEventListener('click', () => this.startGame());

        // Nickname input
        const nicknameInput = document.getElementById('nickname');
        nicknameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startGame();
            }
        });

        // Add some retro keyboard sounds
        nicknameInput.addEventListener('keydown', () => {
            this.playKeyboardSound();
        });

        // Focus nickname input on page load
        setTimeout(() => {
            nicknameInput.focus();
        }, 1000);
    }

    startSillyTextRotation() {
        const sillyTextElement = document.getElementById('silly-text');

        const updateText = () => {
            sillyTextElement.textContent = this.sillyTexts[this.currentSillyTextIndex];
            this.currentSillyTextIndex = (this.currentSillyTextIndex + 1) % this.sillyTexts.length;
        };

        // Initial text
        updateText();

        // Rotate every 3 seconds
        setInterval(updateText, 3000);
    }

    generatePlayerCharacter() {
        this.playerCharacter = this.characterSystem.generateRandomCharacter();
        console.log('Generated player character:', this.playerCharacter);
    }

    updatePlayerCount() {
        // Simulate player count for now
        // In real implementation, this would come from the server
        this.playerCount = Math.floor(Math.random() * 47) + 3; // 3-50 players
        document.getElementById('player-count').textContent = this.playerCount;

        // Update every 10 seconds
        setTimeout(() => this.updatePlayerCount(), 10000);
    }

    startGame() {
        const nickname = document.getElementById('nickname').value.trim();

        if (!nickname) {
            this.showError('CALLSIGN REQUIRED, SOLDIER!');
            return;
        }

        if (nickname.length > 12) {
            this.showError('CALLSIGN TOO LONG! MAX 12 CHARS!');
            return;
        }

        // Validate nickname (basic filtering)
        if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
            this.showError('INVALID CHARACTERS DETECTED!');
            return;
        }

        this.playerCharacter.nickname = nickname.toUpperCase();

        // Show loading screen
        this.showLoadingScreen();

        // Try to connect to multiplayer server
        this.connectToServer(nickname.toUpperCase());
    }

    showError(message) {
        const sillyTextElement = document.getElementById('silly-text');
        const originalText = sillyTextElement.textContent;

        sillyTextElement.textContent = message;
        sillyTextElement.style.color = '#ff0000';
        sillyTextElement.style.textShadow = '0 0 10px #ff0000';

        // Flash effect
        sillyTextElement.style.animation = 'none';
        setTimeout(() => {
            sillyTextElement.style.animation = 'text-pulse 0.2s ease-in-out 5';
        }, 10);

        // Reset after 3 seconds
        setTimeout(() => {
            sillyTextElement.textContent = originalText;
            sillyTextElement.style.color = '#ff00ff';
            sillyTextElement.style.textShadow = '0 0 8px #ff00ff';
            sillyTextElement.style.animation = 'text-pulse 1.5s ease-in-out infinite';
        }, 3000);
    }

    showLoadingScreen() {
        const mainMenu = document.querySelector('.main-menu');
        mainMenu.innerHTML = `
            <div class="loading-container">
                <div class="loading-logo">
                    <div class="neon-green">NOBIKO</div>
                    <div class="neon-pink">WARS</div>
                </div>
                <div class="loading-text">
                    <div id="loading-message" class="neon-cyan">INITIALIZING COMBAT SYSTEMS...</div>
                </div>
                <div class="loading-bar-container">
                    <div class="loading-bar">
                        <div id="loading-progress" class="loading-progress"></div>
                    </div>
                </div>
                <div class="loading-details">
                    <div class="neon-yellow">CONNECTING TO MAINFRAME...</div>
                    <div class="neon-purple">LOADING WORM.EXE...</div>
                    <div class="neon-orange">CALIBRATING CRT DISPLAY...</div>
                </div>
            </div>
        `;

        this.animateLoading();
    }

    animateLoading() {
        const messages = [
            "INITIALIZING COMBAT SYSTEMS...",
            "CONNECTING TO MAINFRAME...",
            "LOADING WORM.EXE...",
            "CALIBRATING CRT DISPLAY...",
            "DOWNLOADING ARENA DATA...",
            "SYNCHRONIZING PLAYER DATA...",
            "ACTIVATING NEON PROTOCOLS...",
            "READY FOR COMBAT!"
        ];

        const progressBar = document.getElementById('loading-progress');
        const messageElement = document.getElementById('loading-message');

        let progress = 0;
        let messageIndex = 0;

        const updateLoading = () => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;

            progressBar.style.width = progress + '%';

            if (messageIndex < messages.length - 1 && progress > (messageIndex + 1) * 12.5) {
                messageIndex++;
                messageElement.textContent = messages[messageIndex];
            }

            if (progress < 100) {
                setTimeout(updateLoading, 200 + Math.random() * 300);
            } else {
                setTimeout(() => {
                    this.showGameCanvas();
                }, 1000);
            }
        };

        updateLoading();
    }

    showGameCanvas() {
        // Hide menu, show game canvas
        document.querySelector('.crt-container').style.display = 'none';
        document.querySelector('.game-container').style.display = 'block';

        this.gameState = 'playing';
        this.initializeGameCanvas();
    }

    initializeGameCanvas() {
        const canvas = document.getElementById('game-canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');

        // Set up game canvas with CRT styling
        canvas.style.background = 'radial-gradient(ellipse at center, #001100 0%, #000000 70%)';
        canvas.style.filter = 'contrast(1.1) brightness(1.1)';

        // Make canvas focusable for pointer lock
        canvas.tabIndex = 1;
        canvas.style.outline = 'none';
        canvas.focus();

        // Initialize game world
        this.initializeGameWorld(canvas);

        // Set up controls
        this.setupGameControls(canvas);

        // Start game loop
        this.gameLoop(ctx);

        // Initialize game start time for survival tracking
        this.gameStartTime = Date.now();

        console.log('Game initialized with character:', this.playerCharacter);
    }

    initializeGameWorld(canvas) {
        // Game world dimensions (larger than screen for scrolling)
        this.worldWidth = 3000;
        this.worldHeight = 2000;

        // Player worm
        this.player = {
            segments: [
                { x: this.worldWidth / 2, y: this.worldHeight / 2 },
                { x: this.worldWidth / 2 - 20, y: this.worldHeight / 2 },
                { x: this.worldWidth / 2 - 40, y: this.worldHeight / 2 }
            ],
            targetX: this.worldWidth / 2,
            targetY: this.worldHeight / 2,
            speed: 3,
            size: 8,
            color: this.playerCharacter.primaryColor,
            nickname: this.playerCharacter.nickname,
            boosting: false,
            boostCooldown: 0,
            boostDuration: 0
        };

        // Camera
        this.camera = {
            x: this.player.segments[0].x - canvas.width / 2,
            y: this.player.segments[0].y - canvas.height / 2
        };

        // Food system - always initialize empty, server will populate
        this.foods = [];
        console.log(`🍎 CLIENT: Initialized empty foods array - server will populate`);

        // Map obstacles - always initialize empty, server will populate
        this.obstacles = [];
        console.log(`🧱 CLIENT: Initialized empty obstacles array - server will populate`);

        // Other players (from multiplayer server)
        this.otherPlayers = [];
        // Bots removed - multiplayer only
    }



    gameLoop(ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Update game state
        this.updatePlayer();
        this.updateCamera();
        // Bots removed - multiplayer only

        // Draw everything
        this.drawBackground(ctx);
        this.drawMap(ctx);
        this.drawFood(ctx);
        this.drawPlayers(ctx);
        this.drawUI(ctx);

        // Continue game loop
        requestAnimationFrame(() => this.gameLoop(ctx));
    }

    // Game mechanics methods
    updatePlayer() {
        if (!this.player) return;

        // Don't update if player is dead
        if (this.player.isDead) {
            return;
        }

        // Update boost timers
        const deltaTime = 16; // Approximate frame time (60 FPS)

        if (this.player.boosting && this.player.boostDuration > 0) {
            this.player.boostDuration -= deltaTime;
            if (this.player.boostDuration <= 0) {
                this.deactivateBoost();
            }
        }

        if (this.player.boostCooldown > 0) {
            this.player.boostCooldown -= deltaTime;
            if (this.player.boostCooldown <= 0) {
                this.player.boostCooldown = 0;
            }
        }

        const head = this.player.segments[0];

        // Debug logging
        if (Date.now() % 5000 < 50) { // Log every 5 seconds
            console.log(`🎮 Game mode: ${this.isMultiplayer ? 'MULTIPLAYER' : 'SINGLE PLAYER'}`);
            console.log(`🍎 Foods available: ${this.foods ? this.foods.length : 'NONE'}`);
            console.log(`🧱 Obstacles available: ${this.obstacles ? this.obstacles.length : 'NONE'}`);
        }

        // In multiplayer, NO CLIENT-SIDE PREDICTION - PURE SERVER AUTHORITY
        if (this.isMultiplayer) {
            // Only update target direction, let server handle ALL movement
            const dx = this.player.targetX - head.x;
            const dy = this.player.targetY - head.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Update current direction if we have a valid target
            if (distance > 5) {
                this.player.currentDirection = {
                    x: dx / distance,
                    y: dy / distance
                };
            }

            // If target is too close or mouse hasn't moved recently, project forward
            const timeSinceMouseMove = Date.now() - this.lastMouseUpdate;
            if (distance < 50 || timeSinceMouseMove > 300) {
                const currentDirection = this.player.currentDirection || { x: 1, y: 0 };
                const projectionDistance = 400;

                this.player.targetX = head.x + (currentDirection.x * projectionDistance);
                this.player.targetY = head.y + (currentDirection.y * projectionDistance);

                // Ensure projected target stays within world bounds
                this.player.targetX = Math.max(50, Math.min(this.worldWidth - 50, this.player.targetX));
                this.player.targetY = Math.max(50, Math.min(this.worldHeight - 50, this.player.targetY));
            }

            // NO CLIENT-SIDE MOVEMENT - Server handles everything
            return;
        } else {
            // Single player - full local simulation
            const dx = this.player.targetX - head.x;
            const dy = this.player.targetY - head.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                const moveX = (dx / distance) * this.player.speed;
                const moveY = (dy / distance) * this.player.speed;

                // Calculate next position
                const nextX = head.x + moveX;
                const nextY = head.y + moveY;

                // Check if next position would collide with walls
                if (this.wouldCollideWithWall(nextX, nextY)) {
                    this.triggerDeathAnimation(head.x, head.y);
                    this.handlePlayerDeath('wall collision');
                    this.player.isDead = true; // Stop all movement immediately
                    return;
                }

                head.x = nextX;
                head.y = nextY;

                // Update body segments to follow with smooth growth
                for (let i = 1; i < this.player.segments.length; i++) {
                    const segment = this.player.segments[i];
                    const prevSegment = this.player.segments[i - 1];

                    // Handle smooth growth for new segments
                    if (segment.isNewSegment) {
                        segment.growthTimer = (segment.growthTimer || 0) + 16; // ~60fps

                        // Gradually move new segment into proper position over 200ms
                        if (segment.growthTimer < 200) {
                            const progress = segment.growthTimer / 200;
                            const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

                            // Calculate target position
                            const targetDistance = 20;
                            const dx = prevSegment.x - segment.x;
                            const dy = prevSegment.y - segment.y;
                            const currentDistance = Math.sqrt(dx * dx + dy * dy);

                            if (currentDistance > 0) {
                                const targetX = prevSegment.x - (dx / currentDistance) * targetDistance;
                                const targetY = prevSegment.y - (dy / currentDistance) * targetDistance;

                                // Smoothly interpolate to target position
                                segment.x = segment.x + (targetX - segment.x) * easeProgress * 0.1;
                                segment.y = segment.y + (targetY - segment.y) * easeProgress * 0.1;
                            }
                        } else {
                            // Growth complete, remove marker
                            delete segment.isNewSegment;
                            delete segment.growthTimer;
                        }
                    }

                    // Normal segment following logic
                    const segmentDx = prevSegment.x - segment.x;
                    const segmentDy = prevSegment.y - segment.y;
                    const segmentDistance = Math.sqrt(segmentDx * segmentDx + segmentDy * segmentDy);

                    if (segmentDistance > 20) {
                        const ratio = (segmentDistance - 20) / segmentDistance;
                        segment.x += segmentDx * ratio;
                        segment.y += segmentDy * ratio;
                    }
                }

                // Check food collisions (single player only)
                if (!this.isMultiplayer) {
                    this.checkFoodCollisions();
                }
            }

            // Keep player in bounds
            head.x = Math.max(this.player.size, Math.min(this.worldWidth - this.player.size, head.x));
            head.y = Math.max(this.player.size, Math.min(this.worldHeight - this.player.size, head.y));
        }
    }

    updateCamera() {
        const head = this.player.segments[0];
        this.camera.x = head.x - window.innerWidth / 2;
        this.camera.y = head.y - window.innerHeight / 2;

        // Keep camera in world bounds
        this.camera.x = Math.max(0, Math.min(this.worldWidth - window.innerWidth, this.camera.x));
        this.camera.y = Math.max(0, Math.min(this.worldHeight - window.innerHeight, this.camera.y));
    }

    activateBoost() {
        // Check if boost is available (not on cooldown)
        if (this.player.boostCooldown <= 0 && !this.player.boosting) {
            this.player.speed = 6;
            this.player.boosting = true;
            this.player.boostDuration = 1000; // 1 second boost duration
            console.log('🚀 BOOST ACTIVATED!');
        }
    }

    deactivateBoost() {
        // This method is now called automatically when boost duration expires
        this.player.speed = 3;
        this.player.boosting = false;
        this.player.boostCooldown = 4000; // 4 second cooldown
        console.log('🚀 BOOST DEACTIVATED - Cooldown: 4 seconds');
    }

    checkFoodCollisions() {
        if (!this.player || !this.foods) {
            if (!this.foods) console.log('⚠️ No foods array found!');
            return;
        }

        const head = this.player.segments[0];

        for (let i = this.foods.length - 1; i >= 0; i--) {
            const food = this.foods[i];
            const dx = head.x - food.x;
            const dy = head.y - food.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const collisionDistance = this.player.size + food.size;

            if (distance < collisionDistance) {
                console.log(`🍎 FOOD COLLISION! Distance: ${distance.toFixed(1)}, Required: ${collisionDistance.toFixed(1)}`);
                // Eat food
                this.eatFood(food, i);
            }
        }
    }

    wouldCollideWithWall(x, y) {
        if (!this.obstacles) {
            console.log('⚠️ No obstacles array found!');
            return false;
        }

        // Check obstacles
        for (const obstacle of this.obstacles) {
            if (x >= obstacle.x - this.player.size &&
                x <= obstacle.x + obstacle.width + this.player.size &&
                y >= obstacle.y - this.player.size &&
                y <= obstacle.y + obstacle.height + this.player.size) {
                console.log(`💥 WALL COLLISION DETECTED! Player at (${x}, ${y}) hit obstacle at (${obstacle.x}, ${obstacle.y})`);
                return true;
            }
        }

        // Check world boundaries
        if (x < this.player.size ||
            x > this.worldWidth - this.player.size ||
            y < this.player.size ||
            y > this.worldHeight - this.player.size) {
            console.log(`💥 BOUNDARY COLLISION! Player at (${x}, ${y}) hit world boundary`);
            return true;
        }

        return false;
    }

    triggerDeathAnimation(x, y) {
        // Create explosion particles based on player segments
        const particles = [];
        const segmentCount = this.player.segments.length;
        const numParticles = Math.min(segmentCount * 3, 60); // More particles for bigger worms

        // Create particles from each segment
        for (let i = 0; i < numParticles; i++) {
            const segmentIndex = Math.floor(i / 3);
            const segment = this.player.segments[segmentIndex] || this.player.segments[0];

            particles.push({
                x: segment.x + (Math.random() - 0.5) * 20,
                y: segment.y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 1.0,
                color: this.player.color || this.getRandomNeonColor(),
                size: Math.random() * 6 + 3
            });
        }

        // Create death food dots (client-side visual only, server handles actual food)
        this.createDeathDots(x, y);

        this.deathParticles = particles;
        this.deathAnimationTime = Date.now();

        console.log('💥 PIXEL EXPLOSION! Death animation triggered!');
    }

    createDeathDots(x, y) {
        // Create visual death dots that will be replaced by server food
        const deathDots = [];
        const segmentCount = this.player.segments.length;
        const numDots = Math.min(segmentCount, 20);

        for (let i = 0; i < numDots; i++) {
            const angle = (Math.PI * 2 * i) / numDots;
            const distance = 30 + Math.random() * 50;

            deathDots.push({
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                size: 8,
                color: this.player.color || this.getRandomNeonColor(),
                life: 1.0,
                fadeTime: Date.now()
            });
        }

        this.deathDots = deathDots;
    }

    eatFood(food, index) {
        // Remove food
        this.foods.splice(index, 1);

        // Grow player - add segments based on food value with smooth growth
        for (let i = 0; i < food.value; i++) {
            const tail = this.player.segments[this.player.segments.length - 1];

            // Start the new segment at the current tail position for smooth growth
            let newX = tail.x;
            let newY = tail.y;

            // Add new segment at the tail position initially (will move into place gradually)
            this.player.segments.push({
                x: newX,
                y: newY,
                isNewSegment: true, // Mark as new for smoother positioning
                growthTimer: 0 // Timer to gradually move into final position
            });
        }

        // Play eat sound effect (placeholder)
        console.log(`🍎 Ate ${food.type} food! Length: ${this.player.segments.length}`);

        // Food regeneration is handled by server only
    }

    handlePlayerDeath(cause) {
        console.log(`💀 Player died: ${cause}`);

        // Show death screen in both single and multiplayer modes
        this.showDeathScreen(cause);
    }

    showDeathScreen(cause) {
        // Create death screen overlay
        const deathScreen = document.createElement('div');
        deathScreen.className = 'death-popup';
        deathScreen.innerHTML = `
            <div class="death-content">
                <div class="death-title">💀 SYSTEM FAILURE 💀</div>
                <div class="death-cause">CAUSE: ${cause.toUpperCase()}</div>
                <div class="death-stats">
                    <div>FINAL LENGTH: ${this.player.segments.length}</div>
                    <div>SURVIVAL TIME: ${this.getGameTime()}</div>
                </div>
                <div class="death-message">CHOOSE YOUR FATE...</div>
                <div class="death-options">
                    <button id="respawn-btn" class="death-button respawn-btn">
                        <span class="button-icon">🔄</span>
                        RESPAWN
                    </button>
                    <button id="nobiko-btn" class="death-button nobiko-btn">
                        <span class="button-icon">🌐</span>
                        JOIN NOBIKO
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(deathScreen);

        // Store reference for cleanup
        this.currentDeathScreen = deathScreen;

        // Add event listeners
        const respawnBtn = document.getElementById('respawn-btn');
        const nobikoBtn = document.getElementById('nobiko-btn');

        if (respawnBtn) {
            respawnBtn.addEventListener('click', () => {
                // Send respawn request to server
                if (this.isMultiplayer && this.socket) {
                    console.log('🔄 Requesting respawn from server...');
                    this.socket.emit('requestRespawn');
                } else {
                    // Fallback for single player (though game is multiplayer only)
                    this.respawnPlayer();
                    if (this.currentDeathScreen) {
                        this.currentDeathScreen.remove();
                        this.currentDeathScreen = null;
                    }
                }
            });
        }

        if (nobikoBtn) {
            nobikoBtn.addEventListener('click', () => {
                // Open Nobiko website in new tab
                window.open('https://nobikolongcat.com/', '_blank');
                // Keep the death screen open so user can still respawn if they want
            });
        }
    }

    showDeathPopup(cause) {
        // Create death popup overlay
        const popup = document.createElement('div');
        popup.className = 'death-popup';
        popup.innerHTML = `
            <div class="death-content">
                <div class="death-title">SYSTEM FAILURE</div>
                <div class="death-cause">CAUSE: ${cause.toUpperCase()}</div>
                <div class="death-stats">
                    <div>FINAL LENGTH: ${this.player.segments.length}</div>
                    <div>SURVIVAL TIME: ${this.getGameTime()}</div>
                </div>
                <div class="death-options">
                    <button id="respawn-btn" class="death-button respawn-btn">
                        <span class="button-icon">🔄</span>
                        RESPAWN
                    </button>
                    <button id="exit-btn" class="death-button exit-btn">
                        <span class="button-icon">🚪</span>
                        EXIT GAME
                    </button>
                </div>
                <div class="death-hint">CHOOSE YOUR FATE...</div>
            </div>
        `;

        document.body.appendChild(popup);

        // Add event listeners
        const respawnBtn = document.getElementById('respawn-btn');
        const exitBtn = document.getElementById('exit-btn');

        respawnBtn.addEventListener('click', () => {
            document.body.removeChild(popup);
            this.respawnPlayer();
        });

        exitBtn.addEventListener('click', () => {
            document.body.removeChild(popup);
            this.exitToMainMenu();
        });

        // Store popup reference for cleanup
        this.currentDeathPopup = popup;
    }

    respawnPlayer() {
        // Reset player to starting state
        this.player.segments = [
            {
                x: Math.random() * (this.worldWidth - 200) + 100,
                y: Math.random() * (this.worldHeight - 200) + 100
            }
        ];

        // Add initial segments
        for (let i = 1; i < 3; i++) {
            this.player.segments.push({
                x: this.player.segments[0].x - i * 20,
                y: this.player.segments[0].y
            });
        }

        this.player.isDead = false; // Reset death flag
        console.log('🔄 Player respawned!');
    }

    exitToMainMenu() {
        // Clean up game state
        if (this.currentDeathPopup) {
            this.currentDeathPopup.remove();
            this.currentDeathPopup = null;
        }

        // Stop game loop
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }

        // Hide game canvas
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }

        // Show main menu
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.style.display = 'flex';
        }

        // Disconnect from multiplayer if connected
        if (this.isMultiplayer && this.socket) {
            this.socket.disconnect();
        }

        console.log('🚪 Exited to main menu');
    }

    getGameTime() {
        if (this.gameStartTime) {
            const elapsed = Date.now() - this.gameStartTime;
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
        }
        return "00:00";
    }

    // Sound effects (placeholder functions)
    playStartupSound() {
        // Could add Web Audio API sounds here
        console.log('🔊 BEEP BOOP - SYSTEM ONLINE');
    }

    playKeyboardSound() {
        // Retro keyboard click sound
        console.log('🔊 *click*');
    }

    // World generation methods
    generateFood() {
        this.foods = [];

        // Generate small food (most common) - REDUCED FOR PERFORMANCE
        for (let i = 0; i < 50; i++) {
            this.foods.push({
                x: Math.random() * this.worldWidth,
                y: Math.random() * this.worldHeight,
                size: 3,
                value: 1,
                type: 'small',
                color: this.getRandomNeonColor(),
                pulsePhase: Math.random() * Math.PI * 2
            });
        }

        // Generate medium food - REDUCED FOR PERFORMANCE
        for (let i = 0; i < 15; i++) {
            this.foods.push({
                x: Math.random() * this.worldWidth,
                y: Math.random() * this.worldHeight,
                size: 6,
                value: 3,
                type: 'medium',
                color: this.getRandomNeonColor(),
                pulsePhase: Math.random() * Math.PI * 2
            });
        }

        // Generate large food (rare) - REDUCED FOR PERFORMANCE
        for (let i = 0; i < 5; i++) {
            this.foods.push({
                x: Math.random() * this.worldWidth,
                y: Math.random() * this.worldHeight,
                size: 10,
                value: 5,
                type: 'large',
                color: this.getRandomNeonColor(),
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    generateSingleFood() {
        const rand = Math.random();
        let food;

        if (rand < 0.8) {
            // Small food
            food = {
                x: Math.random() * this.worldWidth,
                y: Math.random() * this.worldHeight,
                size: 3,
                value: 1,
                type: 'small',
                color: this.getRandomNeonColor(),
                pulsePhase: Math.random() * Math.PI * 2
            };
        } else if (rand < 0.95) {
            // Medium food
            food = {
                x: Math.random() * this.worldWidth,
                y: Math.random() * this.worldHeight,
                size: 6,
                value: 3,
                type: 'medium',
                color: this.getRandomNeonColor(),
                pulsePhase: Math.random() * Math.PI * 2
            };
        } else {
            // Large food
            food = {
                x: Math.random() * this.worldWidth,
                y: Math.random() * this.worldHeight,
                size: 10,
                value: 5,
                type: 'large',
                color: this.getRandomNeonColor(),
                pulsePhase: Math.random() * Math.PI * 2
            };
        }

        this.foods.push(food);
    }

    generateMap() {
        this.obstacles = [];

        // Generate rooms and corridors
        this.generateRooms();
        this.generateMaze();
        this.generateCentralArena();
    }

    generateRooms() {
        // Corner rooms
        const rooms = [
            { x: 100, y: 100, width: 400, height: 300 },
            { x: this.worldWidth - 500, y: 100, width: 400, height: 300 },
            { x: 100, y: this.worldHeight - 400, width: 400, height: 300 },
            { x: this.worldWidth - 500, y: this.worldHeight - 400, width: 400, height: 300 },
            // Central side rooms
            { x: 50, y: this.worldHeight / 2 - 150, width: 200, height: 300 },
            { x: this.worldWidth - 250, y: this.worldHeight / 2 - 150, width: 200, height: 300 }
        ];

        rooms.forEach(room => {
            // Room walls (with openings)
            this.addWallWithOpenings(room.x, room.y, room.width, 20); // Top
            this.addWallWithOpenings(room.x, room.y + room.height - 20, room.width, 20); // Bottom
            this.addWallWithOpenings(room.x, room.y, 20, room.height); // Left
            this.addWallWithOpenings(room.x + room.width - 20, room.y, 20, room.height); // Right
        });
    }

    addWallWithOpenings(x, y, width, height) {
        const openingSize = 80;
        const numOpenings = Math.floor(Math.max(width, height) / 200);

        if (width > height) {
            // Horizontal wall
            let currentX = x;
            for (let i = 0; i <= numOpenings; i++) {
                const segmentWidth = (width / (numOpenings + 1)) - (openingSize / (numOpenings + 1));
                if (segmentWidth > 20) {
                    this.obstacles.push({
                        x: currentX,
                        y: y,
                        width: segmentWidth,
                        height: height,
                        color: '#00ff00'
                    });
                }
                currentX += segmentWidth + openingSize;
            }
        } else {
            // Vertical wall
            let currentY = y;
            for (let i = 0; i <= numOpenings; i++) {
                const segmentHeight = (height / (numOpenings + 1)) - (openingSize / (numOpenings + 1));
                if (segmentHeight > 20) {
                    this.obstacles.push({
                        x: x,
                        y: currentY,
                        width: width,
                        height: segmentHeight,
                        color: '#00ff00'
                    });
                }
                currentY += segmentHeight + openingSize;
            }
        }
    }

    generateMaze() {
        // Add some maze-like structures in the middle areas
        const mazeElements = [
            { x: 800, y: 600, width: 20, height: 200 },
            { x: 1000, y: 400, width: 200, height: 20 },
            { x: 1400, y: 700, width: 20, height: 150 },
            { x: 1200, y: 900, width: 300, height: 20 },
            { x: 2000, y: 500, width: 20, height: 250 },
            { x: 1800, y: 800, width: 150, height: 20 }
        ];

        mazeElements.forEach(element => {
            this.obstacles.push({
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height,
                color: '#ff00ff'
            });
        });
    }

    generateCentralArena() {
        // Central circular arena
        const centerX = this.worldWidth / 2;
        const centerY = this.worldHeight / 2;
        const radius = 200;

        // Create circular wall segments
        for (let angle = 0; angle < Math.PI * 2; angle += 0.3) {
            const x = centerX + Math.cos(angle) * radius - 10;
            const y = centerY + Math.sin(angle) * radius - 10;

            // Skip some segments to create openings
            if (Math.random() > 0.3) {
                this.obstacles.push({
                    x: x,
                    y: y,
                    width: 20,
                    height: 20,
                    color: '#00ffff'
                });
            }
        }
    }

    // Bot generation removed - multiplayer only game

    // Drawing methods
    drawBackground(ctx) {
        // Draw grid background
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.lineWidth = 1;

        const gridSize = 50;
        const startX = Math.floor(this.camera.x / gridSize) * gridSize;
        const startY = Math.floor(this.camera.y / gridSize) * gridSize;

        for (let x = startX; x < this.camera.x + window.innerWidth + gridSize; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x - this.camera.x, 0);
            ctx.lineTo(x - this.camera.x, window.innerHeight);
            ctx.stroke();
        }

        for (let y = startY; y < this.camera.y + window.innerHeight + gridSize; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y - this.camera.y);
            ctx.lineTo(window.innerWidth, y - this.camera.y);
            ctx.stroke();
        }

        // Draw world boundaries
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);

        // Top boundary
        if (this.camera.y < 50) {
            ctx.beginPath();
            ctx.moveTo(-this.camera.x, 0 - this.camera.y);
            ctx.lineTo(this.worldWidth - this.camera.x, 0 - this.camera.y);
            ctx.stroke();
        }

        // Bottom boundary
        if (this.camera.y + window.innerHeight > this.worldHeight - 50) {
            ctx.beginPath();
            ctx.moveTo(-this.camera.x, this.worldHeight - this.camera.y);
            ctx.lineTo(this.worldWidth - this.camera.x, this.worldHeight - this.camera.y);
            ctx.stroke();
        }

        // Left boundary
        if (this.camera.x < 50) {
            ctx.beginPath();
            ctx.moveTo(0 - this.camera.x, -this.camera.y);
            ctx.lineTo(0 - this.camera.x, this.worldHeight - this.camera.y);
            ctx.stroke();
        }

        // Right boundary
        if (this.camera.x + window.innerWidth > this.worldWidth - 50) {
            ctx.beginPath();
            ctx.moveTo(this.worldWidth - this.camera.x, -this.camera.y);
            ctx.lineTo(this.worldWidth - this.camera.x, this.worldHeight - this.camera.y);
            ctx.stroke();
        }

        ctx.setLineDash([]);
    }

    drawMap(ctx) {
        // Debug logging every 5 seconds
        if (Date.now() % 5000 < 50) {
            console.log(`🧱 CLIENT: Drawing ${this.obstacles ? this.obstacles.length : 'NULL'} obstacles`);
            if (this.obstacles && this.obstacles.length > 0) {
                console.log(`🧱 CLIENT: Sample obstacle:`, this.obstacles[0]);
            }
        }

        // Draw obstacles
        if (!this.obstacles || this.obstacles.length === 0) {
            if (Date.now() % 2000 < 50) {
                console.log(`🧱 CLIENT: No obstacles to draw! Array: ${this.obstacles ? this.obstacles.length : 'NULL'}`);
            }
            return;
        }

        this.obstacles.forEach(obstacle => {
            const x = obstacle.x - this.camera.x;
            const y = obstacle.y - this.camera.y;

            // Only draw if visible
            if (x + obstacle.width > 0 && x < window.innerWidth &&
                y + obstacle.height > 0 && y < window.innerHeight) {

                ctx.fillStyle = obstacle.color;
                ctx.shadowColor = obstacle.color;
                ctx.shadowBlur = 10;
                ctx.fillRect(x, y, obstacle.width, obstacle.height);
                ctx.shadowBlur = 0;
            }
        });
    }

    drawFood(ctx) {
        if (!this.foods || this.foods.length === 0) {
            // Debug logging every 2 seconds
            if (Date.now() % 2000 < 50) {
                console.log(`🍎 CLIENT: No foods to draw! Array: ${this.foods ? this.foods.length : 'NULL'}, Type: ${typeof this.foods}`);
                console.log(`🍎 CLIENT: Foods array content:`, this.foods);
            }
            return;
        }

        // Debug logging every 5 seconds
        if (Date.now() % 5000 < 50) {
            console.log(`🍎 CLIENT: Drawing ${this.foods.length} foods`);
            console.log(`🍎 CLIENT: Sample food:`, this.foods[0]);
            console.log(`📷 CLIENT: Camera at (${this.camera.x.toFixed(1)}, ${this.camera.y.toFixed(1)})`);
            console.log(`🎮 CLIENT: Player at (${this.player?.segments?.[0]?.x?.toFixed(1)}, ${this.player?.segments?.[0]?.y?.toFixed(1)})`);
        }

        const time = Date.now() * 0.005;

        this.foods.forEach(food => {
            const x = food.x - this.camera.x;
            const y = food.y - this.camera.y;

            // Only draw if visible
            if (x > -20 && x < window.innerWidth + 20 &&
                y > -20 && y < window.innerHeight + 20) {

                // Enhanced pulsing effect
                const pulse = Math.sin(time + food.pulsePhase) * 0.4 + 1;
                const size = food.size * pulse;

                // Multi-layer glow effect for more vibrant appearance
                ctx.save();

                // Outer glow (largest, most transparent)
                ctx.fillStyle = food.color;
                ctx.shadowColor = food.color;
                ctx.shadowBlur = size * 4;
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
                ctx.fill();

                // Middle glow (medium size, medium transparency)
                ctx.shadowBlur = size * 2.5;
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
                ctx.fill();

                // Inner core (solid, bright)
                ctx.shadowBlur = size * 1.5;
                ctx.globalAlpha = 1.0;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();

                // Add enhanced sparkle effect for all food types
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#ffffff';
                ctx.globalAlpha = 0.8 + 0.2 * Math.sin(time * 2 + food.pulsePhase);
                ctx.beginPath();
                ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.25, 0, Math.PI * 2);
                ctx.fill();

                // Additional sparkle for larger food
                if (food.type !== 'small') {
                    ctx.globalAlpha = 0.6 + 0.4 * Math.sin(time * 1.5 + food.pulsePhase + 1);
                    ctx.beginPath();
                    ctx.arc(x + size * 0.2, y + size * 0.2, size * 0.15, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();

                ctx.shadowBlur = 0;
            }
        });
    }

    drawPlayers(ctx) {
        // Draw other players first
        this.otherPlayers.forEach(player => {
            this.drawWorm(ctx, player);
        });

        // Draw main player last (on top)
        this.drawWorm(ctx, this.player);

        // Draw cursor/aim indicator
        this.drawCursorIndicator(ctx);

        // Draw death particles if active
        this.drawDeathParticles(ctx);

        // Draw death dots if active
        this.drawDeathDots(ctx);
    }

    drawDeathParticles(ctx) {
        if (!this.deathParticles || this.deathParticles.length === 0) return;

        const currentTime = Date.now();
        const elapsed = currentTime - this.deathAnimationTime;
        const duration = 2000; // 2 seconds

        if (elapsed > duration) {
            this.deathParticles = [];
            return;
        }

        ctx.save();

        for (let i = this.deathParticles.length - 1; i >= 0; i--) {
            const particle = this.deathParticles[i];

            // Update particle
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.98; // Friction
            particle.vy *= 0.98;
            particle.life -= 0.02;

            if (particle.life <= 0) {
                this.deathParticles.splice(i, 1);
                continue;
            }

            // Draw particle
            const screenX = particle.x - this.camera.x;
            const screenY = particle.y - this.camera.y;

            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 10;

            ctx.beginPath();
            ctx.arc(screenX, screenY, particle.size * particle.life, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    drawDeathDots(ctx) {
        if (!this.deathDots || this.deathDots.length === 0) return;

        const currentTime = Date.now();
        const duration = 3000; // 3 seconds

        ctx.save();

        for (let i = this.deathDots.length - 1; i >= 0; i--) {
            const dot = this.deathDots[i];
            const elapsed = currentTime - dot.fadeTime;

            if (elapsed > duration) {
                this.deathDots.splice(i, 1);
                continue;
            }

            // Fade out over time
            dot.life = 1.0 - (elapsed / duration);

            // Draw dot
            const screenX = dot.x - this.camera.x;
            const screenY = dot.y - this.camera.y;

            ctx.globalAlpha = dot.life;
            ctx.fillStyle = dot.color;
            ctx.shadowColor = dot.color;
            ctx.shadowBlur = 8;

            ctx.beginPath();
            ctx.arc(screenX, screenY, dot.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    drawCursorIndicator(ctx) {
        if (!this.player || this.player.isDead) return;

        const head = this.player.segments[0];
        const headScreenX = head.x - this.camera.x;
        const headScreenY = head.y - this.camera.y;

        // Use current direction for more stable indicator
        const currentDirection = this.player.currentDirection || { x: 1, y: 0 };

        // Position cursor indicator ahead of the worm
        const indicatorDistance = 50; // Distance ahead of the head
        const indicatorX = headScreenX + (currentDirection.x * indicatorDistance);
        const indicatorY = headScreenY + (currentDirection.y * indicatorDistance);

        // Check if mouse is outside canvas bounds for visual feedback
        const timeSinceMouseMove = Date.now() - this.lastMouseUpdate;
        const isMouseOutOfBounds = timeSinceMouseMove > 300;

        // Draw cursor indicator
        ctx.save();

        // Change appearance based on pointer lock and mouse status
        if (this.pointerLocked) {
            // Pointer locked - green color with subtle pulse
            ctx.strokeStyle = '#00ff88';
            ctx.fillStyle = '#00ff88';
            ctx.shadowColor = '#00ff88';
            ctx.globalAlpha = 0.8 + 0.2 * Math.sin(Date.now() * 0.005); // Slow pulse
        } else if (isMouseOutOfBounds) {
            // Mouse out of bounds - orange color for auto-pilot mode
            ctx.strokeStyle = '#ffaa00';
            ctx.fillStyle = '#ffaa00';
            ctx.shadowColor = '#ffaa00';
            ctx.globalAlpha = 0.7 + 0.3 * Math.sin(Date.now() * 0.01); // Fast pulse
        } else {
            // Normal mode
            ctx.strokeStyle = this.player.color;
            ctx.fillStyle = this.player.color;
            ctx.shadowColor = this.player.color;
        }

        ctx.shadowBlur = 10;
        ctx.lineWidth = 3;

        // Draw crosshair with different sizes for different states
        let size = 10; // Default size
        if (this.pointerLocked) {
            size = 8; // Smaller when locked (more precise)
        } else if (isMouseOutOfBounds) {
            size = 12; // Larger when in auto-pilot
        }
        ctx.beginPath();
        // Horizontal line
        ctx.moveTo(indicatorX - size, indicatorY);
        ctx.lineTo(indicatorX + size, indicatorY);
        // Vertical line
        ctx.moveTo(indicatorX, indicatorY - size);
        ctx.lineTo(indicatorX, indicatorY + size);
        ctx.stroke();

        // Draw center dot with different sizes for different states
        ctx.beginPath();
        let dotSize = 3; // Default size
        if (this.pointerLocked) {
            dotSize = 2; // Smaller when locked
        } else if (isMouseOutOfBounds) {
            dotSize = 4; // Larger when in auto-pilot
        }
        ctx.arc(indicatorX, indicatorY, dotSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw direction arrow for better clarity
        ctx.lineWidth = 2;
        ctx.beginPath();
        const arrowLength = 15;
        const arrowX = indicatorX + (currentDirection.x * arrowLength);
        const arrowY = indicatorY + (currentDirection.y * arrowLength);

        // Arrow line
        ctx.moveTo(indicatorX, indicatorY);
        ctx.lineTo(arrowX, arrowY);

        // Arrow head
        const arrowHeadLength = 6;
        const angle = Math.atan2(currentDirection.y, currentDirection.x);
        ctx.lineTo(arrowX - arrowHeadLength * Math.cos(angle - Math.PI/6),
                   arrowY - arrowHeadLength * Math.sin(angle - Math.PI/6));
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - arrowHeadLength * Math.cos(angle + Math.PI/6),
                   arrowY - arrowHeadLength * Math.sin(angle + Math.PI/6));
        ctx.stroke();

        ctx.restore();
    }

    drawWorm(ctx, worm) {
        // Draw body segments
        for (let i = worm.segments.length - 1; i >= 0; i--) {
            const segment = worm.segments[i];
            const x = segment.x - this.camera.x;
            const y = segment.y - this.camera.y;

            // Only draw if visible
            if (x > -50 && x < window.innerWidth + 50 &&
                y > -50 && y < window.innerHeight + 50) {

                const isHead = i === 0;
                const isTail = i === worm.segments.length - 1;
                const size = isHead ? worm.size + 2 : worm.size;

                // Debug logging for segment types (reduced)
                if (worm === this.player && Date.now() % 5000 < 50) {
                    console.log(`🐱 SEGMENT ${i}: isHead=${isHead}, isTail=${isTail}, segments.length=${worm.segments.length}`);
                }

                // Use PNG assets if loaded, otherwise fallback to geometric shapes
                if (this.catAssets.loaded) {
                    // Debug logging every few seconds
                    if (Date.now() % 3000 < 50 && isHead) {
                        console.log('🐱 Rendering with cat PNG assets');
                    }
                    ctx.save();

                    // Apply color tinting
                    ctx.globalCompositeOperation = 'source-over';

                    if (isHead && this.catAssets.head) {
                        // Calculate rotation based on movement direction
                        let rotation = Math.PI / 2; // Default to pointing upward
                        if (worm.segments.length > 1) {
                            const head = worm.segments[0];
                            const neck = worm.segments[1];
                            rotation = Math.atan2(head.y - neck.y, head.x - neck.x) + Math.PI / 2;
                        }

                        // Draw rotated head
                        ctx.translate(x, y);
                        ctx.rotate(rotation);
                        // Make head slightly larger to ensure overlap
                        const headSize = size * 1.2;
                        ctx.drawImage(this.catAssets.head, -headSize, -headSize, headSize * 2, headSize * 2);

                    } else if (isTail && this.catAssets.tail) {
                        // Calculate tail rotation based on direction TO the previous segment (reverse direction)
                        let rotation = Math.PI; // Default rotation
                        if (i > 0) {
                            const current = worm.segments[i];
                            const previous = worm.segments[i - 1];
                            rotation = Math.atan2(previous.y - current.y, previous.x - current.x) + Math.PI;
                        }

                        // Draw rotated tail
                        ctx.translate(x, y);
                        ctx.rotate(rotation);
                        const tailSize = size * 1.8;
                        const offsetX = -tailSize * 0.3;
                        const offsetY = -tailSize;
                        ctx.drawImage(this.catAssets.tail, offsetX, offsetY, tailSize * 2, tailSize * 2);

                    } else if (this.catAssets.body) {
                        // Calculate body rotation based on direction TO the previous segment (reverse direction)
                        let rotation = Math.PI / 2; // Default rotation
                        if (i > 0) {
                            const current = worm.segments[i];
                            const previous = worm.segments[i - 1];
                            rotation = Math.atan2(previous.y - current.y, previous.x - current.x) + Math.PI / 2;
                        }

                        // Draw rotated body segment
                        ctx.translate(x, y);
                        ctx.rotate(rotation);
                        // Make body segments slightly larger to ensure overlap
                        const bodySize = size * 1.2;
                        ctx.drawImage(this.catAssets.body, -bodySize, -bodySize, bodySize * 2, bodySize * 2);
                    }

                    ctx.restore();
                } else {
                    // Debug logging every few seconds
                    if (Date.now() % 3000 < 50 && isHead) {
                        console.log('⚠️ Using fallback geometric shapes - catAssets.loaded:', this.catAssets.loaded);
                    }
                    // Fallback to geometric shapes
                    // Glow effect
                    ctx.shadowColor = worm.color;
                    ctx.shadowBlur = isHead ? 15 : 10;

                    // Main body
                    ctx.fillStyle = worm.color;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();

                    // Head details
                    if (isHead) {
                        // Eyes
                        ctx.shadowBlur = 0;
                        ctx.fillStyle = '#ffffff';
                        ctx.beginPath();
                        ctx.arc(x - size * 0.3, y - size * 0.2, size * 0.15, 0, Math.PI * 2);
                        ctx.arc(x + size * 0.3, y - size * 0.2, size * 0.15, 0, Math.PI * 2);
                        ctx.fill();

                        // Pupils
                        ctx.fillStyle = '#000000';
                        ctx.beginPath();
                        ctx.arc(x - size * 0.3, y - size * 0.2, size * 0.08, 0, Math.PI * 2);
                        ctx.arc(x + size * 0.3, y - size * 0.2, size * 0.08, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    ctx.shadowBlur = 0;
                }
            }
        }

        // Draw nickname above head
        if (worm.nickname) {
            const head = worm.segments[0];
            const x = head.x - this.camera.x;
            const y = head.y - this.camera.y - worm.size - 20;

            if (x > -100 && x < window.innerWidth + 100 &&
                y > -50 && y < window.innerHeight + 50) {

                ctx.fillStyle = worm.color;
                ctx.font = '12px "Share Tech Mono", monospace';
                ctx.textAlign = 'center';
                ctx.shadowColor = worm.color;
                ctx.shadowBlur = 5;
                ctx.fillText(worm.nickname, x, y);
                ctx.shadowBlur = 0;
            }
        }
    }

    drawUI(ctx) {
        // Score
        ctx.fillStyle = '#00ff00';
        ctx.font = '16px "Share Tech Mono", monospace';
        ctx.textAlign = 'left';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 5;
        ctx.fillText(`LENGTH: ${this.player.segments.length}`, 20, 30);

        // Boost indicator and cooldown
        if (this.player.boosting) {
            ctx.fillStyle = '#ff00ff';
            ctx.shadowColor = '#ff00ff';
            ctx.fillText('🚀 BOOST ACTIVE', 20, 55);
        } else if (this.player.boostCooldown > 0) {
            const cooldownSeconds = (this.player.boostCooldown / 1000).toFixed(1);
            ctx.fillStyle = '#ffff00';
            ctx.shadowColor = '#ffff00';
            ctx.fillText(`🚀 BOOST COOLDOWN: ${cooldownSeconds}s`, 20, 55);
        } else {
            ctx.fillStyle = '#00ffff';
            ctx.shadowColor = '#00ffff';
            ctx.fillText('🚀 BOOST READY (Left Click)', 20, 55);
        }

        // Removed pointer lock UI messages

        // Minimap
        this.drawMinimap(ctx);

        ctx.shadowBlur = 0;
    }

    drawMinimap(ctx) {
        const minimapSize = 150;
        const minimapX = window.innerWidth - minimapSize - 20;
        const minimapY = 20;

        // Minimap background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);

        // Scale factors
        const scaleX = minimapSize / this.worldWidth;
        const scaleY = minimapSize / this.worldHeight;

        // Draw player on minimap
        const playerX = minimapX + this.player.segments[0].x * scaleX;
        const playerY = minimapY + this.player.segments[0].y * scaleY;

        ctx.fillStyle = this.player.color;
        ctx.shadowColor = this.player.color;
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.arc(playerX, playerY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw other players on minimap
        this.otherPlayers.forEach(player => {
            const x = minimapX + player.segments[0].x * scaleX;
            const y = minimapY + player.segments[0].y * scaleY;

            ctx.fillStyle = player.color;
            ctx.shadowColor = player.color;
            ctx.shadowBlur = 2;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.shadowBlur = 0;
    }

    // Utility methods
    getRandomNeonColor() {
        const colors = ['#00ff00', '#ff00ff', '#00ffff', '#ffff00', '#8000ff', '#ff8000', '#ff0080', '#80ff00'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Bot name generation removed - multiplayer only game

    // Multiplayer networking methods
    connectToServer(nickname) {
        try {
            console.log('🔄 Attempting to connect to server...');
            // Connect to server (works for both local and production)
            this.socket = io();

            this.socket.on('connect', () => {
                console.log('🌐 Connected to multiplayer server!');
                this.isMultiplayer = true;
                this.setupMultiplayerEvents();

                // Join the game
                console.log('🎮 Joining game with nickname:', nickname);
                this.socket.emit('joinGame', {
                    nickname: nickname,
                    character: this.playerCharacter
                });
            });

            this.socket.on('connect_error', () => {
                console.log('❌ Failed to connect to server! Please ensure server is running on localhost:8080');
                this.showError('SERVER CONNECTION FAILED! ENSURE SERVER IS RUNNING!');
            });

            // Timeout fallback
            setTimeout(() => {
                if (!this.isMultiplayer) {
                    console.log('⏰ Connection timeout! Server must be running!');
                    this.showError('CONNECTION TIMEOUT! START THE SERVER!');
                }
            }, 3000);

        } catch (error) {
            console.log('❌ Connection error! Server must be running!');
            this.showError('CONNECTION ERROR! START THE SERVER!');
        }
    }

    setupMultiplayerEvents() {
        this.socket.on('gameJoined', (data) => {
            console.log('✅ Joined multiplayer game!', data);
            this.playerId = data.playerId;
            this.worldWidth = data.worldWidth;
            this.worldHeight = data.worldHeight;

            // Use server obstacles instead of generating client-side
            this.obstacles = data.obstacles || [];
            console.log(`🧱 CLIENT: Received ${this.obstacles.length} obstacles from server`);

            // Initialize foods array (will be populated by gameUpdate events)
            this.foods = data.foods || [];
            console.log(`🍎 CLIENT: Received ${this.foods.length} foods from server`);

            // Set up player from server data
            this.player = {
                segments: data.player.segments,
                targetX: data.player.segments[0].x,
                targetY: data.player.segments[0].y,
                speed: data.player.speed,
                size: data.player.size,
                color: data.player.color,
                nickname: data.player.nickname,
                boosting: false,
                boostCooldown: 0,
                boostDuration: 0,
                currentDirection: { x: 1, y: 0 } // Initialize direction
            };

            this.initializeMultiplayerGame();
        });

        this.socket.on('existingPlayers', (players) => {
            this.otherPlayers = players.filter(p => p.id !== this.playerId);
            console.log(`👥 Found ${this.otherPlayers.length} other players`);
        });

        this.socket.on('playerJoined', (player) => {
            if (player.id !== this.playerId) {
                this.otherPlayers.push(player);
                console.log(`👋 ${player.nickname} joined the game!`);
            }
        });

        this.socket.on('playerLeft', (playerId) => {
            this.otherPlayers = this.otherPlayers.filter(p => p.id !== playerId);
            console.log(`👋 Player left the game`);
        });

        this.socket.on('gameUpdate', (data) => {
            // Update ALL players from server (including self) - PURE SERVER AUTHORITY
            const serverPlayer = data.players.find(p => p.id === this.playerId);
            if (serverPlayer && this.player) {
                // COMPLETE SERVER AUTHORITY - No client-side reconciliation
                // This prevents head/body separation issues
                this.player.segments = [...serverPlayer.segments]; // Deep copy to prevent reference issues
                this.player.score = serverPlayer.score;
                this.player.size = serverPlayer.size;
                this.player.boosting = serverPlayer.boosting;
                this.player.boostCooldown = serverPlayer.boostCooldown;
                this.player.boostDuration = serverPlayer.boostDuration;
                this.player.isDead = serverPlayer.isDead;

                // Debug logging for position updates
                if (Date.now() % 3000 < 50) {
                    const head = this.player.segments[0];
                    console.log(`📍 CLIENT: Server update - Head:(${head.x.toFixed(1)}, ${head.y.toFixed(1)}) Segments:${this.player.segments.length}`);
                }
            }

            // Update other players
            this.otherPlayers = data.players.filter(p => p.id !== this.playerId);

            // Update food from server (authoritative)
            if (data.foods && data.foods.length > 0) {
                this.foods = data.foods;
            }

            // Update obstacles from server (authoritative)
            if (data.obstacles && data.obstacles.length > 0) {
                this.obstacles = data.obstacles;
            }
        });

        this.socket.on('foodUpdate', (foods) => {
            this.foods = foods || [];
        });

        this.socket.on('foodEaten', (data) => {
            // Remove eaten food - safety check
            if (this.foods && Array.isArray(this.foods)) {
                this.foods = this.foods.filter(f => f.id !== data.foodId);
            }
        });

        this.socket.on('playerDied', (data) => {
            if (data.playerId === this.playerId) {
                // Trigger death animation at death position
                if (data.deathPosition) {
                    this.triggerDeathAnimation(data.deathPosition.x, data.deathPosition.y);
                }

                // Mark player as dead and show death screen
                this.player.isDead = true;
                this.handlePlayerDeath(data.cause || 'unknown');

                console.log('💀 You died! Choose your fate...');
            }

            // Add death food
            if (data.deathFoods) {
                this.foods.push(...data.deathFoods);
            }
        });

        this.socket.on('playerRespawned', (data) => {
            // Player successfully respawned
            this.player.segments = data.segments;
            this.player.isDead = false;
            this.player.score = 0;

            // Close death screen
            if (this.currentDeathScreen) {
                this.currentDeathScreen.remove();
                this.currentDeathScreen = null;
            }

            console.log('🔄 Successfully respawned!');
        });

        this.socket.on('playerCount', (count) => {
            this.playerCount = count;
            const countElement = document.getElementById('player-count');
            if (countElement) {
                countElement.textContent = count;
            }
        });

        this.socket.on('serverFull', () => {
            this.showError('SERVER FULL! TRY AGAIN LATER!');
        });

        this.socket.on('chatMessage', (messageData) => {
            this.addChatMessage(messageData);
        });
    }

    // Single player mode removed - game is multiplayer only

    // Simple PNG asset loading
    async loadCatAssets() {
        try {
            console.log('🐱 Loading cat PNG assets...');

            // Load head PNG
            this.catAssets.head = new Image();
            this.catAssets.head.src = 'assets/characters/cat/head.png';

            // Load body PNG
            this.catAssets.body = new Image();
            this.catAssets.body.src = 'assets/characters/cat/body.png';

            // Load tail PNG
            this.catAssets.tail = new Image();
            this.catAssets.tail.src = 'assets/characters/cat/tail.png';

            // Wait for all images to load
            await Promise.all([
                new Promise((resolve, reject) => {
                    this.catAssets.head.onload = resolve;
                    this.catAssets.head.onerror = reject;
                }),
                new Promise((resolve, reject) => {
                    this.catAssets.body.onload = resolve;
                    this.catAssets.body.onerror = reject;
                }),
                new Promise((resolve, reject) => {
                    this.catAssets.tail.onload = resolve;
                    this.catAssets.tail.onerror = reject;
                })
            ]);

            this.catAssets.loaded = true;
            console.log('✅ Cat PNG assets loaded successfully!');
            return true;
        } catch (error) {
            console.log('⚠️ Failed to load cat PNG assets:', error);
            console.log('🔄 Using fallback geometric shapes');
            this.catAssets.loaded = false;
            return false;
        }
    }

    async initializeMultiplayerGame() {
        // Load cat PNG assets FIRST before showing game
        await this.loadCatAssets();

        // Only proceed after PNG assets are loaded
        this.showGameCanvas();
        this.initializeGameCanvas();

        // DON'T reinitialize foods/obstacles arrays - they're already set from server!
        console.log(`🍎 CLIENT: Using ${this.foods ? this.foods.length : 0} foods from server`);
        console.log(`🧱 CLIENT: Using ${this.obstacles ? this.obstacles.length : 0} obstacles from server`);

        // Set up chat system
        this.setupChatSystem();

        // Start sending player updates
        this.startPlayerUpdateLoop();

        // Don't generate map - use server obstacles
        console.log('🎮 Multiplayer game initialized with server obstacles');

        // Start game loop with proper context
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        this.gameLoop(ctx);
    }

    startPlayerUpdateLoop() {
        if (!this.isMultiplayer || !this.socket) return;

        // Store last sent position to avoid sending duplicate updates
        this.lastSentTarget = { x: 0, y: 0 };
        this.lastSentTime = 0;

        setInterval(() => {
            if (this.player && this.socket.connected) {
                const now = Date.now();
                const timeSinceLastSent = now - this.lastSentTime;

                // Calculate distance from last sent target
                const dx = this.player.targetX - this.lastSentTarget.x;
                const dy = this.player.targetY - this.lastSentTarget.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Only send update if target has moved significantly or enough time has passed
                if (distance > 15 || timeSinceLastSent > 100) { // Balanced frequency: min 100ms between updates
                    this.socket.emit('playerMove', {
                        targetX: this.player.targetX,
                        targetY: this.player.targetY,
                        boosting: this.player.boosting
                    });

                    this.lastSentTarget.x = this.player.targetX;
                    this.lastSentTarget.y = this.player.targetY;
                    this.lastSentTime = now;
                }
            }
        }, 1000 / 20); // 20 FPS input updates for balanced responsiveness and performance
    }



    // Chat system methods
    setupChatSystem() {
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatToggle = document.getElementById('chat-toggle-btn');
        const chatContainer = document.getElementById('chat-container');

        // Chat toggle functionality
        let chatMinimized = false;
        chatToggle.addEventListener('click', () => {
            chatMinimized = !chatMinimized;
            if (chatMinimized) {
                chatContainer.classList.add('minimized');
                chatToggle.textContent = 'SHOW';
            } else {
                chatContainer.classList.remove('minimized');
                chatToggle.textContent = 'HIDE';
            }
        });

        // Send message functionality
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message && this.socket && this.socket.connected) {
                this.socket.emit('chatMessage', { message });
                chatInput.value = '';
            }
        };

        chatSend.addEventListener('click', sendMessage);

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Add welcome message
        this.addChatMessage({
            nickname: 'SYSTEM',
            message: 'WELCOME TO NOBIKO WARS! TYPE TO CHAT!',
            timestamp: Date.now(),
            color: '#ff00ff',
            isSystem: true
        });

        // Prevent chat input from affecting game controls
        chatInput.addEventListener('focus', () => {
            this.chatFocused = true;
        });

        chatInput.addEventListener('blur', () => {
            this.chatFocused = false;
        });
    }

    addChatMessage(messageData) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = messageData.isSystem ? 'chat-message system' : 'chat-message';

        const timestamp = new Date(messageData.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        if (messageData.isSystem) {
            messageElement.innerHTML = `
                <span class="timestamp">[${timestamp}]</span>
                <span class="message">${messageData.message}</span>
            `;
        } else {
            messageElement.innerHTML = `
                <span class="timestamp">[${timestamp}]</span>
                <span class="nickname" style="color: ${messageData.color}">${messageData.nickname}:</span>
                <span class="message">${messageData.message}</span>
            `;
        }

        chatMessages.appendChild(messageElement);

        // Auto-scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Limit message history (keep last 50 messages)
        while (chatMessages.children.length > 50) {
            chatMessages.removeChild(chatMessages.firstChild);
        }

        // Flash chat if minimized
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer.classList.contains('minimized')) {
            chatContainer.style.animation = 'chat-flash 0.5s ease-in-out 3';
            setTimeout(() => {
                chatContainer.style.animation = '';
            }, 1500);
        }
    }

    // Override game controls when chat is focused
    setupGameControls(canvas) {
        // Store mouse position for cursor indicator
        this.mouseX = canvas.width / 2; // Start at center
        this.mouseY = canvas.height / 2;
        this.lastMouseUpdate = Date.now();

        // Initialize keyboard state for smooth directional movement
        this.keyboardState = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        // Start keyboard movement update loop
        this.startKeyboardMovementLoop();

        // Simple mouse movement handler - NO POINTER LOCK
        const handleMouseMove = (e) => {
            if (this.chatFocused) return; // Don't move when typing

            const rect = canvas.getBoundingClientRect();
            let rawMouseX = e.clientX - rect.left;
            let rawMouseY = e.clientY - rect.top;

            // Scale for canvas resolution vs display size
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            this.mouseX = rawMouseX * scaleX;
            this.mouseY = rawMouseY * scaleY;

            // Clamp to canvas bounds
            this.mouseX = Math.max(0, Math.min(canvas.width, this.mouseX));
            this.mouseY = Math.max(0, Math.min(canvas.height, this.mouseY));

            this.lastMouseUpdate = Date.now();

            // Only update target if not using keyboard controls
            if (!this.isUsingKeyboard()) {
                this.updatePlayerTargetFromMouse();
            }
        };

        // Add mouse move listener
        document.addEventListener('mousemove', handleMouseMove);

        // Canvas click for boost - NO POINTER LOCK
        canvas.addEventListener('mousedown', (e) => {
            if (this.chatFocused) return;

            if (e.button === 0) { // Left click only
                this.activateBoost();
            }
        });

        // Keyboard controls - SMOOTH DIRECTIONAL MOVEMENT
        document.addEventListener('keydown', (e) => {
            if (this.chatFocused) return; // Don't process game controls when typing

            // Space key for boost
            if (e.code === 'Space') {
                e.preventDefault();
                this.activateBoost();
            }

            // Arrow key controls - track key state for smooth movement
            if (this.player && !this.player.isDead) {
                let keyPressed = false;

                switch(e.code) {
                    case 'ArrowUp':
                    case 'KeyW':
                        e.preventDefault();
                        this.keyboardState.up = true;
                        keyPressed = true;
                        break;
                    case 'ArrowDown':
                    case 'KeyS':
                        e.preventDefault();
                        this.keyboardState.down = true;
                        keyPressed = true;
                        break;
                    case 'ArrowLeft':
                    case 'KeyA':
                        e.preventDefault();
                        this.keyboardState.left = true;
                        keyPressed = true;
                        break;
                    case 'ArrowRight':
                    case 'KeyD':
                        e.preventDefault();
                        this.keyboardState.right = true;
                        keyPressed = true;
                        break;
                }

                // If any movement key was pressed, update target immediately
                if (keyPressed) {
                    this.updatePlayerTargetFromKeyboard();
                }
            }

            // Quick chat toggle with 'T' key
            if (e.code === 'KeyT' && !this.chatFocused) {
                e.preventDefault();
                document.getElementById('chat-input').focus();
            }
        });

        // Handle key release for smooth movement
        document.addEventListener('keyup', (e) => {
            if (this.chatFocused) return;

            if (this.player && !this.player.isDead) {
                let keyReleased = false;

                switch(e.code) {
                    case 'ArrowUp':
                    case 'KeyW':
                        this.keyboardState.up = false;
                        keyReleased = true;
                        break;
                    case 'ArrowDown':
                    case 'KeyS':
                        this.keyboardState.down = false;
                        keyReleased = true;
                        break;
                    case 'ArrowLeft':
                    case 'KeyA':
                        this.keyboardState.left = false;
                        keyReleased = true;
                        break;
                    case 'ArrowRight':
                    case 'KeyD':
                        this.keyboardState.right = false;
                        keyReleased = true;
                        break;
                }

                // Update target when key is released
                if (keyReleased) {
                    this.updatePlayerTargetFromKeyboard();
                }
            }
        });
    }
    // Check if any keyboard movement keys are pressed
    isUsingKeyboard() {
        return this.keyboardState && (
            this.keyboardState.up ||
            this.keyboardState.down ||
            this.keyboardState.left ||
            this.keyboardState.right
        );
    }

    // Update player target from mouse position
    updatePlayerTargetFromMouse() {
        if (this.player) {
            this.player.targetX = this.camera.x + this.mouseX;
            this.player.targetY = this.camera.y + this.mouseY;

            // Debug logging every 5 seconds
            if (Date.now() % 5000 < 50) {
                const head = this.player.segments[0];
                const dx = this.player.targetX - head.x;
                const dy = this.player.targetY - head.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                console.log(`🖱️ CLIENT: Mouse:(${this.mouseX.toFixed(1)}, ${this.mouseY.toFixed(1)}) Target:(${this.player.targetX.toFixed(1)}, ${this.player.targetY.toFixed(1)}) Head:(${head.x.toFixed(1)}, ${head.y.toFixed(1)}) Distance:${distance.toFixed(1)}`);
            }

            // Update direction for responsive feel
            this.updatePlayerDirection();
        }
    }

    // Update player target from keyboard input - SMOOTH DIAGONAL MOVEMENT
    updatePlayerTargetFromKeyboard() {
        if (!this.player || this.player.isDead) return;

        // Throttle keyboard updates to prevent spam
        const now = Date.now();
        if (!this.lastKeyboardUpdate) this.lastKeyboardUpdate = 0;
        if (now - this.lastKeyboardUpdate < 50) return; // Max 20 FPS for keyboard updates
        this.lastKeyboardUpdate = now;

        const head = this.player.segments[0];

        // Calculate direction vector from pressed keys
        let directionX = 0;
        let directionY = 0;

        if (this.keyboardState.left) directionX -= 1;
        if (this.keyboardState.right) directionX += 1;
        if (this.keyboardState.up) directionY -= 1;
        if (this.keyboardState.down) directionY += 1;

        // If no keys are pressed, stop updating keyboard target
        if (directionX === 0 && directionY === 0) {
            return;
        }

        // Normalize diagonal movement for consistent speed
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        if (magnitude > 0) {
            directionX /= magnitude;
            directionY /= magnitude;
        }

        // Set target at a reasonable distance for smooth continuous movement
        const targetDistance = 300; // Reduced from 500 for better control
        this.player.targetX = head.x + (directionX * targetDistance);
        this.player.targetY = head.y + (directionY * targetDistance);

        // Keep target within world bounds with safety margin
        this.player.targetX = Math.max(100, Math.min(this.worldWidth - 100, this.player.targetX));
        this.player.targetY = Math.max(100, Math.min(this.worldHeight - 100, this.player.targetY));

        // Update current direction for smooth movement
        this.player.currentDirection = {
            x: directionX,
            y: directionY
        };

        // Debug logging for keyboard movement (reduced frequency)
        if (Date.now() % 5000 < 50) {
            console.log(`⌨️ CLIENT: Keys:(${this.keyboardState.up?'↑':''}${this.keyboardState.down?'↓':''}${this.keyboardState.left?'←':''}${this.keyboardState.right?'→':''}) Direction:(${directionX.toFixed(2)}, ${directionY.toFixed(2)}) Target:(${this.player.targetX.toFixed(1)}, ${this.player.targetY.toFixed(1)})`);
        }
    }

    // Update player direction based on current target
    updatePlayerDirection() {
        if (this.player && this.player.segments && this.player.segments.length > 0) {
            const head = this.player.segments[0];
            const dx = this.player.targetX - head.x;
            const dy = this.player.targetY - head.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                this.player.currentDirection = {
                    x: dx / distance,
                    y: dy / distance
                };
            }
        }
    }

    // Continuous keyboard movement update loop - REDUCED FREQUENCY
    startKeyboardMovementLoop() {
        setInterval(() => {
            if (this.isUsingKeyboard() && this.player && !this.player.isDead) {
                this.updatePlayerTargetFromKeyboard();
            }
        }, 1000 / 20); // 20 FPS for keyboard movement - much more reasonable
    }






}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new NobikoWars();
});

// Add loading bar styles
const loadingStyles = `
.loading-container {
    text-align: center;
    animation: loading-pulse 2s ease-in-out infinite;
}

.loading-logo {
    font-family: 'Orbitron', monospace;
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 40px;
}

.loading-text {
    font-size: 1.2rem;
    margin: 30px 0;
}

.loading-bar-container {
    width: 400px;
    height: 20px;
    border: 2px solid #00ff00;
    margin: 20px auto;
    background: rgba(0, 0, 0, 0.8);
    box-shadow: inset 0 0 10px rgba(0, 255, 0, 0.3);
}

.loading-bar {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.loading-progress {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #00ff00, #00ffff, #00ff00);
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
    transition: width 0.3s ease;
    animation: progress-glow 1s ease-in-out infinite alternate;
}

.loading-details {
    margin-top: 30px;
    font-size: 0.9rem;
    line-height: 1.6;
}

@keyframes loading-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
}

@keyframes progress-glow {
    0% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.8); }
    100% { box-shadow: 0 0 30px rgba(0, 255, 255, 1); }
}
`;

// Inject loading styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);
