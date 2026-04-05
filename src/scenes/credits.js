const CREDITS = [
  { role: 'Directed by', name: 'Tip Top Robins' },
  { role: 'Produced by', name: 'Datt Mamon' },
  { role: 'Catering by', name: 'Whip Gimble' },
  { role: 'Emotional Support provided by', name: 'Father Hoot' },
  { role: 'Best Boy Grip', name: 'Lambo' },
  { role: 'Key Grip', name: 'Danfast Lamgeee' },
  { role: 'Spiritual Advisor', name: 'Daryl Wunderlust' },
  { role: 'Dan Lambourne played by', name: 'Dan Lambourne' },
];

const FINAL_CARD = '"And there are many other names that have not yet been revealed..."';

export async function run(container) {
  return new Promise((resolve) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:absolute;inset:0;background:#000;overflow:hidden;cursor:pointer;';

    const scroll = document.createElement('div');
    scroll.style.cssText = 'position:absolute;bottom:-100%;width:100%;text-align:center;animation:credits-scroll 18s linear forwards;';

    for (const credit of CREDITS) {
      const roleEl = document.createElement('p');
      roleEl.style.cssText = 'font-family:"Crimson Text",serif;font-size:16px;color:#888;margin-top:40px;';
      roleEl.textContent = credit.role;
      scroll.appendChild(roleEl);

      const nameEl = document.createElement('p');
      nameEl.style.cssText = 'font-family:"Cinzel",serif;font-size:28px;color:#FFD700;margin-top:8px;';
      nameEl.textContent = credit.name;
      scroll.appendChild(nameEl);
    }

    const finalCard = document.createElement('p');
    finalCard.style.cssText = 'font-family:"Cinzel",serif;font-size:20px;color:#c8b070;font-style:italic;margin-top:80px;max-width:500px;margin-left:auto;margin-right:auto;';
    finalCard.textContent = FINAL_CARD;
    scroll.appendChild(finalCard);

    wrapper.appendChild(scroll);

    const skipHint = document.createElement('div');
    skipHint.style.cssText = 'position:absolute;bottom:20px;right:20px;color:#555;font-size:13px;font-family:"Crimson Text",serif;z-index:3;';
    skipHint.textContent = 'Click to skip';
    wrapper.appendChild(skipHint);

    // Inject keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes credits-scroll {
        0% { transform: translateY(0); }
        100% { transform: translateY(-200%); }
      }
    `;
    wrapper.appendChild(style);

    container.appendChild(wrapper);

    function finish() {
      document.removeEventListener('keydown', finish);
      container.removeChild(wrapper);
      resolve();
    }

    scroll.addEventListener('animationend', finish);
    wrapper.addEventListener('click', finish);
    document.addEventListener('keydown', finish);
  });
}
