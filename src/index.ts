import app from "./app";

const PORT = process.env.PORT || 3003;

app.listen(3003, () => {
  console.log('Servidor escuchando en http://0.0.0.0:3003');
});

