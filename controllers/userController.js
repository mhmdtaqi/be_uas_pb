const db = require("../db/db");
const bcrypt = require("bcrypt");
const response = require("../utils/response");
const jwt = require("jsonwebtoken");

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

exports.Register = async (req, res) => {
  try {
    const { nama, password, role } = req.body;

    // Validasi input
    if (!nama || !password) {
      return response.error(res, "Nama dan password wajib diisi", 400);
    }

    if (password.length < 6) {
      return response.error(res, "Password minimal 6 karakter", 400);
    }

    // Validasi role
    if (role && !["owner", "kasir"].includes(role)) {
      return response.error(res, "Role harus berupa 'owner' atau 'kasir'", 400);
    }

    // Cek apakah username sudah ada
    const [existingUsers] = await db.query(
      "SELECT * FROM user WHERE nama = ?",
      [nama]
    );
    if (existingUsers.length > 0) {
      return response.error(res, "Username sudah digunakan", 400);
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Simpan user baru
    await db.query(
      "INSERT INTO user (nama, password_hash, role) VALUES (?, ?, ?)",
      [nama, password_hash, role || "kasir"]
    );

    response.success(res, null, "Registrasi berhasil", 201);
  } catch (err) {
    response.error(res, "Gagal melakukan registrasi", 500, err.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { nama, password, role } = req.body;
    let password_hash;
    if (password) {
      const saltRounds = 10;
      password_hash = await bcrypt.hash(password, saltRounds);
    }

    // Validasi role jika diupdate
    if (role && !["owner", "kasir"].includes(role)) {
      return response.error(res, "Role harus berupa 'owner' atau 'kasir'", 400);
    }

    if (password_hash) {
      await db.query(
        "UPDATE user SET nama = ?, password_hash = ?, role = ? WHERE id_user = ?",
        [nama, password_hash, role, req.params.id]
      );
    } else {
      await db.query("UPDATE user SET nama = ?, role = ? WHERE id_user = ?", [
        nama,
        role,
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

exports.login = async (req, res) => {
  try {
    const { nama, password } = req.body;

    if (!nama || !password) {
      return response.error(res, "Nama dan password wajib diisi", 400);
    }

    // Cari user berdasarkan nama
    const [users] = await db.query("SELECT * FROM user WHERE nama = ?", [nama]);

    if (users.length === 0) {
      return response.error(res, "User tidak ditemukan", 401);
    }

    const user = users[0];

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return response.error(res, "Password salah", 401);
    }

    // Buat token JWT
    const token = jwt.sign(
      {
        id_user: user.id_user,
        nama: user.nama,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    response.success(res, { token }, "Login berhasil");
  } catch (err) {
    response.error(res, "Gagal login", 500, err.message);
  }
};
