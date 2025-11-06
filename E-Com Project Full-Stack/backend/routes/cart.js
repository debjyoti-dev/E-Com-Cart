import express from "express";
import { all, get, run } from "../db/sqlite.js";
const router = express.Router();

// Mock user
const USER_ID = "demo";

// POST /api/cart : Add { productId, qty }
router.post("/", async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId || !qty || qty <= 0) {
      return res.status(400).json({ error: "productId and positive qty required" });
    }
    const product = await get("SELECT id FROM products WHERE id = ?", [productId]);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // upsert
    const existing = await get("SELECT id, qty FROM cart_items WHERE userId = ? AND productId = ?", [USER_ID, productId]);
    if (existing) {
      const newQty = existing.qty + qty;
      await run("UPDATE cart_items SET qty = ? WHERE id = ?", [newQty, existing.id]);
    } else {
      await run("INSERT INTO cart_items (userId, productId, qty) VALUES (?,?,?)", [USER_ID, productId, qty]);
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to add to cart" });
  }
});

// PATCH /api/cart/:id : update qty
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { qty } = req.body;
    if (!qty || qty <= 0) return res.status(400).json({ error: "qty must be > 0" });
    const item = await get("SELECT id FROM cart_items WHERE id = ? AND userId = ?", [id, USER_ID]);
    if (!item) return res.status(404).json({ error: "Cart item not found" });
    await run("UPDATE cart_items SET qty = ? WHERE id = ?", [qty, id]);
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Failed to update cart item" });
  }
});

// DELETE /api/cart/:id : Remove item
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await run("DELETE FROM cart_items WHERE id = ? AND userId = ?", [id, USER_ID]);
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Failed to remove cart item" });
  }
});

// GET /api/cart : Get cart + total
router.get("/", async (req, res) => {
  try {
    const items = await all(
      `SELECT c.id as cartId, p.id as productId, p.name, p.price, p.imageUrl, c.qty,
              ROUND(p.price * c.qty, 2) as lineTotal
       FROM cart_items c
       JOIN products p ON p.id = c.productId
       WHERE c.userId = ?`,
       ["demo"]
    );
    const total = items.reduce((acc, it) => acc + Number(it.lineTotal), 0);
    res.json({ items, total: Number(total.toFixed(2)) });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

export default router;
