'use strict';
(async()=>{
 const {categories,esc,url,ready}=Aula;
 const REPO='patagoniatec-ux/tecnologia-materiales',BRANCH='main',DATA='data/contenido.json';
 const API='https://api.github.com/repos/'+REPO;
 const $=id=>document.getElementById(id);
 let token='',head='',tree='',data,tab='biblioteca',editing=null,busy=false;
 try{data=structuredClone(await ready);}catch{$('admin-status').textContent='No se pudo cargar el catálogo.';return;}
 const note=(text,error=false)=>{const el=$('admin-status');el.textContent=text;el.className=error?'error':'success';};
 async function api(path,method='GET',body){const res=await fetch(API+path,{method,headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});if(!res.ok){let message='';try{message=(await res.json()).message;}catch{}throw Error(`GitHub (${res.status}): ${message||'No se pudo completar la operación.'}`);}return res.status===204?null:res.json();}
 const encode=s=>{const bytes=new TextEncoder().encode(s);let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(binary);};
 const decode=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,'')),c=>c.charCodeAt(0)));
 async function refresh(){const b=await api('/branches/'+BRANCH);const f=await api('/contents/'+DATA+'?ref='+b.commit.sha);const next=JSON.parse(decode(f.content));if(!next.config||!['biblioteca','contenidos','noticias','galeria'].every(k=>Array.isArray(next[k])))throw Error('Catálogo inválido.');head=b.commit.sha;tree=b.commit.commit.tree.sha;data=next;}
 $('connect-form').onsubmit=async e=>{e.preventDefault();if(busy)return;token=$('token').value.trim();$('token').value='';busy=true;note('Comprobando acceso…');try{const repo=await api('');if(!repo.permissions?.push)throw Error('La cuenta no tiene permiso de escritura.');await refresh();$('connect-form').hidden=true;$('disconnect').hidden=false;$('connection-status').textContent='Conectado · permiso de edición verificado.';note('Conexión lista. Podés cargar y publicar materiales.');render();}catch(e){token='';note(e.message,true);}finally{busy=false;}};
 $('disconnect').onclick=()=>{if(busy)return;token='';head='';tree='';$('connect-form').hidden=false;$('disconnect').hidden=true;$('connection-status').textContent='Sin conexión de edición.';editing=null;note('Sesión cerrada.');render();};
 window.addEventListener('pagehide',()=>{token='';});
 document.querySelectorAll('[data-admin-tab]').forEach(b=>b.onclick=()=>{if(busy)return;tab=b.dataset.adminTab;editing=null;render();});
 function field(name,label,value='',type='text',required=false){return `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" ${required?'required':''} maxlength="${name==='description'?600:300}"></label>`;}
 function select(name,label,options,value){return `<label>${label}<select name="${name}">${Object.entries(options).map(([k,v])=>`<option value="${esc(k)}" ${String(value)===k?'selected':''}>${esc(v)}</option>`).join('')}</select></label>`;}
 function text(name,label,value='',required=false){return `<label>${label}<textarea name="${name}" ${required?'required':''} maxlength="30000">${esc(value)}</textarea></label>`;}
 function render(){
  document.querySelectorAll('[data-admin-tab]').forEach(b=>{b.classList.toggle('active',tab===b.dataset.adminTab);b.setAttribute('aria-pressed',String(tab===b.dataset.adminTab));});
  const content=$('admin-content');
  if(tab==='config'){
   const c=data.config;content.innerHTML=`<form id="edit-form" class="admin-form"><h2>Ajustes del aula</h2>${field('titulo','Título de portada',c.titulo,'text',true)}${field('subtitulo','Descripción de portada',c.subtitulo,'text',true)}${field('email','Correo de contacto',c.email,'email')}${field('formEndpoint','Dirección de envío de Formspree (opcional)',c.formEndpoint,'url')}<p class="muted">Con Formspree configurado, el formulario envía consultas. Si solo indicás un correo, prepara el mensaje en la aplicación de correo del visitante.</p>${field('instagram','Enlace a Instagram',c.instagram,'url')}<button class="button" ${!token?'disabled':''}>Guardar ajustes en GitHub</button></form>`;
  }else{
   const item=data[tab].find(x=>x.id===editing)||{};const isDoc=['biblioteca','contenidos'].includes(tab);const label={biblioteca:'Biblioteca',contenidos:'Contenidos',noticias:'Noticias y novedades',galeria:'Galería'}[tab];
   content.innerHTML=`<div class="notice">${token?'Los cambios se guardan en GitHub y estarán visibles cuando termine la publicación de GitHub Pages.':'Conectá tu cuenta para cargar o editar materiales.'}</div><h2>${label}</h2><div id="admin-items">${data[tab].length?data[tab].map(x=>`<div class="admin-item"><div><h3>${esc(x.title)}</h3><small>${esc(categories[x.category]||'Galería')}${x.course?' · '+esc(x.course)+'.º ciclo superior':''}</small></div><div class="admin-actions"><button class="button secondary" data-edit="${esc(x.id)}">Editar</button><button class="button danger" data-delete="${esc(x.id)}" ${!token?'disabled':''}>Retirar</button></div></div>`).join(''):'<p class="muted">Todavía no hay elementos publicados.</p>'}</div><hr style="border:0;border-top:1px solid #dce5e8;margin:30px 0"><form id="edit-form" class="admin-form"><h2>${editing?'Editar material':'Agregar material'}</h2>${field('title','Título',item.title,'text',true)}${text('description','Descripción breve',item.description)}${tab!=='galeria'?select('category','Grupo de materiales',categories,item.category||'construccion'):''}${tab==='contenidos'?'<div class="filter-line">'+select('course','Curso',{'2':'2.º del ciclo superior · MMO','3':'3.º del ciclo superior · MMO'},item.course||'2')+select('type','Tipo de actividad',{'Trabajo práctico':'Trabajo práctico','Evaluación':'Evaluación','Guía':'Guía','Lección oral':'Lección oral'},item.type||'Trabajo práctico')+'</div>':''}${tab==='noticias'?field('date','Fecha de publicación',item.date||new Date().toLocaleDateString('sv-SE'),'date',true)+text('body','Texto de la nota',item.body,true)+field('sourceName','Nombre de la fuente',item.sourceName)+field('sourceUrl','Enlace a la fuente',item.sourceUrl,'url'):''}${isDoc?field('url','Enlace al documento (o adjuntá un archivo)',item.url)+`<label>Adjuntar documento · máximo 5 MB<input name="upload" type="file" accept=".pdf,.docx,.xlsx,.pptx,.txt,.csv"></label>`:field('image','Enlace de la imagen (o adjuntá una foto)',item.image)+`<label>Adjuntar imagen · máximo 5 MB<input name="upload" type="file" accept="image/png,image/jpeg,image/webp"></label>`+field('imageAlt','Descripción de la imagen para accesibilidad',item.imageAlt)}<p class="muted">${isDoc?'Los archivos cargados serán públicos. Publicá únicamente materiales que puedan consultar los alumnos.':'Usá imágenes propias o con permiso de publicación.'}</p><div class="actions"><button class="button" ${!token?'disabled':''}>${editing?'Guardar cambios':'Publicar material'}</button>${editing?'<button class="button secondary" type="button" id="cancel-edit">Cancelar</button>':''}</div></form>`;
   content.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{if(busy)return;editing=b.dataset.edit;render();$('edit-form').scrollIntoView({behavior:'smooth',block:'start'});});
   content.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{if(busy||!token)return;const item=data[tab].find(x=>x.id===b.dataset.delete);if(!confirm(`¿Retirar «${item.title}» del catálogo? El archivo seguirá en el repositorio.`))return;const next=structuredClone(data);next[tab]=next[tab].filter(x=>x.id!==item.id);await publish(next);});
   $('cancel-edit')?.addEventListener('click',()=>{editing=null;render();});
  }
  $('edit-form').onsubmit=submit;
 }
 async function readUpload(file){if(file.size>5*1024*1024)throw Error('El archivo supera los 5 MB.');const doc=['biblioteca','contenidos'].includes(tab);const ext=file.name.split('.').pop().toLowerCase();if(!(doc?['pdf','docx','xlsx','pptx','txt','csv']:['png','jpg','jpeg','webp']).includes(ext))throw Error('Tipo de archivo no admitido.');const encoded=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(Error('No se pudo leer el archivo.'));reader.readAsDataURL(file);});return {path:'documentos/'+crypto.randomUUID()+'.'+ext,content:encoded,encoding:'base64',ext};}
 async function submit(e){e.preventDefault();if(busy||!token||!e.target.reportValidity())return;const fd=new FormData(e.target),next=structuredClone(data);const v=name=>String(fd.get(name)||'').trim();let upload;
  try{
   if(tab==='config'){
    const endpoint=v('formEndpoint'),instagram=v('instagram');if(endpoint&&!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint))throw Error('Usá una dirección válida https://formspree.io/f/…');if(instagram&&(!url(instagram)||new URL(instagram).hostname.replace(/^www\./,'')!=='instagram.com'))throw Error('Indicá un enlace válido de Instagram.');next.config={...next.config,titulo:v('titulo'),subtitulo:v('subtitulo'),email:v('email'),formEndpoint:endpoint,instagram};
   }else{
    const old=data[tab].find(x=>x.id===editing)||{};const item={...old,id:old.id||crypto.randomUUID(),title:v('title'),description:v('description')};
    if(tab!=='galeria')item.category=v('category');
    if(tab==='contenidos'){item.course=v('course');item.type=v('type');}
    if(tab==='noticias'){item.date=v('date');item.body=v('body');item.sourceName=v('sourceName');item.sourceUrl=v('sourceUrl');if(item.sourceUrl&&!url(item.sourceUrl))throw Error('La fuente debe tener una dirección HTTPS válida.');}
    const file=fd.get('upload');if(file?.size)upload=await readUpload(file);
    if(['biblioteca','contenidos'].includes(tab)){item.url=upload?.path||v('url');if(!url(item.url))throw Error('Adjuntá un archivo o ingresá un enlace HTTPS válido.');item.format=(upload?.ext||item.url.split('.').pop().split(/[?#]/)[0]||'DOC').slice(0,5);}
    else{item.image=upload?.path||v('image');item.imageAlt=v('imageAlt');if(item.image&&!url(item.image))throw Error('Usá una imagen con enlace HTTPS válido.');if(tab==='galeria'&&!item.image)throw Error('Adjuntá una imagen o indicá su enlace.');}
    const index=next[tab].findIndex(x=>x.id===item.id);if(index>=0)next[tab][index]=item;else next[tab].unshift(item);
   }
   await publish(next,upload);
  }catch(e){note(e.message,true);}
 }
 async function publish(next,upload){
  if(busy)return;busy=true;document.querySelectorAll('#admin-content button').forEach(b=>b.disabled=true);note('Guardando en GitHub…');let changed=false;
  try{
   const current=await api('/branches/'+BRANCH);if(current.commit.sha!==head){await refresh();editing=null;changed=true;throw Error('Hay cambios nuevos en GitHub. Actualizamos el catálogo; revisá los datos antes de volver a publicar.');}
   const entries=[];
   if(upload){const blob=await api('/git/blobs','POST',{content:upload.content,encoding:'base64'});entries.push({path:upload.path,mode:'100644',type:'blob',sha:blob.sha});}
   entries.push({path:DATA,mode:'100644',type:'blob',content:JSON.stringify(next,null,2)+'\n'});
   const t=await api('/git/trees','POST',{base_tree:tree,tree:entries});
   const c=await api('/git/commits','POST',{message:'Actualizar '+(tab==='config'?'ajustes':tab)+' desde el panel docente',tree:t.sha,parents:[head]});
   await api('/git/refs/heads/'+BRANCH,'PATCH',{sha:c.sha,force:false});
   data=next;head=c.sha;tree=t.sha;editing=null;changed=true;note('Guardado en GitHub. La actualización pública aparecerá cuando termine el despliegue.');
  }catch(e){note(e.message,true);}finally{busy=false;if(changed)render();else{document.querySelectorAll('#admin-content button').forEach(b=>b.disabled=false);}}
 }
 render();
})();
