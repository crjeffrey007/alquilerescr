INSTRUCCIONES RÁPIDAS
---------------------
Archivos incluidos (carpeta admin):

- dashboard.html
- dashboard.css
- dashboard.js
- firebase-config.js   <-- reemplaza los placeholders con tu config real
- login.html
- register.html
- analytics.js         <-- reemplaza GA IDs/KEYS o usa Cloud Function proxy
- README.txt

Pasos para usar:
1) Copia la carpeta 'admin' al root de tu proyecto en GitHub (por ejemplo: /admin)
2) Reemplaza firebase-config.js con los datos reales de tu proyecto Firebase.
3) Abre Firebase Console: Authentication -> habilita Email/Password y Google (opcional).
4) Crea colección 'usuarios' en Firestore; los registros de register.html crean documentos automáticamente.
5) Para convertir un usuario en admin: en Firestore -> usuarios -> seleccioná el documento -> cambia 'rol' a 'admin'.
6) Analytics: para mejores prácticas, crea una Cloud Function que haga las llamadas a la Analytics Data API y evitar exponer API Key en el frontend.
7) Sube todo a GitHub y activa GitHub Pages (Settings -> Pages -> branch main).
8) Probar: /admin/login.html -> registrar -> editar rol a admin -> iniciar sesión -> dashboard.

Notas de seguridad:
- No expongas API Keys sensibles en frontend.
- Ajusta las reglas de Firestore según el ejemplo que te pasé antes.
