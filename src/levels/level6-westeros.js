import { gsap } from 'gsap';
import { DISPUTES } from '../data/disputes.js';
import { insertDan } from '../graphics/dan.js';
import { run as narrator } from '../scenes/narrator.js';
import { play } from '../audio/sound-manager.js';

export async function run(container) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position: relative; width: 100%; height: 100%;
    background: linear-gradient(180deg, #1a1a1a 0%, #2C2C2C 50%, #1a1a1a 100%);
    overflow: hidden;
  `;

  // Stone pillar decorations
  const leftPillar = createPillar();
  leftPillar.style.left = '30px';
  wrapper.appendChild(leftPillar);
  const rightPillar = createPillar();
  rightPillar.style.right = '30px';
  wrapper.appendChild(rightPillar);

  // Content — anchored from top
  const content = document.createElement('div');
  content.style.cssText = `
    position: absolute; inset: 0; z-index: 1;
    display: flex; flex-direction: column; align-items: center;
    justify-content: flex-start; padding-top: 10vh;
  `;

  // Dan on throne — fixed position
  const danArea = document.createElement('div');
  danArea.style.cssText = 'margin-bottom:12px;flex-shrink:0;';
  insertDan(danArea, 'medieval', 1.4);
  content.appendChild(danArea);

  // Dispute card area — grows downward, doesn't affect Dan
  const cardArea = document.createElement('div');
  cardArea.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;max-width:600px;padding:0 20px;';
  content.appendChild(cardArea);

  wrapper.appendChild(content);
  container.appendChild(wrapper);

  const shuffled = [...DISPUTES].sort(() => Math.random() - 0.5).slice(0, 6);

  for (let i = 0; i < shuffled.length; i++) {
    const dispute = shuffled[i];
    cardArea.innerHTML = '';

    // Parchment card
    const card = document.createElement('div');
    card.style.cssText = `
      background: #f4e4c1; color: #3e2723; padding: 24px 28px;
      border: 2px solid #8b6914; border-radius: 4px;
      font-family: 'Crimson Text', serif; font-size: 17px; line-height: 1.6;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      max-width: 520px; text-align: center;
      transform: scale(0.9); opacity: 0;
    `;
    card.textContent = dispute.description;
    cardArea.appendChild(card);

    gsap.to(card, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' });

    // Decree buttons
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;flex-direction:column;gap:12px;width:100%;max-width:520px;';

    dispute.options.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.textContent = opt.text;
      btn.style.cssText = `
        font-family: 'Cinzel', serif; font-size: 14px;
        padding: 12px 20px; cursor: pointer;
        background: #3e2723; color: #FFC107; border: 1px solid #8b6914;
        border-radius: 4px; text-align: center; line-height: 1.4;
        transition: background 0.2s, transform 0.1s;
      `;
      btn.onmouseenter = () => { btn.style.background = '#5d4037'; btn.style.transform = 'scale(1.02)'; };
      btn.onmouseleave = () => { btn.style.background = '#3e2723'; btn.style.transform = 'scale(1)'; };
      btn.dataset.index = optIndex;
      btnRow.appendChild(btn);
    });
    cardArea.appendChild(btnRow);

    const choice = await new Promise((resolve) => {
      btnRow.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          play('stamp');
          resolve(Number(btn.dataset.index));
        };
      });
    });
    await new Promise(r => setTimeout(r, 100));

    // Show outcome via narrator
    const outcomeArea = document.createElement('div');
    outcomeArea.style.cssText = 'max-width:520px;';
    cardArea.innerHTML = '';
    cardArea.appendChild(outcomeArea);

    await narrator(outcomeArea, dispute.options[choice].outcome, { className: 'embedded' });
  }

  container.removeChild(wrapper);
}

function createPillar() {
  const pillar = document.createElement('div');
  pillar.style.cssText = `
    position: absolute; top: 0; bottom: 0; width: 40px;
    background: linear-gradient(90deg, #3e3e3e, #555, #3e3e3e);
    box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
    z-index: 0;
  `;
  // Capital
  const cap = document.createElement('div');
  cap.style.cssText = 'width:56px;height:20px;background:#4a4a4a;margin-left:-8px;border-radius:4px 4px 0 0;border-bottom:3px solid #8b6914;';
  pillar.appendChild(cap);
  return pillar;
}
