/**
 * Simple icon generator using Node.js and canvas (requires node-canvas package)
 * Alternative: Use create-icons.html in a browser
 */

// This is a placeholder - for actual icon generation, use create-icons.html
// Or install: npm install canvas
// Then uncomment the code below

/*
const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  
  // Draw shield
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(centerX, size * 0.1);
  ctx.quadraticCurveTo(size * 0.2, size * 0.1, size * 0.2, size * 0.3);
  ctx.lineTo(size * 0.2, size * 0.6);
  ctx.quadraticCurveTo(size * 0.2, size * 0.75, centerX, size * 0.85);
  ctx.quadraticCurveTo(size * 0.8, size * 0.75, size * 0.8, size * 0.6);
  ctx.lineTo(size * 0.8, size * 0.3);
  ctx.quadraticCurveTo(size * 0.8, size * 0.1, centerX, size * 0.1);
  ctx.closePath();
  ctx.fill();
  
  // Draw checkmark
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size * 0.08;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(centerX - radius * 0.3, centerY);
  ctx.lineTo(centerX - radius * 0.1, centerY + radius * 0.3);
  ctx.lineTo(centerX + radius * 0.3, centerY - radius * 0.2);
  ctx.stroke();
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`icons/${filename}`, buffer);
  console.log(`Generated ${filename}`);
}

// Generate all icons
generateIcon(16, 'icon16.png');
generateIcon(48, 'icon48.png');
generateIcon(128, 'icon128.png');
*/

console.log('To generate icons:');
console.log('1. Open create-icons.html in your browser');
console.log('2. Click each "Generate & Download" button');
console.log('3. Save the files to the icons/ folder');
console.log('');
console.log('Or install node-canvas and uncomment the code above.');
