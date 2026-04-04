export function createGameLoop(onTick) {
  let running = false;
  let rafId = null;
  let lastTime = 0;

  function frame(timestamp) {
    if (!running) return;
    const dt = lastTime ? (timestamp - lastTime) / 1000 : 0;
    lastTime = timestamp;
    onTick(dt, timestamp);
    rafId = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastTime = 0;
      rafId = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    },
    get running() { return running; },
  };
}
