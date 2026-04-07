import '../styles/narrator.css';

const CHAR_DELAY = 30;
const ELLIPSIS_DELAY = 500;
const DASH_DELAY = 300;

export async function run(container, text, options = {}) {
  const { className = '', showContinue = true } = options;

  return new Promise((resolve) => {
    const wrapper = document.createElement('div');
    wrapper.className = `narrator-wrapper ${className}`;

    const textEl = document.createElement('p');
    textEl.className = 'narrator-text font-narrator';
    wrapper.appendChild(textEl);

    // Wrap each character in a span so the full text is laid out upfront.
    // Characters start invisible and are revealed one at a time.
    const charSpans = [];
    const cursor = document.createElement('span');
    cursor.className = 'narrator-cursor';
    cursor.textContent = '|';

    for (let i = 0; i < text.length; i++) {
      if (text[i] === '\n') {
        const br = document.createElement('br');
        textEl.appendChild(br);
        // Push a dummy span so charIndex stays aligned with text
        charSpans.push(br);
        continue;
      }
      const span = document.createElement('span');
      span.textContent = text[i];
      span.style.visibility = 'hidden';
      textEl.appendChild(span);
      charSpans.push(span);
    }
    // Cursor starts at the beginning
    if (charSpans.length > 0) {
      textEl.insertBefore(cursor, charSpans[0]);
    }

    const continueBtn = document.createElement('button');
    continueBtn.className = 'narrator-continue font-narrator';
    continueBtn.textContent = '▸ Continue';
    continueBtn.style.visibility = 'hidden';
    wrapper.appendChild(continueBtn);

    container.appendChild(wrapper);

    let charIndex = 0;
    let timeoutId = null;
    let finished = false;

    let phase = 'typing'; // 'typing' -> 'waiting' -> done

    function showAllText() {
      if (phase !== 'typing') return;
      phase = 'waiting';
      if (timeoutId) clearTimeout(timeoutId);
      for (const span of charSpans) {
        span.style.visibility = 'visible';
      }
      cursor.style.display = 'none';
      if (showContinue) {
        continueBtn.style.visibility = 'visible';
      } else {
        cleanup();
        resolve();
      }
    }

    function advance() {
      if (phase !== 'waiting') return;
      phase = 'done';
      cleanup();
      resolve();
    }

    function handleSkip() {
      if (phase === 'typing') {
        showAllText();
      }
    }

    function cleanup() {
      document.removeEventListener('click', handleSkip);
      container.removeChild(wrapper);
    }

    function typeNext() {
      if (charIndex >= charSpans.length) {
        showAllText();
        return;
      }

      charSpans[charIndex].style.visibility = 'visible';
      charIndex++;
      // Move cursor after the last revealed character
      if (charIndex < charSpans.length) {
        textEl.insertBefore(cursor, charSpans[charIndex]);
      } else {
        textEl.appendChild(cursor);
      }

      let delay = CHAR_DELAY;
      if (charIndex >= 3 && text.slice(charIndex - 3, charIndex) === '...') {
        delay = ELLIPSIS_DELAY;
      } else if (text[charIndex - 1] === '—') {
        delay = DASH_DELAY;
      }

      timeoutId = setTimeout(typeNext, delay);
    }

    continueBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      advance();
    });

    // Delay registering skip handlers so a click/key from the previous
    // narrator's continue button doesn't immediately skip this one
    setTimeout(() => {
      document.addEventListener('click', handleSkip);
    }, 100);

    typeNext();
  });
}
