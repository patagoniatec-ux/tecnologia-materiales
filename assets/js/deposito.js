
'use strict';
(()=>{
 const names=['Planta y distribución segura','Planta de techo y fachada','Cortes y materialidad','Seguridad e higiene'];
 const works=names.map((title,i)=>({url:new URL(`documentos/deposito-100m2/lamina-${i+1}.jpg`,location.href).href,kind:'image',title,review:'Depósito de 100 m² · Anteproyecto didáctico. Cotas y decisiones a verificar para una obra real.',course:'Tecnología de los Materiales · CET Nº33'}));
 document.querySelectorAll('[data-sheet]').forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();AulaViewer.open(works,Number(a.dataset.sheet));}));
 document.getElementById('open-deposito').addEventListener('click',()=>AulaViewer.open([{url:new URL('documentos/deposito-100m2/Deposito_100m2_Tecnologia_Materiales.pdf',location.href).href,title:'Depósito de materiales · 100 m²',review:'Cuatro láminas A3: planta, cubierta, fachada, cortes y seguridad e higiene. Anteproyecto didáctico.',course:'Tecnología de los Materiales · CET Nº33'}]));
})();
