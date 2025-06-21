const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/hoy", (req, res) => {
  const fecha = new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long" });
  res.json({
    fecha,
    eventos: [
      "📜 En un día como hoy se celebró una comparsa en el barrio San Ignacio.",
      "🎭 Participación destacada de la IEM Ciudad de Pasto en el desfile estudiantil.",
      "🎶 El colectivo coreográfico realizó una presentación cultural en la plaza de Nariño.",
      "📚 Se conmemora la creación del archivo histórico municipal de Pasto."
    ]
  });
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
