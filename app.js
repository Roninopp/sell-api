// ══ TIGER DEALS MINI APP ══
// Full logic: Telegram init, wallet balance, deposit flow, buy flow

const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// ── Config (update UPI in one place) ──
const CONFIG = {
    UPI_ID: "vivek-6896@ptyes",
    MIN_DEPOSIT: 10,
    MAX_DEPOSIT: 10000,
};

// ── Product catalogue ──
const PRODUCTS = {
    instagram: [
        { id:"100f",   name:"100 Followers",     price:20,  type:"profile", icon:"👤" },
        { id:"500f",   name:"500 Followers",     price:70,  type:"profile", icon:"👤" },
        { id:"1000f",  name:"1000 Followers",    price:160, type:"profile", icon:"👤" },
        { id:"5kf",    name:"5K Followers",      price:420, type:"profile", icon:"👤" },
        { id:"1kv",    name:"1,000 Views",       price:17,  type:"post",    icon:"👁️" },
        { id:"100kv",  name:"100K Views",        price:190, type:"post",    icon:"👁️" },
        { id:"1mv",    name:"1M Views",          price:300, type:"post",    icon:"👁️" },
        { id:"100l",   name:"100 Likes",         price:8,   type:"post",    icon:"❤️" },
        { id:"10kl",   name:"10K Likes",         price:50,  type:"post",    icon:"❤️" },
        { id:"100kl",  name:"100K Likes",        price:70,  type:"post",    icon:"❤️" },
        { id:"1kc",    name:"1K Comments",       price:120, type:"post",    icon:"💬" },
    ],
    telegram: [
        { id:"100m",   name:"100 Members",       price:25,  type:"profile", icon:"👥" },
        { id:"200m",   name:"200 Members",       price:49,  type:"profile", icon:"👥" },
        { id:"500m",   name:"500 Members",       price:120, type:"profile", icon:"👥" },
        { id:"1000m",  name:"1000 Members",      price:240, type:"profile", icon:"👥" },
        { id:"1ktv",   name:"1K Views",          price:10,  type:"post",    icon:"👁️" },
        { id:"100r",   name:"100 Reactions",     price:15,  type:"post",    icon:"⚡" },
    ],
    facebook: [
        { id:"100fb",  name:"100 Followers",     price:25,  type:"profile", icon:"👤" },
        { id:"200fb",  name:"200 Followers",     price:49,  type:"profile", icon:"👤" },
        { id:"500fb",  name:"500 Followers",     price:120, type:"profile", icon:"👤" },
        { id:"1000fb", name:"1000 Followers",    price:240, type:"profile", icon:"👤" },
    ],
};

// Sub-filter labels per category
const SUB_FILTERS = {
    instagram: ["All", "Followers", "Views", "Likes", "Comments"],
    telegram:  ["All", "Members", "Views", "Reactions"],
    facebook:  ["All", "Followers"],
};

const SUB_FILTER_MATCH = {
    "Followers": ["Followers"],
    "Views":     ["Views"],
    "Likes":     ["Likes"],
    "Comments":  ["Comments"],
    "Members":   ["Members"],
    "Reactions": ["Reactions"],
};

// ── State ──
let state = {
    balance: 0,
    category: "instagram",
    subFilter: "All",
    selectedProduct: null,
    depositAmount: 0,
    userId: null,
    userName: null,
};

// ── DOM refs ──
const $ = id => document.getElementById(id);
const walletEl      = $('wallet-balance');
const gridEl        = $('product-grid');
const subFiltersEl  = $('sub-filters');
const sectionTitle  = $('section-title');
const sectionCount  = $('section-count');
const overlay       = $('overlay');
const toastEl       = $('toast');

const depositSheet  = $('deposit-sheet');
const purchaseSheet = $('purchase-sheet');

// ══ INIT ══
document.addEventListener("DOMContentLoaded", () => {
    initTelegram();
    loadBalance();
    renderSubFilters();
    renderGrid();
    bindEvents();
});

