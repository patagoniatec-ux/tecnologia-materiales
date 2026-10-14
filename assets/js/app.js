'use strict';
window.Aula = (() => {
 const categories={construccion:'Construcción',metales:'Aceros y metales',maderas:'Maderas',impresion3d:'Impresión 3D'};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function url(value,{image=false}={}) {
  if(typeof value!=='string'||!value.trim())return '';
  const v=value.trim();
  if(/^https:\/\//i.test(v)){try {const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}}
  if(/^(assets\/img|documentos)\/[a-zA-Z0-9_./-]+$/.test(v)&&!v.split('/').includes('..'))return v;
  return '';
 }
 const date=v=>/^\d{4}-\d{2}-\d{2}$/.test(v||'')?new Date(v+'T12:00:00').toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'}):'';
 const empty=(title,body)=>`<div class="empty-state"><strong>${esc(title)}</strong><p>${esc(body)}</p></div>`;
 const ready=fetch('data/contenido.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('No se pudo cargar el catálogo.');return r.json();}).then(data=>{if(!data.config||!['biblioteca','contenidos','noticias','galeria'].every(k=>Array.isArray(data[k])))throw Error('El catálogo no tiene un formato válido.');return data;});
 ready.catch(()=>{});
 document.querySelector('.menu-toggle')?.addEventListener('click',e=>{const open=document.getElementById('navigation').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));e.currentTarget.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');});
 ready.then(data=>{const ig=url(data.config.instagram);if(ig&&new URL(ig).hostname.replace(/^www\./,'')==='instagram.com')document.querySelectorAll('[data-instagram]').forEach(a=>{a.href=ig;a.hidden=false;});}).catch(()=>{});
 return {categories,esc,url,date,empty,ready};
})();
