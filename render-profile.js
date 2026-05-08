const { createCanvas } = require('canvas');
const fs = require('fs');

const W = 800, H = 800, cx = W/2, cy = H/2;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Clip to circle
ctx.beginPath();
ctx.arc(cx, cy, 400, 0, Math.PI*2);
ctx.clip();

// Background gradient
const bg = ctx.createRadialGradient(cx, cy-80, 50, cx, cy, 420);
bg.addColorStop(0, '#1a1a3e');
bg.addColorStop(0.6, '#0f0f1a');
bg.addColorStop(1, '#080812');
ctx.fillStyle = bg;
ctx.fillRect(0, 0, W, H);

// Subtle glow behind
const glow = ctx.createRadialGradient(cx, cy-40, 20, cx, cy, 300);
glow.addColorStop(0, 'rgba(139,92,246,0.15)');
glow.addColorStop(0.5, 'rgba(139,92,246,0.05)');
glow.addColorStop(1, 'rgba(139,92,246,0)');
ctx.fillStyle = glow;
ctx.fillRect(0, 0, W, H);

// Outer ring
ctx.beginPath();
ctx.arc(cx, cy, 340, 0, Math.PI*2);
ctx.strokeStyle = 'rgba(139,92,246,0.3)';
ctx.lineWidth = 2;
ctx.stroke();

// Inner ring
ctx.beginPath();
ctx.arc(cx, cy, 320, 0, Math.PI*2);
ctx.strokeStyle = 'rgba(139,92,246,0.12)';
ctx.lineWidth = 1;
ctx.stroke();

// Decorative dots around ring
for (let i = 0; i < 36; i++) {
  const angle = (i / 36) * Math.PI * 2 - Math.PI/2;
  const r = 340;
  const x = cx + Math.cos(angle) * r;
  const y = cy + Math.sin(angle) * r;
  ctx.beginPath();
  ctx.arc(x, y, i % 6 === 0 ? 4 : 2, 0, Math.PI*2);
  ctx.fillStyle = i % 6 === 0 ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.2)';
  ctx.fill();
}

// Top accent arc
ctx.beginPath();
ctx.arc(cx, cy, 340, -Math.PI*0.75, -Math.PI*0.25);
const arcGrad = ctx.createLinearGradient(cx-250, cy-250, cx+250, cy-250);
arcGrad.addColorStop(0, 'rgba(139,92,246,0)');
arcGrad.addColorStop(0.5, 'rgba(139,92,246,0.8)');
arcGrad.addColorStop(1, 'rgba(139,92,246,0)');
ctx.strokeStyle = arcGrad;
ctx.lineWidth = 4;
ctx.stroke();

// Shadow for depth
ctx.shadowColor = 'rgba(139,92,246,0.4)';
ctx.shadowBlur = 40;

// P letter (white)
ctx.font = '900 200px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
const pW = ctx.measureText('P').width;
const vW = ctx.measureText('V').width;
const totalW = pW + vW;

ctx.fillStyle = '#ffffff';
ctx.fillText('P', cx - totalW/2 + pW/2, cy + 10);

// V letter (purple accent)
ctx.fillStyle = '#8b5cf6';
ctx.fillText('V', cx + totalW/2 - vW/2, cy + 10);

// Reset shadow
ctx.shadowColor = 'transparent';
ctx.shadowBlur = 0;

// Tagline
ctx.font = '500 22px sans-serif';
ctx.fillStyle = 'rgba(209,213,219,0.7)';
ctx.fillText('POKÉVENDRE PRO', cx, cy + 110);

// Bottom line
ctx.beginPath();
ctx.moveTo(cx - 80, cy + 140);
ctx.lineTo(cx + 80, cy + 140);
const lineGrad = ctx.createLinearGradient(cx-80, 0, cx+80, 0);
lineGrad.addColorStop(0, 'rgba(139,92,246,0)');
lineGrad.addColorStop(0.5, 'rgba(139,92,246,0.5)');
lineGrad.addColorStop(1, 'rgba(139,92,246,0)');
ctx.strokeStyle = lineGrad;
ctx.lineWidth = 1;
ctx.stroke();

// Save
const buf = canvas.toBuffer('image/png');
fs.writeFileSync('/home/ubuntu/flipmaster-lp/pokevendre-profile.png', buf);
console.log('Saved! Size:', buf.length, 'bytes');