function initTelegram() {
    const user = tg.initDataUnsafe?.user;
    if (user) {
        state.userId   = user.id;
        state.userName = user.first_name;
        $('user-name').textContent = user.first_name;

        // Avatar initials
        const initials = user.first_name.slice(0,2).toUpperCase();
        $('avatar-circle').textContent = initials;
    }

    // Read balance from URL param (set by bot when opening mini app)
    const params = new URLSearchParams(window.location.search);
    const bal = parseFloat(params.get('balance') || '0');
    state.balance = isNaN(bal) ? 0 : bal;
    updateBalanceDisplay();
}

function loadBalance() {
    // Balance comes from URL; mini app can also request fresh via sendData
    updateBalanceDisplay();
}

function updateBalanceDisplay() {
    walletEl.textContent = `₹${state.balance.toFixed(2)}`;
    // Also update purchase sheet balance
    $('sheet-balance').textContent = `₹${state.balance.toFixed(2)}`;
}

// ══ RENDER ══
function renderSubFilters() {
    const filters = SUB_FILTERS[state.category] || ["All"];
    subFiltersEl.innerHTML = '';
    filters.forEach(f => {
        const btn = document.createElement('button');
        btn.className = 'sub-btn' + (f === state.subFilter ? ' active' : '');
        btn.textContent = f;
        btn.addEventListener('click', () => {
            state.subFilter = f;
            renderSubFilters();
            renderGrid();
        });
        subFiltersEl.appendChild(btn);
    });
}

