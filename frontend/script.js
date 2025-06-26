fetch('https://historia-backend-ervf.onrender.com')
  .then(res => res.json())
  .then(data => {
    document.getElementById('titulo').textContent = data.titulo;
    document.getElementById('descripcion').textContent = data.descripcion;
    if (data.fuente) {
      const link = document.getElementById('fuente');
      link.textContent = "Ver fuente 🔗";
      link.href = data.fuente;
    }
  })
  .catch(err => {
    document.getElementById('titulo').textContent = "Error de conexión";
    document.getElementById('descripcion').textContent = "No se pudo obtener el hecho histórico.";
  });
