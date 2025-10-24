
Alquileres CR - Paquete final (configurado)

Configuración incluida (no incluir API secret en cliente):
- Dominio: alquileres-cr.com
- Site name: Alquileres CR
- Firebase: projectId inmobiliaria-cr
- Cloudinary: cloud 'media-anuncios', unsigned upload preset 'alquilerescr', folder 'alquilerescr'
  - IMPORTANT: Do NOT place your Cloudinary API secret in client-side files. Use server-side only.
- Web3Forms access_key: 36e1e635-e0fa-4b58-adba-4daf2694b7dd
- Admin email: crjeffrey7@gmail.com
- Contact emails: crjeffrey7@gmail.com, info@alquilerescr.com
- Blog categories: Recomendaciones, Experiencias, Asuntos Legales

Pasos rápidos:
1. Descomprime y sube a hosting.
2. En Cloudinary: create unsigned upload preset 'alquilerescr' and set folder 'alquilerescr' if desired.
3. In Firebase console: enable Authentication (Email/Password and Google), enable Firestore.
4. Replace ADMIN_HASH in js/admin.js with SHA-256 of your admin password.
5. Test by opening publicar-alquiler.html and sending a demo ad.

Security note:
- I intentionally DID NOT include your Cloudinary API secret in any file inside this ZIP. Keep API secret on server if needed.
