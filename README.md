# Tecnología de los Materiales · Aula virtual

Sitio educativo de Marcelo para Maestro Mayor de Obras. Diseño blanco y azul petróleo inspirado en la propuesta visual aprobada, con fotografía de muestras de hormigón, acero, madera e impresión 3D.

## Páginas

- `index.html`: portada y accesos por grupo de materiales.
- `contenidos.html`: trabajos prácticos, evaluaciones, guías y orientaciones para lecciones orales; filtros por 2.º o 3.º del ciclo superior de MMO, material y tipo.
- `biblioteca.html`: documentos de consulta con categorías y buscador.
- `noticias.html`: listado de novedades y lectura individual; fuentes enlazadas.
- `galeria.html`: fotografías y visor ampliado.
- `contacto.html`: nombre, correo y mensaje.
- `administracion.html`: panel de carga y edición mediante la API de GitHub.

## Estructura

`assets/css/` contiene el diseño adaptable a celular; `assets/js/` contiene la interfaz y el panel; `assets/img/` incluye la marca y fotografía; `data/contenido.json` conserva el catálogo y los ajustes; `documentos/` recibe los documentos e imágenes cargados; `docs/` incluye instrucciones.

Es un sitio estático sin dependencias de compilación, compatible con GitHub Pages y Netlify. Se utiliza JavaScript moderno y no se necesitan instalaciones para publicarlo.

## Activar GitHub Pages

1. Abrir **Settings → Pages** del repositorio.
2. En **Build and deployment → Source**, elegir **GitHub Actions**.
3. Abrir **Actions → Publicar aula en GitHub Pages → Run workflow** si el primer intento ocurrió antes de activar Pages.
4. Esperar el resultado exitoso del despliegue.

La dirección prevista es https://patagoniatec-ux.github.io/tecnologia-materiales/ . El código subido no implica que Pages ya esté activado; confirmar el resultado en Actions.

El workflow sigue el formato de [publicación automática de GitHub](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically).

## Panel docente

Leer [docs/administracion.md](docs/administracion.md). El panel publica archivos y catálogo en un único commit; comprueba permisos y detecta cambios concurrentes. Se necesita una credencial de la cuenta del docente con permiso **Contents: Read and write** para este repositorio. La credencial vive en memoria, no se añade al repositorio ni se guarda en el navegador. Los alumnos pueden consultar el sitio pero no guardar cambios sin permisos en GitHub.

Los catálogos se entregan vacíos: no se simulan documentos, noticias o producciones de alumnos.

## Contacto e Instagram

El docente debe configurar los datos reales desde **Administración → Ajustes**.

- Si se configura un endpoint de Formspree `https://formspree.io/f/…`, las consultas se envían mediante ese servicio. Su cuenta y recepción deben verificarse allí.
- Si se configura solo un correo, el botón prepara un mensaje en la aplicación de correo del visitante; no simula un envío desde el servidor.
- Si no se configura ninguna opción, el envío queda deshabilitado y se explica que está en preparación.
- Instagram se muestra únicamente al indicar un enlace válido de la cuenta.

## Netlify más adelante

Importar este repositorio, dejar vacío **Build command** e indicar `.` en **Publish directory**. El archivo `netlify.toml` ya establece la carpeta de publicación. No hacen falta cambios de arquitectura. El contacto puede conservar su conexión con Formspree.

## Vista local

Desde la carpeta del proyecto: `python -m http.server 8000`. Abrir http://localhost:8000 . No abrir el HTML por doble clic: el catálogo JSON requiere un servidor HTTP.

## Alcance y comprobaciones

Se comprobaron sintaxis de JavaScript, referencias locales y flujos de renderizado/validación mediante pruebas sin navegador. No se probó el envío real a Formspree ni el ingreso con una credencial personal, porque faltan esos datos. La conexión y publicación con el token se verifican al configurar el panel. No se realizó revisión visual en navegador en este entorno.

Las imágenes de materiales fueron generadas para este proyecto. No representan obras ni proyectos de alumnos reales. No se incluye una licencia general para futuros documentos de terceros.
