// arian-backend/server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path'); // Importa el módulo 'path' para trabajar con rutas de archivos

const app = express();

// Configura el puerto para que use la variable de entorno de Render.
// Render asigna un puerto a tu aplicación a través de process.env.PORT.
// Si no está definido (ej. en desarrollo local), usará 3000.
const PORT = process.env.PORT || 3000;

app.use(cors());

// --- Servir archivos estáticos del frontend ---
// Esto le dice a Express que sirva los archivos estáticos (HTML, CSS, JS, imágenes)
// que se encuentran en la carpeta 'arian-frontend'.
// path.join(__dirname, 'arian-frontend') construye la ruta absoluta a esa carpeta.
app.use(express.static(path.join(__dirname, 'arian-frontend')));

// La ruta para la raíz ("/") ya es manejada por express.static si existe un index.html
// en la carpeta 'arian-frontend'. Si quieres un mensaje específico para la raíz
// y no un archivo HTML, puedes descomentar y usar la siguiente línea:
/*
app.get('/', (req, res) => {
  res.send('¡Servidor de búsqueda de música de Arian Music (Deezer API) está funcionando!');
});
*/

app.get('/buscar', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Falta parámetro de búsqueda (q)' });
  }

  try {
    const respuesta = await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
    const resultados = respuesta.data.data.slice(0, 10).map(track => ({
      titulo: track.title,
      artista: track.artist.name,
      album: track.album.title,
      preview: track.preview,
      imagen: track.album.cover_medium
    }));
    res.json(resultados);
  } catch (error) {
    console.error('Error al conectarse con Deezer:', error.message); // Log para depuración
    res.status(500).json({ error: 'Error al conectarse con Deezer o procesar la solicitud' });
  }
});

// --- Ruta 'catch-all' para Single Page Applications (SPAs) ---
// Esta línea asegura que cualquier ruta no definida por el backend redirija al index.html.
// Es útil para que las recargas de página o las URLs directas funcionen correctamente en el frontend,
// especialmente si tu frontend es una SPA (como React, Vue, Angular) que maneja sus propias rutas.
// Si tu frontend es solo un HTML simple sin enrutamiento interno, esta línea es opcional pero no hace daño.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'arian-frontend', 'index.html'));
});


// Inicia el servidor, escuchando en el puerto configurado dinámicamente
app.listen(PORT, () => {
  console.log(`Servidor backend y frontend escuchando en el puerto ${PORT}`);
  console.log(`Accede a tu aplicación en: http://localhost:${PORT}`);
  console.log(`Accede a la ruta de búsqueda: http://localhost:${PORT}/buscar?q=nombre_cancion`);
});
