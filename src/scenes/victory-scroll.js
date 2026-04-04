import { run as narrator } from './narrator.js';

const VICTORY_TEXTS = [
  '"A fine day\'s work for Dan Lambourne. But the realm stirs."',
  '"The condemned have been judged. The 7th Circle rests in silence. But Dan\'s work is far from done."',
  '"Gold and crimson bend to his will, as they always have. As they always shall."',
  '"Probability itself kneels before the Manipulator. The universe adjusts its expectations accordingly."',
  '"The maliciousness has been consumed. Dan grows ever stronger. The office trembles."',
  '"Westeros is united. The benefits package is comprehensive. The 401(k) match is, frankly, unreasonable."',
  '"The Fist has spoken. The HR violation is no more. And Dan... rests."',
];

const TRANSITION = '\n"But there are those who know him by... another name."';

export async function run(container, state, levelIndex) {
  const text = VICTORY_TEXTS[levelIndex] || '"And so it was done."';
  const full = levelIndex < 6 ? text + TRANSITION : text;
  await narrator(container, full);
}
