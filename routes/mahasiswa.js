const express = require("express");
const router = express.Router(); // deklarasi router
const { body, validationResult } = require("express-validator");
const connect = require("../config/db.js"); // import database
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// file filter configuration
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true); // file diizinkan
  } else {
    cb(new Error("File Gambar harus berformat jpg,jpeg,png,webp"), false);
  }
};
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
const upload = multer({ storage: storage, fileFilter: fileFilter });

const authenticateToken = require("../routes/auth/middleware/authenticateToken.js");

// membuat route /
router.get("/", authenticateToken, (req, res) => {
  connect.query(
    "SELECT m.*, j.nama_jurusan FROM mahasiswa as m JOIN jurusan as j ON m.id_jurusan = j.id_j ORDER BY id_mahasiswa DESC",
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
  authenticateToken,
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "foto_ktm", maxCount: 1 },
  ]),
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
      foto: req.files.foto[0].filename,
      foto_ktm: req.files.foto_ktm[0].filename,
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
  authenticateToken,
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "foto_ktm", maxCount: 1 },
  ]),
  [body("nama").notEmpty(), body("nrp").notEmpty(), body("jurusan").notEmpty()],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let id = req.params.id;
    let foto = req.files["foto"] ? req.files["foto"][0].filename : null;
    let fotoKtm = req.files["foto_ktm"]
      ? req.files["foto_ktm"][0].filename
      : null;

    connect.query(
      "SELECT * FROM mahasiswa WHERE id_mahasiswa=?",
      id,
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: err,
          });
        }
        if (rows.length === 0) {
          return res.status(404).json({
            status: false,
            message: "Data tidak ditemukan",
          });
        }
        const fotoLama = rows[0].foto;
        const fotoKtmLama = rows[0].foto_ktm;

        // hapus file lama jika ada
        if (fotoLama && foto) {
          const pathFileLama = path.join(
            __dirname,
            "../public/images",
            fotoLama
          );
          fs.unlinkSync(pathFileLama);
        }
        if (fotoKtmLama && fotoKtm) {
          const pathFileLama = path.join(
            __dirname,
            "../public/images",
            fotoKtmLama
          );
          fs.unlinkSync(pathFileLama);
        }

        let data = {
          nama: req.body.nama,
          nrp: req.body.nrp,
          id_jurusan: req.body.jurusan,
        };

        if (foto) {
          data.foto = foto;
        }
        if (fotoKtm) {
          data.foto_ktm = fotoKtm;
        }
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
            }
            return res.status(200).json({
              status: true,
              message: "Mahasiswa berhasil diupdate",
              payload: data,
            });
          }
        );
      }
    );
  }
);

// membuat route delete
router.delete("/delete/(:id)", authenticateToken, (req, res) => {
  let id = req.params.id;
  connect.query(
    "SELECT * FROM mahasiswa WHERE id_mahasiswa=?",
    id,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
          error: err,
        });
      }
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Data tidak ditemukan",
        });
      }
      const fotoLama = rows[0].foto;
      const fotoKtmLama = rows[0].foto_ktm;

      // hapus file lama jika ada
      if (fotoLama) {
        const pathFileLama = path.join(__dirname, "../public/images", fotoLama);
        fs.unlinkSync(pathFileLama);
      }
      if (fotoKtmLama) {
        const pathFileLama = path.join(
          __dirname,
          "../public/images",
          fotoKtmLama
        );
        fs.unlinkSync(pathFileLama);
      }
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
            return res.status(200).json({
              status: true,
              message: "Mahasiswa berhasil di delete",
            });
          }
        }
      );
    }
  );
});

module.exports = router;
