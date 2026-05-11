/**
 * database.js
 *
 * Act as a Database Administrator:
 * This file opens (or creates) store.db and sets up all tables.
 * Import this file once in server.js — it runs automatically on startup.
 *
 * Usage in other files:
 *   const db = require('../database');
 */

const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

// store.db lives in feane-backend/ next to server.js
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'store.db');

/**
 * Open or create store.db.
 * OPEN_READWRITE | OPEN_CREATE = open if exists, create if not.
 */
const db = new sqlite3.Database(
  DB_PATH,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error('Could not connect to store.db:', err.message);
    } else {
      console.log('Connected to SQLite → store.db');
    }
  }
);

// WAL mode = better performance for concurrent reads/writes (DBA best-practice)
db.run('PRAGMA journal_mode = WAL;');

/**
 * CREATE TABLE IF NOT EXISTS — runs safely on every startup.
 * Tables are only created when they don't already exist.
 */

// Table: users (mirrors auth_user.json)
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    username             TEXT    NOT NULL UNIQUE,
    password             TEXT    NOT NULL,
    first_name           TEXT    NOT NULL,
    date_of_registration TEXT    NOT NULL
  )
`);

// Table: products (mirrors products.json)
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    price       REAL NOT NULL,
    category    TEXT,
    image       TEXT,
    description TEXT
  )
`);

/**
 * Table: orders
 * user_id is a FOREIGN KEY → users.id
 * This is the "Relational Logic" from the ERD:
 *   USERS ||--o{ ORDERS : "User_ID"
 */
db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    total_price REAL    NOT NULL,
    card_last4  TEXT,
    email       TEXT,
    order_date  TEXT    NOT NULL DEFAULT (DATE('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

/**
 * Table: order_items
 * Junction table: orders ↔ products (one order can have many products)
 * product_id → products.id
 * order_id   → orders.id
 */
db.run(`
  CREATE TABLE IF NOT EXISTS order_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id   INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity   INTEGER NOT NULL DEFAULT 1,
    price      REAL    NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )
`);

module.exports = db;