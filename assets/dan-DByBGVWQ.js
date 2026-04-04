import{a as e,i as t}from"./shapes-DyW1ToKl.js";var n=`#b8a04c`;function r(e){return`<g>
    <path d="
      M${e-14},32
      Q${e-12},20 ${e-4},18
      L${e-2},14
      L${e+1},18
      L${e+4},13
      L${e+8},19
      Q${e+14},20 ${e+14},32
      Q${e+10},29 ${e},30
      Q${e-10},29 ${e-14},32
      Z
    " fill="${n}"/>
    <path d="M${e-6},24 L${e-4},17" stroke="#8a7a30" stroke-width="1" stroke-linecap="round"/>
    <path d="M${e+2},23 L${e+4},16" stroke="#8a7a30" stroke-width="1" stroke-linecap="round"/>
    <path d="M${e-10},27 L${e-8},21" stroke="#8a7a30" stroke-width="1" stroke-linecap="round"/>
  </g>`}var i=`#c2b280`,a={office:{shirtColor:`#111111`,headColor:`#e8beac`,accents:()=>[]},judge:{shirtColor:`#1a1a2e`,headColor:`#e8beac`,accents:t=>[e(t-18,52,36,8,`#4a0e0e`),`<g transform="rotate(20,${t+23},75)">
        <rect x="${t+20}" y="60" width="6" height="30" rx="2" fill="#8b6914"/>
        <rect x="${t+16}" y="56" width="14" height="8" rx="2" fill="#5d4037"/>
      </g>`]},cosmic:{shirtColor:`#1a0a3e`,headColor:`#e8beac`,accents:e=>[t(e-10,65,2,`#FFD700`),t(e+8,72,1.5,`#00E5FF`),t(e-5,78,1,`#7C4DFF`),t(e+12,68,1.5,`#FFD700`),`<polygon points="${e-18},54 ${e},48 ${e+18},54" fill="#311B92"/>`]},medieval:{shirtColor:`#5d4037`,headColor:`#e8beac`,accents:t=>[`<polygon points="${t-10},16 ${t-6},8 ${t-2},14 ${t+2},6 ${t+6},14 ${t+10},8 ${t+14},16" fill="#FFC107"/>`,e(t-14,72,28,4,`#8b6914`),e(t-3,71,6,6,`#FFC107`,1)]},fist:{shirtColor:`#1a1a1a`,headColor:`#e8beac`,accents:e=>[`<g transform="translate(${e+22}, 50)">
        <rect x="-6" y="-16" width="14" height="20" rx="4" fill="#e8beac"/>
        <rect x="-6" y="-16" width="14" height="5" rx="2" fill="#d4a08a"/>
        <rect x="-6" y="-8" width="14" height="5" rx="2" fill="#d4a08a"/>
      </g>`,t(e+29,42,18,`rgba(255,215,0,0.15)`)]}};function o(n=`office`,o=100,s=120){let c=o/2,l=a[n]||a.office;return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o} ${s}" width="${o}" height="${s}">${[e(c-12,88,10,28,i,3),e(c+2,88,10,28,i,3),e(c-16,52,32,40,l.shirtColor,6),e(c-24,56,10,28,l.shirtColor,4),e(c+14,56,10,28,l.shirtColor,4),t(c,38,16,l.headColor),r(c),t(c-5,36,2,`#2c3e50`),t(c+5,36,2,`#2c3e50`),`<path d="M${c-4},43 Q${c},47 ${c+4},43" fill="none" stroke="#2c3e50" stroke-width="1.5" stroke-linecap="round"/>`,...l.accents(c)].join(``)}</svg>`}function s(e,t=`office`,n=1){let r=document.createElement(`div`);return r.className=`dan-character`,r.innerHTML=o(t,100*n,120*n),e.appendChild(r),r}export{s as t};