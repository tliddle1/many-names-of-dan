import { createGameLoop } from '../engine/game-loop.js';
import { MAZE, MALICIOUSNESS_QUOTES } from '../data/maze-layout.js';
import { play } from '../audio/sound-manager.js';

// Pre-render Dan's head as an Image for use on canvas
function createDanHeadImage(size) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.4;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#e8beac"/>
    <path d="
      M${cx - r * 0.875},${cy - r * 0.375}
      Q${cx - r * 0.75},${cy - r * 1.125} ${cx - r * 0.25},${cy - r * 1.25}
      L${cx - r * 0.125},${cy - r * 1.5}
      L${cx + r * 0.0625},${cy - r * 1.25}
      L${cx + r * 0.25},${cy - r * 1.5625}
      L${cx + r * 0.5},${cy - r * 1.1875}
      Q${cx + r * 0.875},${cy - r * 1.125} ${cx + r * 0.875},${cy - r * 0.375}
      Q${cx + r * 0.625},${cy - r * 0.5625} ${cx},${cy - r * 0.5}
      Q${cx - r * 0.625},${cy - r * 0.5625} ${cx - r * 0.875},${cy - r * 0.375}
      Z
    " fill="#b8a04c"/>
    <circle cx="${cx - r * 0.3125}" cy="${cy - r * 0.125}" r="${r * 0.125}" fill="#2c3e50"/>
    <circle cx="${cx + r * 0.3125}" cy="${cy - r * 0.125}" r="${r * 0.125}" fill="#2c3e50"/>
    <path d="M${cx - r * 0.25},${cy + r * 0.3125} Q${cx},${cy + r * 0.5625} ${cx + r * 0.25},${cy + r * 0.3125}" fill="none" stroke="#2c3e50" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  return img;
}

const CELL = 32;
const MOVE_SPEED = 3;
const POWER_DURATION = 5;
const ENEMY_SPEED = 1.5;
const ENEMY_COUNT = 3;

