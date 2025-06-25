const express = require('express');
const cors = require('cors');
const moment = require('moment');
const hechos = require('./datos/hechos.json');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/api/hecho-hoy', (req, res) => {
  const hoy = moment().format('MM-DD');
  const hecho = hechos[hoy] || {
    titulo: "No hay datos para hoy 😢",
    descripcion: "Lo siento, no encontramos un hecho histórico para esta fecha.",
    fuente: ""
  };
  res.json(hecho);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});