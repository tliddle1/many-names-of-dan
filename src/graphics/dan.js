import { svgCircle, svgRect } from './shapes.js';

const HAIR_COLOR = '#b8a04c'; // dirty blond

function spikyHair(cx) {
  // Head is circle at (cx,38) r=16. Top of head at y=22, eyes at y=36.
  // Swoopy hair covering the entire top of the head with a few soft peaks.
  // Hairline sits at ~y=32, with a slight inward curve.
  return `<g>
    <path d="
      M${cx-14},32
      Q${cx-12},20 ${cx-4},18
      L${cx-2},14
      L${cx+1},18
      L${cx+4},13
      L${cx+8},19
      Q${cx+14},20 ${cx+14},32
      Q${cx+10},29 ${cx},30
      Q${cx-10},29 ${cx-14},32
      Z
    " fill="${HAIR_COLOR}"/>
    <path d="M${cx-6},24 L${cx-4},17" stroke="#8a7a30" stroke-width="1" stroke-linecap="round"/>
    <path d="M${cx+2},23 L${cx+4},16" stroke="#8a7a30" stroke-width="1" stroke-linecap="round"/>
    <path d="M${cx-10},27 L${cx-8},21" stroke="#8a7a30" stroke-width="1" stroke-linecap="round"/>
  </g>`;
}

const KHAKI = '#c2b280';

const COSTUMES = {
  office: {
    shirtColor: '#111111',
    headColor: '#e8beac',
    accents: () => [],
  },
  judge: {
    shirtColor: '#1a1a2e',
    headColor: '#e8beac',
    accents: (cx) => [
      // Robe collar
      svgRect(cx - 18, 52, 36, 8, '#4a0e0e'),
      // Gavel (handle + head grouped and rotated together)
      `<g transform="rotate(20,${cx+23},75)">
        <rect x="${cx+20}" y="60" width="6" height="30" rx="2" fill="#8b6914"/>
        <rect x="${cx+16}" y="56" width="14" height="8" rx="2" fill="#5d4037"/>
      </g>`,
    ],
  },
  cosmic: {
    shirtColor: '#1a0a3e',
    headColor: '#e8beac',
    accents: (cx) => [
      // Starry cloak shimmer
      svgCircle(cx - 10, 65, 2, '#FFD700'),
      svgCircle(cx + 8, 72, 1.5, '#00E5FF'),
      svgCircle(cx - 5, 78, 1, '#7C4DFF'),
      svgCircle(cx + 12, 68, 1.5, '#FFD700'),
      // Cape collar
      `<polygon points="${cx-18},54 ${cx},48 ${cx+18},54" fill="#311B92"/>`,
    ],
  },
  medieval: {
    shirtColor: '#5d4037',
    headColor: '#e8beac',
    accents: (cx) => [
      // Crown (sits on head, hair pokes above/around it)
      `<polygon points="${cx-12},26 ${cx-8},16 ${cx-4},23 ${cx},12 ${cx+4},23 ${cx+8},16 ${cx+12},26" fill="#FFC107" stroke="#DAA520" stroke-width="0.5"/>`,
      // Belt
      svgRect(cx - 14, 72, 28, 4, '#8b6914'),
      svgRect(cx - 3, 71, 6, 6, '#FFC107', 1),
    ],
  },
  fist: {
    shirtColor: '#1a1a1a',
    headColor: '#e8beac',
    accents: (cx) => [
      // Raised fist
      `<g transform="translate(${cx + 22}, 50)">
        <rect x="-6" y="-16" width="14" height="20" rx="4" fill="#e8beac"/>
        <rect x="-6" y="-16" width="14" height="5" rx="2" fill="#d4a08a"/>
        <rect x="-6" y="-8" width="14" height="5" rx="2" fill="#d4a08a"/>
      </g>`,
      // Power glow
      svgCircle(cx + 29, 42, 18, 'rgba(255,215,0,0.15)'),
    ],
  },
};

export function createDanSVG(costume = 'office', width = 100, height = 120) {
  const cx = width / 2;
  const config = COSTUMES[costume] || COSTUMES.office;

  const parts = [
    // Legs (khaki pants)
    svgRect(cx - 12, 88, 10, 28, KHAKI, 3),
    svgRect(cx + 2, 88, 10, 28, KHAKI, 3),
    // Body (torso — black long-sleeved shirt base, overridden per costume)
    svgRect(cx - 16, 52, 32, 40, config.shirtColor, 6),
    // Arms (long sleeves match shirt)
    svgRect(cx - 24, 56, 10, 28, config.shirtColor, 4),
    svgRect(cx + 14, 56, 10, 28, config.shirtColor, 4),
    // Head
    svgCircle(cx, 38, 16, config.headColor),
    // Dirty blond spiky hair
    spikyHair(cx),
    // Eyes
    svgCircle(cx - 5, 36, 2, '#2c3e50'),
    svgCircle(cx + 5, 36, 2, '#2c3e50'),
    // Mouth (slight smile)
    `<path d="M${cx-4},43 Q${cx},47 ${cx+4},43" fill="none" stroke="#2c3e50" stroke-width="1.5" stroke-linecap="round"/>`,
    // Costume accents (drawn on top)
    ...config.accents(cx),
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${parts.join('')}</svg>`;
}

export function insertDan(container, costume = 'office', scale = 1) {
  const el = document.createElement('div');
  el.className = 'dan-character';
  el.innerHTML = createDanSVG(costume, 100 * scale, 120 * scale);
  container.appendChild(el);
  return el;
}
