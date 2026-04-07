import { gsap } from 'gsap';
import Splitting from 'splitting';
import 'splitting/dist/splitting.css';
import '../styles/reveal.css';
import { run as narrator } from './narrator.js';
import { play } from '../audio/sound-manager.js';

export async function run(container, levelInfo, options = {}) {
  const { slam = false } = options;

  const overlay = document.createElement('div');
  overlay.className = 'reveal-overlay';

  // Pre-create all elements so layout is stable from the start
  const nameEl = document.createElement('h1');
  nameEl.className = `reveal-name ${slam ? 'slam' : ''}`;
  nameEl.textContent = levelInfo.name;
  overlay.appendChild(nameEl);

  const subtitleEl = document.createElement('p');
  subtitleEl.className = 'reveal-subtitle';
  if (levelInfo.subtitle) {
    subtitleEl.textContent = levelInfo.subtitle;
  } else {
    subtitleEl.style.display = 'none';
  }
  overlay.appendChild(subtitleEl);

  const flavorContainer = document.createElement('div');
  flavorContainer.className = 'reveal-flavor';
  if (!levelInfo.flavor) {
    flavorContainer.style.display = 'none';
  }
  overlay.appendChild(flavorContainer);

  container.appendChild(overlay);

  // Fade in dark overlay
  await gsap.to(overlay, { backgroundColor: 'rgba(0,0,0,0.9)', duration: 0.5 });
  overlay.classList.add('active');

  // Track whether the user has skipped the title animation
  let skipped = false;
  function skipAnimation() { skipped = true; }

  // Helper: wait for a duration but resolve early on click/key
  function skippableWait(ms) {
    return new Promise((resolve) => {
      const timer = setTimeout(done, ms);
      function onSkip() { skipped = true; done(); }
      function done() {
        clearTimeout(timer);
        overlay.removeEventListener('click', onSkip);
        resolve();
      }
      overlay.addEventListener('click', onSkip, { once: true });
    });
  }

  // Split into characters for animation
  const splitResult = Splitting({ target: nameEl, by: 'chars' });

  if (slam) {
    play('slam');
    nameEl.style.opacity = '1';
    nameEl.style.animation = 'slam-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards';
    await skippableWait(600);
    if (!skipped) {
      container.style.animation = 'screen-shake 0.4s ease-out 5';
      await skippableWait(2000);
      container.style.animation = '';
    } else {
      nameEl.style.animation = 'none';
      nameEl.style.opacity = '1';
      nameEl.style.transform = 'scale(1)';
    }
  } else {
    play('reveal');
    const chars = splitResult[0]?.chars || [];
    const tl = gsap.timeline();

    tl.to(nameEl, { opacity: 1, duration: 0.3 });

    chars.forEach((char, i) => {
      gsap.set(char, { opacity: 0, y: 20 });
      tl.to(char, {
        opacity: 1,
        y: 0,
        duration: 0.08,
        ease: 'power2.out',
      }, 0.3 + i * 0.04);
    });

    // Allow skipping the character animation
    const skipPromise = new Promise((resolve) => {
      function onSkip() {
        skipped = true;
        tl.progress(1);
        resolve();
      }
      overlay.addEventListener('click', onSkip, { once: true });
      tl.then(() => {
        overlay.removeEventListener('click', onSkip);
        resolve();
      });
    });

    await skipPromise;
  }

  // Subtitle
  if (levelInfo.subtitle) {
    if (skipped) {
      gsap.set(subtitleEl, { opacity: 1 });
    } else {
      const subtitleTween = gsap.to(subtitleEl, { opacity: 1, duration: 0.8, delay: 0.3 });
      const skipPromise = new Promise((resolve) => {
        function onSkip() {
          skipped = true;
          subtitleTween.progress(1);
          resolve();
        }
        overlay.addEventListener('click', onSkip, { once: true });
        subtitleTween.then(() => {
          overlay.removeEventListener('click', onSkip);
          resolve();
        });
      });
      await skipPromise;
    }
  }

  // Flavor text via narrator typewriter, or a continue button if no flavor
  if (levelInfo.flavor) {
    await narrator(flavorContainer, levelInfo.flavor, { className: 'embedded' });
  } else {
    flavorContainer.style.display = '';
    const continueBtn = document.createElement('button');
    continueBtn.className = 'narrator-continue font-narrator';
    continueBtn.textContent = '▸ Continue';
    continueBtn.style.marginTop = '24px';
    flavorContainer.appendChild(continueBtn);
    await new Promise((resolve) => {
      continueBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resolve();
      });
    });
  }

  // Brief pause then cleanup
  await new Promise(r => setTimeout(r, 300));
  await gsap.to(overlay, { opacity: 0, duration: 0.5 });
  container.removeChild(overlay);
}
