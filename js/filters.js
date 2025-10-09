import { locationsCR } from './location-data.js';

export function populateProvinces(){
  const selProv = document.getElementById('provincia');
  if(!selProv) return;
  selProv.innerHTML = '<option value="">--Provincia--</option>';
  Object.keys(locationsCR).forEach(p => selProv.innerHTML += `<option>${p}</option>`);
  selProv.addEventListener('change', onProvChange);
  onProvChange();
}

export function populateFilterProvinces(){
  const selProv = document.getElementById('filterProvincia');
  if(!selProv) return;
  selProv.innerHTML = '<option value="">Todas Provincias</option>';
  Object.keys(locationsCR).forEach(p => selProv.innerHTML += `<option>${p}</option>`);
  selProv.addEventListener('change', ()=>{
    const prov = selProv.value;
    const selCanton = document.getElementById('filterCanton');
    selCanton.innerHTML = '<option value="">Todos cantones</option>';
    if(!prov) return;
    Object.keys(locationsCR[prov]).forEach(c=> selCanton.innerHTML += `<option>${c}</option>`);
  });
}

function onProvChange(){
  const provEl = document.getElementById('provincia');
  if(!provEl) return;
  const prov = provEl.value;
  const canton = document.getElementById('canton');
  const distrito = document.getElementById('distrito');
  canton.innerHTML = '<option value="">--Cantón--</option>';
  distrito.innerHTML = '<option value="">--Distrito--</option>';
  if(!prov) return;
  const cantones = Object.keys(locationsCR[prov] || {});
  cantones.forEach(c => canton.innerHTML += `<option>${c}</option>`);
  canton.addEventListener('change', ()=>{
    const c = canton.value;
    distrito.innerHTML = '<option value="">--Distrito--</option>';
    (locationsCR[prov][c] || []).forEach(d => distrito.innerHTML += `<option>${d}</option>`);
  });
}
