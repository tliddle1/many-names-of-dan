import { gsap } from 'gsap';
import { SINS } from '../data/sins.js';
import { insertDan } from '../graphics/dan.js';
import { play } from '../audio/sound-manager.js';

const JUDGMENT_COUNT = 11;

const FORGIVEN_REACTIONS = [
  '"Mercy flows through the Arbiter like fluorescent light through a drop ceiling."',
  '"The sin is cleansed. The soul ascends to the 3rd floor — Accounting."',
  '"Forgiven. But not forgotten. It goes in the file."',
  '"The Arbiter shows compassion. The breakroom grows slightly warmer."',
];

const CAST_REACTIONS = [
  '"The soul descends. There is no PTO in the deeper circles."',
  '"Cast deeper. Let them contemplate their sins beside the 2003 holiday decorations."',
  '"The flames of HR compliance consume another offender."',
  '"Down they go. The sub-basement welcomes all."',
];

export async function run(container) {
  return new Promise((resolve) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: relative; width: 100%; height: 100%;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      overflow: hidden;
    `;

    // Hellfire background layers
    const fireBg = document.createElement('div');
    fireBg.style.cssText = `
      position: absolute; inset: 0; z-index: 0;
      background: radial-gradient(ellipse at 50% 120%, #FF6F00 0%, #D32F2F 30%, #1B0000 70%, #000 100%);
    `;
    wrapper.appendChild(fireBg);

    // Pulsing fire overlay
    const fireOverlay = document.createElement('div');
    fireOverlay.style.cssText = `
      position: absolute; inset: 0; z-index: 1;
      background: radial-gradient(ellipse at 30% 100%, rgba(255,111,0,0.4) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 100%, rgba(211,47,47,0.3) 0%, transparent 50%);
      mix-blend-mode: screen;
      animation: fire-pulse 3s ease-in-out infinite alternate;
    `;
    wrapper.appendChild(fireOverlay);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fire-pulse {
        0% { opacity: 0.6; transform: scale(1); }
        100% { opacity: 1; transform: scale(1.05); }
      }
      @keyframes fly-left {
        to { transform: translateX(-120vw) rotate(-20deg); opacity: 0; }
      }
      @keyframes fly-right {
        to { transform: translateX(120vw) rotate(20deg); opacity: 0; }
      }
      @keyframes beam-up {
        0% { opacity: 0; }
        30% { opacity: 0.8; }
        100% { opacity: 0; transform: translateY(-100vh); }
      }
    `;
    wrapper.appendChild(style);

    // Content layer — all elements created once with fixed positions
    const content = document.createElement('div');
    content.style.cssText = 'position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:20vh;gap:20px;';

    // Tension meter
    const meterWrapper = document.createElement('div');
    meterWrapper.style.cssText = 'width:60%;max-width:500px;height:12px;background:rgba(0,0,0,0.5);border:1px solid #D32F2F;border-radius:6px;overflow:hidden;';
    const meterFill = document.createElement('div');
    meterFill.style.cssText = 'width:0%;height:100%;background:linear-gradient(to right,#FF6F00,#D32F2F,#FFD600);transition:width 0.4s;border-radius:6px;';
    meterWrapper.appendChild(meterFill);
    content.appendChild(meterWrapper);

    // Dan at judge's stand
    const danArea = document.createElement('div');
    danArea.style.cssText = 'display:flex;flex-direction:column;align-items:center;position:relative;';
    insertDan(danArea, 'judge', 1.3);
    const stand = document.createElement('div');
    stand.style.cssText = `
      width: 160px; height: 80px; margin-top: -85px;
      background: linear-gradient(to bottom, #5d4037, #3e2723);
      border-top: 4px solid #8b6914;
      border-radius: 4px 4px 0 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      position: relative; z-index: 1;
    `;
    danArea.appendChild(stand);
    const standBase = document.createElement('div');
    standBase.style.cssText = `
      width: 180px; height: 10px;
      background: #3e2723;
      border-radius: 0 0 4px 4px;
      border-top: 2px solid #4e342e;
      position: relative; z-index: 1;
    `;
    danArea.appendChild(standBase);
    content.appendChild(danArea);

    // Card area — normal flow, stacked vertically
    const cardArea = document.createElement('div');
    cardArea.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:20px;width:500px;';

    // Soul card
    const card = document.createElement('div');
    card.style.cssText = `
      background: rgba(255,255,255,0.1); backdrop-filter: blur(4px);
      border: 1px solid rgba(255,215,0,0.3); border-radius: 8px;
      padding: 28px 36px; width: 100%; min-height: 80px; text-align: center;
      font-family: 'Crimson Text', serif; font-size: 24px; color: #e0d6c8;
      display: flex; align-items: center; justify-content: center;
    `;
    cardArea.appendChild(card);

    // Buttons
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:24px;';
    const forgivenBtn = makeBtn('FORGIVEN', '#FFD600', '#000');
    const castBtn = makeBtn('CAST DEEPER', '#1a1a1a', '#FF4444', '1px solid #FF4444');
    btnRow.appendChild(forgivenBtn);
    btnRow.appendChild(castBtn);
    cardArea.appendChild(btnRow);

    // Reaction — below buttons
    const reaction = document.createElement('p');
    reaction.style.cssText = 'font-family:"Crimson Text",serif;font-size:28px;font-weight:700;color:#000;font-style:italic;text-align:center;min-height:70px;visibility:hidden;';
    cardArea.appendChild(reaction);

    content.appendChild(cardArea);
    wrapper.appendChild(content);
    container.appendChild(wrapper);

    const shuffled = [...SINS].sort(() => Math.random() - 0.5).slice(0, JUDGMENT_COUNT);
    let index = 0;
    let advanceTimeout = null;
    let waitingToAdvance = false;

    function nextSoul() {
      if (!waitingToAdvance) return;
      waitingToAdvance = false;
      if (advanceTimeout) clearTimeout(advanceTimeout);
      wrapper.removeEventListener('click', nextSoul);
      showSoul();
    }

    function showSoul() {
      if (index >= shuffled.length) {
        finish();
        return;
      }

      // Reset state
      card.textContent = shuffled[index];
      card.style.animation = '';
      card.style.opacity = '1';
      card.style.transform = '';
      forgivenBtn.disabled = false;
      castBtn.disabled = false;
      btnRow.style.visibility = 'visible';
      reaction.textContent = '\u00A0';
      reaction.style.visibility = 'hidden';

      function judge(type) {
        play('whoosh');
        forgivenBtn.disabled = true;
        castBtn.disabled = true;
        btnRow.style.visibility = 'hidden';

        if (type === 'forgiven') {
          card.style.animation = 'fly-left 0.6s ease-in forwards';
          reaction.textContent = FORGIVEN_REACTIONS[index % FORGIVEN_REACTIONS.length];
        } else {
          card.style.animation = 'fly-right 0.6s ease-in forwards';
          reaction.textContent = CAST_REACTIONS[index % CAST_REACTIONS.length];
        }
        reaction.style.visibility = 'visible';

        index++;
        meterFill.style.width = `${(index / shuffled.length) * 100}%`;

        waitingToAdvance = true;
        setTimeout(() => wrapper.addEventListener('click', nextSoul), 100);
        advanceTimeout = setTimeout(nextSoul, 3500);
      }

      forgivenBtn.onclick = () => judge('forgiven');
      castBtn.onclick = () => judge('cast');
    }

    function finish() {
      container.removeChild(wrapper);
      resolve();
    }

    showSoul();
  });
}

function makeBtn(text, bg, color, border = 'none') {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.style.cssText = `
    font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700;
    padding: 14px 32px; cursor: pointer; letter-spacing: 0.15em;
    background: ${bg}; color: ${color}; border: ${border}; border-radius: 4px;
    transition: transform 0.1s;
  `;
  btn.onmouseenter = () => { btn.style.transform = 'scale(1.05)'; };
  btn.onmouseleave = () => { btn.style.transform = 'scale(1)'; };
  return btn;
}
