import { gsap } from 'gsap';
import { EMAILS } from '../data/emails.js';
import { insertDan } from '../graphics/dan.js';
import { play } from '../audio/sound-manager.js';

const EMAIL_COUNT = 7;

export async function run(container) {
  return new Promise((resolve) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'level1-wrapper';
    wrapper.style.cssText = `
      display: flex; align-items: center; justify-content: center; gap: 40px;
      width: 100%; height: 100%; padding: 40px;
      background: var(--bg, #ECEFF1);
    `;

    // Dan at desk
    const danArea = document.createElement('div');
    danArea.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:12px;';
    const danEl = insertDan(danArea, 'office', 1.5);
    danEl.style.marginBottom = '-40px';

    // Desk — overlaps Dan's lower half so he looks seated behind it
    const desk = document.createElement('div');
    desk.style.cssText = `
      width: 180px; height: 70px; margin-top: -70px;
      background: linear-gradient(to bottom, #8d6e4e, #5d4037);
      border-top: 4px solid #a0825a;
      border-radius: 4px 4px 0 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      position: relative; z-index: 1;
    `;
    danArea.appendChild(desk);
    wrapper.appendChild(danArea);

    // Email area — positioned so buttons and reaction are fixed,
    // card grows upward from above the buttons
    const emailArea = document.createElement('div');
    emailArea.style.cssText = 'position:relative;width:500px;height:300px;';

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'position:absolute;top:140px;left:50%;transform:translateX(-50%);display:flex;gap:16px;';
    const approveBtn = createButton('APPROVE', '#2e7d32');
    const denyBtn = createButton('DENY', '#c62828');
    btnRow.appendChild(approveBtn);
    btnRow.appendChild(denyBtn);
    emailArea.appendChild(btnRow);

    const reaction = document.createElement('p');
    reaction.style.cssText = 'position:absolute;top:200px;left:0;right:0;color:#607D8B;font-style:italic;font-size:20px;font-weight:600;font-family:"Crimson Text",serif;visibility:hidden;text-align:center;';
    emailArea.appendChild(reaction);

    // Card anchored to bottom edge above buttons, grows upward
    const card = document.createElement('div');
    card.style.cssText = `
      position:absolute;bottom:180px;left:0;right:0;
      background: #fff; color: #333; padding: 24px; border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      font-family: 'Crimson Text', serif; font-size: 24px;
      text-align: center;
    `;
    emailArea.appendChild(card);

    wrapper.appendChild(emailArea);
    container.appendChild(wrapper);

    const shuffled = [...EMAILS].sort(() => Math.random() - 0.5).slice(0, EMAIL_COUNT);
    let index = 0;
    let advanceTimeout = null;
    let waiting = false;

    function nextEmail() {
      if (!waiting) return;
      waiting = false;
      if (advanceTimeout) clearTimeout(advanceTimeout);
      wrapper.removeEventListener('click', nextEmail);
      index++;
      showEmail();
    }

    function showEmail() {
      if (index >= shuffled.length) {
        finishLevel();
        return;
      }

      const email = shuffled[index];

      // Reset state
      card.textContent = email.subject;
      card.style.opacity = '1';
      approveBtn.disabled = false;
      denyBtn.disabled = false;
      reaction.textContent = '\u00A0';
      reaction.style.visibility = 'hidden';

      function handleChoice(type) {
        play('stamp');
        approveBtn.disabled = true;
        denyBtn.disabled = true;
        reaction.textContent = email.reactions[type];
        reaction.style.visibility = 'visible';

        // Stamp visual feedback
        gsap.fromTo(card, { scale: 1 }, { scale: 0.95, duration: 0.05, yoyo: true, repeat: 1 });

        waiting = true;
        setTimeout(() => wrapper.addEventListener('click', nextEmail), 100);
        advanceTimeout = setTimeout(nextEmail, 2500);
      }

      approveBtn.onclick = () => handleChoice('approve');
      denyBtn.onclick = () => handleChoice('deny');
    }

    async function finishLevel() {
      container.removeChild(wrapper);
      resolve();
    }

    showEmail();
  });
}

function createButton(text, color) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.style.cssText = `
    font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700;
    padding: 14px 32px; cursor: pointer;
    background: ${color}; color: #fff; border: none; border-radius: 4px;
    letter-spacing: 0.1em; transition: transform 0.1s;
  `;
  btn.onmouseenter = () => { btn.style.transform = 'scale(1.05)'; };
  btn.onmouseleave = () => { btn.style.transform = 'scale(1)'; };
  return btn;
}
