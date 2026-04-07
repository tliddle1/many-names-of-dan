import '../styles/crawl.css';
import { play, stop, isMuted, onUnmute } from '../audio/sound-manager.js';

const CRAWL_LINES = [
  'In the land of cubicles and fluorescent light,',
  'there exists a man.',
  '',
  'You know him as Dan.',
  '',
  'But Dan is merely the surface —',
  'the mask worn for the comfort of mortals.',
  '',
  'Across realms seen and unseen,',
  'he is known by many names.',
  '',
  'And today...',
  '',
  'the names shall be revealed.',
];

const SCROLL_SPEED = 50;       // pixels per second in world space
const CAMERA_DISTANCE = 300;   // distance from camera to the "floor" plane
const DEPTH_FACTOR = 0.8;      // how aggressively y maps to z (depth)
const LINE_SPACING = 50;       // world-space spacing between lines
const BASE_FONT_SIZE = 42;
const FONT = "'Cinzel', serif";
const TEXT_COLOR = '#FFD700';
const FADE_START = 0.7;        // fraction of max distance where fade begins

export async function run(container) {
  return new Promise((resolve) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'crawl-viewport';

    const canvas = document.createElement('canvas');
    wrapper.appendChild(canvas);

    const skipBtn = document.createElement('button');
    skipBtn.className = 'crawl-skip';
    skipBtn.textContent = 'Skip';
    skipBtn.style.cssText = 'position:absolute;bottom:20px;right:20px;color:#555;font-size:13px;font-family:"Crimson Text",serif;z-index:3;background:none;border:1px solid #333;padding:4px 12px;cursor:pointer;visibility:hidden;';
    wrapper.appendChild(skipBtn);

    container.appendChild(wrapper);

    const ctx = canvas.getContext('2d');
    let running = true;
    let offset = 0;

    // Total height of all lines in world space
    const totalHeight = CRAWL_LINES.length * LINE_SPACING;
    // How far the text needs to scroll before it's all gone past the camera
    const maxOffset = totalHeight + 2000;

    function resize() {
      canvas.width = wrapper.clientWidth * devicePixelRatio;
      canvas.height = wrapper.clientHeight * devicePixelRatio;
      canvas.style.width = wrapper.clientWidth + 'px';
      canvas.style.height = wrapper.clientHeight + 'px';
    }

    resize();
    window.addEventListener('resize', resize);

    function drawFrame(dt) {
      offset += SCROLL_SPEED * dt;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      // Vanishing point near the top of the screen
      const vanishY = h * 0.05;
      // Where the "floor" meets the camera at the bottom
      const bottomY = h * 1.0;

      for (let i = 0; i < CRAWL_LINES.length; i++) {
        const line = CRAWL_LINES[i];
        if (!line) continue;

        // World position on the "floor plane" — larger values are further away.
        // First line starts furthest away, last line is nearest. Offset scrolls
        // everything toward the camera (reducing worldZ over time).
        const worldZ = (CRAWL_LINES.length - 1 - i) * LINE_SPACING - totalHeight + offset;

        // Skip lines that have scrolled past the camera
        if (worldZ < 0) continue;

        // Perspective scale: near lines (small z) are large, far lines are small
        const scale = CAMERA_DISTANCE / (CAMERA_DISTANCE + worldZ * DEPTH_FACTOR);

        if (scale < 0.05) continue;

        // Project to screen: scale=1 → bottom of screen, scale→0 → vanishing point
        const screenY = vanishY + (bottomY - vanishY) * scale;

        // Skip lines off-screen
        if (screenY < -50 || screenY > h + 50) continue;

        // Fade out as lines approach the vanishing point
        // Staggered fade: far-away lines (small scale) disappear first,
        // near lines (large scale) disappear later
        const fadeStart = totalHeight + 1000;
        const fadeDuration = 200;
        const lineFadeStart = fadeStart + scale * 600;
        const globalFade = offset < lineFadeStart ? 1 : Math.max(0, 1 - (offset - lineFadeStart) / fadeDuration);
        const alpha = Math.min(1, scale / 0.3) * globalFade;

        const scaledSize = BASE_FONT_SIZE * scale * devicePixelRatio;
        if (scaledSize < 2) continue;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${BASE_FONT_SIZE * devicePixelRatio}px ${FONT}`;
        ctx.fillStyle = TEXT_COLOR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.translate(centerX, screenY);
        // Compress vertically to simulate the tilted plane receding away
        ctx.scale(scale, scale * 0.8);
        ctx.fillText(line, 0, 0);
        ctx.restore();
      }
    }

    let lastTime = 0;
    function frame(timestamp) {
      if (!running) return;
      const dt = lastTime ? (timestamp - lastTime) / 1000 : 0;
      lastTime = timestamp;

      drawFrame(dt);

      if (offset >= maxOffset) {
        finish();
        return;
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
    play('intro');

    // If muted at start, play intro sound when user unmutes mid-crawl
    const removeUnmuteListener = onUnmute(() => {
      if (running) play('intro');
    });

    let skippable = false;

    function enableSkip() {
      skippable = true;
      skipBtn.style.visibility = 'visible';
      skipBtn.addEventListener('click', finish);
    }

    // Enable skipping after 2 seconds (text should be visible by then)
    setTimeout(enableSkip, 2000);

    function finish() {
      if (!running || !skippable) return;
      running = false;
      stop('intro');
      removeUnmuteListener();
      window.removeEventListener('resize', resize);
      skipBtn.removeEventListener('click', finish);
      container.removeChild(wrapper);
      resolve();
    }
  });
}
