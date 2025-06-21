// Nobiko Wars - Multiplayer Server
// 90s-themed Slither.io Clone Server

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Game state
const gameState = {
    players: new Map(),
    foods: [],
    obstacles: [], // Empty - no obstacles for open world gameplay
    worldWidth: 6000,  // Doubled world width for more open gameplay
    worldHeight: 4000, // Doubled world height for more open gameplay
    maxPlayers: 50
};

// Neon colors for players
const neonColors = [
    '#00ff00', '#ff00ff', '#00ffff', '#ffff00',
    '#8000ff', '#ff8000', '#ff0080', '#80ff00'
];

// Visual effects system for unique player appearances
const visualEffects = [
    {
        name: 'normal',
        colorTint: null,
        glitch: false,
        crt: false,
        glow: false,
        pixelate: false,
        rainbow: false
    },
    {
        name: 'neon_glow',
        colorTint: '#00ffff',
        glitch: false,
        crt: false,
        glow: true,
        pixelate: false,
        rainbow: false
    },
    {
        name: 'glitch_red',
        colorTint: '#ff0040',
        glitch: true,
        crt: false,
        glow: false,
        pixelate: false,
        rainbow: false
    },
    {
        name: 'crt_green',
        colorTint: '#40ff40',
        glitch: false,
        crt: true,
        glow: false,
        pixelate: false,
        rainbow: false
    },
    {
        name: 'purple_glow',
        colorTint: '#8040ff',
        glitch: false,
        crt: false,
        glow: true,
        pixelate: false,
        rainbow: false
    },
    {
        name: 'pixel_blue',
        colorTint: '#4080ff',
        glitch: false,
        crt: false,
        glow: false,
        pixelate: true,
        rainbow: false
    },
    {
        name: 'rainbow',
        colorTint: null,
        glitch: false,
        crt: false,
        glow: true,
        pixelate: false,
        rainbow: true
    },
    {
        name: 'glitch_cyan',
        colorTint: '#00ff80',
        glitch: true,
        crt: false,
        glow: false,
        pixelate: false,
        rainbow: false
    },
    {
        name: 'crt_amber',
        colorTint: '#ffaa00',
        glitch: false,
        crt: true,
        glow: false,
        pixelate: false,
        rainbow: false
    }
];

// Initialize food with proper scattered distribution across the entire map
function generateFood() {
    gameState.foods = [];
    let foodIndex = 0;

    // Generate food with random distribution across the map
    const targetFoodCount = 200; // Much more food for larger open world (5x increase)

    for (let i = 0; i < targetFoodCount; i++) {
        const food = generateSingleFood();
        if (food) {
            // Food is already added to gameState.foods in generateSingleFood
            foodIndex++;
        }
    }
}

// Generate food within a specific grid cell for even distribution
function generateGridFood(id, type, gridPos, cellWidth, cellHeight) {
    // Calculate the bounds of this grid cell
    const cellX = gridPos.col * cellWidth;
    const cellY = gridPos.row * cellHeight;

    // Padding to keep food away from cell edges
    const padding = 30;
    const minX = cellX + padding;
    const maxX = cellX + cellWidth - padding;
    const minY = cellY + padding;
    const maxY = cellY + cellHeight - padding;

    // Ensure we have valid bounds
    if (maxX <= minX || maxY <= minY) {
        return null;
    }

    let x, y;
    let attempts = 0;
    const maxAttempts = 15;

    // Try to find a good position
    do {
        x = Math.random() * (maxX - minX) + minX;
        y = Math.random() * (maxY - minY) + minY;
        attempts++;

        // No obstacle collision checks needed for open world
        break; // Always accept the position
    } while (attempts < maxAttempts);

    // If we couldn't find a good position, use the center of the cell
    if (attempts >= maxAttempts) {
        x = cellX + cellWidth / 2;
        y = cellY + cellHeight / 2;
    }

    // Food properties based on type - BALANCED VALUES (MAX 4 POINTS)
    let size, value;
    switch (type) {
        case 'small':
            size = 3;
            value = 1; // Back to 1 point
            break;
        case 'medium':
            size = 6;
            value = 2; // Reduced to 2 points
            break;
        case 'large':
            size = 10;
            value = 4; // Reduced to 4 points max
            break;
    }

    return {
        id,
        x,
        y,
        size,
        value,
        type,
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
        pulsePhase: Math.random() * Math.PI * 2
    };
}



