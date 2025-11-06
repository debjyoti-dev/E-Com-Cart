# Vibe Commerce — Mock E-Com Cart

Basic full-stack shopping cart for screening.

## Tech Stack
- **Backend:** Node.js, Express, SQLite
- **Frontend:** React (Vite)
- **REST APIs:** /api/products, /api/cart, /api/checkout

## Quick Start

### 1) Backend
```bash
cd backend
cp .env.example .env   # optional
npm install
npm run seed           # creates DB and seeds products
npm start              # http://localhost:4000
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```
The dev server proxies `/api` to `http://localhost:4000`.

## API Spec

- `GET /api/products` → list 5–10 items
- `POST /api/cart` body: `{ productId, qty }` → add (upsert)
- `PATCH /api/cart/:id` body: `{ qty }` → update qty
- `DELETE /api/cart/:id` → remove item
- `GET /api/cart` → cart items + total
- `POST /api/checkout` body: `{ name, email }` → returns `receipt` and clears cart

## Bonus & Notes
- DB persistence with SQLite (mock user `demo`).
- Error handling for bad inputs.
- Responsive design.
- Receipt modal shown after checkout.
- You can easily swap SQLite with MongoDB in `db/` if preferred.

## Screenshots
Add to your repo after running locally.

## Demo Video
Use Loom/YouTube (unlisted) for a 1–2 min walkthrough.
