import { initDb } from "../db/sqlite.js";
await initDb();
console.log("DB ready.");