// Generate single food item with better distribution across the entire map
function generateSingleFood() {
    const rand = Math.random();
    const id = `food_${Date.now()}_${Math.random()}`;

    let type;
    if (rand < 0.8) {
        type = 'small';
    } else if (rand < 0.95) {
        type = 'medium';
    } else {
        type = 'large';
    }

    // TRULY RANDOM DISTRIBUTION - no distance checks between food items
    let x, y;
    let attempts = 0;
    const maxAttempts = 20; // Reduced attempts for faster generation
    const minDistanceFromWalls = 15; // Small buffer from walls only

    do {
        // Generate completely random position across the ENTIRE map
        x = Math.random() * (gameState.worldWidth - 30) + 15;
        y = Math.random() * (gameState.worldHeight - 30) + 15;
        attempts++;

        // No obstacle collision checks needed for open world
        break; // Always accept the position
    } while (false); // Exit immediately since no obstacles to avoid

    // Food properties based on type - BALANCED VALUES (MAX 4 POINTS)
    let size, value;
    switch (type) {
        case 'small':
            size = 3;
            value = 1; // Back to 1 point
            break;
        case 'medium':
            size = 6;
            value = 2; // Reduced to 2 points
            break;
        case 'large':
            size = 10;
            value = 4; // Reduced to 4 points max
            break;
    }

    const food = {
        id,
        x,
        y,
        size,
        value,
        type,
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
        pulsePhase: Math.random() * Math.PI * 2
    };

    gameState.foods.push(food);
    return food;
}



// Create food from dead player - SLITHER.IO STYLE
function createDeathFood(player) {
    const deathFoods = [];
    const segmentCount = player.segments.length;
    const deathPosition = player.segments[0];

    // Calculate food count based on player length (like slither.io)
    // Each segment beyond the initial 3 creates 1-2 food items
    const baseFoodCount = Math.max(3, segmentCount - 3); // At least 3, more for longer snakes
    const bonusFoodCount = Math.floor(player.score / 10); // Bonus food based on score
    const totalFoodCount = Math.min(baseFoodCount + bonusFoodCount, 25); // Cap at 25 food items

    console.log(`💀 SERVER: ${player.nickname} (${segmentCount} segments, ${player.score} score) dropping ${totalFoodCount} food items`);

    // Create food items in a line pattern like slither.io
    for (let i = 0; i < totalFoodCount; i++) {
        // Create food along the snake's body path for realistic distribution
        let foodX, foodY;

        if (i < player.segments.length) {
            // Place food near actual segment positions
            const segment = player.segments[i];
            const offsetAngle = Math.random() * Math.PI * 2;
            const offsetDistance = 15 + Math.random() * 25;
            foodX = segment.x + Math.cos(offsetAngle) * offsetDistance;
            foodY = segment.y + Math.sin(offsetAngle) * offsetDistance;
        } else {
            // For extra food beyond segment count, spread around death position
            const angle = (Math.PI * 2 * i) / totalFoodCount;
            const distance = 40 + Math.random() * 60;
            foodX = deathPosition.x + Math.cos(angle) * distance;
            foodY = deathPosition.y + Math.sin(angle) * distance;
        }

        // Determine food size and value based on position and randomness
        let size, value, type;
        const rand = Math.random();

        if (rand < 0.7) {
            // Most death food is small
            size = 6;
            value = 2;
            type = 'death_small';
        } else if (rand < 0.9) {
            // Some medium death food
            size = 8;
            value = 3;
            type = 'death_medium';
        } else {
            // Rare large death food
            size = 10;
            value = 4;
            type = 'death_large';
        }

        const food = {
            id: `death_food_${Date.now()}_${i}`,
            x: foodX,
            y: foodY,
            size: size,
            value: value,
            type: type,
            color: player.color || '#ff0080',
            pulsePhase: Math.random() * Math.PI * 2
        };

        // Keep food in bounds
        food.x = Math.max(20, Math.min(gameState.worldWidth - 20, food.x));
        food.y = Math.max(20, Math.min(gameState.worldHeight - 20, food.y));

        deathFoods.push(food);
        gameState.foods.push(food);
    }

    console.log(`💀 SERVER: ${player.nickname} dropped ${deathFoods.length} death food items at (${deathPosition.x.toFixed(1)}, ${deathPosition.y.toFixed(1)})`);

    return deathFoods;
}

// Check collision between two circles
function checkCollision(obj1, obj2, radius1, radius2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < radius1 + radius2;
}

// Check if position would collide with walls (SERVER-SIDE)
function wouldCollideWithWall(x, y, playerSize) {
    // Check world boundaries
    if (x < playerSize ||
        x > gameState.worldWidth - playerSize ||
        y < playerSize ||
        y > gameState.worldHeight - playerSize) {
        return true;
    }

    // No obstacles in open world - skip obstacle collision checks

    return false;
}

