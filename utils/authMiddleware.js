/**
 * Middleware untuk autentikasi menggunakan JWT
 * @module utils/authMiddleware
 */

const jwt = require("jsonwebtoken");
const response = require("./response");

/**
 * Middleware untuk memverifikasi token JWT
 * @param {Object} req - Request object dari Express
 * @param {Object} res - Response object dari Express
 * @param {Function} next - Next middleware function
 */
const authMiddleware = (req, res, next) => {
  try {
    // Mengambil token dari header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.error(res, "Akses ditolak. Token tidak ditemukan", 401);
    }

    const token = authHeader.split(" ")[1];

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Menambahkan data user ke request
    req.user = decoded;

    next();
  } catch (error) {
    response.error(res, "Token tidak valid", 401);
  }
};

module.exports = authMiddleware;
