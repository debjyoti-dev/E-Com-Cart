import sqlite3 from "sqlite3";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = process.env.DB_FILE || path.join(__dirname, "vibe_cart.db");

export const db = new sqlite3.Database(DB_FILE);

export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export async function initDb() {
  await run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      imageUrl TEXT
  )`);
  await run(`CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      productId INTEGER NOT NULL,
      qty INTEGER NOT NULL CHECK (qty > 0),
      UNIQUE(userId, productId),
      FOREIGN KEY(productId) REFERENCES products(id)
  )`);

  // Seed default products if empty
  const count = await get("SELECT COUNT(*) as c FROM products");
  if (!count || count.c === 0) {
    const seed = [
      {id:1,name:"Aurora Headphones",price:199.99,imageUrl:"/aurora.jpg"},
      {id:2,name:"Nimbus Keyboard",price:99.00,imageUrl:"/nimbus.jpg"},
      {id:3,name:"Pulse Mouse",price:49.50,imageUrl:"/pulse.jpg"},
      {id:4,name:"Zen Monitor 24"",price:189.00,imageUrl:"/zen24.jpg"},
      {id:5,name:"Orbit Webcam",price:69.99,imageUrl:"/orbit.jpg"},
      {id:6,name:"Echo Speaker",price:79.99,imageUrl:"/echo.jpg"},
      {id:7,name:"Voyager SSD 1TB",price:119.49,imageUrl:"/voyager.jpg"},
      {id:8,name:"Halo Lamp",price:39.99,imageUrl:"/halo.jpg"}
    ];
    for (const p of seed) {
      await run("INSERT INTO products (id,name,price,imageUrl) VALUES (?,?,?,?)", [p.id, p.name, p.price, p.imageUrl]);
    }
    console.log("Seeded products table with mock items.");
  }
}
