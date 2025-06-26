const express = require('express');
const cors = require('cors');
const axios = require('axios');
const moment = require('moment');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/api/hecho-hoy', async (req, res) => {
  const hoy = moment().format('YYYY/MM/DD');
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/es/featured/${hoy}`;

  try {
    const r = await axios.get(url, {
      headers: { 'User-Agent': 'HistoriaPasto/1.0 (email@ejemplo.com)' }
    });
    const eventos = r.data.events || [];
    const hecho = eventos[0] || null;
    if (!hecho) {
      return res.status(404).json({ titulo: "No hay hechos hoy", descripcion: "", fuente: "" });
    }
    res.json({
      titulo: hecho.text,
      descripcion: hecho.pages?.[0]?.extract || "",
      fuente: hecho.pages?.[0]?.content_urls?.desktop?.page || `https://es.wikipedia.org/wiki/${hecho.pages?.[0]?.title}`
    });
  } catch (error) {
    console.error("Error Wikimedia:", error.message);
    res.status(500).json({
      titulo: "Error al obtener hecho histórico",
      descripcion: "No se pudo consultar Wikipedia.",
      fuente: ""
    });
  }
});

app.listen(PORT, () => {
  console.log("Servidor HistoriaPasto corrriendo en puerto", PORT);
});
