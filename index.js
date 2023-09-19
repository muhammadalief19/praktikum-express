const express = require("express");
const app = express();
const port = 1908;
const mhsRouter = require("./routes/mahasiswa.js");

app.get("/", (req, res) => {
  res.send("Hallo Sayang ❤️");
});

// mmembuat route /api/mhs
app.use("/api/mhs", mhsRouter);

app.listen(port, () => {
  console.log(`Aplikasi ini berjalan pada port: ${port}`);
});
