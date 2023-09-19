const express = require("express");
const router = express.Router(); // deklarasi router
const { body, validationResult } = require("express-validator");
const connect = require("../config/db.js"); // import database

// membuat route /
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

// membuat route store
router.post(
  "/store",
  [body("nama").notEmpty(), body("nrp").notEmpty()],
  (req, res) => {
    const error = validationResult(req);

    // ketika validasi gagal
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: array,
      });
    }

    let data = {
      nama: req.body.nama,
      nrp: req.body.nrp,
    };

    connect.query("INSERT INTO mahasiswa set ? ", data, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
          error: err,
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "Mahasiswa berhasil ditambahkan",
          data: rows[0],
        });
      }
    });
  }
);

// membuat route get mahasiswa by id
router.get("/(:id)", (req, res) => {
  let id = req.params.id;
  connect.query(
    `SELECT * FROM mahasiswa where id_mahasiswa=${id}`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
          error: err,
        });
      }
      if (rows.legth <= 0) {
        return res.status(404).json({
          status: false,
          message: "Not Found",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data Mahasiswa",
          data: rows[0],
        });
      }
    }
  );
});

// membuat route update
router.patch(
  "/update/(:id)",
  [body("nama").notEmpty(), body("nrp").notEmpty()],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let id = req.params.id;
    let data = {
      nama: req.body.nama,
      nrp: req.body.nrp,
    };
    connect.query(
      `UPDATE mahasiswa set ? where id_mahasiswa=${id}`,
      data,
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: err,
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "Mahasiswa berhasil diupdate",
            data: rows[0],
          });
        }
      }
    );
  }
);

module.exports = router;