export async function run(container) {
  return new Promise((resolve) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: relative; width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      background: #263238;
    `;

    const canvas = document.createElement('canvas');
    const rows = MAZE.length;
    const cols = MAZE[0].length;
    canvas.width = cols * CELL;
    canvas.height = rows * CELL;
    canvas.style.cssText = 'image-rendering: pixelated;max-width:90vw;max-height:80vh;';
    wrapper.appendChild(canvas);

    // HUD
    const hud = document.createElement('div');
    hud.style.cssText = `
      position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
      display: flex; gap: 20px; align-items: center; z-index: 2;
    `;
    const meterLabel = document.createElement('span');
    meterLabel.style.cssText = 'font-family:"Cinzel",serif;font-size:14px;color:#78909C;';
    meterLabel.textContent = 'MALICIOUSNESS';
    hud.appendChild(meterLabel);
    const meterOuter = document.createElement('div');
    meterOuter.style.cssText = 'width:200px;height:14px;background:rgba(0,0,0,0.4);border:1px solid #455A64;border-radius:7px;overflow:hidden;position:relative;';
    const meterFill = document.createElement('div');
    meterFill.style.cssText = 'width:0%;height:100%;background:linear-gradient(to right,#4CAF50,#FF5722,#D32F2F);transition:width 0.3s;border-radius:7px;';
    meterOuter.appendChild(meterFill);
    // 50% threshold marker
    const threshold = document.createElement('div');
    threshold.style.cssText = 'position:absolute;left:50%;top:-2px;bottom:-2px;width:2px;background:#FFD700;z-index:1;';
    meterOuter.appendChild(threshold);
    hud.appendChild(meterOuter);
    const powerLabel = document.createElement('span');
    powerLabel.style.cssText = 'font-family:"Cinzel",serif;font-size:12px;color:#FFD700;opacity:0.6;';
    powerLabel.textContent = '⚡ 50%';
    hud.appendChild(powerLabel);
    wrapper.appendChild(hud);

    // Flash text
    const flashText = document.createElement('div');
    flashText.style.cssText = `
      position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
      font-family: 'Crimson Text', serif; font-size: 24px; color: #D32F2F;
      font-style: italic; opacity: 0; transition: opacity 0.3s;
      text-align: center; max-width: 400px; z-index: 2;
    `;
    wrapper.appendChild(flashText);

    // Intro overlay
    const introOverlay = document.createElement('div');
    introOverlay.style.cssText = `
      position: absolute; inset: 0; z-index: 10;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.85); gap: 24px; padding: 40px;
    `;
    const introTitle = document.createElement('div');
    introTitle.style.cssText = `
      font-family: 'Cinzel', serif; font-size: 28px; color: #D32F2F;
      text-shadow: 0 0 12px rgba(211,47,47,0.4);
    `;
    introTitle.textContent = 'Devour the Maliciousness';
    introOverlay.appendChild(introTitle);

    const introBody = document.createElement('div');
    introBody.style.cssText = `
      font-family: 'Crimson Text', serif; font-size: 22px; color: #ccc;
      text-align: center; line-height: 1.8; max-width: 460px;
    `;
    introBody.innerHTML = `
      Collect the <span style="color:#D32F2F">red orbs</span> to devour the maliciousness.<br>
      Avoid the <span style="color:#FF8A65">ghosts</span> — they will send you back to the start.<br><br>
      At <b style="color:#FFD700">50%</b>, you gain the power to consume ghosts.<br><br>
      Use <b>Arrow Keys</b> to move.
    `;
    introOverlay.appendChild(introBody);

    const introBtn = document.createElement('button');
    introBtn.textContent = 'BEGIN';
    introBtn.style.cssText = `
      font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700;
      padding: 14px 40px; cursor: pointer; letter-spacing: 0.15em;
      background: #D32F2F; color: #fff; border: none; border-radius: 4px;
      transition: transform 0.1s; margin-top: 12px;
    `;
    introBtn.onmouseenter = () => { introBtn.style.transform = 'scale(1.05)'; };
    introBtn.onmouseleave = () => { introBtn.style.transform = 'scale(1)'; };
    introOverlay.appendChild(introBtn);
    wrapper.appendChild(introOverlay);

    container.appendChild(wrapper);

    const ctx = canvas.getContext('2d');
    const danHead = createDanHeadImage(CELL * 2);
    const danHeadPowered = createDanHeadImage(CELL * 2.5);

    // Build mutable grid
    const grid = MAZE.map(row => [...row]);
    let totalOrbs = 0;
    let collectedOrbs = 0;
    let playerGrid = { r: 0, c: 0 };

    // Find player start and count orbs
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 3) { playerGrid = { r, c }; grid[r][c] = 0; }
        if (grid[r][c] === 2) totalOrbs++;
      }
    }

    const startPos = { ...playerGrid };
    let playerX = playerGrid.c * CELL + CELL / 2;
    let playerY = playerGrid.r * CELL + CELL / 2;
    let targetX = playerX;
    let targetY = playerY;
    let playerSize = CELL * 0.35;
    let powered = false;
    let powerTimer = 0;
    let quoteIndex = 0;
    let flashTimeout = null;
    let currentDir = { dr: 0, dc: 0 }; // current movement direction
    let nextDir = { dr: 0, dc: 0 };    // buffered input direction

    // Enemies
    const enemies = [];
    const enemyStarts = [
      { r: 5, c: 15 },
      { r: 15, c: 17 },
      { r: 17, c: 3 },
    ];
    for (let i = 0; i < ENEMY_COUNT; i++) {
      const es = enemyStarts[i] || { r: 10, c: 10 };
      enemies.push({
        r: es.r, c: es.c,
        x: es.c * CELL + CELL / 2,
        y: es.r * CELL + CELL / 2,
        tx: es.c * CELL + CELL / 2,
        ty: es.r * CELL + CELL / 2,
        dir: Math.floor(Math.random() * 4),
        alive: true,
        respawnTimer: 0,
        startR: es.r,
        startC: es.c,
      });
    }

    // Input — buffer the most recent direction press
    function onKeyDown(e) {
      const keyMap = {
        ArrowUp: { dr: -1, dc: 0 }, ArrowDown: { dr: 1, dc: 0 },
        ArrowLeft: { dr: 0, dc: -1 }, ArrowRight: { dr: 0, dc: 1 },
        w: { dr: -1, dc: 0 }, W: { dr: -1, dc: 0 },
        a: { dr: 0, dc: -1 }, A: { dr: 0, dc: -1 },
        s: { dr: 1, dc: 0 }, S: { dr: 1, dc: 0 },
        d: { dr: 0, dc: 1 }, D: { dr: 0, dc: 1 },
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        nextDir = keyMap[e.key];
      }
    }
    function onKeyUp() {}

    function canMove(r, c) {
      if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
      if (grid[r][c] === 1) return false;
      return true;
    }

    function isAtTarget() {
      return Math.abs(playerX - targetX) < 1 && Math.abs(playerY - targetY) < 1;
    }

    const loop = createGameLoop((dt) => {
      // Player movement
      if (isAtTarget()) {
        playerGrid.c = Math.round((targetX - CELL / 2) / CELL);
        playerGrid.r = Math.round((targetY - CELL / 2) / CELL);
        playerX = targetX;
        playerY = targetY;

        // Collect orb
        if (grid[playerGrid.r][playerGrid.c] === 2) {
          grid[playerGrid.r][playerGrid.c] = 0;
          collectedOrbs++;
          play('chomp');
          showFlash(MALICIOUSNESS_QUOTES[quoteIndex % MALICIOUSNESS_QUOTES.length]);
          quoteIndex++;
        }

        // Try buffered direction first, then continue current direction
        if ((nextDir.dr || nextDir.dc) && canMove(playerGrid.r + nextDir.dr, playerGrid.c + nextDir.dc)) {
          currentDir = { ...nextDir };
          targetX = (playerGrid.c + currentDir.dc) * CELL + CELL / 2;
          targetY = (playerGrid.r + currentDir.dr) * CELL + CELL / 2;
        } else if ((currentDir.dr || currentDir.dc) && canMove(playerGrid.r + currentDir.dr, playerGrid.c + currentDir.dc)) {
          targetX = (playerGrid.c + currentDir.dc) * CELL + CELL / 2;
          targetY = (playerGrid.r + currentDir.dr) * CELL + CELL / 2;
        }
      } else {
        const dx = targetX - playerX;
        const dy = targetY - playerY;
        const step = MOVE_SPEED * 60 * dt;
        playerX += Math.sign(dx) * Math.min(step, Math.abs(dx));
        playerY += Math.sign(dy) * Math.min(step, Math.abs(dy));
      }

      // Power-up
      const meterPct = totalOrbs > 0 ? (collectedOrbs / totalOrbs) * 100 : 0;
      meterFill.style.width = `${meterPct}%`;

      if (!powered && meterPct >= 50 && powerTimer === 0) {
        powered = true;
        powerTimer = POWER_DURATION;
        playerSize = CELL * 0.5;
        play('powerup');
      }

      if (powered) {
        powerTimer -= dt;
        if (powerTimer <= 0) {
          powered = false;
          powerTimer = -1; // prevent re-trigger
          playerSize = CELL * 0.35;
        }
      }

      // Enemy movement
      const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      for (const enemy of enemies) {
        if (!enemy.alive) {
          enemy.respawnTimer -= dt;
          if (enemy.respawnTimer <= 0) {
            enemy.alive = true;
            enemy.r = enemy.startR;
            enemy.c = enemy.startC;
            enemy.x = enemy.c * CELL + CELL / 2;
            enemy.y = enemy.r * CELL + CELL / 2;
            enemy.tx = enemy.x;
            enemy.ty = enemy.y;
          }
          continue;
        }

        // Move smoothly toward target cell
        const edx = enemy.tx - enemy.x;
        const edy = enemy.ty - enemy.y;
        const eStep = ENEMY_SPEED * 60 * dt;
        if (Math.abs(edx) > 1 || Math.abs(edy) > 1) {
          enemy.x += Math.sign(edx) * Math.min(eStep, Math.abs(edx));
          enemy.y += Math.sign(edy) * Math.min(eStep, Math.abs(edy));
        } else {
          // Arrived at target — pick next cell
          enemy.x = enemy.tx;
          enemy.y = enemy.ty;
          enemy.r = Math.round((enemy.ty - CELL / 2) / CELL);
          enemy.c = Math.round((enemy.tx - CELL / 2) / CELL);

          const [dr, dc] = dirs[enemy.dir];
          const nr = enemy.r + dr;
          const nc = enemy.c + dc;
          if (canMove(nr, nc) && Math.random() > 0.02) {
            enemy.tx = nc * CELL + CELL / 2;
            enemy.ty = nr * CELL + CELL / 2;
          } else {
            const options = dirs.map((d, i) => i).filter(i => {
              const [dr2, dc2] = dirs[i];
              return canMove(enemy.r + dr2, enemy.c + dc2);
            });
            if (options.length) {
              enemy.dir = options[Math.floor(Math.random() * options.length)];
              const [ndr, ndc] = dirs[enemy.dir];
              enemy.tx = (enemy.c + ndc) * CELL + CELL / 2;
              enemy.ty = (enemy.r + ndr) * CELL + CELL / 2;
            }
          }
        }

        // Collision with player
        const dist = Math.hypot(enemy.x - playerX, enemy.y - playerY);
        if (dist < CELL * 0.6) {
          if (powered) {
            enemy.alive = false;
            enemy.respawnTimer = 4;
            play('chomp');
          } else {
            // Reset player to start
            playerGrid.r = startPos.r;
            playerGrid.c = startPos.c;
            playerX = startPos.c * CELL + CELL / 2;
            playerY = startPos.r * CELL + CELL / 2;
            targetX = playerX;
            targetY = playerY;
            play('buzz');
          }
        }
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Floor
      ctx.fillStyle = '#1a2327';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Walls and orbs
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL;
          const y = r * CELL;
          if (grid[r][c] === 1) {
            ctx.fillStyle = '#455A64';
            ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
            ctx.strokeStyle = '#546E7A';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 1, y + 1, CELL - 2, CELL - 2);
          } else if (grid[r][c] === 2) {
            const pulse = Math.sin(Date.now() / 300 + r + c) * 2;
            ctx.fillStyle = '#D32F2F';
            ctx.shadowColor = '#FF5722';
            ctx.shadowBlur = 8 + pulse;
            ctx.beginPath();
            ctx.arc(x + CELL / 2, y + CELL / 2, 5 + pulse * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Enemies
      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        ctx.fillStyle = powered ? '#4FC3F7' : '#FF8A65';
        ctx.strokeStyle = powered ? '#0288D1' : '#BF360C';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Ghost shape
        const ex = enemy.x;
        const ey = enemy.y;
        const es = CELL * 0.35;
        ctx.arc(ex, ey - es * 0.3, es, Math.PI, 0);
        ctx.lineTo(ex + es, ey + es * 0.5);
        // Wavy bottom
        ctx.lineTo(ex + es * 0.6, ey + es * 0.2);
        ctx.lineTo(ex + es * 0.3, ey + es * 0.5);
        ctx.lineTo(ex, ey + es * 0.2);
        ctx.lineTo(ex - es * 0.3, ey + es * 0.5);
        ctx.lineTo(ex - es * 0.6, ey + es * 0.2);
        ctx.lineTo(ex - es, ey + es * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ex - es * 0.3, ey - es * 0.3, 3, 0, Math.PI * 2);
        ctx.arc(ex + es * 0.3, ey - es * 0.3, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Player — Dan's head
      const headImg = powered ? danHeadPowered : danHead;
      const drawSize = powered ? CELL * 1.0 : CELL * 0.8;
      if (powered) {
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;
      }
      ctx.drawImage(headImg, playerX - drawSize / 2, playerY - drawSize / 2, drawSize, drawSize);
      ctx.shadowBlur = 0;

      // Power timer indicator
      if (powered) {
        ctx.fillStyle = 'rgba(255,215,0,0.3)';
        ctx.beginPath();
        ctx.arc(playerX, playerY, drawSize / 2 + 4, 0, Math.PI * 2 * (powerTimer / POWER_DURATION));
        ctx.lineTo(playerX, playerY);
        ctx.fill();
      }

      // Win check
      if (collectedOrbs >= totalOrbs) {
        loop.stop();
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
        if (flashTimeout) clearTimeout(flashTimeout);
        container.removeChild(wrapper);
        resolve();
      }
    });

    function showFlash(text) {
      flashText.textContent = text;
      flashText.style.opacity = '1';
      if (flashTimeout) clearTimeout(flashTimeout);
      flashTimeout = setTimeout(() => { flashText.style.opacity = '0'; }, 1500);
    }

    introBtn.onclick = () => {
      wrapper.removeChild(introOverlay);
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
      loop.start();
    };
  });
}