// Check if player collides with any other player
function checkPlayerCollisions(currentPlayer) {
    const head = currentPlayer.segments[0];
    
    for (const [playerId, player] of gameState.players) {
        if (playerId === currentPlayer.id) continue;
        
        // Check collision with other player's body segments
        for (let i = 0; i < player.segments.length; i++) {
            const segment = player.segments[i];
            if (checkCollision(head, segment, currentPlayer.size, player.size)) {
                return { collided: true, withPlayer: playerId };
            }
        }
    }
    
    // Check collision with own body (skip head and first segment)
    for (let i = 2; i < currentPlayer.segments.length; i++) {
        const segment = currentPlayer.segments[i];
        if (checkCollision(head, segment, currentPlayer.size, currentPlayer.size)) {
            return { collided: true, withPlayer: currentPlayer.id };
        }
    }
    
    return { collided: false };
}

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`🎮 Player connected: ${socket.id}`);
    
    // Send current player count
    io.emit('playerCount', gameState.players.size);
    
    socket.on('joinGame', (playerData) => {
        // Check if server is full
        if (gameState.players.size >= gameState.maxPlayers) {
            socket.emit('serverFull');
            return;
        }
        
        // Create new player with exactly 3 segments
        const startX = Math.random() * (gameState.worldWidth - 200) + 100;
        const startY = Math.random() * (gameState.worldHeight - 200) + 100;

        const player = {
            id: socket.id,
            nickname: playerData.nickname || 'ANONYMOUS',
            segments: [
                { x: startX, y: startY },           // Head
                { x: startX - 10, y: startY },      // Body segment 1
                { x: startX - 20, y: startY }       // Body segment 2
            ],
            // Enhanced movement system inspired by slither.io
            headPath: [], // Track head movement path for smooth body following
            targetX: startX + 100,
            targetY: startY,
            lastDirection: { x: 1, y: 0 }, // Track last movement direction for momentum
            lastMoveTime: Date.now(), // Track when player last sent movement
            speed: 7, // Balanced base speed for optimal gameplay feel
            baseSize: 8,
            size: 8, // Current size (grows with food)
            scale: 1.0, // Growth scale factor
            preferredDistance: 10, // Tighter distance for better cohesion
            queuedSegments: 0, // Segments waiting to be added
            color: neonColors[Math.floor(Math.random() * neonColors.length)],
            visualEffect: visualEffects[Math.floor(Math.random() * (visualEffects.length - 1)) + 1], // Skip 'normal' effect
            score: 0,
            boosting: false,
            boostCooldown: 0,
            boostDuration: 0,
            lastUpdate: Date.now(),
            isDead: false
        };

        // Initialize head path with starting positions - proper spacing for segments
        const pathSpacing = player.preferredDistance / 4; // Finer granularity for smoother following
        for (let i = 0; i < 100; i++) {
            player.headPath.push({ x: startX - i * pathSpacing, y: startY });
        }
        
        gameState.players.set(socket.id, player);
        
        // Send initial game state to new player
        socket.emit('gameJoined', {
            playerId: socket.id,
            player: player,
            worldWidth: gameState.worldWidth,
            worldHeight: gameState.worldHeight,
            obstacles: gameState.obstacles,
            foods: gameState.foods
        });

        // Also send separate food update for compatibility
        socket.emit('foodUpdate', gameState.foods);
        
        // Notify all players of new player
        socket.broadcast.emit('playerJoined', player);
        
        // Send existing players to new player
        const existingPlayers = Array.from(gameState.players.values()).filter(p => p.id !== socket.id);
        socket.emit('existingPlayers', existingPlayers);
        
        // Update player count
        io.emit('playerCount', gameState.players.size);
        
        console.log(`✅ Player ${playerData.nickname} joined the game! Total players: ${gameState.players.size}`);
    });
    
    socket.on('playerMove', (moveData) => {
        const player = gameState.players.get(socket.id);
        if (!player || player.isDead) return;

        // Rate limiting - prevent spam updates
        const now = Date.now();
        if (player.lastMoveUpdate && (now - player.lastMoveUpdate) < 50) {
            return; // Ignore updates that come too frequently (max 20 FPS)
        }
        player.lastMoveUpdate = now;

        // Validate move data
        if (typeof moveData.targetX !== 'number' || typeof moveData.targetY !== 'number') {
            console.log(`⚠️ SERVER: Invalid move data from ${player.nickname}:`, moveData);
            return;
        }

        // Validate target position is within reasonable bounds
        const head = player.segments[0];
        const dx = moveData.targetX - head.x;
        const dy = moveData.targetY - head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Prevent teleporting - limit maximum target distance
        if (distance > 1000) {
            console.log(`⚠️ SERVER: Target too far for ${player.nickname}: ${distance.toFixed(1)}px, limiting`);
            const limitedDistance = 1000;
            const normalizedDx = dx / distance;
            const normalizedDy = dy / distance;
            player.targetX = head.x + (normalizedDx * limitedDistance);
            player.targetY = head.y + (normalizedDy * limitedDistance);
        } else {
            // Update target position
            player.targetX = moveData.targetX;
            player.targetY = moveData.targetY;

            // Calculate and store movement direction for momentum
            const head = player.segments[0];
            const dx = player.targetX - head.x;
            const dy = player.targetY - head.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                player.lastDirection.x = dx / distance;
                player.lastDirection.y = dy / distance;
            }

            player.lastMoveTime = Date.now();
        }

        // Target bounds removed - free movement
        // player.targetX = Math.max(50, Math.min(gameState.worldWidth - 50, player.targetX));
        // player.targetY = Math.max(50, Math.min(gameState.worldHeight - 50, player.targetY));

        // Handle boost activation (server authority)
        if (moveData.boosting && !player.boosting && player.boostCooldown <= 0) {
            player.boosting = true;
            player.boostDuration = 1000; // 1 second boost duration
            console.log(`🚀 SERVER: ${player.nickname} activated boost`);
        }

        player.lastUpdate = Date.now();

        // Debug logging every 5 seconds for active players
        if (Date.now() % 5000 < 50) {
            const head = player.segments[0];
            const dx = player.targetX - head.x;
            const dy = player.targetY - head.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            console.log(`📍 SERVER: ${player.nickname} target:(${moveData.targetX.toFixed(1)}, ${moveData.targetY.toFixed(1)}) current:(${head.x.toFixed(1)}, ${head.y.toFixed(1)}) distance:${distance.toFixed(1)}`);
        }
    });

    socket.on('chatMessage', (messageData) => {
        const player = gameState.players.get(socket.id);
        if (!player) return;

        // Basic message validation
        if (!messageData.message || typeof messageData.message !== 'string') return;
        if (messageData.message.length > 100) return;
        if (messageData.message.trim().length === 0) return;

        // Simple profanity filter (basic)
        const cleanMessage = messageData.message
            .replace(/fuck|shit|damn|hell|ass/gi, '****')
            .trim();

        // Rate limiting (simple)
        const now = Date.now();
        if (!player.lastChatTime) player.lastChatTime = 0;
        if (now - player.lastChatTime < 1000) return; // 1 second cooldown
        player.lastChatTime = now;

        const chatMessage = {
            id: `msg_${now}_${Math.random()}`,
            nickname: player.nickname,
            message: cleanMessage,
            timestamp: now,
            color: player.color
        };

        // Broadcast to all players
        io.emit('chatMessage', chatMessage);

        console.log(`💬 ${player.nickname}: ${cleanMessage}`);
    });

    socket.on('requestRespawn', () => {
        const player = gameState.players.get(socket.id);
        if (!player) return;

        console.log(`🔄 SERVER: ${player.nickname} requested respawn`);
        respawnPlayer(player);
    });

    socket.on('disconnect', () => {
        const player = gameState.players.get(socket.id);
        if (player) {
            // Create death food
            createDeathFood(player);
            
            // Remove player
            gameState.players.delete(socket.id);
            
            // Notify other players
            socket.broadcast.emit('playerLeft', socket.id);
            
            // Update player count
            io.emit('playerCount', gameState.players.size);
            
            console.log(`👋 Player ${player.nickname} left the game! Total players: ${gameState.players.size}`);
        }
    });
});

