/**
 * cart.js — Global cart state manager
 * ── key: 'feaneCartItems'  (object format, ตรงกับ custom.js)
 * ── ทุกหน้าใช้ไฟล์นี้เป็น source of truth
 */

const Cart = {

  // ── Read ────────────────────────────────────────────────
  _raw() {
    const stored = localStorage.getItem('feaneCartItems');
    return stored ? JSON.parse(stored) : {};
  },

  /** คืน array ของ items (ใช้ใน payment.html) */
  get() {
    return Object.values(this._raw());
  },

  // ── Write ───────────────────────────────────────────────
  _save(obj) {
    localStorage.setItem('feaneCartItems', JSON.stringify(obj));
    this.updateBadge();
  },

  add(product) {
    const cart = this._raw();
    const key  = String(product.id);
    if (cart[key]) {
      cart[key].quantity += 1;
    } else {
      cart[key] = { ...product, quantity: 1 };
    }
    this._save(cart);
  },

  remove(productId) {
    const cart = this._raw();
    delete cart[String(productId)];
    this._save(cart);
  },

  clear() {
    localStorage.removeItem('feaneCartItems');
    this.updateBadge();
  },

  // ── Aggregates ──────────────────────────────────────────
  count() {
    return this.get().reduce((s, i) => s + i.quantity, 0);
  },

  total() {
    return this.get().reduce((s, i) => s + i.price * i.quantity, 0);
  },

  // ── Badge ───────────────────────────────────────────────
  updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const n = this.count();
    badge.textContent  = n;
    badge.style.display = n > 0 ? 'flex' : 'none';
  }
};

document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());