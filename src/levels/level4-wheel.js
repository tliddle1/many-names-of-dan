import { gsap } from 'gsap';
import { WHEEL_ROUNDS } from '../data/wheel-rounds.js';
import { run as narrator } from '../scenes/narrator.js';
import { play } from '../audio/sound-manager.js';

const WHEEL_RADIUS = 220;

export async function run(container) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position: relative; width: 100%; height: 100%;
    background: radial-gradient(ellipse at 50% 50%, #1a0a3e 0%, #0D0221 60%, #000 100%);
    overflow: hidden;
  `;

  // Twinkling stars background
  const starCanvas = document.createElement('canvas');
  starCanvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
  wrapper.appendChild(starCanvas);

  // Fixed content area — anchored from top, not centered
  const content = document.createElement('div');
  content.style.cssText = `
    position: absolute; inset: 0; z-index: 1;
    display: flex; flex-direction: column; align-items: center;
    justify-content: flex-start; padding-top: 5vh;
  `;

  // Middle row: key + wheel column
  const middleRow = document.createElement('div');
  middleRow.style.cssText = 'display:flex;align-items:center;gap:32px;';

  // Key/legend
  const keyEl = document.createElement('div');
  keyEl.style.cssText = 'width:220px;display:flex;flex-direction:column;gap:10px;';
  middleRow.appendChild(keyEl);

  // Wheel column (pointer + canvas)
  const wheelCol = document.createElement('div');
  wheelCol.style.cssText = 'display:flex;flex-direction:column;align-items:center;';

  const pointer = document.createElement('div');
  pointer.style.cssText = `
    position: relative; z-index: 2; margin-bottom: -12px;
    width: 0; height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 24px solid #FFD700;
    filter: drop-shadow(0 0 6px rgba(255,215,0,0.6));
  `;
  wheelCol.appendChild(pointer);

  const canvas = document.createElement('canvas');
  canvas.width = WHEEL_RADIUS * 2 + 40;
  canvas.height = WHEEL_RADIUS * 2 + 40;
  canvas.style.cssText = 'display:block;';
  wheelCol.appendChild(canvas);

  middleRow.appendChild(wheelCol);
  content.appendChild(middleRow);

  const spinBtn = document.createElement('button');
  spinBtn.textContent = 'SPIN';
  spinBtn.style.cssText = `
    font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700;
    padding: 14px 48px; cursor: pointer; letter-spacing: 0.2em;
    background: linear-gradient(135deg, #7C4DFF, #311B92);
    color: #fff; border: 2px solid #00E5FF; border-radius: 8px;
    text-shadow: 0 0 10px rgba(0,229,255,0.5);
    transition: transform 0.1s; margin-top: 16px;
  `;
  content.appendChild(spinBtn);

  // Result text area — fixed height so narrator typing doesn't shift anything above
  const resultArea = document.createElement('div');
  resultArea.style.cssText = 'max-width:500px;text-align:center;min-height:120px;margin-top:8px;';
  content.appendChild(resultArea);

  wrapper.appendChild(content);
  container.appendChild(wrapper);

  // Resize star canvas
  function resizeStars() {
    starCanvas.width = wrapper.clientWidth;
    starCanvas.height = wrapper.clientHeight;
    drawStars(starCanvas);
  }
  resizeStars();
  window.addEventListener('resize', resizeStars);

  const ctx = canvas.getContext('2d');
  let currentAngle = 0;

  for (let round = 0; round < WHEEL_ROUNDS.length; round++) {
    const config = WHEEL_ROUNDS[round];
    const segments = buildSegments(config);

    drawWheel(ctx, canvas.width / 2, canvas.height / 2, WHEEL_RADIUS, segments, 0);
    resultArea.innerHTML = '';
    spinBtn.style.display = '';

    // Build key/legend
    keyEl.innerHTML = '';
    for (const seg of segments) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:10px;';
      const swatch = document.createElement('div');
      swatch.style.cssText = `width:16px;height:16px;border-radius:3px;flex-shrink:0;background:${seg.color};border:1px solid rgba(255,255,255,0.2);`;
      row.appendChild(swatch);
      const label = document.createElement('span');
      label.style.cssText = 'font-family:"Crimson Text",serif;font-size:18px;color:#e0d6c8;';
      label.textContent = seg.label;
      row.appendChild(label);
      keyEl.appendChild(row);
    }

    // Wait for spin click
    await new Promise((resolve) => {
      spinBtn.onclick = () => {
        spinBtn.style.display = 'none';
        resolve();
      };
    });

    // Calculate target angle so the winning segment lands at top (pointer position)
    const winSeg = segments[config.winIndex];
    const winMidAngle = (winSeg.startAngle + winSeg.endAngle) / 2;
    // We want winMidAngle to be at -PI/2 (top) after rotation
    const targetOffset = -Math.PI / 2 - winMidAngle;
    const totalRotation = Math.PI * 10 + targetOffset; // 5 full spins + target

    // Animate spin
    const spinObj = { angle: 0 };
    play('wheelSpin');
    await gsap.to(spinObj, {
      angle: totalRotation,
      duration: 4.5,
      ease: 'power4.out',
      onUpdate() {
        currentAngle = spinObj.angle;
        drawWheel(ctx, canvas.width / 2, canvas.height / 2, WHEEL_RADIUS, segments, currentAngle);
      },
    });

    play('ding');

    // Show result
    const resultText = document.createElement('p');
    resultText.style.cssText = 'font-family:"Cinzel Decorative",serif;font-size:24px;color:#FFD700;text-shadow:0 0 20px rgba(255,215,0,0.5);margin-bottom:8px;';
    resultText.textContent = winSeg.label;
    resultArea.appendChild(resultText);

    // Narrator quip
    await narrator(resultArea, config.narrator, { className: 'embedded' });
  }

  window.removeEventListener('resize', resizeStars);
  container.removeChild(wrapper);
}

function buildSegments(config) {
  const totalWeight = config.segments.reduce((sum, s) => sum + s.weight, 0);
  let angle = 0;
  return config.segments.map((s) => {
    const sweep = (s.weight / totalWeight) * Math.PI * 2;
    const seg = {
      label: s.label,
      color: s.color,
      startAngle: angle,
      endAngle: angle + sweep,
    };
    angle += sweep;
    return seg;
  });
}

function drawWheel(ctx, cx, cy, r, segments, rotation) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  for (const seg of segments) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, seg.startAngle, seg.endAngle);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Center circle
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#1a0a3e';
  ctx.fill();
  ctx.strokeStyle = '#7C4DFF';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

function drawStars(canvas) {
  const ctx = canvas.getContext('2d');
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 2 + 0.5;
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.6 + 0.2})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}
