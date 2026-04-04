export function createParticleSystem(canvas) {
  const ctx = canvas.getContext('2d');
  const particles = [];

  function spawn(count, config) {
    for (let i = 0; i < count; i++) {
      const angle = config.angle ?? (Math.random() * Math.PI * 2);
      const speed = config.speed ?? (Math.random() * 100 + 50);
      particles.push({
        x: config.x ?? canvas.width / 2,
        y: config.y ?? canvas.height / 2,
        vx: Math.cos(angle) * speed + (config.vx ?? 0),
        vy: Math.sin(angle) * speed + (config.vy ?? 0),
        life: 1,
        decay: config.decay ?? (0.3 + Math.random() * 0.5),
        size: config.size ?? (2 + Math.random() * 4),
        color: config.colors
          ? config.colors[Math.floor(Math.random() * config.colors.length)]
          : config.color ?? '#FFD700',
        gravity: config.gravity ?? 0,
      });
    }
  }

  function update(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.life -= p.decay * dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  function draw() {
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function clear() {
    particles.length = 0;
  }

  return { spawn, update, draw, clear, get count() { return particles.length; } };
}
