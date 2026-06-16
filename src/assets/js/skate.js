(function(){
  const steps = Array.from(document.querySelectorAll('.step'));
  const total = steps.length;
  const fill = document.getElementById('pc-fill');
  const doneEl = document.getElementById('pc-done');
  document.getElementById('pc-total').textContent = total;
  const KEY = 'skate-progress-v1';
  let state = {}; // id -> bool
  let persistent = true;

  function render(){
    let done = 0;
    steps.forEach(s=>{
      const id = s.dataset.id;
      if(state[id]){ s.classList.add('done'); done++; }
      else { s.classList.remove('done'); }
    });
    doneEl.textContent = done;
    fill.style.width = (done/total*100) + '%';
  }

  async function save(){
    if(!persistent) return;
    try { await window.storage.set(KEY, JSON.stringify(state), false); }
    catch(e){ persistent = false; }
  }

  async function load(){
    try {
      const r = await window.storage.get(KEY, false);
      if(r && r.value) state = JSON.parse(r.value) || {};
    } catch(e){ /* no saved data or storage unavailable */ }
    render();
  }

  function toggle(s){
    const id = s.dataset.id;
    state[id] = !state[id];
    render();
    save();
  }

  steps.forEach(s=>{
    const head = s.querySelector('.step-head');
    const chk = s.querySelector('.chk');
    chk.addEventListener('click', e=>{ e.stopPropagation(); toggle(s); });
    head.addEventListener('click', ()=> toggle(s));
  });

  document.getElementById('resetBtn').addEventListener('click', async ()=>{
    state = {};
    render();
    try { await window.storage.delete(KEY, false); } catch(e){}
  });

  load();
})();
