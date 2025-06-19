// Character Sprite System for Nobiko Wars
// Modular character generation with mix-and-match parts

class CharacterSpriteSystem {
    constructor() {
        this.neonColors = [
            '#00ff00', // Neon Green
            '#ff00ff', // Neon Pink
            '#00ffff', // Neon Cyan
            '#ffff00', // Neon Yellow
            '#8000ff', // Neon Purple
            '#ff8000', // Neon Orange
            '#ff0080', // Hot Pink
            '#80ff00', // Lime Green
        ];

        this.headTypes = ['round', 'angular', 'pointed', 'wide', 'cat'];
        this.bodyPatterns = ['solid', 'striped', 'dotted', 'gradient', 'cat'];
        this.tailTypes = ['pointed', 'rounded', 'forked', 'stubby', 'cat'];

        this.segmentSize = 20; // Base size for worm segments
        this.assetLoader = window.assetLoader; // Reference to global asset loader
    }
    
    // Generate a random character configuration
    generateRandomCharacter() {
        // Prefer cat assets if available, otherwise use procedural
        const useCatAssets = this.assetLoader && this.assetLoader.hasCatAssets();

        if (useCatAssets) {
            return {
                id: this.generateId(),
                headType: 'cat',
                bodyPattern: 'cat',
                tailType: 'cat',
                primaryColor: this.getRandomElement(this.neonColors),
                secondaryColor: this.getRandomElement(this.neonColors),
                size: this.segmentSize,
                usePngAssets: true
            };
        } else {
            return {
                id: this.generateId(),
                headType: this.getRandomElement(this.headTypes.filter(t => t !== 'cat')),
                bodyPattern: this.getRandomElement(this.bodyPatterns.filter(p => p !== 'cat')),
                tailType: this.getRandomElement(this.tailTypes.filter(t => t !== 'cat')),
                primaryColor: this.getRandomElement(this.neonColors),
                secondaryColor: this.getRandomElement(this.neonColors),
                size: this.segmentSize,
                usePngAssets: false
            };
        }
    }
    
    // Draw character head
    drawHead(ctx, x, y, character, direction = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(direction);

        const size = character.size;
        const primaryColor = character.primaryColor;
        const secondaryColor = character.secondaryColor;

        // Check if using PNG assets
        if (character.usePngAssets && character.headType === 'cat') {
            this.drawCatHead(ctx, size, primaryColor);
        } else {
            // Add glow effect for procedural graphics
            ctx.shadowColor = primaryColor;
            ctx.shadowBlur = 15;

            switch (character.headType) {
                case 'round':
                    this.drawRoundHead(ctx, size, primaryColor, secondaryColor);
                    break;
                case 'angular':
                    this.drawAngularHead(ctx, size, primaryColor, secondaryColor);
                    break;
                case 'pointed':
                    this.drawPointedHead(ctx, size, primaryColor, secondaryColor);
                    break;
                case 'wide':
                    this.drawWideHead(ctx, size, primaryColor, secondaryColor);
                    break;
            }
        }

        ctx.restore();
    }
    
    // Draw character body segment
    drawBodySegment(ctx, x, y, character, segmentIndex = 0) {
        ctx.save();
        ctx.translate(x, y);

        const size = character.size * 0.9; // Slightly smaller than head
        const primaryColor = character.primaryColor;
        const secondaryColor = character.secondaryColor;

        // Check if using PNG assets
        if (character.usePngAssets && character.bodyPattern === 'cat') {
            this.drawCatBody(ctx, size, primaryColor);
        } else {
            // Add glow effect for procedural graphics
            ctx.shadowColor = primaryColor;
            ctx.shadowBlur = 10;

            switch (character.bodyPattern) {
                case 'solid':
                    this.drawSolidSegment(ctx, size, primaryColor);
                    break;
                case 'striped':
                    this.drawStripedSegment(ctx, size, primaryColor, secondaryColor, segmentIndex);
                    break;
                case 'dotted':
                    this.drawDottedSegment(ctx, size, primaryColor, secondaryColor);
                    break;
                case 'gradient':
                    this.drawGradientSegment(ctx, size, primaryColor, secondaryColor);
                    break;
            }
        }

        ctx.restore();
    }
    
    // Draw character tail
    drawTail(ctx, x, y, character, direction = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(direction);

        const size = character.size * 0.7; // Smaller than body
        const primaryColor = character.primaryColor;
        const secondaryColor = character.secondaryColor;

        // Check if using PNG assets
        if (character.usePngAssets && character.tailType === 'cat') {
            this.drawCatTail(ctx, size, primaryColor);
        } else {
            // Add glow effect for procedural graphics
            ctx.shadowColor = primaryColor;
            ctx.shadowBlur = 8;

            switch (character.tailType) {
                case 'pointed':
                    this.drawPointedTail(ctx, size, primaryColor);
                    break;
                case 'rounded':
                    this.drawRoundedTail(ctx, size, primaryColor);
                    break;
                case 'forked':
                    this.drawForkedTail(ctx, size, primaryColor, secondaryColor);
                    break;
                case 'stubby':
                    this.drawStubbyTail(ctx, size, primaryColor);
                    break;
            }
        }

        ctx.restore();
    }
    
    // Head drawing methods
    drawRoundHead(ctx, size, primary, secondary) {
        // Main head circle
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.arc(-size/4, -size/6, size/8, 0, Math.PI * 2);
        ctx.arc(size/4, -size/6, size/8, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth
        ctx.strokeStyle = secondary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, size/6, size/4, 0, Math.PI);
        ctx.stroke();
    }
    
