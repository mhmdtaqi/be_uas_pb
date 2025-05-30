/**
 * Middleware untuk otorisasi berdasarkan role
 * @module utils/roleMiddleware
 */

const response = require("./response");

/**
 * Middleware untuk mengecek role user
 * @param {string[]} allowedRoles - Array role yang diizinkan
 * @returns {Function} Middleware function
 */
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!userRole) {
      return response.error(res, "Role tidak ditemukan", 403);
    }

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      response.error(res, "Anda tidak memiliki akses ke halaman ini", 403);
    }
  };
};

/**
 * Middleware untuk role owner
 * @type {Function}
 */
const ownerOnly = roleMiddleware(["owner"]);

/**
 * Middleware untuk role kasir
 * @type {Function}
 */
const kasirOnly = roleMiddleware(["kasir"]);

/**
 * Middleware untuk role owner dan kasir
 * @type {Function}
 */
const ownerAndKasir = roleMiddleware(["owner", "kasir"]);

module.exports = {
  ownerOnly,
  kasirOnly,
  ownerAndKasir,
};
