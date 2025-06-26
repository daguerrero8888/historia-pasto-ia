const express = require('express');
const cors = require('cors');
const axios = require('axios');
const moment = require('moment');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/api/hecho-hoy', async (req, res) => {
  const hoy = moment().format('MMMM D'); // Ej: June 25
  const pregunta = `¿Qué hecho histórico ocurrió en Colombia un ${hoy}?`;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/bigscience/bloom-560m',
      { inputs: pregunta },
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    const texto = response.data?.generated_text || "No se encontró un hecho histórico.";
    res.json({
      titulo: "Hecho histórico del día",
      descripcion: texto,
      fuente: "https://es.wikipedia.org/wiki/Colombia"
    });
  } catch (error) {
    console.error("Error Hugging Face:", error.response?.data || error.message);
    res.status(500).json({
      titulo: "Error al obtener hecho histórico",
      descripcion: "No se pudo generar el dato con IA.",
      fuente: ""
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor HuggingFace sin clave corriendo en puerto ${PORT}`);
});
