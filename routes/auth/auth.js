const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const connect = require("../../config/db.js");

const secretKey = "kunciRahasiaYangSama";

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("username harus diisi"),
    body("password").notEmpty().withMessage("password harus diisi"),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    const { username, password } = req.body;
    const checkUserQuery = "SELECT * FROM users WHERE username = ?";
    connect.query(checkUserQuery, [username], (err, result) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal server error",
          error: err,
        });
      }

      if (result.length > 0) {
        return res.stastatus(500).json({
          status: false,
          message: "Pengguna sudah terdaftar",
        });
      }

      const insertQuery = "INSERT INTO users (username,password) VALUES (?,?)";
      connect.query(insertQuery, [username, password], (err, result) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err,
          });
        }

        const payload = { userId: result.insertId, username };
        const token = jwt.sign(payload.secretKey);
        const updateTokenQuery = "UPDATE users SET token = ? WHERE id = ?";
        connect.query(
          updateTokenQuery,
          [token, result.insertId],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                status: false,
                message: "Internal server error",
                error: err,
              });
            }
            res.json({ token });
          }
        );
      });
    });
  }
);

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  connect.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          status: false,
          message: "Internal server error",
          error: error,
        });
      }

      if (result.length === 0) {
        return res.status(401).json({
          status: false,
          message: "Login Failed !",
        });
      }

      const user = result[0];
      if (user.password !== password) {
        return res.status(401).json({
          status: false,
          message: "Kata sandi salah !",
        });
      }
      if (user.token) {
        const token = user.token;
        res.json({ token });
      } else {
        const payload = { userId: user.id, username };
        const token = jwt.sign(payload, secretKey);
      }
    }
  );
});

module.exports = router;
