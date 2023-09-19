const express = require("express");
const app = express();
const port = 1908;

app.get("/", (req, res) => {
  res.send("Hallo Sayang ❤️");
});

app.listen(port, () => {
  console.log(`Aplikasi ini berjalan pada port: ${port}`);
});
