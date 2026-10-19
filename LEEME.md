# Sofá Royale

Battle royale multijugador para jugar desde el navegador (compu o celular), sin cuentas.

## Subirlo a internet (gratis, con Render)

1. Crea una cuenta en https://github.com y un repositorio nuevo llamado `sofa-royale`.
2. En el repositorio, elige "uploading an existing file" y arrastra TODO el contenido
   de esta carpeta (`package.json`, `server.js`, `LEEME.md` e `index.html`). Dale "Commit changes".
3. Crea una cuenta en https://render.com (puedes entrar con tu cuenta de GitHub).
4. En Render: New > Web Service > elige el repositorio `sofa-royale`.
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance type: Free
5. Dale "Deploy". En unos minutos te da un link tipo `https://sofa-royale-xxxx.onrender.com`.
   Ese link es el que les mandas a tus amigos.

Nota: en el plan gratis el servidor se duerme si nadie juega por un rato;
la primera persona que entra espera unos 30 a 50 segundos a que despierte.

## Probarlo en tu compu

Con Node instalado: `npm install`, luego `npm start`, y abre http://localhost:3000
