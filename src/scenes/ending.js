import { run as narrator } from './narrator.js';

const ENDING_LINES = [
  '"And so the maliciousness was devoured. The low probabilities were manipulated. The gold and crimson were mastered. The 7th Circle was arbitrated. Westeros received a very competitive benefits package."',
  '"And The Fist... rested."',
  '"Until Monday."',
  '"Because PTO requests don\'t approve themselves."',
];

export async function run(container) {
  for (const line of ENDING_LINES) {
    await narrator(container, line);
  }
}
