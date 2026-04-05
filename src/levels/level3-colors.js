import { createGameLoop } from '../engine/game-loop.js';
import { drawStar, drawDiamond, drawCircle } from '../graphics/shapes.js';
import { play } from '../audio/sound-manager.js';

const TARGET_SCORE = 25;
const INITIAL_INTERVAL = 1.8;
const MIN_INTERVAL = 0.7;
const EXPIRE_TIME = 3.0;

const GOLD_SHAPES = [
  { type: 'star', label: 'Gold Star' },
  { type: 'diamond', label: 'Trophy' },
  { type: 'circle', label: 'Gold Coin' },
];

const CRIMSON_SHAPES = [
  { type: 'star', label: 'Write-Up' },
  { type: 'diamond', label: 'DENIED' },
  { type: 'circle', label: 'Violation' },
];

export async function run(container) {
  return new Promise((resolve) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: relative; width: 100%; height: 100%;
      background: linear-gradient(180deg, #1A0A00 0%, #2a1000 50%, #1A0A00 100%);
    `;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    wrapper.appendChild(canvas);

    // HUD overlay
    const hud = document.createElement('div');
    hud.style.cssText = `
      position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
      font-family: 'Cinzel', serif; font-size: 20px; color: #FFD700;
      text-shadow: 0 0 10px rgba(255,215,0,0.5);
    `;
    wrapper.appendChild(hud);

    // Instructions hint (persistent, bottom of screen)
    const instructions = document.createElement('div');
    instructions.style.cssText = `
      position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
      font-family: 'Crimson Text', serif; font-size: 18px; color: #888; text-align: center;
    `;
    instructions.textContent = '↑  Gold    ↓  Crimson';
    wrapper.appendChild(instructions);

    // Full intro overlay
    const introOverlay = document.createElement('div');
    introOverlay.style.cssText = `
      position: absolute; inset: 0; z-index: 10;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.85); gap: 24px; padding: 40px;
    `;
    const introTitle = document.createElement('div');
    introTitle.style.cssText = `
      font-family: 'Cinzel', serif; font-size: 28px; color: #FFD700;
      text-shadow: 0 0 12px rgba(255,215,0,0.4);
    `;
    introTitle.textContent = 'Sort the Shapes';
    introOverlay.appendChild(introTitle);

    const introBody = document.createElement('div');
    introBody.style.cssText = `
      font-family: 'Crimson Text', serif; font-size: 22px; color: #ccc;
      text-align: center; line-height: 1.8; max-width: 460px;
    `;
    introBody.innerHTML = `
      <span style="color:#FFD700">Gold</span> shapes are rewards — press <b>↑ Up</b><br>
      <span style="color:#D32F2F">Crimson</span> shapes are punishments — press <b>↓ Down</b><br><br>
      Sort <b>${TARGET_SCORE}</b> correctly to prove your mastery.
    `;
    introOverlay.appendChild(introBody);

    const introBtn = document.createElement('button');
    introBtn.textContent = 'BEGIN';
    introBtn.style.cssText = `
      font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700;
      padding: 14px 40px; cursor: pointer; letter-spacing: 0.15em;
      background: #FFD700; color: #000; border: none; border-radius: 4px;
      transition: transform 0.1s; margin-top: 12px;
    `;
    introBtn.onmouseenter = () => { introBtn.style.transform = 'scale(1.05)'; };
    introBtn.onmouseleave = () => { introBtn.style.transform = 'scale(1)'; };
    introOverlay.appendChild(introBtn);
    wrapper.appendChild(introOverlay);

    // Narrator tut
    const tutText = document.createElement('div');
    tutText.style.cssText = `
      position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%);
      font-family: 'Cinzel', serif; font-size: 16px; color: #c8b070;
      font-style: italic; opacity: 0; transition: opacity 0.3s;
      text-align: center; max-width: 400px;
    `;
    wrapper.appendChild(tutText);

    container.appendChild(wrapper);

    function resize() {
      canvas.width = wrapper.clientWidth;
      canvas.height = wrapper.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');
    let score = 0;
    let objectCount = 0;
    let currentObject = null;
    let objectTimer = 0;
    let spawnTimer = 0;
    let flyingObjects = [];
    let tutTimeout = null;

    function spawnObject() {
      const isGold = Math.random() > 0.5;
      const shapes = isGold ? GOLD_SHAPES : CRIMSON_SHAPES;
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      currentObject = {
        isGold,
        shape: shape.type,
        label: shape.label,
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 24,
        age: 0,
        pulse: 0,
      };
      objectTimer = 0;
    }

    function sortObject(direction) {
      if (!currentObject) return;
      const correct = (direction === 'up' && currentObject.isGold) ||
                      (direction === 'down' && !currentObject.isGold);

      if (correct) {
        play('ding');
        score++;
        flyingObjects.push({
          ...currentObject,
          vy: direction === 'up' ? -600 : 600,
          life: 1,
        });
      } else {
        play('buzz');
        showTut();
      }

      currentObject = null;
      objectCount++;
    }

    function expireObject() {
      play('buzz');
      showTut();
      currentObject = null;
      objectCount++;
    }

    function showTut() {
      tutText.textContent = '"Gold and crimson are not to be confused. Dan would never make such an error."';
      tutText.style.opacity = '1';
      if (tutTimeout) clearTimeout(tutTimeout);
      tutTimeout = setTimeout(() => { tutText.style.opacity = '0'; }, 2000);
    }

    function getInterval() {
      const speedups = Math.floor(objectCount / 10);
      return Math.max(MIN_INTERVAL, INITIAL_INTERVAL - speedups * 0.2);
    }

    function onKeyDown(e) {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { e.preventDefault(); sortObject('up'); }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); sortObject('down'); }
    }
    const loop = createGameLoop((dt) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw banner decorations
      drawBanners(ctx, canvas.width, canvas.height);

      // Spawn logic
      if (!currentObject && score < TARGET_SCORE) {
        spawnTimer += dt;
        if (spawnTimer >= 0.4) {
          spawnObject();
          spawnTimer = 0;
        }
      }

      // Current object
      if (currentObject) {
        objectTimer += dt;
        currentObject.pulse += dt * 4;
        const pulseSize = currentObject.size + Math.sin(currentObject.pulse) * 3;
        const color = currentObject.isGold ? '#FFD700' : '#D32F2F';

        // Expire warning — flash when close to expiring
        const expireRatio = objectTimer / EXPIRE_TIME;
        if (expireRatio > 0.7) {
          ctx.globalAlpha = 0.5 + Math.sin(objectTimer * 12) * 0.5;
        }

        drawShapeAt(ctx, currentObject.shape, currentObject.x, currentObject.y, pulseSize, color);
        ctx.globalAlpha = 1;

        // Label
        ctx.fillStyle = color;
        ctx.font = '14px "Crimson Text", serif';
        ctx.textAlign = 'center';
        ctx.fillText(currentObject.label, currentObject.x, currentObject.y + pulseSize + 20);

        if (objectTimer >= EXPIRE_TIME) {
          expireObject();
        }
      }

      // Flying objects (sorted ones)
      for (let i = flyingObjects.length - 1; i >= 0; i--) {
        const fo = flyingObjects[i];
        fo.y += fo.vy * dt;
        fo.life -= dt * 1.5;
        ctx.globalAlpha = Math.max(0, fo.life);
        const color = fo.isGold ? '#FFD700' : '#D32F2F';
        drawShapeAt(ctx, fo.shape, fo.x, fo.y, fo.size, color);
        ctx.globalAlpha = 1;
        if (fo.life <= 0) flyingObjects.splice(i, 1);
      }

      // HUD
      hud.textContent = `${score} / ${TARGET_SCORE}`;

      // Win condition — wait for last flying animation to finish
      if (score >= TARGET_SCORE && !currentObject) {
        document.removeEventListener('keydown', onKeyDown);
        if (flyingObjects.length === 0) {
          loop.stop();
          window.removeEventListener('resize', resize);
          if (tutTimeout) clearTimeout(tutTimeout);
          container.removeChild(wrapper);
          resolve();
        }
      }
    });

    introBtn.onclick = () => {
      wrapper.removeChild(introOverlay);
      document.addEventListener('keydown', onKeyDown);
      loop.start();
    };
  });
}

function drawShapeAt(ctx, type, x, y, size, color) {
  if (type === 'star') drawStar(ctx, x, y, size, size * 0.45, 5, color);
  else if (type === 'diamond') drawDiamond(ctx, x, y, size * 1.4, size * 1.8, color);
  else drawCircle(ctx, x, y, size, color);
}

function drawBanners(ctx, w, h) {
  // Gold banners on left
  ctx.fillStyle = 'rgba(255,215,0,0.08)';
  ctx.fillRect(0, 0, 40, h);
  ctx.fillRect(60, 0, 20, h);

  // Crimson banners on right
  ctx.fillStyle = 'rgba(211,47,47,0.08)';
  ctx.fillRect(w - 40, 0, 40, h);
  ctx.fillRect(w - 80, 0, 20, h);
}
