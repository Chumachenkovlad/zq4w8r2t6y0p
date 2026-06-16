// Рушій рендеру тижневого розкладу. Контент (події, нотатки) приходить із
// window.__DATA__, який інʼєктить шаблон із front-matter сторінки.
const DATA = window.__DATA__ || {};

const DISC = {
  work:    {label:'Робота',     color:'#8b93a7', bg:'rgba(139,147,167,.16)'},
  strength:{label:'Силове',     color:'#5b8cff', bg:'rgba(91,140,255,.18)'},
  boxing:  {label:'Бокс',       color:'#ff5470', bg:'rgba(255,84,112,.18)'},
  basket:  {label:'Баскетбол',  color:'#ff9447', bg:'rgba(255,148,71,.18)'},
  skate:   {label:'Скейт',      color:'#2dd4bf', bg:'rgba(45,212,191,.18)'},
  driving: {label:'Водіння',    color:'#f5c451', bg:'rgba(245,196,81,.18)'},
};
const DAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
const DAYFULL = ['Понеділок','Вівторок','Середа','Четвер','Пʼятниця','Субота','Неділя'];

const EVENTS = DATA.events || [];
const REST = DATA.rest || {};
const NOTES = DATA.notes || [];

const toMin = t => { const [h,m]=t.split(':').map(Number); return h*60+m; };
const START = 9*60, END = 22.5*60, SPAN = END-START;
const PXMIN = 1.0;
const GH = SPAN*PXMIN;

const today = new Date();
const jsDay = today.getDay();
const todayIdx = (jsDay+6)%7;
const monday = new Date(today); monday.setDate(today.getDate()-todayIdx);
const dateOf = i => { const d=new Date(monday); d.setDate(monday.getDate()+i); return d; };
const ddmm = d => `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}`;

const active = {}; Object.keys(DISC).forEach(k=>active[k]=true);

function el(tag,cls){const x=document.createElement(tag); if(cls)x.className=cls; return x;}

function buildSummary(){
  const counts={strength:0,boxing:0,basket:0,skate:0,driving:0};
  EVENTS.forEach(e=>{ if(counts[e.type]!==undefined) counts[e.type]++; });
  const order=['strength','boxing','basket','skate','driving'];
  document.getElementById('summary').innerHTML=order.map(k=>`
    <div class="scount"><span class="dot" style="background:${DISC[k].color}"></span>
      <span class="num">${counts[k]}</span><span class="lbl">${DISC[k].label}</span></div>`).join('');
}

function buildFilters(){
  const order=['strength','boxing','basket','skate','driving','work'];
  document.getElementById('filters').innerHTML=order.map(k=>`
    <span class="chip" data-k="${k}"><span class="dot" style="background:${DISC[k].color}"></span>${DISC[k].label}</span>`).join('');
  document.querySelectorAll('.chip').forEach(c=>{
    c.onclick=()=>{ const k=c.dataset.k; active[k]=!active[k]; c.classList.toggle('off',!active[k]); render(); };
  });
}

function buildGrid(){
  const cal=document.getElementById('cal'); cal.innerHTML='';
  cal.appendChild(el('div','corner'));
  for(let i=0;i<7;i++){
    const d=dateOf(i);
    const h=el('div','dayhead'+(i===todayIdx?' today':''));
    h.innerHTML=`<div class="dn">${DAYS[i]}</div><div class="dd">${ddmm(d)}</div>`;
    cal.appendChild(h);
  }
  const tcol=el('div','timecol'); tcol.style.height=GH+'px';
  for(let m=START;m<=END;m+=60){
    const lab=el('div','tlabel'); lab.style.top=((m-START)*PXMIN)+'px';
    lab.textContent=(m/60)+':00'; tcol.appendChild(lab);
  }
  cal.appendChild(tcol);
  for(let i=0;i<7;i++){
    const col=el('div','daycol'+(i===todayIdx?' today':'')); col.style.height=GH+'px';
    for(let m=START;m<=END;m+=30){
      const ln=el('div','hourline'+(m%60?' half':'')); ln.style.top=((m-START)*PXMIN)+'px';
      col.appendChild(ln);
    }
    EVENTS.filter(e=>e.day===i && active[e.type]).forEach(e=>{
      const top=(toMin(e.s)-START)*PXMIN, h=(toMin(e.e)-toMin(e.s))*PXMIN;
      const ev=el('div','ev'+(e.assumed?' assumed':'')+(h<40?' tiny':''));
      ev.style.top=top+'px'; ev.style.height=(h-3)+'px';
      ev.style.setProperty('--c',DISC[e.type].color);
      ev.style.setProperty('--evbg',DISC[e.type].bg);
      ev.innerHTML=`<span class="et">${e.t}</span>${h>=40?`<span class="etime">${e.s}–${e.e}</span>`:''}`;
      ev.onclick=()=>openSheet(e);
      col.appendChild(ev);
    });
    cal.appendChild(col);
  }
}

