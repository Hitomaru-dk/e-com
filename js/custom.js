// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();


// isotope js
$(window).on('load', function () {
    $('.filters_menu li').click(function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');

        var data = $(this).attr('data-filter');
        $grid.isotope({
            filter: data
        })
    });

    var $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: false,
        masonry: {
            columnWidth: ".all"
        }
    })
});

// nice select
$(document).ready(function() {
    $('select').niceSelect();
  });

/** google_map js **/
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(40.712775, -74.005973),
        zoom: 18,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

// client section owl carousel
$(".client_owl-carousel").owlCarousel({
    loop: true,
    margin: 0,
    dots: false,
    nav: true,
    navText: [],
    autoplay: true,
    autoplayHoverPause: true,
    navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 2
        },
        1000: {
            items: 2
        }
    }
});
let cart = {};
const CART_STORAGE_KEY = 'feaneCartItems';
const CART_PANEL_ID = 'cartPanel';

function loadCart() {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    cart = stored ? JSON.parse(stored) : {};
    renderCartCount();
}

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    renderCartCount();
    renderCartPanel();
}

function getCartItemCount() {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
}

function renderCartCount() {
    document.querySelectorAll('.cart_link').forEach(link => {
        let badge = link.querySelector('.cart-count');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-count';
            badge.id = 'cartCount';
            link.appendChild(badge);
        }
        const count = getCartItemCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    });
}

