import { run as narrator } from './narrator.js';

export async function run(container) {
  await narrator(container, '"There are those who know him by... another name."');
}
