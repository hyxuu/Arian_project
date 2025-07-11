// arian-backend/server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// --- CAMBIO CLAVE 1: Configurar el puerto para que use la variable de entorno de Render ---
// Render asigna un puerto a tu aplicación a través de process.env.PORT.
// Si no está definido (ej. en desarrollo local), usará 3000.
const PORT = process.env.PORT || 3000;

app.use(cors());

// --- CAMBIO CLAVE 2: Añadir una ruta para la raíz ("/") ---
// Esto es lo que el navegador busca por defecto cuando accedes a la URL base.
app.get('/', (req, res) => {
  // Puedes enviar un mensaje simple, un HTML, o redirigir a tu frontend si lo tienes desplegado.
  res.send('¡Servidor de búsqueda de música de Arian Music (Deezer API) está funcionando!');
});

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

// Inicia el servidor, escuchando en el puerto configurado dinámicamente
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
  console.log(`Accede a la ruta de búsqueda: http://localhost:${PORT}/buscar?q=nombre_cancion`);
});