function generateCartId(title) {
    return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function getProductDataFromButton(button) {
    const productCard = button.closest('.box');
    const title = button.dataset.title || productCard?.querySelector('.detail-box h5')?.textContent.trim() || 'Unknown item';
    const priceText = button.dataset.price || productCard?.querySelector('.options h6')?.textContent.trim() || '0';
    const price = parseFloat(priceText.replace(/[^0-9\.]/g, '') || '0');
    const image = button.dataset.image || productCard?.querySelector('.img-box img')?.src || '';
    const id = button.dataset.id || generateCartId(title);
    return { id, title, price, image };
}

function addToCart(product) {
    if (cart[product.id]) {
        cart[product.id].quantity += 1;
    } else {
        cart[product.id] = {
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        };
    }
    saveCart();
    openCartPanel();
}

function setupStaticCartButtons() {
    document.querySelectorAll('.filters-content .options a, .options a').forEach(anchor => {
        if (anchor.closest('.user_option') || anchor.closest('.cart-panel')) return;
        if (!anchor.classList.contains('add-to-cart')) {
            anchor.classList.add('add-to-cart');
        }
        const productCard = anchor.closest('.box');
        if (productCard) {
            const title = productCard.querySelector('.detail-box h5')?.textContent.trim() || '';
            const priceText = productCard.querySelector('.options h6')?.textContent.trim() || '';
            const image = productCard.querySelector('.img-box img')?.src || '';
            if (title) {
                anchor.dataset.id = anchor.dataset.id || generateCartId(title);
                anchor.dataset.title = anchor.dataset.title || title;
                anchor.dataset.price = anchor.dataset.price || priceText.replace(/[^0-9\.]/g, '');
                anchor.dataset.image = anchor.dataset.image || image;
            }
        }
    });
}

function createCartPanel() {
    if (document.getElementById(CART_PANEL_ID)) return;

    const panelHtml = `
        <div id="${CART_PANEL_ID}" class="cart-panel" aria-hidden="true">
            <div class="cart-panel-backdrop"></div>
            <div class="cart-panel-box">
                <div class="cart-panel-header">
                    <h3>ตะกร้าของคุณ</h3>
                    <button type="button" id="cartCloseBtn" class="cart-close" aria-label="Close cart">×</button>
                </div>
                <div id="cartItemsList" class="cart-items-list"></div>
                <div class="cart-panel-footer">
                    <div id="cartTotal" class="cart-total"></div>
                    <button type="button" id="clearCartBtn" class="cart-clear">ลบทั้งหมด</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', panelHtml);

    const style = document.createElement('style');
    style.textContent = `
        .cart_link { position: relative; }
        .cart-count { position: absolute; top: 2px; right: 2px; background: #ff2f2f; color: #fff; font-size: 12px; line-height: 1; min-width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; padding: 0 6px; box-shadow: 0 0 0 2px rgba(255,255,255,0.9); text-align: center; }
        .cart-panel { display: none; position: fixed; inset: 0; z-index: 9999; }
        .cart-panel.active { display: block; }
        .cart-panel-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.55); }
        .cart-panel-box { position: absolute; top: 50%; right: 20px; transform: translateY(-50%); width: min(420px, 90%); max-height: 85vh; overflow: hidden; background: #fff; border-radius: 18px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2); }
        .cart-panel-header { display: flex; align-items: center; justify-content: space-between; padding: 18px; border-bottom: 1px solid #eee; }
        .cart-panel-header h3 { margin: 0; font-size: 18px; }
        .cart-close { background: transparent; border: none; font-size: 24px; cursor: pointer; line-height: 1; }
        .cart-items-list { max-height: calc(85vh - 180px); overflow-y: auto; padding: 16px; }
        .cart-item { display: flex; gap: 12px; margin-bottom: 16px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px; }
        .cart-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .cart-item img { width: 64px; height: 64px; object-fit: cover; border-radius: 12px; }
        .cart-item-info { flex: 1; }
        .cart-item-title { font-weight: 600; margin-bottom: 6px; }
        .cart-item-meta { font-size: 13px; color: #555; margin-bottom: 8px; }
        .cart-item-actions { display: flex; justify-content: space-between; align-items: center; }
        .remove-cart-item { background: transparent; border: none; color: #ff4c4c; cursor: pointer; font-size: 13px; }
        .cart-panel-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px; border-top: 1px solid #eee; }
        .cart-total { font-weight: 600; }
        .cart-clear { background: #ff6500; color: #fff; border: none; padding: 10px 16px; border-radius: 10px; cursor: pointer; }
        .cart-empty { padding: 24px 16px; text-align: center; color: #444; }
    `;
    document.head.appendChild(style);

    document.getElementById('cartCloseBtn').addEventListener('click', closeCartPanel);
    document.querySelector(`#${CART_PANEL_ID} .cart-panel-backdrop`).addEventListener('click', closeCartPanel);
    document.getElementById('clearCartBtn').addEventListener('click', function() {
        cart = {};
        saveCart();
        renderCartPanel();
    });
    document.getElementById(CART_PANEL_ID).addEventListener('click', function(event) {
        const removeButton = event.target.closest('.remove-cart-item');
        if (!removeButton) return;
        const id = removeButton.dataset.id;
        if (id && cart[id]) {
            delete cart[id];
            saveCart();
            renderCartPanel();
        }
    });
}

function renderCartPanel() {
    const panel = document.getElementById(CART_PANEL_ID);
    if (!panel) return;
    const list = document.getElementById('cartItemsList');
    const totalEl = document.getElementById('cartTotal');
    if (!list || !totalEl) return;

    const items = Object.entries(cart);
    if (items.length === 0) {
        list.innerHTML = '<div class="cart-empty">ตะกร้าว่างอยู่ ขณะนี้ยังไม่มีสินค้า</div>';
        totalEl.textContent = '';
        return;
    }

    let total = 0;
    list.innerHTML = items.map(([id, item]) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        return `
            <div class="cart-item">
                <img src="${item.image || 'images/f1.png'}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-meta">ราคา ${item.price.toFixed(2)} x ${item.quantity} = ${(subtotal).toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <button type="button" class="remove-cart-item" data-id="${id}">ลบ</button>
                    </div>
                </div>
            </div>`;
    }).join('');
    totalEl.textContent = `รวม ${total.toFixed(2)} USD | ${getCartItemCount()} ชิ้น`;
}

function openCartPanel() {
    const panel = document.getElementById(CART_PANEL_ID);
    if (!panel) return;
    panel.classList.add('active');
    panel.setAttribute('aria-hidden', 'false');
    renderCartPanel();
}

function closeCartPanel() {
    const panel = document.getElementById(CART_PANEL_ID);
    if (!panel) return;
    panel.classList.remove('active');
    panel.setAttribute('aria-hidden', 'true');
}

function initCart() {
    createCartPanel();
    setupStaticCartButtons();
    loadCart();
}

function handleAddToCartButton(addButton) {
    const product = getProductDataFromButton(addButton);
    addToCart(product);
}

// Global event delegation for add-to-cart buttons and cart icon
document.body.addEventListener('click', function(event) {
    const addButton = event.target.closest('.add-to-cart');
    if (addButton) {
        event.preventDefault();
        handleAddToCartButton(addButton);
        return;
    }

    const cartButton = event.target.closest('.cart_link');
    if (cartButton) {
        event.preventDefault();
        openCartPanel();
    }
});

window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCartPanel();
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    initCart();
}