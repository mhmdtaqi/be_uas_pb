const db = require("../db/db");
const response = require("../utils/response");

exports.getAllMenus = async (req, res) => {
  try {
    const [menus] = await db.query("SELECT * FROM menu");
    response.success(res, menus, "Berhasil mengambil data menu");
  } catch (err) {
    response.error(res, "Gagal mengambil data menu", 500, err.message);
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const [menu] = await db.query("SELECT * FROM menu WHERE id = ?", [
      req.params.id,
    ]);
    if (menu.length === 0)
      return response.error(res, "Menu tidak ditemukan", 404);
    response.success(res, menu[0], "Berhasil mengambil data menu");
  } catch (err) {
    response.error(res, "Gagal mengambil data menu", 500, err.message);
  }
};

exports.getMenuByName = async (req, res) => {
  try {
    const [menu] = await db.query("SELECT * FROM menu WHERE name = ?", [
      req.params.name,
    ]);
    if (menu.length === 0)
      return response.error(res, "Menu tidak ditemukan", 404);
    response.success(res, menu[0], "Berhasil mengambil data menu");
  } catch (err) {
    response.error(res, "Gagal mengambil data menu", 500, err.message);
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { nama, jenis, harga } = req.body;
    await db.query("INSERT INTO menu (nama, jenis, harga) VALUES (?, ?, ?)", [
      nama,
      jenis,
      harga,
    ]);
    response.success(res, null, "Menu berhasil dibuat", 201);
  } catch (err) {
    response.error(res, "Gagal membuat menu", 500, err.message);
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { nama, jenis, harga } = req.body;
    await db.query(
      "UPDATE menu SET nama = ?, jenis = ?, harga = ? WHERE id = ?",
      [nama, jenis, harga, req.params.id]
    );
    response.success(res, null, "Menu berhasil diupdate");
  } catch (err) {
    response.error(res, "Gagal mengupdate menu", 500, err.message);
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    await db.query("DELETE FROM menu WHERE id = ?", [req.params.id]);
    response.success(res, null, "Menu berhasil dihapus");
  } catch (err) {
    response.error(res, "Gagal menghapus menu", 500, err.message);
  }
};
