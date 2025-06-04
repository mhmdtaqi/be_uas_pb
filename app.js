const express = require("express");
require("dotenv").config();
const authMiddleware = require("./utils/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const menuRoutes = require("./routes/menuRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");
const transaksiDetailRoutes = require("./routes/transaksiDetailRoutes");
const laporanHarianRoutes = require("./routes/laporanHarianRoutes");
const laporanBulananRoutes = require("./routes/laporanBulananRoutes");


app.use("/user", userRoutes);
app.use("/menu", authMiddleware, menuRoutes);
app.use("/transaksi", authMiddleware, transaksiRoutes);
app.use("/transaksi-detail", authMiddleware, transaksiDetailRoutes);
app.use("/laporan-harian", authMiddleware, laporanHarianRoutes);
app.use("/laporan-bulanan", authMiddleware, laporanBulananRoutes);

// Root
app.get("/", (req, res) => {
  res.send("API berjalan...");
});

app.listen(PORT, () => {
  console. log(`Server berjalan di http://localhost:${PORT}`);
});
