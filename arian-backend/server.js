const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/buscar', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Falta parámetro de búsqueda' });

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
    res.status(500).json({ error: 'Error al conectarse con Deezer' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
