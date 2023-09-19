const express = require("express");

// deklarasi router
const router = express.Router();

// import database
const connect = require("../config/db.js");

// membuat route
router.get("/", (req, res) => {
  connect.query(
    "SELECT * FROM mahasiswa ORDER BY id_mahasiswa DESC",
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data Mahasiswa",
          data: rows,
        });
      }
    }
  );
});

module.exports = router;
