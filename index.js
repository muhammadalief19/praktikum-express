const express = require("express");
const app = express();
const port = 1908;
const mhsRouter = require("./routes/mahasiswa.js");
const jurusanRouter = require("./routes/jurusan.js");
const cors = require("cors");
// import body-parser
const bodyPs = require("body-parser");
const path = require("path");
app.use(cors);
app.use("/static", express.static(path.join(__dirname, "public/images")));
app.use(bodyPs.urlencoded({ extended: false }));
app.use(bodyPs.json());

app.get("/", (req, res) => {
  res.send("Hallo Sayang ❤️");
});

// membuat route /api/mhs
app.use("/api/mhs", mhsRouter);

// membuat route /api/jurusan
app.use("/api/jurusan", jurusanRouter);

app.listen(port, () => {
  console.log(`Aplikasi ini berjalan pada port: ${port}`);
});
