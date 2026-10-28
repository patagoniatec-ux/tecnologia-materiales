window.AulaViewer=(()=>{
let host,frame,items=[],index=0,focus;
function send(){frame.contentWindow.postMessage({type:'open-viewer',works:items,index},location.origin);}
function close(){if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});host?.close();frame?.removeAttribute('src');focus?.focus();}
window.addEventListener('message',e=>{if(!frame||e.source!==frame.contentWindow||e.origin!==location.origin)return;if(e.data?.type==='viewer-ready')send();if(e.data?.type==='close-viewer')close();});
return {open(works,i=0){items=works;index=i;focus=document.activeElement;if(!host){host=document.createElement('dialog');host.setAttribute('aria-label','Panel de visualización');host.style.cssText='padding:0;border:0;position:fixed;inset:0;margin:0;width:100vw;height:100dvh;max-width:none;max-height:none;background:#14242e';frame=document.createElement('iframe');frame.title='Visor ampliable de PDF e imágenes';frame.allowFullscreen=true;frame.style.cssText='width:100%;height:100%;border:0;display:block';host.append(frame);document.body.append(host);host.addEventListener('cancel',e=>{e.preventDefault();close()});}frame.src=new URL('visor/index.html',location.href).href;host.showModal();}};
})();
