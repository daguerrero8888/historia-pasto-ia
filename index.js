const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Hechos históricos simulados por fecha
const hechos = {
    "01-01": ["Fundación de Pasto en 1537"],
    "06-24": ["El 24 de junio de 1824 se defendió la ciudad de una invasión", "El Carnaval de Negros y Blancos fue declarado Patrimonio Oral en esta fecha"],
    "12-31": ["Última batalla independentista en Pasto, 1822"]
};

// Función para generar IA simulada
function generarHechoIA(fecha) {
    const ejemplos = hechos[fecha] || [`El ${fecha}, Pasto vivió un evento importante que marcó su historia.`];
    return {
        fecha: `Hoy es ${fecha}`,
        eventos: ejemplos
    };
}

app.get('/hoy', (req, res) => {
    const hoy = new Date();
    const key = hoy.toISOString().slice(5, 10); // MM-DD
    const hecho = generarHechoIA(key);
    res.json(hecho);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
