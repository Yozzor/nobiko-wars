// Asset Loader for Nobiko Wars
// Handles loading and caching of PNG character assets

class AssetLoader {
    constructor() {
        this.assets = new Map();
        this.loadingPromises = new Map();
        this.loadedAssets = new Set();
        
        // Asset paths
        this.assetPaths = {
            cat: {
                head: 'assets/characters/cat/head.png',
                body: 'assets/characters/cat/body.png',
                tail: 'assets/characters/cat/tail.png'
            }
        };
        
        // Track loading state
        this.isLoading = false;
        this.loadingProgress = 0;
        this.totalAssets = 0;
    }
    
    // Load all character assets
    async loadAllAssets() {
        console.log('🎨 Loading character assets...');
        this.isLoading = true;
        this.loadingProgress = 0;
        
        const assetPromises = [];
        
        // Load cat assets
        for (const [partName, path] of Object.entries(this.assetPaths.cat)) {
            const assetKey = `cat_${partName}`;
            assetPromises.push(this.loadAsset(assetKey, path));
        }
        
        this.totalAssets = assetPromises.length;
        
        try {
            await Promise.all(assetPromises);
            console.log('✅ All character assets loaded successfully!');
            this.isLoading = false;
            return true;
        } catch (error) {
            console.warn('⚠️ Some assets failed to load, falling back to procedural generation:', error);
            this.isLoading = false;
            return false;
        }
    }
    
    // Load a single asset
    async loadAsset(key, path) {
        // Return existing promise if already loading
        if (this.loadingPromises.has(key)) {
            return this.loadingPromises.get(key);
        }
        
        // Return cached asset if already loaded
        if (this.assets.has(key)) {
            return this.assets.get(key);
        }
        
        const loadPromise = new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                console.log(`✅ Loaded asset: ${key}`);
                this.assets.set(key, img);
                this.loadedAssets.add(key);
                this.loadingProgress++;
                this.loadingPromises.delete(key);
                resolve(img);
            };
            
            img.onerror = () => {
                console.warn(`❌ Failed to load asset: ${key} from ${path}`);
                this.loadingPromises.delete(key);
                reject(new Error(`Failed to load ${path}`));
            };
            
            // Start loading
            img.src = path;
        });
        
        this.loadingPromises.set(key, loadPromise);
        return loadPromise;
    }
    
    // Get an asset by key
    getAsset(key) {
        return this.assets.get(key);
    }
    
    // Check if an asset is loaded
    hasAsset(key) {
        return this.assets.has(key);
    }
    
    // Check if cat assets are available
    hasCatAssets() {
        return this.hasAsset('cat_head') && 
               this.hasAsset('cat_body') && 
               this.hasAsset('cat_tail');
    }
    
    // Get cat assets
    getCatAssets() {
        if (!this.hasCatAssets()) {
            return null;
        }
        
        return {
            head: this.getAsset('cat_head'),
            body: this.getAsset('cat_body'),
            tail: this.getAsset('cat_tail')
        };
    }
    
    // Get loading progress (0-1)
    getLoadingProgress() {
        if (this.totalAssets === 0) return 1;
        return this.loadingProgress / this.totalAssets;
    }
    
    // Check if currently loading
    isCurrentlyLoading() {
        return this.isLoading;
    }
    
    // Preload assets (call this early in game initialization)
    async preloadAssets() {
        try {
            await this.loadAllAssets();
            return true;
        } catch (error) {
            console.warn('Asset preloading failed:', error);
            return false;
        }
    }
}

// Create global instance
window.assetLoader = new AssetLoader();

// Export for use in other modules
window.AssetLoader = AssetLoader;
