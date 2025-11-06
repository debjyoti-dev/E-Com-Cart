import express from "express";
import { all } from "../db/sqlite.js";
const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const rows = await all("SELECT id, name, price, imageUrl FROM products");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
