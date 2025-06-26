require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const moment = require('moment');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/api/hecho-hoy', async function (req, res) {
  const hoy = moment().format('MMMM D'); // Ej: June 25
  const prompt = `Dime un hecho histórico real que haya ocurrido un ${hoy} en Colombia o Nariño. Usa máximo 40 palabras. Devuélvelo en este formato JSON:\n{"titulo": "...", "descripcion": "...", "fuente": "https://..."}`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo-0613',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const respuestaIA = JSON.parse(response.data.choices[0].message.content);
    res.json(respuestaIA);
  } catch (error) {
    console.error("Error IA:", error.response?.data || error.message);
    res.status(500).json({
      titulo: "Error al obtener hecho histórico",
      descripcion: "No se pudo generar el dato con IA.",
      fuente: ""
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
