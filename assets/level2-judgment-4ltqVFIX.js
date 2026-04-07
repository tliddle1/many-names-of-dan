import{n as e}from"./index-Bk7WGUZV.js";import{t}from"./dan-C-gQqMrl.js";var n=[`Microwaved fish in the shared kitchen. Twice.`,`Replied-all to a company-wide email to say "Thanks!"`,`Took the last cup of coffee and did not make more.`,`Scheduled a meeting that could have been an email.`,`Ate someone else's clearly labeled lunch.`,`Put in a PTO request for the entire month of December.`,`Used "per my last email" with malicious intent.`,`Adjusted the thermostat without consulting the committee.`,`Brought a speakerphone call into the open office.`,`Left passive-aggressive Post-it notes on the communal fridge.`,`Clipped their nails at their desk. During a video call.`,`Sent a Slack message that just said "Hi" and then waited.`,`Heated up leftover broccoli in the microwave at 11:47 AM.`,`Took credit for the team's work in the all-hands meeting.`],r=11,i=[`"Mercy flows through the Arbiter like fluorescent light through a drop ceiling."`,`"The sin is cleansed. The soul ascends to the 3rd floor — Accounting."`,`"Forgiven. But not forgotten. It goes in the file."`,`"The Arbiter shows compassion. The breakroom grows slightly warmer."`],a=[`"The soul descends. There is no PTO in the deeper circles."`,`"Cast deeper. Let them contemplate their sins beside the 2003 holiday decorations."`,`"The flames of HR compliance consume another offender."`,`"Down they go. The sub-basement welcomes all."`];async function o(o){return new Promise(c=>{let l=document.createElement(`div`);l.style.cssText=`
      position: relative; width: 100%; height: 100%;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      overflow: hidden;
    `;let u=document.createElement(`div`);u.style.cssText=`
      position: absolute; inset: 0; z-index: 0;
      background: radial-gradient(ellipse at 50% 120%, #FF6F00 0%, #D32F2F 30%, #1B0000 70%, #000 100%);
    `,l.appendChild(u);let d=document.createElement(`div`);d.style.cssText=`
      position: absolute; inset: 0; z-index: 1;
      background: radial-gradient(ellipse at 30% 100%, rgba(255,111,0,0.4) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 100%, rgba(211,47,47,0.3) 0%, transparent 50%);
      mix-blend-mode: screen;
      animation: fire-pulse 3s ease-in-out infinite alternate;
    `,l.appendChild(d);let f=document.createElement(`style`);f.textContent=`
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
    `,l.appendChild(f);let p=document.createElement(`div`);p.style.cssText=`position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:20vh;gap:20px;`;let m=document.createElement(`div`);m.style.cssText=`width:60%;max-width:500px;height:12px;background:rgba(0,0,0,0.5);border:1px solid #D32F2F;border-radius:6px;overflow:hidden;`;let h=document.createElement(`div`);h.style.cssText=`width:0%;height:100%;background:linear-gradient(to right,#FF6F00,#D32F2F,#FFD600);transition:width 0.4s;border-radius:6px;`,m.appendChild(h),p.appendChild(m);let g=document.createElement(`div`);g.style.cssText=`display:flex;flex-direction:column;align-items:center;position:relative;`,t(g,`judge`,1.3);let _=document.createElement(`div`);_.style.cssText=`
      width: 160px; height: 80px; margin-top: -85px;
      background: linear-gradient(to bottom, #5d4037, #3e2723);
      border-top: 4px solid #8b6914;
      border-radius: 4px 4px 0 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      position: relative; z-index: 1;
    `,g.appendChild(_);let v=document.createElement(`div`);v.style.cssText=`
      width: 180px; height: 10px;
      background: #3e2723;
      border-radius: 0 0 4px 4px;
      border-top: 2px solid #4e342e;
      position: relative; z-index: 1;
    `,g.appendChild(v),p.appendChild(g);let y=document.createElement(`div`);y.style.cssText=`display:flex;flex-direction:column;align-items:center;gap:20px;width:500px;`;let b=document.createElement(`div`);b.style.cssText=`
      background: rgba(255,255,255,0.1); backdrop-filter: blur(4px);
      border: 1px solid rgba(255,215,0,0.3); border-radius: 8px;
      padding: 28px 36px; width: 100%; min-height: 80px; text-align: center;
      font-family: 'Crimson Text', serif; font-size: 24px; color: #e0d6c8;
      display: flex; align-items: center; justify-content: center;
    `,y.appendChild(b);let x=document.createElement(`div`);x.style.cssText=`display:flex;gap:24px;`;let S=s(`FORGIVEN`,`#FFD600`,`#000`),C=s(`CAST DEEPER`,`#1a1a1a`,`#FF4444`,`1px solid #FF4444`);x.appendChild(S),x.appendChild(C),y.appendChild(x);let w=document.createElement(`p`);w.style.cssText=`font-family:"Crimson Text",serif;font-size:28px;font-weight:700;color:#000;font-style:italic;text-align:center;min-height:70px;visibility:hidden;`,y.appendChild(w),p.appendChild(y),l.appendChild(p),o.appendChild(l);let T=[...n].sort(()=>Math.random()-.5).slice(0,r),E=0,D=null,O=!1;function k(){O&&(O=!1,D&&clearTimeout(D),l.removeEventListener(`click`,k),A())}function A(){if(E>=T.length){j();return}b.textContent=T[E],b.style.animation=``,b.style.opacity=`1`,b.style.transform=``,S.disabled=!1,C.disabled=!1,x.style.visibility=`visible`,w.textContent=`\xA0`,w.style.visibility=`hidden`;function t(t){e(`whoosh`),S.disabled=!0,C.disabled=!0,x.style.visibility=`hidden`,t===`forgiven`?(b.style.animation=`fly-left 0.6s ease-in forwards`,w.textContent=i[E%i.length]):(b.style.animation=`fly-right 0.6s ease-in forwards`,w.textContent=a[E%a.length]),w.style.visibility=`visible`,E++,h.style.width=`${E/T.length*100}%`,O=!0,setTimeout(()=>l.addEventListener(`click`,k),100),D=setTimeout(k,3500)}S.onclick=()=>t(`forgiven`),C.onclick=()=>t(`cast`)}function j(){o.removeChild(l),c()}A()})}function s(e,t,n,r=`none`){let i=document.createElement(`button`);return i.textContent=e,i.style.cssText=`
    font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700;
    padding: 14px 32px; cursor: pointer; letter-spacing: 0.15em;
    background: ${t}; color: ${n}; border: ${r}; border-radius: 4px;
    transition: transform 0.1s;
  `,i.onmouseenter=()=>{i.style.transform=`scale(1.05)`},i.onmouseleave=()=>{i.style.transform=`scale(1)`},i}export{o as run};