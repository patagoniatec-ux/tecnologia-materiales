# Uso del panel docente

## Conectar una sesión

1. Entrar en la cuenta de GitHub propietaria del repositorio.
2. En la configuración personal, abrir **Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
3. Seleccionar únicamente `patagoniatec-ux/tecnologia-materiales`, establecer un vencimiento y habilitar **Repository permissions → Contents: Read and write**. Metadata es de lectura por defecto.
4. En el aula, abrir **Administración**, introducir la credencial y conectar. No enviarla por chat ni incorporarla a archivos.

El panel lee el estado más reciente de la rama `main` y comprueba permiso de escritura. La credencial no se almacena de manera persistente; cerrar o recargar la página obliga a reconectar.

## Cargar material

- Biblioteca: título, descripción, grupo de materiales y documento o enlace.
- Contenidos: además, 2.º o 3.º del ciclo superior de MMO y tipo de actividad.
- Noticias: título, resumen, texto, fecha, categoría, fuente e imagen opcional.
- Galería: título, descripción, foto y descripción accesible de la imagen.

**Publicar material** guarda en GitHub. Si Pages está activo, el workflow publica el cambio automáticamente. Los documentos admiten PDF, DOCX, XLSX, PPTX, TXT y CSV. Las fotos admiten PNG, JPG y WebP. Límite del panel: 5 MB por archivo. Para archivos más grandes, usar un enlace HTTPS.

**Editar** permite reemplazar datos o adjuntar un archivo nuevo. **Retirar** quita la entrada del catálogo; no borra el archivo ni su historial en GitHub.

Si otra persona modificó el repositorio durante la sesión, el panel recarga el catálogo y pide revisar antes de guardar. Esto evita sobreescribir cambios ajenos.

## Ajustes

Modificar título y descripción de portada, correo de contacto, endpoint de Formspree e Instagram. No guardar contraseñas o credenciales en estos campos. El catálogo es público.

Para enviar consultas sin abrir una aplicación de correo, crear y verificar un formulario en Formspree y copiar su dirección de envío al panel. El formulario del aula solo utiliza endpoints del formato `https://formspree.io/f/…`.

## Visibilidad

Este repositorio es público. Subir únicamente documentos e imágenes que puedan publicarse. Para evaluaciones, cargar las consignas destinadas a estudiantes, no respuestas reservadas. Retirar un documento del listado no lo elimina del historial público.

## Recursos

- [Tokens de acceso personal](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [Ajustes de GitHub Pages](https://github.com/patagoniatec-ux/tecnologia-materiales/settings/pages)
- [Acciones de publicación](https://github.com/patagoniatec-ux/tecnologia-materiales/actions)
