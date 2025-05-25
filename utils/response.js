function success(res, data, message = "Berhasil", status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

function error(res, message = "Terjadi kesalahan", status = 500, error = null) {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
}

module.exports = {
  success,
  error,
};
