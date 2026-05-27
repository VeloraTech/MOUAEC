// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../")));

// ── Routes ────────────────────────────────────────────────────────────
app.use("/admin", adminRoutes);

// ── Serve admin page ──────────────────────────────────────────────────
app.get("/admin-panel", (req, res) => {
  res.sendFile(path.join(__dirname, "../../admin.html"));
});

// ── Health check ──────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



