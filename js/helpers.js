/* js/helpers.js */
function q(s){ return document.querySelector(s); }
function showMsg(el, txt, t = 4000){ if(!el) return; el.textContent = txt; setTimeout(()=>el.textContent = '', t); }
function serializeForm(form){ return Object.fromEntries(new FormData(form).entries()); }
