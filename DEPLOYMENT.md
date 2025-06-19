# NOBIKO WARS - Deployment Guide

## 🚀 Multiplayer-Only Game
This game is **ENTIRELY MULTIPLAYER** with no single-player mode or bots. Real players only!

## 📋 Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
node server.js
```
The server will start on port 8080 by default.

### 3. Open the Game
Open `index.html` in a web browser or serve it via a web server.

## 🌐 Production Deployment

### Server Configuration
1. **Environment Variables:**
   - `PORT`: Server port (default: 8080)
   
2. **Update Client Connection:**
   In `js/main.js`, update the socket connection URL:
   ```javascript
   this.socket = io('https://your-domain.com');
   ```

### Hosting Options

#### Option 1: Heroku
1. Create a `Procfile`:
   ```
   web: node server.js
   ```
2. Deploy to Heroku
3. Update client connection URL to your Heroku app URL

#### Option 2: VPS/Cloud Server
1. Upload files to server
2. Install Node.js and dependencies
3. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "nobiko-wars"
   ```
4. Configure reverse proxy (nginx/Apache)
5. Set up SSL certificate

#### Option 3: Vercel/Netlify
1. Deploy static files (HTML/CSS/JS) to Vercel/Netlify
2. Deploy server separately (Railway, Render, etc.)
3. Update client connection URL

## 🎮 Game Features
- **Real-time multiplayer** (no bots)
- **Server-authoritative** gameplay
- **In-game chat** system
- **Custom character sprites** (cat theme)
- **Collision detection** and physics
- **Food collection** and growth mechanics
- **Death animations** with food dropping
- **Boost mechanics** (spacebar or click)

## 🔧 Configuration

### Server Settings (server.js)
- `maxPlayers`: Maximum concurrent players (default: 50)
- `worldWidth/worldHeight`: Game world dimensions
- `tickRate`: Server update frequency (60 TPS)

### Client Settings (js/main.js)
- Connection timeout: 3 seconds
- Update frequency: 60 FPS
- Chat message limit: 50 messages

## 🐛 Troubleshooting

### Common Issues
1. **"SERVER CONNECTION FAILED!"**
   - Ensure server is running on correct port
   - Check firewall settings
   - Verify client connection URL

2. **Players not seeing each other**
   - Check server logs for errors
   - Ensure all clients connect to same server
   - Verify network connectivity

3. **Game lag or stuttering**
   - Check server performance
   - Monitor network latency
   - Consider reducing tick rate for lower-end servers

## 📊 Monitoring
- Server logs show player connections/disconnections
- Player count displayed in real-time
- Chat system for player communication

## 🔒 Security Notes
- Input validation on nickname/chat
- Rate limiting recommended for production
- Consider implementing anti-cheat measures
- Use HTTPS in production

## 🎯 Performance Tips
- Use CDN for static assets
- Enable gzip compression
- Monitor server resources
- Consider horizontal scaling for high traffic

---

**Ready to launch your multiplayer worm battle arena!** 🐛⚔️