// Initialize game
generateFood();
generateMap();
console.log(`🍎 SERVER: Generated ${gameState.foods.length} initial food items`);

// Game loop - Reasonable tick rate for web game
setInterval(() => {
    updateGameState();
    broadcastGameState();
}, 1000 / 30); // 30 TPS for good balance of smoothness and performance

function updateGameState() {
    // Update all players with error handling
    for (const [playerId, player] of gameState.players) {
        try {
            // Skip players that are missing essential data
            if (!player || !player.segments || player.segments.length === 0) {
                console.log(`⚠️ SERVER: Removing invalid player ${playerId}`);
                gameState.players.delete(playerId);
                continue;
            }

            updatePlayer(player);
        } catch (error) {
            console.log(`❌ SERVER: Error updating player ${playerId}:`, error.message);
            // Remove problematic player to prevent crashes
            gameState.players.delete(playerId);
        }
    }

    // Maintain food count with random distribution
    if (gameState.foods.length < 200) { // Maintain high food count for larger open world
        try {
            const newFood = generateSingleFood();
            // Log occasionally to avoid spam
            if (Math.random() < 0.01) { // 1% chance to log
                console.log(`🍎 SERVER: Generated ${newFood.type} food. Total: ${gameState.foods.length}`);
            }
        } catch (error) {
            console.log(`❌ SERVER: Error generating food:`, error.message);
        }
    }
}

