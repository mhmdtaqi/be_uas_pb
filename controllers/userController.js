const db = require("../db/db");
const bcrypt = require("bcrypt");
const response = require("../utils/response");

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM user");
    response.success(res, users, "Berhasil mengambil data user");
  } catch (err) {
    response.error(res, "Gagal mengambil data user", 500, err.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const [user] = await db.query("SELECT * FROM user WHERE id_user = ?", [
      req.params.id,
    ]);
    if (user.length === 0)
      return response.error(res, "User tidak ditemukan", 404);
    response.success(res, user[0], "Berhasil mengambil data user");
  } catch (err) {
    response.error(res, "Gagal mengambil data user", 500, err.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const { nama, password } = req.body;
    if (!nama || !password) {
      return response.error(res, "Nama dan password wajib diisi", 400);
    }
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    await db.query("INSERT INTO user (nama, password_hash) VALUES (?, ?)", [
      nama,
      password_hash,
    ]);
    response.success(res, null, "User berhasil dibuat", 201);
  } catch (err) {
    response.error(res, "Gagal membuat user", 500, err.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { nama, password } = req.body;
    let password_hash;
    if (password) {
      const saltRounds = 10;
      password_hash = await bcrypt.hash(password, saltRounds);
    }
    if (password_hash) {
      await db.query(
        "UPDATE user SET nama = ?, password_hash = ? WHERE id_user = ?",
        [nama, password_hash, req.params.id]
      );
    } else {
      await db.query("UPDATE user SET nama = ? WHERE id_user = ?", [
        nama,
        req.params.id,
      ]);
    }
    response.success(res, null, "User berhasil diupdate");
  } catch (err) {
    response.error(res, "Gagal mengupdate user", 500, err.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await db.query("DELETE FROM user WHERE id_user = ?", [req.params.id]);
    response.success(res, null, "User berhasil dihapus");
  } catch (err) {
    response.error(res, "Gagal menghapus user", 500, err.message);
  }
};
