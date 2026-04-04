const STATE_KEY = 'many-names-of-dan';

export function createState() {
  return { currentLevel: 0, levelResults: [] };
}

export function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function loadState() {
  const raw = localStorage.getItem(STATE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearState() {
  localStorage.removeItem(STATE_KEY);
}
