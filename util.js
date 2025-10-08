function wtCodeGen() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let c = "";
    for (let i=0;i<6;i++) c += chars[Math.floor(Math.random()*chars.length)];
    return c;
  }
  
  function wtCopy(text) {
    return navigator.clipboard?.writeText(text);
  }
  
  function wtToast(el, msg, ms=1500) {
    if (!el) return;
    el.textContent = msg;
    el.style.opacity = 1;
    clearTimeout(el._t);
    el._t = setTimeout(()=>{ el.style.opacity = .85; }, 50);
    clearTimeout(el._t2);
    el._t2 = setTimeout(()=>{ el.textContent=''; el.style.opacity = 1; }, ms);
  }
  
  function wtUserId() {
    let id = localStorage.getItem('wt_user_id');
    if (!id) { id = 'user_' + Math.random().toString(36).slice(2,7); localStorage.setItem('wt_user_id', id); }
    return id;
  }
  function wtUserName() {
    let nm = localStorage.getItem('wt_user_name');
    if (!nm) { nm = 'Guest ' + Math.floor(100 + Math.random()*900); localStorage.setItem('wt_user_name', nm); }
    return nm;
  }
  function wtSetUserName(name) { localStorage.setItem('wt_user_name', name); }
  