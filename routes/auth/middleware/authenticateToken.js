const jwt = require("jsonwebtoken");
const secretKey = "kunciRahasiaYangSama";

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Akses ditolak, token tidak ada",
      error: err,
    });
  }

  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({
      status: false,
      message: "Format token tidak valid",
      error: err,
    });
  }

  const tokenValue = tokenParts[1];

  jwt.verify(tokenValue, secretKey, (err, decode) => {
    if (err) {
      return res.status(403).json({
        status: false,
        message: "Token tidak valid",
        error: err,
      });
    }
    const { userId, username } = decode;
    req.user = { userId, username };
    next();
  });
};

module.exports = authenticateToken;
