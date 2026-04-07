import { isMuted, toggleMute } from '../audio/sound-manager.js';

const ICON_ON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
const ICON_OFF = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;

let btn;
let label;

function updateDisplay() {
  const muted = isMuted();
  btn.querySelector('.sound-icon').innerHTML = muted ? ICON_OFF : ICON_ON;
  btn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
  if (label) label.textContent = muted ? 'Sound Off' : 'Sound On';
}

export function createSoundToggle() {
  if (btn) {
    btn.classList.remove('sound-toggle--compact');
    btn.classList.add('sound-toggle--prominent');
    updateDisplay();
    return btn;
  }

  btn = document.createElement('button');
  btn.id = 'sound-toggle';
  btn.className = 'sound-toggle sound-toggle--prominent';

  const icon = document.createElement('span');
  icon.className = 'sound-icon';
  btn.appendChild(icon);

  label = document.createElement('span');
  label.className = 'sound-label';
  btn.appendChild(label);

  updateDisplay();

  btn.addEventListener('click', () => {
    toggleMute();
    updateDisplay();
  });

  document.body.appendChild(btn);
  return btn;
}

export function compactMode() {
  if (!btn) return;
  btn.classList.remove('sound-toggle--prominent');
  btn.classList.add('sound-toggle--compact');
}
