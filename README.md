# 🎮 NOBIKO WARS
## 90s-Themed Multiplayer Worm Combat Game

A retro-styled slither.io clone with authentic CRT screen effects and neon aesthetics!

### 🚀 Quick Start

#### Option 1: Windows (Easy)
1. Double-click `start-server.bat`
2. Open your browser to `http://localhost:3000`
3. Enter your callsign and start playing!

#### Option 2: Manual Setup
1. Install Node.js from https://nodejs.org/
2. Open terminal/command prompt in the game directory
3. Run: `npm install`
4. Run: `npm start`
5. Open your browser to `http://localhost:3000`

### 🎯 Game Features

#### ✨ Visual Style
- **Authentic 90s CRT Effects**: Scanlines, phosphor glow, screen flicker
- **Neon Color Palette**: Multi-color glowing elements
- **Retro UI**: Terminal-style fonts and interface
- **Grid Background**: Classic computer grid pattern

#### 🕹️ Gameplay
- **Smooth Worm Movement**: Mouse-controlled with realistic physics
- **Growth System**: Eat glowing pixels to grow longer
- **Boost Mechanic**: Hold space/click to boost (costs segments)
- **Collision Detection**: Head-to-body contact causes death
- **Death Mechanics**: Dead players release food for others

#### 🌐 Multiplayer
- **Real-time Multiplayer**: Up to 50 players per server
- **Automatic Fallback**: Single-player mode if server unavailable
- **Live Player Count**: See how many players are online
- **Smooth Networking**: 20 TPS server updates with client prediction

#### 🍎 Food System
- **Small Pixels**: Common green dots (+1 segment)
- **Medium Pixels**: Larger colorful orbs (+3 segments)
- **Large Pixels**: Rare big spheres (+5 segments)
- **Death Food**: Released when players die (+4 segments)
- **Pulsing Effects**: All food glows and pulses

#### 🗺️ Map Design
- **Rooms**: Corner rooms with strategic openings
- **Maze Elements**: Scattered walls creating interesting paths
- **Central Arena**: Circular combat zone in the middle
- **World Boundaries**: 3000x2000 pixel game world

### 🎮 Controls
- **Mouse**: Move your worm
- **Space/Click**: Boost (hold for continuous boost)
- **Enter**: Start game from menu

### 🛠️ Technical Details

#### Server
- **Node.js + Express**: Web server
- **Socket.io**: Real-time WebSocket communication
- **20 TPS**: Server tick rate for smooth gameplay
- **Collision Detection**: Server-side collision system
- **Food Management**: Dynamic food spawning and cleanup

#### Client
- **HTML5 Canvas**: High-performance rendering
- **Client Prediction**: Smooth movement despite network latency
- **CRT Effects**: CSS-based retro visual effects
- **Responsive Design**: Works on desktop and mobile

### 📁 Project Structure
```
nobiko-wars/
├── index.html          # Main game page
├── server.js           # Multiplayer server
├── package.json        # Node.js dependencies
├── start-server.bat    # Windows startup script
├── styles/
│   └── main.css        # CRT effects and styling
└── js/
    ├── main.js         # Game logic and networking
    └── character-sprites.js # Character rendering system
```

### 🎨 Customization

#### Adding New Colors
Edit the `neonColors` array in `server.js` and `js/main.js`:
```javascript
const neonColors = [
    '#00ff00', // Neon Green
    '#ff00ff', // Neon Pink
    '#00ffff', // Neon Cyan
    // Add your colors here
];
```

#### Adjusting Game Settings
In `server.js`, modify:
- `maxPlayers`: Maximum concurrent players
- `worldWidth/worldHeight`: Game world size
- Food generation parameters

#### CRT Effects
Customize visual effects in `styles/main.css`:
- Scanline intensity
- Glow effects
- Screen curvature
- Color schemes

### 🐛 Troubleshooting

#### Server Won't Start
- Make sure Node.js is installed
- Check if port 3000 is available
- Run `npm install` to install dependencies

#### Can't Connect to Multiplayer
- Ensure server is running on localhost:3000
- Game automatically falls back to single-player mode
- Check browser console for error messages

#### Performance Issues
- Close other browser tabs
- Reduce browser zoom level
- Check if hardware acceleration is enabled

### 🎯 Future Features
- Global chat system
- Player rankings/leaderboards
- Power-ups and special abilities
- Multiple game modes
- Mobile app version

### 📜 License
MIT License - Feel free to modify and distribute!

---

**TOTALLY RADICAL WORM ACTION!** 🐍✨

*Built with love for the 90s aesthetic and classic .io game mechanics*