function updatePlayer(player) {
    // Skip dead players
    if (player.isDead) return;

    const head = player.segments[0];

    // Update boost timers (server-side authority)
    const deltaTime = 16; // Approximate frame time (60 TPS)

    if (player.boosting && player.boostDuration > 0) {
        player.boostDuration -= deltaTime;
        if (player.boostDuration <= 0) {
            player.boosting = false;
            player.boostCooldown = 4000; // 4 second cooldown
            console.log(`🚀 SERVER: ${player.nickname} boost ended - cooldown started`);
        }
    }

    if (player.boostCooldown > 0) {
        player.boostCooldown -= deltaTime;
        if (player.boostCooldown <= 0) {
            player.boostCooldown = 0;
        }
    }

    // Check if player has been inactive (alt-tabbed) and use momentum
    const timeSinceLastMove = Date.now() - (player.lastMoveTime || 0);
    const isInactive = timeSinceLastMove > 300; // 300ms without updates = likely alt-tabbed

    let dx, dy, distance;

    if (isInactive && player.lastDirection) {
        // Use momentum - move directly using last direction instead of updating target
        const speed = player.boosting ? 12 : 7;
        dx = player.lastDirection.x * speed;
        dy = player.lastDirection.y * speed;
        distance = speed;

        // Don't update targetX/targetY - just move directly
        // This prevents the oscillation issue

        // Debug log for momentum movement
        if (Date.now() % 3000 < 50) {
            console.log(`🎮 SERVER: ${player.nickname} using momentum (inactive for ${timeSinceLastMove}ms) direction:(${player.lastDirection.x.toFixed(2)}, ${player.lastDirection.y.toFixed(2)})`);
        }
    } else {
        // Normal movement towards target
        if (!player.targetX || !player.targetY) {
            return; // No target set yet
        }

        // Calculate movement towards target
        dx = player.targetX - head.x;
        dy = player.targetY - head.y;
        distance = Math.sqrt(dx * dx + dy * dy);
    }

    // Only move if target is far enough away OR using momentum
    if (distance > 5 || isInactive) { // Balanced threshold or momentum movement
        let moveX, moveY;

        if (isInactive && player.lastDirection) {
            // Direct momentum movement - no need to normalize
            moveX = dx;
            moveY = dy;
        } else {
            // Normal movement towards target
            const speed = player.boosting ? 12 : 7; // Balanced speeds for optimal gameplay feel
            moveX = (dx / distance) * speed;
            moveY = (dy / distance) * speed;
        }

        // Calculate next position
        const nextX = head.x + moveX;
        const nextY = head.y + moveY;

        // Wall collision disabled - free movement across world
        // if (wouldCollideWithWall(nextX, nextY, player.size)) {
        //     console.log(`💥 SERVER: Wall collision detected for player ${player.nickname} at (${nextX}, ${nextY})`);
        //     handlePlayerDeath(player);
        //     return; // Stop processing movement
        // }

        // Check if next position would collide with other players (SERVER-SIDE) - LESS AGGRESSIVE
        const tempHead = { x: nextX, y: nextY };
        for (const [playerId, otherPlayer] of gameState.players) {
            if (playerId === player.id || otherPlayer.isDead) continue;

            // Check collision with other player's body segments - more lenient
            for (let i = 0; i < otherPlayer.segments.length; i++) {
                const segment = otherPlayer.segments[i];
                const collisionDistance = Math.sqrt((tempHead.x - segment.x) ** 2 + (tempHead.y - segment.y) ** 2);
                const requiredDistance = (player.size + otherPlayer.size) * 0.7; // 30% more lenient

                if (collisionDistance < requiredDistance) {
                    console.log(`💥 SERVER: Player collision! ${player.nickname} hit ${otherPlayer.nickname} - Distance: ${collisionDistance.toFixed(1)}, Required: ${requiredDistance.toFixed(1)}`);
                    handlePlayerDeath(player);
                    return; // Stop processing movement
                }
            }
        }

        // Check collision with own body (skip head and more segments for stability)
        for (let i = 5; i < player.segments.length; i++) { // Skip more segments to prevent false positives
            const segment = player.segments[i];
            const collisionDistance = Math.sqrt((tempHead.x - segment.x) ** 2 + (tempHead.y - segment.y) ** 2);
            const requiredDistance = player.size * 0.8; // More lenient self-collision

            if (collisionDistance < requiredDistance) {
                console.log(`💥 SERVER: Self collision! ${player.nickname} hit own body`);
                handlePlayerDeath(player);
                return;
            }
        }

        // Update head position and add to path
        head.x = nextX;
        head.y = nextY;

        // Add current head position to path - only if moved significantly
        const lastPathPoint = player.headPath[0];
        const pathDistance = Math.sqrt((head.x - lastPathPoint.x) ** 2 + (head.y - lastPathPoint.y) ** 2);

        // Add point to path if moved enough distance for smooth following
        if (pathDistance > 2) {
            player.headPath.unshift({ x: head.x, y: head.y });
        }

        // Keep path manageable size but long enough for all segments
        const maxPathLength = Math.max(300, player.segments.length * 20);
        if (player.headPath.length > maxPathLength) {
            player.headPath.pop();
        }

        // Update body segments using head path system for smoother movement
        updateSegmentsAlongPath(player);

        // World bounds removed - free movement
        // head.x = Math.max(player.size, Math.min(gameState.worldWidth - player.size, head.x));
        // head.y = Math.max(player.size, Math.min(gameState.worldHeight - player.size, head.y));
    }

    // Check food collisions
    checkFoodCollisions(player);

    // Queued segments system removed - segments are now added immediately with proper spacing
}

