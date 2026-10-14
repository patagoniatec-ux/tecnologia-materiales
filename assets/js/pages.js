'use strict';
(async()=>{
 const {categories,esc,url,date,empty,ready}=Aula;
 const byId=id=>document.getElementById(id);
 const file=location.pathname.split('/').pop()||'index.html';
 let data;
 try {data=await ready;}catch(e){for(const id of ['resources','home-library','home-news','news-grid','gallery']){if(byId(id))byId(id).innerHTML=empty('No pudimos cargar los materiales.','Reintentá en unos minutos.');}return;}
 const resource=r=>`<div class="resource"><span class="doc-icon">${esc((r.format||'DOC').toUpperCase().slice(0,5))}</span><div class="resource-main"><span class="meta">${esc(categories[r.category]||'Material de consulta')}${r.type?' · '+esc(r.type):''}</span><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p></div>${url(r.url)?`<a class="text-link" href="${esc(url(r.url))}" target="_blank" rel="noopener noreferrer">Ver documento ↗</a>`:''}</div>`;
 const newsCard=n=>`<article class="news-card"><img src="${esc(url(n.image)||'assets/img/materiales.png')}" alt="${esc(n.imageAlt||n.title)}" loading="lazy"><div class="news-copy"><span class="meta">${esc(categories[n.category]||'Tecnología')}${date(n.date)?' · '+esc(date(n.date)):''}</span><h3>${esc(n.title)}</h3><p>${esc(n.description)}</p><a class="text-link" href="noticias.html?id=${encodeURIComponent(n.id)}">Leer más →</a></div></article>`;
 const news=[...data.noticias].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 if(file==='index.html'){
  const title=document.querySelector('[data-home-title]');if(data.config.titulo)title.textContent=data.config.titulo;
  if(data.config.subtitulo)document.querySelector('[data-home-subtitle]').textContent=data.config.subtitulo;
  byId('home-library').innerHTML=data.biblioteca.length?data.biblioteca.slice(0,2).map(resource).join(''):empty('La biblioteca está creciendo.','Próximamente encontrarás manuales y fichas de consulta para cada grupo de materiales.');
  byId('home-news').innerHTML=news.length?news.slice(0,3).map(newsCard).join(''):empty('Un espacio para descubrir lo nuevo.','Aquí se publicarán las notas seleccionadas por el docente, con sus fuentes y aplicaciones en el aula.');
 }
 let category=new URLSearchParams(location.search).get('categoria')||'';
 if(!Object.hasOwn(categories,category))category='';
 let course=new URLSearchParams(location.search).get('curso')==='3'?'3':'2';
 function selectFilters(){document.querySelectorAll('[data-category]').forEach(b=>{const active=b.dataset.category===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-course]').forEach(b=>{const active=b.dataset.course===course;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
 function matches(r){const q=(byId('search')?.value||'').toLocaleLowerCase('es');return (!category||r.category===category)&&`${r.title} ${r.description}`.toLocaleLowerCase('es').includes(q);}
 function render(){
  selectFilters();
  if(['biblioteca.html','contenidos.html'].includes(file)){
   const isCourse=file==='contenidos.html';const type=byId('type')?.value||'';
   const source=isCourse?data.contenidos.filter(r=>String(r.course)===course):data.biblioteca;
   const filtered=source.filter(r=>matches(r)&&(!type||r.type===type));
   if(isCourse)byId('course-description').textContent=`Materiales de ${course}.º del ciclo superior · Maestro Mayor de Obras`;
   byId('result-count').textContent=`${filtered.length} recurso${filtered.length===1?'':'s'}`;
   byId('resources').innerHTML=filtered.length?filtered.map(resource).join(''):empty(source.length?'No hay coincidencias.':'Todavía no hay documentos publicados.',source.length?'Probá otra categoría o palabra.':'El docente irá incorporando materiales a este espacio.');
  }
  if(file==='noticias.html')byId('news-grid').innerHTML=news.filter(matches).map(newsCard).join('')||empty('Las novedades llegarán aquí.','Las notas publicadas incluirán el tema, la fecha y la fuente para seguir investigando.');
 }
 document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;render();}));
 document.querySelectorAll('[data-course]').forEach(b=>b.addEventListener('click',()=>{course=b.dataset.course;render();}));
 byId('search')?.addEventListener('input',render);byId('type')?.addEventListener('change',render);
 if(['biblioteca.html','contenidos.html','noticias.html'].includes(file))render();
 if(file==='noticias.html'){
  const id=new URLSearchParams(location.search).get('id');if(id){byId('news-list').hidden=true;const article=byId('article');article.hidden=false;const n=news.find(x=>x.id===id);article.innerHTML=n?`<a class="text-link" href="noticias.html">← Todas las novedades</a><p class="meta section">${esc(categories[n.category])} · ${esc(date(n.date))}</p><h1>${esc(n.title)}</h1><p class="lead">${esc(n.description)}</p>${url(n.image)?`<img class="article-image" src="${esc(url(n.image))}" alt="${esc(n.imageAlt||n.title)}">`:''}<div class="article-body">${esc(n.body)}</div>${url(n.sourceUrl)?`<p class="notice">Fuente: <a href="${esc(url(n.sourceUrl))}" target="_blank" rel="noopener noreferrer">${esc(n.sourceName||'Consultar fuente original')} ↗</a></p>`:''}`:empty('Esta nota no está disponible.','Volvé a Noticias y novedades para consultar las publicaciones.');}
 }
 if(file==='galeria.html'){
  const photos=data.galeria.filter(g=>url(g.image));byId('gallery').innerHTML=photos.length?photos.map((g,i)=>`<figure class="gallery-card"><button data-photo="${i}" aria-label="Ampliar: ${esc(g.title)}"><img src="${esc(url(g.image))}" alt="${esc(g.imageAlt||g.title)}" loading="lazy"></button><figcaption><h3>${esc(g.title)}</h3><p>${esc(g.description)}</p></figcaption></figure>`).join(''):empty('Los proyectos tendrán su lugar.','Este espacio reunirá imágenes de trabajos, experiencias y muestras del aula.');
  const dialog=byId('photo-dialog');document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{const g=photos[Number(b.dataset.photo)];dialog.querySelector('img').src=url(g.image);dialog.querySelector('img').alt=g.imageAlt||g.title;dialog.querySelector('p').textContent=g.title;dialog.showModal();}));dialog.querySelector('.close-dialog').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 }
 if(file==='contacto.html'){
  const form=byId('contact-form'),button=byId('contact-submit'),help=byId('contact-help'),status=byId('contact-status');
  const endpoint=/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(data.config.formEndpoint||'')?data.config.formEndpoint:'';
  const email=/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.config.email||'')?data.config.email:'';
  button.disabled=!endpoint&&!email;button.textContent=endpoint?'Enviar consulta':email?'Preparar correo':'Contacto en preparación';
  help.textContent=endpoint?'Se enviarán tu nombre, correo y consulta al servicio de contacto del docente.':email?'Se abrirá tu aplicación de correo con el mensaje preparado para que lo envíes.':'El docente está preparando el canal de contacto. El envío se habilitará cuando esté configurado.';
  form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity()||(!endpoint&&!email)||form.elements.website.value)return;const values=new FormData(form);if(!endpoint){const subject=encodeURIComponent('Consulta del aula · '+values.get('nombre'));const body=encodeURIComponent(`Nombre: ${values.get('nombre')}\nCorreo: ${values.get('email')}\n\n${values.get('mensaje')}`);location.href=`mailto:${email}?subject=${subject}&body=${body}`;status.textContent='Revisá el mensaje en tu aplicación de correo y presioná Enviar allí.';return;}button.disabled=true;status.textContent='Enviando consulta…';try{const response=await fetch(endpoint,{method:'POST',body:values,headers:{Accept:'application/json'}});if(!response.ok)throw Error('No se pudo enviar. Probá nuevamente más tarde.');form.reset();status.textContent='Tu consulta fue enviada. Gracias por escribir.';}catch(e){status.textContent=e.message;}finally{button.disabled=false;}});
 }
})();
