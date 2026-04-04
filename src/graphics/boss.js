export function createBossSVG(width = 300, height = 350) {
  const cx = width / 2;

  // Angular jagged composition of crumpled forms, red tape, broken chairs
  const parts = [
    // Main body mass — overlapping jagged triangles
    `<polygon points="${cx},20 ${cx+80},120 ${cx+40},110 ${cx+100},200 ${cx+60},180 ${cx+80},280 ${cx},240 ${cx-80},280 ${cx-60},180 ${cx-100},200 ${cx-40},110 ${cx-80},120" fill="#3d1515"/>`,

    // Red tape tangles
    `<path d="M${cx-60},80 Q${cx-20},60 ${cx+10},90 T${cx+70},70" fill="none" stroke="#c62828" stroke-width="6" opacity="0.8"/>`,
    `<path d="M${cx-40},140 Q${cx},120 ${cx+30},150 T${cx+80},130" fill="none" stroke="#b71c1c" stroke-width="4" opacity="0.7"/>`,
    `<path d="M${cx-70},200 Q${cx-30},180 ${cx+20},210 T${cx+60},190" fill="none" stroke="#d32f2f" stroke-width="5" opacity="0.6"/>`,

    // Crumpled paper shapes
    `<polygon points="${cx-30},100 ${cx-15},85 ${cx+5},105 ${cx-10},115" fill="#7a7a7a" opacity="0.5"/>`,
    `<polygon points="${cx+20},150 ${cx+40},135 ${cx+55},160 ${cx+35},170" fill="#8a8a8a" opacity="0.4"/>`,
    `<polygon points="${cx-50},180 ${cx-30},165 ${cx-15},185 ${cx-35},195" fill="#6a6a6a" opacity="0.5"/>`,

    // Broken chair parts
    `<rect x="${cx+30}" y="200" width="8" height="40" fill="#5d4037" transform="rotate(15,${cx+34},220)"/>`,
    `<rect x="${cx-40}" y="210" width="8" height="35" fill="#4e342e" transform="rotate(-20,${cx-36},228)"/>`,
    `<rect x="${cx-20}" y="230" width="40" height="6" fill="#5d4037" transform="rotate(5,${cx},233)"/>`,

    // Glowing angry eyes
    `<circle cx="${cx-20}" cy="80" r="10" fill="#ff1744" opacity="0.9"/>`,
    `<circle cx="${cx+20}" cy="80" r="10" fill="#ff1744" opacity="0.9"/>`,
    `<circle cx="${cx-20}" cy="80" r="5" fill="#fff" opacity="0.8"/>`,
    `<circle cx="${cx+20}" cy="80" r="5" fill="#fff" opacity="0.8"/>`,

    // Jagged mouth
    `<path d="M${cx-25},110 L${cx-15},105 L${cx-8},115 L${cx},103 L${cx+8},115 L${cx+15},105 L${cx+25},110" fill="#1a0000" stroke="#ff1744" stroke-width="1.5"/>`,

    // Outer glow
    `<circle cx="${cx}" cy="150" r="140" fill="none" stroke="rgba(255,23,68,0.15)" stroke-width="20"/>`,
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${parts.join('')}</svg>`;
}

export function insertBoss(container, scale = 1) {
  const el = document.createElement('div');
  el.className = 'boss-character';
  el.innerHTML = createBossSVG(300 * scale, 350 * scale);
  container.appendChild(el);
  return el;
}
