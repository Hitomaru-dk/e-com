/**
 * cart.js — Global cart state manager
 * Used by all pages: add/remove items, get count, get total
 * Cart stored in localStorage as 'feane_cart'
 */

const Cart = {
  get() {
    return JSON.parse(localStorage.getItem('feane_cart') || '[]');
  },
  save(items) {
    localStorage.setItem('feane_cart', JSON.stringify(items));
    Cart.updateBadge();
  },
  add(product) {
    const items = Cart.get();
    const idx = items.findIndex(i => i.id === product.id);
    if (idx > -1) {
      items[idx].quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }
    Cart.save(items);
  },
  remove(productId) {
    Cart.save(Cart.get().filter(i => i.id !== productId));
  },
  clear() {
    localStorage.removeItem('feane_cart');
    Cart.updateBadge();
  },
  count() {
    return Cart.get().reduce((s, i) => s + i.quantity, 0);
  },
  total() {
    return Cart.get().reduce((s, i) => s + i.price * i.quantity, 0);
  },
  updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const n = Cart.count();
    badge.textContent = n;
    badge.style.display = n > 0 ? 'flex' : 'none';
  }
};

// Update badge on page load
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());