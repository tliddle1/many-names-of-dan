export async function run(container, savedState) {
  return new Promise((resolve) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:24px;';

    const title = document.createElement('h1');
    title.textContent = 'The Many Names of Dan';
    title.className = 'font-title';
    title.style.cssText = 'font-size:48px;color:#FFD700;text-align:center;';
    wrapper.appendChild(title);

    const newBtn = document.createElement('button');
    newBtn.textContent = 'New Game';
    newBtn.style.cssText = 'font-family:"Cinzel",serif;font-size:20px;padding:12px 32px;cursor:pointer;background:#222;color:#e0d6c8;border:2px solid #8b6914;';
    newBtn.onclick = () => { container.removeChild(wrapper); resolve('new'); };
    wrapper.appendChild(newBtn);

    if (savedState) {
      const contBtn = document.createElement('button');
      contBtn.textContent = 'Continue';
      contBtn.style.cssText = 'font-family:"Cinzel",serif;font-size:20px;padding:12px 32px;cursor:pointer;background:#222;color:#e0d6c8;border:2px solid #8b6914;';
      contBtn.onclick = () => { container.removeChild(wrapper); resolve('continue'); };
      wrapper.appendChild(contBtn);
    }

    container.appendChild(wrapper);
  });
}