function buildList(){
  const wrap=document.getElementById('list'); wrap.innerHTML='';
  for(let i=0;i<7;i++){
    const d=dateOf(i);
    const card=el('div','dcard'+(i===todayIdx?' today':''));
    let html=`<h3>${DAYS[i]} <small>${DAYFULL[i]} · ${ddmm(d)}</small>${i===todayIdx?'<span class="todaytag">сьогодні</span>':''}</h3>`;
    const evs=EVENTS.filter(e=>e.day===i && active[e.type]).sort((a,b)=>toMin(a.s)-toMin(b.s));
    if(evs.length===0) html+=`<div class="emptyday">Вільно / відпочинок</div>`;
    evs.forEach(e=>{
      html+=`<div class="litem" data-idx="${EVENTS.indexOf(e)}">
        <div class="bar" style="background:${DISC[e.type].color}"></div>
        <div><div class="lt">${e.t}</div><div class="ltime">${e.s}–${e.e}${e.meta?' · '+e.meta:''}</div>${e.n?`<div class="ln">${e.n}</div>`:''}</div></div>`;
    });
    if(REST[i]) html+=`<div class="restrow">${REST[i]}</div>`;
    card.innerHTML=html;
    wrap.appendChild(card);
  }
  wrap.querySelectorAll('.litem').forEach(li=>{ li.onclick=()=>openSheet(EVENTS[+li.dataset.idx]); });
}

function buildNotes(){
  document.getElementById('notes').innerHTML=NOTES.map(n=>`
    <div class="note" style="--c:${n.c}"><b>${n.b}</b><p>${n.p}</p></div>`).join('');
}

function openSheet(e){
  const st=document.getElementById('sType');
  st.innerHTML=`<span class="dot" style="background:${DISC[e.type].color}"></span>${DISC[e.type].label}`;
  document.getElementById('sheet').style.setProperty('--c',DISC[e.type].color);
  document.getElementById('sTitle').textContent=e.t;
  document.getElementById('sWhen').textContent=`${DAYFULL[e.day]}, ${e.s}–${e.e}`+(e.meta?'  ·  '+e.meta:'')+(e.assumed?'  · час орієнтовний':'');
  const exBox=document.getElementById('sEx');
  if(e.ex&&e.ex.length){
    exBox.style.display='';
    exBox.innerHTML=e.ex.map((x,i)=>`<div class="exrow"><span class="exn"><b>${i+1}.</b>${x.n}</span><span class="exs">${x.s}</span></div>`).join('');
  } else { exBox.style.display='none'; exBox.innerHTML=''; }
  document.getElementById('sNote').textContent=e.n||'';
  document.getElementById('overlay').classList.add('open');
}
document.getElementById('sClose').onclick=()=>document.getElementById('overlay').classList.remove('open');
document.getElementById('overlay').onclick=ev=>{ if(ev.target.id==='overlay') document.getElementById('overlay').classList.remove('open'); };

document.querySelectorAll('#viewseg button').forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll('#viewseg button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const grid=b.dataset.v==='grid';
    document.getElementById('gridWrap').style.display=grid?'':'none';
    document.getElementById('list').style.display=grid?'none':'';
  };
});

function pad(n){return String(n).padStart(2,'0');}
function icsDate(dayIdx,t){
  const d=dateOf(dayIdx); const [h,m]=t.split(':').map(Number);
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(h)}${pad(m)}00`;
}
function esc(s){return (s||'').replace(/\\/g,'\\\\').replace(/,/g,'\\,').replace(/;/g,'\\;').replace(/\n/g,'\\n');}
function buildICS(){
  const stamp=new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
  let out=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Trenuvalnyi Tyzhden//UA','CALSCALE:GREGORIAN','METHOD:PUBLISH'];
  EVENTS.filter(e=>e.type!=='work').forEach((e,i)=>{
    out.push('BEGIN:VEVENT',
      `UID:tt-${i}-${Date.now()}@local`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${icsDate(e.day,e.s)}`,
      `DTEND:${icsDate(e.day,e.e)}`,
      'RRULE:FREQ=WEEKLY',
      `SUMMARY:${esc(e.t)}`,
      `DESCRIPTION:${esc((e.n||'')+(e.assumed?' [час орієнтовний — підправ]':''))}`,
      'END:VEVENT');
  });
  out.push('END:VCALENDAR');
  return out.join('\r\n');
}
document.getElementById('icsBtn').onclick=()=>{
  const blob=new Blob([buildICS()],{type:'text/calendar;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='trenuvalnyi-tyzhden.ics';
  document.body.appendChild(a); a.click(); a.remove();
};

function render(){ buildGrid(); buildList(); }
buildSummary(); buildFilters(); buildNotes(); render();
if(window.innerWidth<640){ document.querySelector('#viewseg button[data-v="list"]').click(); }
