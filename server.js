const express = require('express');
const cors = require('cors');
const axios = require('axios');
const moment = require('moment');
const curiosidades = require('./curiosidades.json');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Endpoint: /api/hecho-hoy
app.get('/api/hecho-hoy', async (req, res) => {
  const fecha = moment();
  const mes = fecha.month() + 1;
  const dia = fecha.date();

  try {
    const url = `https://es.wikipedia.org/api/rest_v1/feed/onthisday/events/${mes}/${dia}`;
    const r = await axios.get(url, {
      headers: { 'User-Agent': 'HistoriaPasto/1.0 (ejemplo@correo.com)' }
    });

    const eventos = r.data?.events || [];
    if (eventos.length === 0) {
      return res.status(404).json({
        titulo: "No hay hechos hoy",
        descripcion: "",
        fuente: ""
      });
    }

    const evento = eventos[Math.floor(Math.random() * eventos.length)];
    const descripcion = evento.text;
    const fuente = evento.pages?.[0]?.content_urls?.desktop?.page || "https://es.wikipedia.org";

    res.json({
      titulo: "Hecho histórico del día",
      descripcion,
      fuente
    });
  } catch (error) {
    console.error("Error Wikipedia:", error.message);
    res.status(500).json({
      titulo: "Error al obtener hecho histórico",
      descripcion: "No se pudo consultar la API de Wikipedia.",
      fuente: ""
    });
  }
});

// Endpoint: /api/dato-curioso
app.get('/api/dato-curioso', (req, res) => {
  const dato = curiosidades[Math.floor(Math.random() * curiosidades.length)];
  res.json({
    titulo: "Dato curioso del día",
    descripcion: dato
  });
});

app.listen(PORT, () => {
  console.log("Servidor combinado corriendo en puerto", PORT);
});
