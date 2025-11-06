import express from "express";
import { all, run } from "../db/sqlite.js";
const router = express.Router();

const USER_ID = "demo";

// POST /api/checkout : { name, email }
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "name and email required" });
    }

    const items = await all(
      `SELECT p.name, p.price, c.qty, ROUND(p.price * c.qty, 2) as lineTotal
       FROM cart_items c JOIN products p ON p.id = c.productId
       WHERE c.userId = ?`, [USER_ID]
    );

    const total = items.reduce((acc, it) => acc + Number(it.lineTotal), 0);
    const ts = new Date().toISOString();

    // Clear cart
    await run("DELETE FROM cart_items WHERE userId = ?", [USER_ID]);

    return res.json({
      receipt: {
        customer: { name, email },
        items,
        total: Number(total.toFixed(2)),
        timestamp: ts,
        id: Math.random().toString(36).slice(2,10)
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Checkout failed" });
  }
});

export default router;
