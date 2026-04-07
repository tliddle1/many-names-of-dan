import { Howl } from 'howler';

const base = import.meta.env.BASE_URL;

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
  const sound = sounds[soundName];
  if (sound) sound.play();
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
