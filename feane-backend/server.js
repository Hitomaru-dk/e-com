/**
 * server.js — Express app entry point
 * Connects to store.db on startup via database.js,
 * then mounts all API routes.
 */

const express        = require('express');
const cors           = require('cors');
const productRoutes  = require('./routes/products');
const authRoutes     = require('./routes/auth');
const checkoutRoutes = require('./routes/checkout');

const app  = express();
const PORT = 3000;

// Connect to SQLite (store.db) — runs CREATE TABLE IF NOT EXISTS on startup
// Must be required before any route that uses the db
require('./database');

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth',     authRoutes);
app.use('/api/checkout', checkoutRoutes);

app.get('/', (req, res) => {
  res.send('Backend Server is Running!');
});

app.listen(PORT, () => {
  console.log(`Server is active on http://localhost:${PORT}`);
});