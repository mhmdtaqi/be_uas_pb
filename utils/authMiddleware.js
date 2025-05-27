const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Mengambil token dari header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Akses ditolak. Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Menambahkan data user ke request
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid" });
  }
};

module.exports = authMiddleware;
