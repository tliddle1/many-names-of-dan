import{n as e,r as t,t as n}from"./shapes-DyW1ToKl.js";import"./sound-manager-5pdaUF8g.js";import{t as r}from"./game-loop-BED9Szz-.js";var i=25,a=3,o=[{type:`star`,label:`Gold Star`},{type:`diamond`,label:`Trophy`},{type:`circle`,label:`Gold Coin`}],s=[{type:`star`,label:`Write-Up`},{type:`diamond`,label:`DENIED`},{type:`circle`,label:`Violation`}];async function c(e){return new Promise(t=>{let n=document.createElement(`div`);n.style.cssText=`
      position: relative; width: 100%; height: 100%;
      background: linear-gradient(180deg, #1A0A00 0%, #2a1000 50%, #1A0A00 100%);
    `;let c=document.createElement(`canvas`);c.style.cssText=`width:100%;height:100%;display:block;`,n.appendChild(c);let d=document.createElement(`div`);d.style.cssText=`
      position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
      font-family: 'Cinzel', serif; font-size: 20px; color: #FFD700;
      text-shadow: 0 0 10px rgba(255,215,0,0.5);
    `,n.appendChild(d);let f=document.createElement(`div`);f.style.cssText=`
      position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
      font-family: 'Crimson Text', serif; font-size: 18px; color: #888; text-align: center;
    `,f.textContent=`↑  Gold    ↓  Crimson`,n.appendChild(f);let p=document.createElement(`div`);p.style.cssText=`
      position: absolute; inset: 0; z-index: 10;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.85); gap: 24px; padding: 40px;
    `;let m=document.createElement(`div`);m.style.cssText=`
      font-family: 'Cinzel', serif; font-size: 28px; color: #FFD700;
      text-shadow: 0 0 12px rgba(255,215,0,0.4);
    `,m.textContent=`Sort the Shapes`,p.appendChild(m);let h=document.createElement(`div`);h.style.cssText=`
      font-family: 'Crimson Text', serif; font-size: 22px; color: #ccc;
      text-align: center; line-height: 1.8; max-width: 460px;
    `,h.innerHTML=`
      <span style="color:#FFD700">Gold</span> shapes are rewards — press <b>↑ Up</b><br>
      <span style="color:#D32F2F">Crimson</span> shapes are punishments — press <b>↓ Down</b><br><br>
      Sort <b>${i}</b> correctly to prove your mastery.
    `,p.appendChild(h);let g=document.createElement(`button`);g.textContent=`BEGIN`,g.style.cssText=`
      font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700;
      padding: 14px 40px; cursor: pointer; letter-spacing: 0.15em;
      background: #FFD700; color: #000; border: none; border-radius: 4px;
      transition: transform 0.1s; margin-top: 12px;
    `,g.onmouseenter=()=>{g.style.transform=`scale(1.05)`},g.onmouseleave=()=>{g.style.transform=`scale(1)`},p.appendChild(g),n.appendChild(p);let _=document.createElement(`div`);_.style.cssText=`
      position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%);
      font-family: 'Cinzel', serif; font-size: 16px; color: #c8b070;
      font-style: italic; opacity: 0; transition: opacity 0.3s;
      text-align: center; max-width: 400px;
    `,n.appendChild(_),e.appendChild(n);function v(){c.width=n.clientWidth,c.height=n.clientHeight}v(),window.addEventListener(`resize`,v);let y=c.getContext(`2d`),b=0,x=0,S=null,C=0,w=0,T=[],E=null;function D(){let e=Math.random()>.5,t=e?o:s,n=t[Math.floor(Math.random()*t.length)];S={isGold:e,shape:n.type,label:n.label,x:c.width/2,y:c.height/2,size:24,age:0,pulse:0},C=0}function O(e){S&&(e===`up`&&S.isGold||e===`down`&&!S.isGold?(b++,T.push({...S,vy:e===`up`?-600:600,life:1})):A(),S=null,x++)}function k(){A(),S=null,x++}function A(){_.textContent=`"Gold and crimson are not to be confused. Dan would never make such an error."`,_.style.opacity=`1`,E&&clearTimeout(E),E=setTimeout(()=>{_.style.opacity=`0`},2e3)}function j(e){(e.key===`ArrowUp`||e.key===`w`||e.key===`W`)&&(e.preventDefault(),O(`up`)),(e.key===`ArrowDown`||e.key===`s`||e.key===`S`)&&(e.preventDefault(),O(`down`))}let M=r(r=>{if(y.clearRect(0,0,c.width,c.height),u(y,c.width,c.height),!S&&b<i&&(w+=r,w>=.4&&(D(),w=0)),S){C+=r,S.pulse+=r*4;let e=S.size+Math.sin(S.pulse)*3,t=S.isGold?`#FFD700`:`#D32F2F`;C/a>.7&&(y.globalAlpha=.5+Math.sin(C*12)*.5),l(y,S.shape,S.x,S.y,e,t),y.globalAlpha=1,y.fillStyle=t,y.font=`14px "Crimson Text", serif`,y.textAlign=`center`,y.fillText(S.label,S.x,S.y+e+20),C>=a&&k()}for(let e=T.length-1;e>=0;e--){let t=T[e];t.y+=t.vy*r,t.life-=r*1.5,y.globalAlpha=Math.max(0,t.life);let n=t.isGold?`#FFD700`:`#D32F2F`;l(y,t.shape,t.x,t.y,t.size,n),y.globalAlpha=1,t.life<=0&&T.splice(e,1)}d.textContent=`${b} / ${i}`,b>=i&&!S&&(document.removeEventListener(`keydown`,j),T.length===0&&(M.stop(),window.removeEventListener(`resize`,v),E&&clearTimeout(E),e.removeChild(n),t()))});g.onclick=()=>{n.removeChild(p),document.addEventListener(`keydown`,j),M.start()}})}function l(r,i,a,o,s,c){i===`star`?t(r,a,o,s,s*.45,5,c):i===`diamond`?e(r,a,o,s*1.4,s*1.8,c):n(r,a,o,s,c)}function u(e,t,n){e.fillStyle=`rgba(255,215,0,0.08)`,e.fillRect(0,0,40,n),e.fillRect(60,0,20,n),e.fillStyle=`rgba(211,47,47,0.08)`,e.fillRect(t-40,0,40,n),e.fillRect(t-80,0,20,n)}export{c as run};