const express = require("express");
const router = express.Router(); // deklarasi router
const { body, validationResult } = require("express-validator");
const connect = require("../config/db.js"); // import database

// membuat route
router.get("/", (req, res) => {
  connect.query("SELECT * FROM jurusan ORDER BY id_j DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Data Jurusan",
        data: rows,
      });
    }
  });
});

// membuat route store
router.post("/store", [body("nama_jurusan").notEmpty()], (req, res) => {
  const error = validationResult(req);

  // ketika validasi gagal
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: array,
    });
  }

  let data = {
    nama_jurusan: req.body.nama_jurusan,
  };

  connect.query("INSERT INTO jurusan set ? ", data, (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: err,
      });
    } else {
      return res.status(201).json({
        status: true,
        message: "Jurusan berhasil ditambahkan",
        data: data,
      });
    }
  });
});

// membuat route get mahasiswa by id
router.get("/(:id)", (req, res) => {
  let id = req.params.id;
  connect.query(`SELECT * FROM jurusan where id_j=${id}`, (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: err,
      });
    }
    if (rows.length <= 0) {
      return res.status(404).json({
        status: false,
        message: "Not Found",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Data Jurusan",
        payload: rows[0],
      });
    }
  });
});

// membuat route update
router.patch("/update/(:id)", [body("nama_jurusan").notEmpty()], (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array(),
    });
  }
  let id = req.params.id;
  let data = {
    nama_jurusan: req.body.nama_jurusan,
  };
  connect.query(`UPDATE jurusan set ? where id_j=${id}`, data, (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: err,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Jurusan berhasil diupdate",
        data: data,
      });
    }
  });
});

// membuat route delete
router.delete("/delete/(:id)", (req, res) => {
  let id = req.params.id;
  connect.query(`DELETE FROM jurusan WHERE id_j=${id}`, (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: err,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Jurusan berhasil di delete",
      });
    }
  });
});

module.exports = router;
