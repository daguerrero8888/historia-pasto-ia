const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

function getWikipediaURL(fecha) {
  return `https://es.wikipedia.org/wiki/${fecha}`;
}

function limpiarTexto(texto) {
  return texto.replace(/\[\d+\]/g, "").trim();
}

app.get("/api/hechos-hoy", async (req, res) => {
  const hoy = new Date();
  const dia = hoy.getDate();
  const mes = hoy.toLocaleString("es-ES", { month: "long" }).toLowerCase();
  const fecha = `${dia}_de_${mes}`;
  const url = getWikipediaURL(fecha);

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const hechos = [];

    const h2s = $("h2");
    const index = h2s.toArray().findIndex(el => $(el).text().includes("Acontecimientos"));

    if (index !== -1) {
      let elemento = $(h2s[index]).next();
      while (elemento.length && elemento[0].tagName !== "h2") {
        if (elemento[0].tagName === "ul") {
          elemento.find("li").each((_, li) => {
            hechos.push(limpiarTexto($(li).text()));
          });
        }
        elemento = elemento.next();
      }
    }

    res.json({ fecha, hechos });
  } catch (err) {
    res.status(500).json({ error: "No se pudieron obtener los datos." });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
