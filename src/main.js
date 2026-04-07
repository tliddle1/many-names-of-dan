import './styles/main.css';
import './styles/levels.css';
import { createState, loadState, saveState, clearState } from './state.js';
import { NARRATOR } from './data/narrator-text.js';
import { createSoundToggle, compactMode } from './ui/sound-toggle.js';

const container = document.getElementById('game-container');

const LEVEL_NAMES = [
  { name: 'DAN LAMBOURNE', subtitle: 'Human Resources Representative', flavor: '"A simple name. A simple man. Or so they would have you believe."' },
  { name: 'ARBITER OF THE 7TH CIRCLE OF HUMAN RESOURCES', subtitle: '', flavor: '"Below the breakroom. Below the basement. Below the sub-basement where they keep the 2003 holiday decorations. There lies the 7th Circle. And there, Dan sits in judgment."' },
  { name: 'MASTER OF GOLD AND CRIMSON', subtitle: '', flavor: '"There are two colors that bend to his will. Gold — the color of wealth, of glory, of the \'Exceeds Expectations\' rating. And Crimson — the color of blood, of warnings, of the final write-up before termination."' },
  { name: 'MANIPULATOR OF LOW PROBABILITY', subtitle: '', flavor: '"Chance is not random. Not for Dan. He reaches into the chaos of the universe and pulls out exactly the outcome he requires. Usually involving paperwork."' },
  { name: 'DEVOURER OF MALICIOUSNESS', subtitle: '', flavor: '"Where others see conflict, Dan sees a meal. Gossip. Backstabbing. Passive-aggressive Post-it notes. He consumes them all, and grows stronger."' },
  { name: 'CHAMPION OF THE MANIFEST DESTINY OF WESTEROS', subtitle: '', flavor: '"In the land of ice and fire, there is one who would unite all kingdoms — not through war, but through superior benefits enrollment and a very competitive 401(k) match."' },
  { name: 'THE FIST OF DANBURY', subtitle: '', flavor: '' },
];

async function runGame() {
  // Sound toggle — prominent on title screen, compact during gameplay
  createSoundToggle();

  // Title screen
  const { run: titleScreen } = await import('./scenes/title-screen.js');
  const saved = loadState();
  const choice = await titleScreen(container, saved);

  compactMode();

  if (choice === 'credits') {
    const { run: credits } = await import('./scenes/credits.js');
    await credits(container);
    return runGame();
  }

  let state;
  let startLevel;

  if (choice === 'continue' && saved) {
    state = saved;
    startLevel = state.currentLevel;
  } else {
    clearState();
    state = createState();
    startLevel = 0;

    // Opening crawl
    const { run: introCrawl } = await import('./scenes/intro-crawl.js');
    await introCrawl(container, state);
  }

  // Level imports
  const levelModules = [
    () => import('./levels/level1-office.js'),
    () => import('./levels/level2-judgment.js'),
    () => import('./levels/level3-colors.js'),
    () => import('./levels/level4-wheel.js'),
    () => import('./levels/level5-maze.js'),
    () => import('./levels/level6-westeros.js'),
    () => import('./levels/level7-fist.js'),
  ];

  const { run: nameReveal } = await import('./scenes/name-reveal.js');
  const { run: victoryScroll } = await import('./scenes/victory-scroll.js');

  for (let i = startLevel; i < 7; i++) {
    state.currentLevel = i;
    saveState(state);

    // Level 7 special intro sequence
    if (i === 6) {
      const { run: narratorRun } = await import('./scenes/narrator.js');
      for (const line of NARRATOR.level7_intro) {
        await narratorRun(container, line);
      }
    }

    // Name reveal
    const levelInfo = LEVEL_NAMES[i];
    await nameReveal(container, levelInfo, { slam: i === 6 });

    // Level gameplay
    container.classList.add(`level-${i + 1}`);
    const { run: levelRun } = await levelModules[i]();
    const result = await levelRun(container, state);
    container.classList.remove(`level-${i + 1}`);

    state.levelResults.push(result);

    // Victory scroll (includes transition text for non-final levels)
    await victoryScroll(container, state, i);
  }

  // Ending
  const { run: ending } = await import('./scenes/ending.js');
  await ending(container, state);

  // Credits
  const { run: credits } = await import('./scenes/credits.js');
  await credits(container, state);

  clearState();
  runGame();
}

runGame();
