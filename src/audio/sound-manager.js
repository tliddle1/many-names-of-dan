import { Howl } from 'howler';

const base = import.meta.env.BASE_URL;

const STORAGE_KEY = 'dan-sound-muted';

// Muted by default — only unmuted if the user has explicitly opted in before
const stored = localStorage.getItem(STORAGE_KEY);
let muted = stored === null ? true : stored === 'true';

const sounds = {
  stamp:     new Howl({ src: [`${base}audio/rubber-stamp.wav`] }),
  whoosh:    new Howl({ src: [`${base}audio/whoosh.wav`] }),
  ding:      new Howl({ src: [`${base}audio/ui-click.wav`] }),
  buzz:      new Howl({ src: [`${base}audio/buzz.wav`], volume: 0.1 }),
  wheelSpin: new Howl({ src: [`${base}audio/prize-wheel.wav`] }),
  chomp:     new Howl({ src: [`${base}audio/chomp.wav`] }),
  powerup:   new Howl({ src: [`${base}audio/powerup.flac`], volume: 0.3 }),
  punch:     new Howl({ src: [`${base}audio/punch.wav`] }),
  slam:      new Howl({ src: [`${base}audio/orchestral-hit.wav`] }),
  reveal:    new Howl({ src: [`${base}audio/reveal.wav`] }),
  intro:     new Howl({ src: [`${base}audio/intro.wav`] }),
};

export function play(soundName) {
  if (muted) return;
  const sound = sounds[soundName];
  if (sound) sound.play();
}

export function isMuted() {
  return muted;
}

const unmuteListeners = new Set();

export function toggleMute() {
  muted = !muted;
  localStorage.setItem(STORAGE_KEY, String(muted));
  if (muted) {
    stopAll();
  } else {
    for (const fn of unmuteListeners) fn();
  }
  return muted;
}

export function onUnmute(fn) {
  unmuteListeners.add(fn);
  return () => unmuteListeners.delete(fn);
}

export function stop(soundName) {
  const sound = sounds[soundName];
  if (sound) sound.stop();
}

export function stopAll() {
  for (const sound of Object.values(sounds)) {
    sound.stop();
  }
}

export function setVolume(level) {
  for (const sound of Object.values(sounds)) {
    sound.volume(level);
  }
}