// Improved segment following system for tight body cohesion
function updateSegmentsAlongPath(player) {
    if (!player.headPath || player.headPath.length < 2) return;

    // Update each segment to follow the previous segment at proper distance
    for (let i = 1; i < player.segments.length; i++) {
        const segment = player.segments[i];
        const previousSegment = player.segments[i - 1];

        // Calculate desired distance between segments
        const desiredDistance = player.preferredDistance * player.scale;

        // Calculate current distance to previous segment
        const dx = previousSegment.x - segment.x;
        const dy = previousSegment.y - segment.y;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        // Only move if distance is significantly different from desired
        if (Math.abs(currentDistance - desiredDistance) > 1) {
            if (currentDistance > 0) {
                // Calculate target position at desired distance from previous segment
                const targetX = previousSegment.x - (dx / currentDistance) * desiredDistance;
                const targetY = previousSegment.y - (dy / currentDistance) * desiredDistance;

                // Smooth movement toward target position
                const moveSpeed = 0.8; // Higher speed for tighter following
                segment.x += (targetX - segment.x) * moveSpeed;
                segment.y += (targetY - segment.y) * moveSpeed;
            }
        }
    }
}

// Alternative path-based positioning for smoother curves (backup method)
function updateSegmentsAlongPathSmooth(player) {
    if (!player.headPath || player.headPath.length < 2) return;

    let accumulatedDistance = 0;
    const segmentDistance = player.preferredDistance * player.scale;

    // Update each segment to follow the head path at proper distances
    for (let i = 1; i < player.segments.length; i++) {
        const segment = player.segments[i];
        accumulatedDistance += segmentDistance;

        // Find position on path at accumulated distance
        const pathPosition = findPositionOnPath(player.headPath, accumulatedDistance);

        if (pathPosition) {
            // Smooth movement toward path position
            const dx = pathPosition.x - segment.x;
            const dy = pathPosition.y - segment.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 1) {
                const moveRatio = Math.min(0.7, distance / segmentDistance);
                segment.x += dx * moveRatio;
                segment.y += dy * moveRatio;
            }
        }
    }
}

// Find position on path at specific distance from head
function findPositionOnPath(headPath, targetDistance) {
    let totalDistance = 0;

    for (let i = 0; i < headPath.length - 1; i++) {
        const current = headPath[i];
        const next = headPath[i + 1];

        const segmentDistance = Math.sqrt(
            (next.x - current.x) ** 2 + (next.y - current.y) ** 2
        );

        if (totalDistance + segmentDistance >= targetDistance) {
            // Interpolate position within this segment
            const remainingDistance = targetDistance - totalDistance;
            const ratio = segmentDistance > 0 ? remainingDistance / segmentDistance : 0;

            return {
                x: current.x + (next.x - current.x) * ratio,
                y: current.y + (next.y - current.y) * ratio
            };
        }

        totalDistance += segmentDistance;
    }

    // Return last position if distance exceeds path length
    return headPath[headPath.length - 1];
}

