import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { createBossSVG } from '../graphics/boss.js';
import { run as narrator } from '../scenes/narrator.js';
import { play } from '../audio/sound-manager.js';
import { NARRATOR } from '../data/narrator-text.js';

const MAX_CLICKS = 150;
const THRESHOLDS = [0.25, 0.5, 0.75, 1.0];

export async function run(container) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position: relative; width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;
    background: radial-gradient(ellipse at 50% 30%, #1a0a0a 0%, #000 70%);
    overflow: hidden;
  `;

  // Boss
  const bossArea = document.createElement('div');
  bossArea.style.cssText = 'position:relative;';
  bossArea.innerHTML = createBossSVG(240, 280);
  wrapper.appendChild(bossArea);

  // Power meter
  const meterWrapper = document.createElement('div');
  meterWrapper.style.cssText = `
    width: 300px; height: 24px; background: rgba(255,255,255,0.1);
    border: 2px solid #FFD700; border-radius: 12px; overflow: hidden;
    position: relative;
  `;
  const meterFill = document.createElement('div');
  meterFill.style.cssText = `
    width: 0%; height: 100%;
    background: linear-gradient(to right, #4CAF50, #FFD700, #FF5722, #D32F2F);
    border-radius: 12px; transition: width 0.05s;
  `;
  meterWrapper.appendChild(meterFill);
  wrapper.appendChild(meterWrapper);

  // FIST button
  const fistBtn = document.createElement('button');
  fistBtn.textContent = 'CHARGE UP';
  fistBtn.style.cssText = `
    font-family: 'Cinzel Decorative', serif; font-size: 36px; font-weight: 900;
    padding: 24px 64px; cursor: pointer;
    background: linear-gradient(135deg, #b71c1c, #880000);
    color: #FFD700; border: 3px solid #FFD700; border-radius: 12px;
    letter-spacing: 0.2em;
    text-shadow: 0 0 20px rgba(255,215,0,0.5);
    box-shadow: 0 0 30px rgba(183,28,28,0.5);
    transition: transform 0.05s;
    user-select: none;
  `;
  wrapper.appendChild(fistBtn);

  // Narrator area — positioned at bottom so it doesn't push boss off screen
  const narratorArea = document.createElement('div');
  narratorArea.style.cssText = 'position:absolute;bottom:8vh;left:50%;transform:translateX(-50%);max-width:500px;text-align:center;min-height:40px;z-index:2;';
  wrapper.appendChild(narratorArea);

  // Flash overlay
  const flash = document.createElement('div');
  flash.style.cssText = 'position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:100;';
  wrapper.appendChild(flash);

  container.appendChild(wrapper);

  // Narrator explains the boss before mashing begins
  fistBtn.style.visibility = 'hidden';
  meterWrapper.style.visibility = 'hidden';
  await narrator(narratorArea, NARRATOR.level7_boss, { className: 'embedded' });
  narratorArea.innerHTML = '';
  fistBtn.style.visibility = 'visible';
  meterWrapper.style.visibility = 'visible';

  let clicks = 0;
  let nextThreshold = 0;
  let unleashed = false;

  // Mash phase
  await new Promise((resolve) => {
    fistBtn.addEventListener('mousedown', () => {
      if (unleashed) return;
      clicks++;
      play('punch');
      const pct = Math.min(clicks / MAX_CLICKS, 1);
      meterFill.style.width = `${pct * 100}%`;

      // Button punch feedback
      gsap.fromTo(fistBtn, { scale: 0.92 }, { scale: 1, duration: 0.06 });

      // Boss shake
      gsap.to(bossArea, {
        x: (Math.random() - 0.5) * pct * 10,
        y: (Math.random() - 0.5) * pct * 5,
        duration: 0.05,
      });

      // Threshold narrator
      if (nextThreshold < THRESHOLDS.length && pct >= THRESHOLDS[nextThreshold]) {
        const text = NARRATOR.level7_escalation[nextThreshold];
        narratorArea.innerHTML = '';
        const p = document.createElement('p');
        p.style.cssText = `
          font-family: 'Cinzel', serif; font-size: 18px; color: #FFD700;
          font-style: italic; text-shadow: 0 0 10px rgba(255,215,0,0.5);
        `;
        p.textContent = text;
        narratorArea.appendChild(p);
        gsap.fromTo(p, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
        nextThreshold++;
      }

      // Full meter — transform to UNLEASH
      if (clicks >= MAX_CLICKS && !unleashed) {
        unleashed = true;
        fistBtn.textContent = 'UNLEASH';
        fistBtn.style.background = 'linear-gradient(135deg, #FFD700, #FF6F00)';
        fistBtn.style.color = '#000';
        fistBtn.style.fontSize = '40px';
        gsap.fromTo(fistBtn, { scale: 1.3 }, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });

        fistBtn.onclick = () => {
          fistBtn.onclick = null;
          resolve();
        };
      }
    });
  });

  // UNLEASH sequence
  play('slam');

  // Screen flash
  gsap.to(flash, { opacity: 0.9, duration: 0.1 });
  await new Promise(r => setTimeout(r, 100));
  gsap.to(flash, { opacity: 0, duration: 0.4 });

  // Screen shake
  const shakeTimeline = gsap.timeline();
  for (let i = 0; i < 10; i++) {
    shakeTimeline.to(wrapper, {
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * 8,
      duration: 0.05,
    });
  }
  shakeTimeline.to(wrapper, { x: 0, y: 0, duration: 0.1 });

  // Boss shatter — break into pieces flying outward
  const bossSvg = bossArea.querySelector('svg');
  if (bossSvg) {
    gsap.to(bossSvg, { scale: 1.5, opacity: 0, duration: 0.5, ease: 'power2.in' });
  }

  // Confetti
  confetti({
    particleCount: 200,
    spread: 160,
    origin: { x: 0.5, y: 0.4 },
    colors: ['#FFD700', '#FF6F00', '#D32F2F', '#fff'],
  });

  // Hide button
  fistBtn.style.display = 'none';
  meterWrapper.style.display = 'none';

  await shakeTimeline.then();
  await new Promise(r => setTimeout(r, 800));

  // Second confetti burst
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#FFD700', '#fff'],
  });

  await new Promise(r => setTimeout(r, 1000));

  container.removeChild(wrapper);
}