    drawAngularHead(ctx, size, primary, secondary) {
        // Angular head shape
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(size/2, 0);
        ctx.lineTo(0, size/2);
        ctx.lineTo(-size/2, 0);
        ctx.closePath();
        ctx.fill();
        
        // Angular eyes
        ctx.fillStyle = secondary;
        ctx.fillRect(-size/3, -size/4, size/6, size/6);
        ctx.fillRect(size/6, -size/4, size/6, size/6);
    }
    
    drawPointedHead(ctx, size, primary, secondary) {
        // Pointed head
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.moveTo(size/2, 0);
        ctx.lineTo(-size/4, -size/3);
        ctx.lineTo(-size/2, 0);
        ctx.lineTo(-size/4, size/3);
        ctx.closePath();
        ctx.fill();
        
        // Sharp eyes
        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.moveTo(-size/6, -size/8);
        ctx.lineTo(0, -size/4);
        ctx.lineTo(size/6, -size/8);
        ctx.fill();
    }
    
    drawWideHead(ctx, size, primary, secondary) {
        // Wide oval head
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.ellipse(0, 0, size/2 * 1.3, size/2 * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Wide-set eyes
        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.arc(-size/3, -size/8, size/10, 0, Math.PI * 2);
        ctx.arc(size/3, -size/8, size/10, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Body segment drawing methods
    drawSolidSegment(ctx, size, primary) {
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawStripedSegment(ctx, size, primary, secondary, index) {
        // Alternating colors based on segment index
        const color = index % 2 === 0 ? primary : secondary;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add stripe lines
        ctx.strokeStyle = index % 2 === 0 ? secondary : primary;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-size/2, 0);
        ctx.lineTo(size/2, 0);
        ctx.stroke();
    }
    
    drawDottedSegment(ctx, size, primary, secondary) {
        // Main segment
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Dots
        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.arc(-size/4, 0, size/12, 0, Math.PI * 2);
        ctx.arc(size/4, 0, size/12, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawGradientSegment(ctx, size, primary, secondary) {
        // Create gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
        gradient.addColorStop(0, secondary);
        gradient.addColorStop(1, primary);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Tail drawing methods
    drawPointedTail(ctx, size, primary) {
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.moveTo(size/2, 0);
        ctx.lineTo(-size/2, -size/4);
        ctx.lineTo(-size/2, size/4);
        ctx.closePath();
        ctx.fill();
    }
    
    drawRoundedTail(ctx, size, primary) {
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawForkedTail(ctx, size, primary, secondary) {
        // Main tail
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.arc(0, 0, size/3, 0, Math.PI * 2);
        ctx.fill();
        
        // Fork prongs
        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.arc(-size/4, -size/3, size/6, 0, Math.PI * 2);
        ctx.arc(-size/4, size/3, size/6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawStubbyTail(ctx, size, primary) {
        ctx.fillStyle = primary;
        ctx.fillRect(-size/4, -size/4, size/2, size/2);
    }
    
    // Utility methods
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    generateId() {
        return 'char_' + Math.random().toString(36).substr(2, 9);
    }
    
    // PNG Asset Drawing Methods
    drawCatHead(ctx, size, primaryColor) {
        if (!this.assetLoader || !this.assetLoader.hasAsset('cat_head')) {
            // Fallback to procedural if asset not available
            this.drawRoundHead(ctx, size, primaryColor, '#ffffff');
            return;
        }

        const headAsset = this.assetLoader.getAsset('cat_head');

        // Apply color tinting if needed
        if (primaryColor !== '#ffffff') {
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = primaryColor;
            ctx.fillRect(-size/2, -size/2, size, size);
            ctx.globalCompositeOperation = 'destination-atop';
        }

        // Draw the PNG asset
        ctx.drawImage(headAsset, -size/2, -size/2, size, size);

        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
    }

    drawCatBody(ctx, size, primaryColor) {
        if (!this.assetLoader || !this.assetLoader.hasAsset('cat_body')) {
            // Fallback to procedural if asset not available
            this.drawSolidSegment(ctx, size, primaryColor);
            return;
        }

        const bodyAsset = this.assetLoader.getAsset('cat_body');

        // Apply color tinting if needed
        if (primaryColor !== '#ffffff') {
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = primaryColor;
            ctx.fillRect(-size/2, -size/2, size, size);
            ctx.globalCompositeOperation = 'destination-atop';
        }

        // Draw the PNG asset
        ctx.drawImage(bodyAsset, -size/2, -size/2, size, size);

        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
    }

    drawCatTail(ctx, size, primaryColor) {
        if (!this.assetLoader || !this.assetLoader.hasAsset('cat_tail')) {
            // Fallback to procedural if asset not available
            this.drawRoundedTail(ctx, size, primaryColor);
            return;
        }

        const tailAsset = this.assetLoader.getAsset('cat_tail');

        // Apply color tinting if needed
        if (primaryColor !== '#ffffff') {
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = primaryColor;
            ctx.fillRect(-size/2, -size/2, size, size);
            ctx.globalCompositeOperation = 'destination-atop';
        }

        // Draw the PNG asset
        ctx.drawImage(tailAsset, -size/2, -size/2, size, size);

        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
    }

    // Create a preview of the character (for UI)
    createCharacterPreview(character, canvas, size = 60) {
        const ctx = canvas.getContext('2d');
        canvas.width = size * 3;
        canvas.height = size;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw a simple 3-segment preview
        this.drawTail(ctx, size/2, size/2, character);
        this.drawBodySegment(ctx, size, size/2, character, 0);
        this.drawHead(ctx, size * 1.5, size/2, character);
    }
}

// Export for use in other modules
window.CharacterSpriteSystem = CharacterSpriteSystem;