function checkFoodCollisions(player) {
    const head = player.segments[0];

    for (let i = gameState.foods.length - 1; i >= 0; i--) {
        const food = gameState.foods[i];
        const distance = Math.sqrt((head.x - food.x) ** 2 + (head.y - food.y) ** 2);
        const collisionDistance = player.size + food.size;

        if (distance < collisionDistance) {
            // Player ate food
            console.log(`🍎 SERVER: ${player.nickname} ate ${food.type} food! Distance: ${distance.toFixed(1)}, Required: ${collisionDistance.toFixed(1)}`);
            eatFood(player, food, i);
        }
    }
}

function eatFood(player, food, index) {
    const oldLength = player.segments.length;

    // Remove food
    gameState.foods.splice(index, 1);

    // Enhanced growth system inspired by slither.io
    growPlayer(player, food.value);

    console.log(`🍎 SERVER: ${player.nickname} ate ${food.type} food (+${food.value} points). Length: ${player.segments.length}, Scale: ${player.scale.toFixed(2)}, Queued: ${player.queuedSegments}`);

    // Notify all players about food consumption
    io.emit('foodEaten', { foodId: food.id, playerId: player.id });
}

// Enhanced growth system with proper segment spacing
function growPlayer(player, foodValue) {
    // Add segments one by one to prevent overlap - FIXED SPACING
    for (let i = 0; i < foodValue; i++) {
        const tail = player.segments[player.segments.length - 1];
        const secondToLast = player.segments[player.segments.length - 2];

        // Calculate proper position for new segment
        let newX, newY;
        if (secondToLast) {
            // Position new segment behind the tail, maintaining proper distance
            const dx = tail.x - secondToLast.x;
            const dy = tail.y - secondToLast.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                // Normalize direction and place segment at proper distance
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                newX = tail.x + normalizedDx * player.preferredDistance;
                newY = tail.y + normalizedDy * player.preferredDistance;
            } else {
                // Fallback if segments are overlapping
                newX = tail.x - player.preferredDistance;
                newY = tail.y;
            }
        } else {
            // First additional segment - place behind tail
            newX = tail.x - player.preferredDistance;
            newY = tail.y;
        }

        // Add new segment with proper spacing
        player.segments.push({ x: newX, y: newY });
    }

    // Gradual size increase (like slither.io) - REDUCED GROWTH
    const growthFactor = 1 + (foodValue * 0.001); // Much smaller incremental growth
    player.scale = Math.min(player.scale * growthFactor, 1.8); // Lower cap at 1.8x scale

    // Update size and preferred distance based on scale
    player.size = player.baseSize * player.scale;
    player.preferredDistance = 10 * player.scale; // Maintain proper spacing

    // Speed slightly decreases as snake grows (balance)
    const baseSpeed = player.boosting ? 12 : 7; // Match current movement speeds
    player.speed = Math.max(baseSpeed * (1 - (player.scale - 1) * 0.15), baseSpeed * 0.6);

    // Update score
    player.score += foodValue;
}

function handlePlayerDeath(player) {
    console.log(`💀 SERVER: Player ${player.nickname} died!`);

    // Store death position for animation
    const deathPosition = { x: player.segments[0].x, y: player.segments[0].y };

    // Create death food
    const deathFoods = createDeathFood(player);

    // Mark player as dead (don't auto-respawn)
    player.isDead = true;
    player.deathTime = Date.now();

    console.log(`💀 SERVER: ${player.nickname} marked as dead - waiting for respawn request`);

    // Notify all players about death (no auto-respawn)
    io.emit('playerDied', {
        playerId: player.id,
        deathPosition: deathPosition,
        deathFoods: deathFoods,
        cause: 'wall collision'
    });
}