function renderGrid() {
    let items = PRODUCTS[state.category] || [];

    // Apply sub-filter
    if (state.subFilter !== "All") {
        const keywords = SUB_FILTER_MATCH[state.subFilter] || [state.subFilter];
        items = items.filter(p => keywords.some(k => p.name.includes(k)));
    }

    // Section label
    const catLabel = { instagram:"Instagram", telegram:"Telegram", facebook:"Facebook" };
    sectionTitle.textContent = `${catLabel[state.category]} Services`;
    sectionCount.textContent = `${items.length} deals`;

    gridEl.innerHTML = '';

    if (items.length === 0) {
        gridEl.innerHTML = `<div class="empty-state"><i class="fa-solid fa-box-open"></i>No services here yet</div>`;
        return;
    }

    items.forEach((prod, i) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${i * 0.04}s`;
        card.innerHTML = `
            <div class="p-card-icon">${prod.icon}</div>
            <div class="p-card-name">${prod.name}</div>
            <div class="p-card-price">₹${prod.price}</div>
            <button class="p-card-btn">Select →</button>
        `;
        card.addEventListener('click', () => openPurchaseSheet(prod));
        gridEl.appendChild(card);
    });
}

// ══ SHEETS ══
function openSheet(sheet) {
    overlay.classList.add('show');
    sheet.classList.add('open');
    tg.BackButton.show();
    tg.BackButton.onClick(closeAllSheets);
}

function closeAllSheets() {
    overlay.classList.remove('show');
    depositSheet.classList.remove('open');
    purchaseSheet.classList.remove('open');
    tg.BackButton.hide();
    state.selectedProduct = null;
}

overlay.addEventListener('click', closeAllSheets);

// ── Deposit Sheet ──
function openDepositSheet() {
    $('deposit-amount').value = '';
    state.depositAmount = 0;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
    openSheet(depositSheet);
}

// ── Purchase Sheet ──
function openPurchaseSheet(prod) {
    state.selectedProduct = prod;

    $('sheet-product-name').textContent = prod.name;
    $('sheet-price').textContent        = `₹${prod.price}`;
    $('purchase-icon').textContent      = prod.icon;
    $('target-input').value             = '';
    $('input-error').style.display      = 'none';
    $('input-error').textContent        = '';

    // Label for input
    let placeholder = "Enter username...";
    if (prod.type === 'post') {
        placeholder = prod.category === 'instagram'
            ? "Paste Post/Reel link (https://...)"
            : "Paste public message link (https://...)";
    } else {
        if (state.category === 'instagram') placeholder = "Instagram username (without @)";
        if (state.category === 'telegram')  placeholder = "@channel or t.me/channel";
        if (state.category === 'facebook')  placeholder = "Profile or page link";
    }
    $('target-input').placeholder = placeholder;

    // Balance check
    const warn     = $('balance-warning');
    const warnText = $('balance-warn-text');
    const buyBtn   = $('btn-buy-confirm');

    if (state.balance < prod.price) {
        warn.style.display = 'flex';
        warnText.textContent = `Insufficient balance. You need ₹${prod.price} but have ₹${state.balance.toFixed(2)}. Please deposit first.`;
        buyBtn.disabled = true;
    } else {
        warn.style.display = 'none';
        buyBtn.disabled = false;
    }

    updateBalanceDisplay();
    openSheet(purchaseSheet);
}

// ══ EVENTS ══
function bindEvents() {
    // Tabs
    document.querySelectorAll('.tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.category  = btn.dataset.cat;
            state.subFilter = "All";
            renderSubFilters();
            renderGrid();
        });
    });

    // Deposit open
    $('btn-deposit').addEventListener('click', openDepositSheet);

    // Amount pills
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
            const amt = parseInt(pill.dataset.amount);
            $('deposit-amount').value = amt;
            state.depositAmount = amt;
        });
    });

    // Deposit amount input
    $('deposit-amount').addEventListener('input', e => {
        state.depositAmount = parseInt(e.target.value) || 0;
        document.querySelectorAll('.pill').forEach(p => {
            p.classList.toggle('selected', parseInt(p.dataset.amount) === state.depositAmount);
        });
    });

    // Copy UPI
    $('copy-upi').addEventListener('click', () => {
        navigator.clipboard.writeText(CONFIG.UPI_ID)
            .then(() => showToast('UPI ID copied!', 'success'))
            .catch(() => showToast(CONFIG.UPI_ID, 'info'));
    });

    // Deposit confirm → send to bot
    $('btn-deposit-confirm').addEventListener('click', () => {
        const amt = state.depositAmount;
        if (!amt || amt < CONFIG.MIN_DEPOSIT) {
            showToast(`Minimum deposit is ₹${CONFIG.MIN_DEPOSIT}`, 'error');
            return;
        }
        if (amt > CONFIG.MAX_DEPOSIT) {
            showToast(`Maximum deposit is ₹${CONFIG.MAX_DEPOSIT}`, 'error');
            return;
        }

        // Send deposit request to bot — bot will ask for screenshot
        tg.sendData(JSON.stringify({
            action: "deposit_request",
            amount: amt,
        }));
    });

    $('btn-deposit-cancel').addEventListener('click', closeAllSheets);

    // Buy confirm → validate → send to bot
    $('btn-buy-confirm').addEventListener('click', () => {
        const prod   = state.selectedProduct;
        const target = $('target-input').value.trim();
        const errEl  = $('input-error');

        if (!target || target.length < 2) {
            errEl.textContent     = "Please enter a valid username or link.";
            errEl.style.display   = 'block';
            return;
        }

        if (prod.type === 'post' && !target.startsWith('http')) {
            errEl.textContent     = "Please paste a full link starting with https://";
            errEl.style.display   = 'block';
            return;
        }

        if (state.balance < prod.price) {
            showToast("Insufficient balance! Please deposit first.", 'error');
            return;
        }

        errEl.style.display = 'none';

        // Send purchase order to bot
        tg.sendData(JSON.stringify({
            action:      "purchase",
            product_id:  prod.id,
            product_name: prod.name,
            price:       prod.price,
            category:    state.category,
            target:      target,
        }));
    });

    $('btn-buy-cancel').addEventListener('click', closeAllSheets);

    // Referral button
    $('btn-referral').addEventListener('click', () => {
        tg.sendData(JSON.stringify({ action: "get_referral" }));
    });

    // History button
    $('btn-history').addEventListener('click', () => {
        tg.sendData(JSON.stringify({ action: "order_history" }));
    });
}

// ══ TOAST ══
let toastTimer;
function showToast(msg, type = 'info') {
    toastEl.textContent = msg;
    toastEl.className   = `toast ${type} show`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastEl.classList.remove('show');
    }, 2800);
}
