/**
 * Utility untuk menangani response API
 * @module utils/response
 */

/**
 * Mengirim response sukses
 * @param {Object} res - Response object dari Express
 * @param {*} data - Data yang akan dikirim
 * @param {string} message - Pesan sukses
 * @param {number} [statusCode=200] - HTTP status code
 */
exports.success = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Mengirim response error
 * @param {Object} res - Response object dari Express
 * @param {string} message - Pesan error
 * @param {number} statusCode - HTTP status code
 * @param {string} [error] - Detail error (opsional)
 */
exports.error = (res, message, statusCode, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
