# Character Assets Guide

## 📁 Folder Structure

```
assets/
└── characters/
    └── cat/
        ├── head.png          ← Cat head (fixed size)
        ├── body.png          ← Cat body segment (repeatable)
        └── tail.png          ← Cat tail/back legs (fixed size)
```

## 🎨 PNG File Requirements

### ✅ **YES - PNG files are perfect!**
- **Format**: PNG with transparency (alpha channel)
- **Background**: Transparent
- **Quality**: High resolution for crisp scaling

### 📏 **Recommended Dimensions**
- **head.png**: 40x40 pixels (or 80x80 for high-res)
- **body.png**: 40x40 pixels (or 80x80 for high-res) 
- **tail.png**: 40x40 pixels (or 80x80 for high-res)

*Note: All parts should be the same dimensions for consistent scaling*

### 🎯 **Design Guidelines**

#### **head.png** (Fixed)
- Cat head with ears, eyes, nose
- Faces RIGHT (→) direction by default
- Will be rotated automatically based on movement direction
- Should connect seamlessly with body.png

#### **body.png** (Repeatable)
- Cat body segment/torso
- Must tile seamlessly when repeated
- Design should work when placed multiple times in a row
- Should connect smoothly with head and tail

#### **tail.png** (Fixed)  
- Cat tail and back legs
- Faces LEFT (←) direction by default
- Should connect seamlessly with body.png
- This is the "end piece" of the worm

### 🔄 **How the System Works**

```
[head.png] → [body.png] → [body.png] → [body.png] → [tail.png]
     ↑            ↑           ↑           ↑           ↑
   Fixed      Repeats as   Repeats as   Repeats as   Fixed
             cat grows    cat grows    cat grows
```

### 🎨 **Color Considerations**
- Design in **white/grayscale** if you want the game to apply player colors
- OR design in **full color** if you want fixed cat colors
- The system can handle both approaches

### 📝 **File Naming** (Important!)
- Use exactly these names: `head.png`, `body.png`, `tail.png`
- Lowercase, no spaces
- Place in: `assets/characters/cat/`

## 🚀 **After Adding Your Files**
1. Place your PNG files in the correct folder
2. The game will automatically detect and load them
3. Players will see your cat design instead of the current geometric shapes!

## 🎮 **Testing Your Assets**
- Start the game server
- Your cat sprites should appear immediately
- The body will grow longer as players eat food
- Head rotates to show movement direction
