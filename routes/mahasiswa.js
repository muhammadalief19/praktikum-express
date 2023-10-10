const express = require("express");
const router = express.Router(); // deklarasi router
const { body, validationResult } = require("express-validator");
const connect = require("../config/db.js"); // import database
const multer = require("multer");
const path = require("path");

// Storage Configuration and Destination Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

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
  upload.single("foto"),
  [(body("nama").notEmpty(), body("nrp").notEmpty(), body("jurusan"))],
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
      id_jurusan: req.body.jurusan,
      foto: req.file.filename,
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
          payload: data,
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
      if (rows.length <= 0) {
        return res.status(404).json({
          status: false,
          message: "Not Found",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data Mahasiswa",
          payload: rows[0],
        });
      }
    }
  );
});

// membuat route update
router.patch(
  "/update/(:id)",
  [body("nama").notEmpty(), body("nrp").notEmpty(), body("jurusan").notEmpty()],
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
      id_jurusan: req.body.jurusan,
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

// membuat route delete
router.delete("/delete/(:id)", (req, res) => {
  let id = req.params.id;
  connect.query(
    `DELETE FROM mahasiswa WHERE id_mahasiswa=${id}`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
          error: err,
        });
      } else {
        return res.status(500).json({
          status: true,
          message: "Mahasiswa berhasil di delete",
        });
      }
    }
  );
});

module.exports = router;
