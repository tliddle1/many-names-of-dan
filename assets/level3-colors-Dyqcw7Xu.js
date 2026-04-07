import{t as e}from"./sound-manager-CIe8E3Py.js";import{n as t,r as n,t as r}from"./shapes-CG0hL56V.js";import{t as i}from"./game-loop-BED9Szz-.js";var a=25,o=3,s=[{type:`star`,label:`Gold Star`},{type:`diamond`,label:`Trophy`},{type:`circle`,label:`Gold Coin`}],c=[{type:`star`,label:`Write-Up`},{type:`diamond`,label:`DENIED`},{type:`circle`,label:`Violation`}];async function l(t){return new Promise(n=>{let r=document.createElement(`div`);r.style.cssText=`
      position: relative; width: 100%; height: 100%;
      background: linear-gradient(180deg, #1A0A00 0%, #2a1000 50%, #1A0A00 100%);
    `;let l=document.createElement(`canvas`);l.style.cssText=`width:100%;height:100%;display:block;`,r.appendChild(l);let f=document.createElement(`div`);f.style.cssText=`
      position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
      font-family: 'Cinzel', serif; font-size: 20px; color: #FFD700;
      text-shadow: 0 0 10px rgba(255,215,0,0.5);
    `,r.appendChild(f);let p=document.createElement(`div`);p.style.cssText=`
      position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
      font-family: 'Crimson Text', serif; font-size: 18px; color: #888; text-align: center;
    `,p.textContent=`↑  Gold    ↓  Crimson`,r.appendChild(p);let m=document.createElement(`div`);m.style.cssText=`
      position: absolute; inset: 0; z-index: 10;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.85); gap: 24px; padding: 40px;
    `;let h=document.createElement(`div`);h.style.cssText=`
      font-family: 'Cinzel', serif; font-size: 28px; color: #FFD700;
      text-shadow: 0 0 12px rgba(255,215,0,0.4);
    `,h.textContent=`Sort the Shapes`,m.appendChild(h);let g=document.createElement(`div`);g.style.cssText=`
      font-family: 'Crimson Text', serif; font-size: 22px; color: #ccc;
      text-align: center; line-height: 1.8; max-width: 460px;
    `,g.innerHTML=`
      <span style="color:#FFD700">Gold</span> shapes are rewards — press <b>↑ Up</b><br>
      <span style="color:#D32F2F">Crimson</span> shapes are punishments — press <b>↓ Down</b><br><br>
      Sort <b>${a}</b> correctly to prove your mastery.
    `,m.appendChild(g);let _=document.createElement(`button`);_.textContent=`BEGIN`,_.style.cssText=`
      font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700;
      padding: 14px 40px; cursor: pointer; letter-spacing: 0.15em;
      background: #FFD700; color: #000; border: none; border-radius: 4px;
      transition: transform 0.1s; margin-top: 12px;
    `,_.onmouseenter=()=>{_.style.transform=`scale(1.05)`},_.onmouseleave=()=>{_.style.transform=`scale(1)`},m.appendChild(_),r.appendChild(m);let v=document.createElement(`div`);v.style.cssText=`
      position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%);
      font-family: 'Cinzel', serif; font-size: 16px; color: #c8b070;
      font-style: italic; opacity: 0; transition: opacity 0.3s;
      text-align: center; max-width: 400px;
    `,r.appendChild(v),t.appendChild(r);function y(){l.width=r.clientWidth,l.height=r.clientHeight}y(),window.addEventListener(`resize`,y);let b=l.getContext(`2d`),x=0,S=0,C=null,w=0,T=0,E=[],D=null,O=null,k=0;function A(){let e;e=k>=3?!O:Math.random()>.5,e===O?k++:(k=1,O=e);let t=e?s:c,n=t[Math.floor(Math.random()*t.length)];C={isGold:e,shape:n.type,label:n.label,x:l.width/2,y:l.height/2,size:24,age:0,pulse:0},w=0}function j(t){C&&(t===`up`&&C.isGold||t===`down`&&!C.isGold?(e(`ding`),x++,E.push({...C,vy:t===`up`?-600:600,life:1})):(e(`buzz`),N()),C=null,S++)}function M(){e(`buzz`),N(),C=null,S++}function N(){v.textContent=`"Gold and crimson are not to be confused. Dan would never make such an error."`,v.style.opacity=`1`,D&&clearTimeout(D),D=setTimeout(()=>{v.style.opacity=`0`},2e3)}function P(e){(e.key===`ArrowUp`||e.key===`w`||e.key===`W`)&&(e.preventDefault(),j(`up`)),(e.key===`ArrowDown`||e.key===`s`||e.key===`S`)&&(e.preventDefault(),j(`down`))}let F=i(e=>{if(b.clearRect(0,0,l.width,l.height),d(b,l.width,l.height),!C&&x<a&&(T+=e,T>=.4&&(A(),T=0)),C){w+=e,C.pulse+=e*4;let t=C.size+Math.sin(C.pulse)*3,n=C.isGold?`#FFD700`:`#D32F2F`;w/o>.7&&(b.globalAlpha=.5+Math.sin(w*12)*.5),u(b,C.shape,C.x,C.y,t,n),b.globalAlpha=1,b.fillStyle=n,b.font=`14px "Crimson Text", serif`,b.textAlign=`center`,b.fillText(C.label,C.x,C.y+t+20),w>=o&&M()}for(let t=E.length-1;t>=0;t--){let n=E[t];n.y+=n.vy*e,n.life-=e*1.5,b.globalAlpha=Math.max(0,n.life);let r=n.isGold?`#FFD700`:`#D32F2F`;u(b,n.shape,n.x,n.y,n.size,r),b.globalAlpha=1,n.life<=0&&E.splice(t,1)}f.textContent=`${x} / ${a}`,x>=a&&!C&&(document.removeEventListener(`keydown`,P),E.length===0&&(F.stop(),window.removeEventListener(`resize`,y),D&&clearTimeout(D),t.removeChild(r),n()))});_.onclick=()=>{r.removeChild(m),document.addEventListener(`keydown`,P),F.start()}})}function u(e,i,a,o,s,c){i===`star`?n(e,a,o,s,s*.45,5,c):i===`diamond`?t(e,a,o,s*1.4,s*1.8,c):r(e,a,o,s,c)}function d(e,t,n){e.fillStyle=`rgba(255,215,0,0.08)`,e.fillRect(0,0,40,n),e.fillRect(60,0,20,n),e.fillStyle=`rgba(211,47,47,0.08)`,e.fillRect(t-40,0,40,n),e.fillRect(t-80,0,20,n)}export{l as run};