function respawnPlayer(player) {
    if (!player.isDead) {
        console.log(`⚠️ SERVER: ${player.nickname} tried to respawn but is not dead`);
        return;
    }

    // Reset player to exactly 3 segments
    const startX = Math.random() * (gameState.worldWidth - 200) + 100;
    const startY = Math.random() * (gameState.worldHeight - 200) + 100;

    player.segments = [
        { x: startX, y: startY },           // Head
        { x: startX - 10, y: startY },      // Body segment 1
        { x: startX - 20, y: startY }       // Body segment 2
    ];

    // Reset target position ahead of player
    player.targetX = startX + 100;
    player.targetY = startY;

    // Reset momentum system
    player.lastDirection = { x: 1, y: 0 };
    player.lastMoveTime = Date.now();

    // Reset all player state including growth system
    player.score = 0;
    player.isDead = false;
    player.boosting = false;
    player.boostCooldown = 0;
    player.boostDuration = 0;
    player.speed = 7; // Updated base speed for balanced movement system
    player.scale = 1.0; // Reset scale
    player.size = player.baseSize; // Reset to base size
    player.preferredDistance = 10; // Reset segment distance to tighter spacing
    player.queuedSegments = 0; // Clear queued segments

    // Reset head path with proper spacing
    player.headPath = [];
    const pathSpacing = player.preferredDistance / 4; // Consistent with initialization
    for (let i = 0; i < 100; i++) {
        player.headPath.push({ x: startX - i * pathSpacing, y: startY });
    }

    delete player.deathTime;

    console.log(`🔄 SERVER: ${player.nickname} respawned with ${player.segments.length} segments at (${startX.toFixed(1)}, ${startY.toFixed(1)})`);

    // Notify the player about successful respawn
    io.to(player.id).emit('playerRespawned', {
        newPosition: player.segments[0],
        segments: player.segments
    });
}

function broadcastGameState() {
    try {
        // Filter out invalid players before broadcasting
        const validPlayers = Array.from(gameState.players.values()).filter(player =>
            player && player.segments && player.segments.length > 0 && !player.isDead
        );

        io.emit('gameUpdate', {
            players: validPlayers,
            foods: gameState.foods || [],  // Send food to all clients
            obstacles: gameState.obstacles || [],  // Send obstacles to all clients
            timestamp: Date.now()
        });
    } catch (error) {
        console.log(`❌ SERVER: Error broadcasting game state:`, error.message);
    }
}

// Bot management removed - multiplayer only game

// Map generation functions (SERVER-SIDE) - DISABLED for open world gameplay
function generateMap() {
    gameState.obstacles = []; // Keep empty for open world
    // generateRooms();     // Disabled
    // generateMaze();      // Disabled
    // generateCentralArena(); // Disabled
    console.log(`🌍 SERVER: Open world map - no obstacles generated`);
}

function generateRooms() {
    // Corner rooms
    const rooms = [
        { x: 100, y: 100, width: 400, height: 300 },
        { x: gameState.worldWidth - 500, y: 100, width: 400, height: 300 },
        { x: 100, y: gameState.worldHeight - 400, width: 400, height: 300 },
        { x: gameState.worldWidth - 500, y: gameState.worldHeight - 400, width: 400, height: 300 },
        // Central side rooms
        { x: 50, y: gameState.worldHeight / 2 - 150, width: 200, height: 300 },
        { x: gameState.worldWidth - 250, y: gameState.worldHeight / 2 - 150, width: 200, height: 300 }
    ];

    rooms.forEach(room => {
        createWallWithOpenings(room.x, room.y, room.width, 20, 2, 80); // Top
        createWallWithOpenings(room.x, room.y + room.height - 20, room.width, 20, 2, 80); // Bottom
        createWallWithOpenings(room.x, room.y, 20, room.height, 1, 60); // Left
        createWallWithOpenings(room.x + room.width - 20, room.y, 20, room.height, 1, 60); // Right
    });
}

function createWallWithOpenings(x, y, width, height, numOpenings, openingSize) {
    if (width > height) {
        // Horizontal wall
        let currentX = x;
        for (let i = 0; i <= numOpenings; i++) {
            const segmentWidth = (width / (numOpenings + 1)) - (openingSize / (numOpenings + 1));
            if (segmentWidth > 20) {
                gameState.obstacles.push({
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
                gameState.obstacles.push({
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

function generateMaze() {
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
        gameState.obstacles.push({
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            color: '#ff00ff'
        });
    });
}

function generateCentralArena() {
    // Central circular arena
    const centerX = gameState.worldWidth / 2;
    const centerY = gameState.worldHeight / 2;
    const radius = 200;

    // Create circular wall segments
    for (let angle = 0; angle < Math.PI * 2; angle += 0.3) {
        const x = centerX + Math.cos(angle) * radius - 10;
        const y = centerY + Math.sin(angle) * radius - 10;

        // Skip some segments to create openings
        if (Math.random() > 0.3) {
            gameState.obstacles.push({
                x: x,
                y: y,
                width: 20,
                height: 20,
                color: '#00ffff'
            });
        }
    }
}

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 NOBIKO WARS Server running on port ${PORT}`);
    console.log(`🎮 Ready for up to ${gameState.maxPlayers} players!`);
    console.log(`🌍 World size: ${gameState.worldWidth}x${gameState.worldHeight}`);
    console.log(`🎯 MULTIPLAYER ONLY - No bots, real players only!`);
});
