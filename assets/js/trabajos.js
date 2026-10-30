
'use strict';
(async()=>{
 const host=document.getElementById('student-works');if(!host)return;
 const {esc,url,ready}=Aula;
 let works;
 try{const data=await ready;works=(data.trabajos||[]).filter(w=>url(w.url)&&(!host.dataset.project||w.project===host.dataset.project));}
 catch{host.innerHTML='<p class="notice">No pudimos cargar las entregas. Volvé a intentarlo más tarde.</p>';return;}
 const search=document.getElementById('student-search'),count=document.getElementById('student-count');
 function render(){
  const q=(search?.value||'').trim().toLocaleLowerCase('es');
  const filtered=works.filter(w=>[w.author,w.groupName,w.title,w.course].join(' ').toLocaleLowerCase('es').includes(q));
  if(count)count.textContent=`${filtered.length} trabajo${filtered.length===1?'':'s'} publicado${filtered.length===1?'':'s'}`;
  host.innerHTML=filtered.length?filtered.map((w,i)=>`<article class="student-work"><span class="doc-icon">PDF</span><div class="resource-main"><p class="meta">${w.mode==='grupal'?'TRABAJO GRUPAL':'TRABAJO INDIVIDUAL'}${w.groupName?' · '+esc(w.groupName):''}${w.course?' · '+esc(w.course):''}</p><h3 class="student-names">${esc(w.author||'Autor sin indicar')}</h3><h4>${esc(w.title)}</h4>${w.description?`<p>${esc(w.description)}</p>`:''}</div><div class="student-actions"><a class="button" href="${esc(url(w.url))}" data-work="${i}" target="_blank" rel="noopener">Ampliar PDF ↗</a><a class="text-link" href="${esc(url(w.url))}" download target="_blank" rel="noopener">Descargar / abrir original</a></div></article>`).join(''):`<div class="empty-state"><strong>${works.length?'No encontramos coincidencias.':'Las entregas aparecerán aquí.'}</strong><p>${works.length?'Buscá por alumno, grupo, título o curso.':'Cada trabajo mostrará el nombre del alumno o los integrantes del grupo y su PDF ampliable.'}</p></div>`;
  host.querySelectorAll('[data-work]').forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();AulaViewer.open(filtered.map(w=>({url:new URL(url(w.url),location.href).href,title:w.title,author:w.author,course:[w.mode==='grupal'?'Grupal':'Individual',w.groupName,w.course].filter(Boolean).join(' · '),review:w.description||''})),Number(a.dataset.work));}));
 }
 search?.addEventListener('input',render);render();
})();
