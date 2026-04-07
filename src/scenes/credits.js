const CREDITS = [
  { role: 'Director', name: 'Tip Top Robins' },
  { role: 'Executive Producer', name: 'Dad Lambourne' },
  { role: 'Lead Screenwriter', name: 'Quentin McQuade' },
  { role: 'Casting Director', name: 'Mammary Clark' },
  { role: 'Composer', name: 'DJ Gramz' },
  { role: 'Sound Designer', name: 'Three screams, two whistles' },
  { role: 'Director of Photography', name: 'The Great Mirage' },
  { role: 'Gaffer', name: 'Fully Torqued' },
  { role: 'Costume Designer', name: 'Tweed Lickuns' },
  { role: 'Prosthetics & Special Makeup Effects', name: 'Two Snow Leopard Cubs in a Trenchcoat' },
  { role: 'Stunt Coordinator', name: 'The Perpetual Danstand' },
  { role: 'Safety Coordinator', name: 'Mr. No, NO NONONONONO' },
  { role: 'Pyrotechnics Supervisor', name: 'Dan-O-Mite!' },
  { role: 'Visual Effects Supervisor', name: 'The Einstein-Rosen Bulge' },
  { role: 'CGI Character Animator', name: 'Danbotron' },
  { role: 'Lead Editor', name: 'The AmperDand' },
  { role: 'Colorist', name: 'Flavor 58' },
  { role: 'Location Scout', name: "Deeney's Gap" },
  { role: 'Unit Production Manager', name: 'The only man' },
  { role: 'Catering', name: "Rack O' Lambourne" },
  { role: 'On-Set Beverages', name: '35oz of Malt Vinegar' },
  { role: 'Animal Wrangler', name: 'Cool Daddy Katz' },
  { role: 'Stunt Driver', name: 'Lambo' },
  { role: 'Insurance & Liability', name: 'Dubious Coverage' },
  { role: 'Risk Assessment', name: 'Pretty bad odds' },
  { role: 'On-Set Medic', name: 'Dr. Richard Vanlangendonck' },
  { role: 'Security', name: 'THE absolute unit' },
  { role: 'Night Watchman', name: 'Gary-of-the-dawn' },
  { role: 'Weather Consultant', name: 'A stiff early frost' },
  { role: 'On-Set Meteorologist', name: 'Hurricane William' },
  { role: 'Marketing', name: 'Big Drip D-Lambo, the Rizzy Rizmaster' },
  { role: 'Piano Tuner', name: 'Toots Mahogany' },
  { role: 'Military Advisor', name: 'Talidan' },
  { role: 'Dan Lambourne', name: 'Dan Lambourne' },
];

const FINAL_CARD = '"And there are many other names that have not yet been revealed..."';

export async function run(container) {
  return new Promise((resolve) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:absolute;inset:0;background:#000;overflow:hidden;cursor:default;';

    const scroll = document.createElement('div');
    scroll.style.cssText = 'position:absolute;top:100%;width:100%;text-align:center;animation:credits-scroll 60s linear forwards;';

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

    const skipBtn = document.createElement('button');
    skipBtn.textContent = 'Skip';
    skipBtn.style.cssText = 'position:absolute;bottom:20px;right:20px;color:#555;font-size:13px;font-family:"Crimson Text",serif;z-index:3;background:none;border:1px solid #333;padding:4px 12px;cursor:pointer;';
    wrapper.appendChild(skipBtn);

    // Inject keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes credits-scroll {
        0% { transform: translateY(0); }
        100% { transform: translateY(calc(-100% - 100vh)); }
      }
    `;
    wrapper.appendChild(style);

    container.appendChild(wrapper);

    function finish() {
      container.removeChild(wrapper);
      resolve();
    }

    scroll.addEventListener('animationend', finish);
    skipBtn.addEventListener('click', finish);
  });
}
