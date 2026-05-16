// Tiger Deals Mini App
const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

const UPI_ID = "vivek-6896@ptyes";
const MIN_DEP = 10;
const MAX_DEP = 10000;

const PRODUCTS = {
    instagram: [
        { id:"100f",   name:"100 Followers",  price:20,  type:"profile", icon:"👤", clr:"#7b5cfa" },
        { id:"500f",   name:"500 Followers",  price:70,  type:"profile", icon:"👤", clr:"#7b5cfa" },
        { id:"1000f",  name:"1K Followers",   price:160, type:"profile", icon:"👤", clr:"#7b5cfa" },
        { id:"5kf",    name:"5K Followers",   price:420, type:"profile", icon:"👤", clr:"#7b5cfa" },
        { id:"1kv",    name:"1K Views",       price:17,  type:"post",    icon:"👁", clr:"#00d4ff" },
        { id:"100kv",  name:"100K Views",     price:190, type:"post",    icon:"👁", clr:"#00d4ff" },
        { id:"1mv",    name:"1M Views",       price:300, type:"post",    icon:"👁", clr:"#00d4ff" },
        { id:"100l",   name:"100 Likes",      price:8,   type:"post",    icon:"❤", clr:"#ff6eb4" },
        { id:"10kl",   name:"10K Likes",      price:50,  type:"post",    icon:"❤", clr:"#ff6eb4" },
        { id:"100kl",  name:"100K Likes",     price:70,  type:"post",    icon:"❤", clr:"#ff6eb4" },
        { id:"1kc",    name:"1K Comments",    price:120, type:"post",    icon:"💬", clr:"#00e5a0" },
    ],
    telegram: [
        { id:"100m",   name:"100 Members",    price:25,  type:"profile", icon:"👥", clr:"#2ea6ff" },
        { id:"200m",   name:"200 Members",    price:49,  type:"profile", icon:"👥", clr:"#2ea6ff" },
        { id:"500m",   name:"500 Members",    price:120, type:"profile", icon:"👥", clr:"#2ea6ff" },
        { id:"1000m",  name:"1000 Members",   price:240, type:"profile", icon:"👥", clr:"#2ea6ff" },
        { id:"1ktv",   name:"1K Views",       price:10,  type:"post",    icon:"👁", clr:"#00d4ff" },
        { id:"100r",   name:"100 Reactions",  price:15,  type:"post",    icon:"⚡", clr:"#ffaa00" },
    ],
    facebook: [
        { id:"100fb",  name:"100 Followers",  price:25,  type:"profile", icon:"👤", clr:"#4267B2" },
        { id:"200fb",  name:"200 Followers",  price:49,  type:"profile", icon:"👤", clr:"#4267B2" },
        { id:"500fb",  name:"500 Followers",  price:120, type:"profile", icon:"👤", clr:"#4267B2" },
        { id:"1000fb", name:"1000 Followers", price:240, type:"profile", icon:"👤", clr:"#4267B2" },
    ],
};

const SUBS = {
    instagram: ["All","Followers","Views","Likes","Comments"],
    telegram:  ["All","Members","Views","Reactions"],
    facebook:  ["All","Followers"],
};
const SUB_KEY = {
    Followers:"Followers", Views:"Views", Likes:"Likes",
    Comments:"Comments", Members:"Members", Reactions:"Reactions",
};

let S = { balance:0, cat:"instagram", sub:"All", prod:null, depAmt:0 };

// DOM refs — assigned INSIDE DOMContentLoaded to avoid null errors
let overlay, depSheet, buySheet, toastEl;

// ══ BOOT ══
document.addEventListener("DOMContentLoaded", () => {

    // Assign DOM refs safely after DOM is ready
    overlay  = document.getElementById('overlay');
    depSheet = document.getElementById('dep-sheet');
    buySheet = document.getElementById('buy-sheet');
    toastEl  = document.getElementById('toast');

    // ── User name ──
    const p = new URLSearchParams(window.location.search);

    let firstName = '';
    try {
        // Try Telegram native first
        const tgUser = tg.initDataUnsafe && tg.initDataUnsafe.user;
        if (tgUser && tgUser.first_name) firstName = tgUser.first_name;
    } catch(e) {}

    // URL param fallback (bot passes ?name=FirstName)
    if (!firstName) {
        const n = p.get('name');
        if (n) firstName = decodeURIComponent(n);
    }

    const unameEl = document.getElementById('uname');
    const avaEl   = document.getElementById('ava');
    if (firstName) {
        unameEl.textContent = firstName;
        avaEl.textContent   = firstName.slice(0,2).toUpperCase();
    } else {
        unameEl.textContent = 'My Account';
        avaEl.textContent   = 'TG';
    }

    // ── Balance ──
    const bal = parseFloat(p.get('balance') || '0');
    S.balance = isNaN(bal) ? 0 : bal;
    updateWallet();

    // ── Render ──
    renderSubs();
    renderGrid();
    bindAll();
});

// ── Wallet ──
function updateWallet() {
    const wamt  = document.getElementById('wamt');
    const bhBal = document.getElementById('bh-bal');
    if (wamt)  wamt.textContent  = '₹' + S.balance.toFixed(2);
    if (bhBal) bhBal.textContent = '₹' + S.balance.toFixed(2);
}

// ── Subs ──
function renderSubs() {
    const wrap = document.getElementById('subs');
    if (!wrap) return;
    wrap.innerHTML = '';
    const filters = SUBS[S.cat] || ['All'];
    filters.forEach(function(f) {
        const b = document.createElement('button');
        b.className = 'sub-btn' + (f === S.sub ? ' active' : '');
        b.textContent = f;
        b.onclick = function() { S.sub = f; renderSubs(); renderGrid(); };
        wrap.appendChild(b);
    });
}

// ── Grid ──
function renderGrid() {
    const grid = document.getElementById('grid');
    const gtitle = document.getElementById('gtitle');
    const gcount = document.getElementById('gcount');
    if (!grid) return;

    let items = (PRODUCTS[S.cat] || []).slice();
    if (S.sub !== 'All') {
        const kw = SUB_KEY[S.sub] || S.sub;
        items = items.filter(function(p) { return p.name.indexOf(kw) !== -1; });
    }

    const labels = { instagram:'Instagram', telegram:'Telegram', facebook:'Facebook' };
    if (gtitle) gtitle.textContent = (labels[S.cat] || S.cat) + ' Services';
    if (gcount) gcount.textContent = items.length + ' deals';

    grid.innerHTML = '';

    if (!items.length) {
        grid.innerHTML = '<div class="empty">📦 No services here yet</div>';
        return;
    }

    items.forEach(function(prod) {
        const c = prod.clr;
        const card = document.createElement('div');
        card.className = 'pcard';
        card.innerHTML =
            '<div class="pcard-orb" style="background:radial-gradient(circle,' + c + '44,transparent 70%)"></div>' +
            '<div class="pcard-icon">' + prod.icon + '</div>' +
            '<div class="pcard-name">' + prod.name + '</div>' +
            '<div class="pcard-price" style="color:' + c + '">&#8377;' + prod.price + '</div>' +
            '<button class="pcard-btn" style="background:' + c + '22;border:1px solid ' + c + '55;color:' + c + '">Select &#8594;</button>';
        card.onclick = function() { openBuySheet(prod); };
        grid.appendChild(card);
    });
}

// ══ SHEETS ══
function openSheet(el) {
    if (!overlay || !el) return;
    overlay.classList.add('on');
    el.classList.add('open');
    tg.BackButton.show();
    tg.BackButton.onClick(closeAll);
}

function closeAll() {
    if (overlay)   overlay.classList.remove('on');
    if (depSheet)  depSheet.classList.remove('open');
    if (buySheet)  buySheet.classList.remove('open');
    tg.BackButton.hide();
    S.prod = null;
}

function openDepSheet() {
    S.depAmt = 0;
    const amt = document.getElementById('dep-amount');
    if (amt) amt.value = '';
    document.querySelectorAll('.pill').forEach(function(p) { p.classList.remove('on'); });
    openSheet(depSheet);
}

function openBuySheet(prod) {
    S.prod = prod;
    const bhIcon  = document.getElementById('bh-icon');
    const bhName  = document.getElementById('bh-name');
    const bhPrice = document.getElementById('bh-price');
    const tgtIn   = document.getElementById('tgt-input');
    const tgtErr  = document.getElementById('tgt-err');
    const balWarn = document.getElementById('bal-warn');
    const balWTxt = document.getElementById('bal-warn-txt');
    const buyBtn  = document.getElementById('btn-buy-ok');

    if (bhIcon)  bhIcon.textContent  = prod.icon;
    if (bhName)  bhName.textContent  = prod.name;
    if (bhPrice) bhPrice.textContent = '₹' + prod.price;
    if (tgtIn)   tgtIn.value         = '';
    if (tgtErr)  tgtErr.textContent  = '';

    // Placeholder per category
    let ph = 'Enter username or link...';
    if (prod.type === 'post') {
        ph = S.cat === 'instagram'
            ? 'Paste Post/Reel link (https://...)'
            : 'Paste public message link (https://...)';
    } else {
        if (S.cat === 'instagram') ph = 'Instagram username (without @)';
        if (S.cat === 'telegram')  ph = '@channel or t.me/channel';
        if (S.cat === 'facebook')  ph = 'Facebook profile or page link';
    }
    if (tgtIn) tgtIn.placeholder = ph;

    // Balance check
    if (S.balance < prod.price) {
        if (balWarn) balWarn.style.display = 'flex';
        if (balWTxt) balWTxt.textContent =
            'You need ₹' + prod.price + ' but have ₹' + S.balance.toFixed(2) + '. Add funds first.';
        if (buyBtn) buyBtn.disabled = true;
    } else {
        if (balWarn) balWarn.style.display = 'none';
        if (buyBtn) buyBtn.disabled = false;
    }

    updateWallet();
    openSheet(buySheet);
}

// ══ BIND EVENTS ══
function bindAll() {

    // Tabs
    document.querySelectorAll('.tab').forEach(function(t) {
        t.onclick = function() {
            document.querySelectorAll('.tab').forEach(function(x) { x.classList.remove('active'); });
            t.classList.add('active');
            S.cat = t.dataset.cat;
            S.sub = 'All';
            renderSubs();
            renderGrid();
        };
    });

    // Open deposit
    const btnDep = document.getElementById('btn-dep');
    if (btnDep) btnDep.onclick = openDepSheet;

    // Amount pills
    document.querySelectorAll('.pill').forEach(function(pill) {
        pill.onclick = function() {
            document.querySelectorAll('.pill').forEach(function(p) { p.classList.remove('on'); });
            pill.classList.add('on');
            S.depAmt = parseInt(pill.dataset.amount);
            const da = document.getElementById('dep-amount');
            if (da) da.value = S.depAmt;
        };
    });

    const depAmtEl = document.getElementById('dep-amount');
    if (depAmtEl) {
        depAmtEl.addEventListener('input', function(e) {
            S.depAmt = parseInt(e.target.value) || 0;
            document.querySelectorAll('.pill').forEach(function(p) {
                p.classList.toggle('on', parseInt(p.dataset.amount) === S.depAmt);
            });
        });
    }

    // Copy UPI
    const copyBtn = document.getElementById('copy-upi');
    if (copyBtn) {
        copyBtn.onclick = function() {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(UPI_ID)
                    .then(function() { showToast('UPI ID copied!', 'ok'); })
                    .catch(function() { showToast(UPI_ID, 'info'); });
            } else {
                showToast(UPI_ID, 'info');
            }
        };
    }

    // Deposit confirm
    const btnDepOk = document.getElementById('btn-dep-ok');
    if (btnDepOk) {
        btnDepOk.onclick = function() {
            const amt = S.depAmt;
            if (!amt || amt < MIN_DEP) { showToast('Min deposit is ₹' + MIN_DEP, 'err'); return; }
            if (amt > MAX_DEP)         { showToast('Max deposit is ₹' + MAX_DEP, 'err'); return; }

            const payload = JSON.stringify({ action: "deposit_request", amount: amt });
            closeAll();
            showSuccessScreen({ type: 'deposit', amount: amt, payload: payload });
        };
    }

    const btnDepCancel = document.getElementById('btn-dep-cancel');
    if (btnDepCancel) btnDepCancel.onclick = closeAll;

    // Buy confirm
    const btnBuyOk = document.getElementById('btn-buy-ok');
    if (btnBuyOk) {
        btnBuyOk.onclick = function() {
            const tgtIn = document.getElementById('tgt-input');
            const errEl = document.getElementById('tgt-err');
            const target = tgtIn ? tgtIn.value.trim() : '';

            if (errEl) errEl.textContent = '';

            if (!target || target.length < 2) {
                if (errEl) errEl.textContent = 'Please enter a valid username or link.';
                return;
            }
            if (S.prod.type === 'post' && target.indexOf('http') !== 0) {
                if (errEl) errEl.textContent = 'Please paste a full link starting with https://';
                return;
            }
            if (S.balance < S.prod.price) {
                showToast('Insufficient balance! Add funds first.', 'err');
                return;
            }

            const newBal = S.balance - S.prod.price;
            const payload = JSON.stringify({
                action:       "purchase",
                product_id:   S.prod.id,
                product_name: S.prod.name,
                price:        S.prod.price,
                category:     S.cat,
                target:       target,
            });

            closeAll();
            showSuccessScreen({
                type:    'order',
                icon:    S.prod.icon,
                name:    S.prod.name,
                price:   S.prod.price,
                target:  target,
                newBal:  newBal,
                payload: payload,
            });
        };
    }

    const btnBuyCancel = document.getElementById('btn-buy-cancel');
    if (btnBuyCancel) btnBuyCancel.onclick = closeAll;

    // Referral
    const btnRef = document.getElementById('btn-ref');
    if (btnRef) btnRef.onclick = function() {
        tg.sendData(JSON.stringify({ action: "get_referral" }));
    };

    // Overlay click
    if (overlay) overlay.onclick = closeAll;
}

// ══ SUCCESS SCREEN ══
function showSuccessScreen(opts) {
    var type    = opts.type;
    var icon    = opts.icon    || '💳';
    var name    = opts.name    || '';
    var price   = opts.price   || 0;
    var target  = opts.target  || '';
    var amount  = opts.amount  || 0;
    var newBal  = opts.newBal;
    var payload = opts.payload || '';

    var appEl = document.getElementById('app');
    if (appEl) appEl.style.display = 'none';

    var screen = document.createElement('div');
    screen.id = 'success-screen';
    screen.className = 'success-screen';

    if (type === 'order') {
        screen.innerHTML =
            '<div class="ss-inner">' +
            '<div class="ss-circle">' +
            '<div class="ss-icon">' + icon + '</div>' +
            '<div class="ss-check">✓</div>' +
            '</div>' +
            '<h1 class="ss-title">Order Placed!</h1>' +
            '<p class="ss-sub">Your order is being processed</p>' +
            '<div class="ss-card">' +
            '<div class="ss-row"><span>Product</span><span class="ss-val">' + name + '</span></div>' +
            '<div class="ss-row"><span>Amount</span><span class="ss-val ss-price">&#8377;' + price + '</span></div>' +
            '<div class="ss-row"><span>Target</span><span class="ss-val ss-target">' + target + '</span></div>' +
            '<div class="ss-row"><span>New Balance</span><span class="ss-val ss-green">&#8377;' + (newBal !== undefined ? newBal.toFixed(2) : '0.00') + '</span></div>' +
            '</div>' +
            '<p class="ss-note">Delivery starts shortly. Check your Telegram for updates!</p>' +
            '<button class="ss-btn-main" id="ss-more">Continue Shopping</button>' +
            '<button class="ss-btn-flat" id="ss-close">Close App</button>' +
            '</div>';
    } else {
        screen.innerHTML =
            '<div class="ss-inner">' +
            '<div class="ss-circle ss-dep">' +
            '<div class="ss-icon">💳</div>' +
            '<div class="ss-check">✓</div>' +
            '</div>' +
            '<h1 class="ss-title">Deposit Requested!</h1>' +
            '<p class="ss-sub">Now send your screenshot in bot chat</p>' +
            '<div class="ss-card">' +
            '<div class="ss-row"><span>Amount</span><span class="ss-val ss-price">&#8377;' + amount + '</span></div>' +
            '<div class="ss-row"><span>Status</span><span class="ss-val ss-orange">Awaiting Screenshot</span></div>' +
            '</div>' +
            '<p class="ss-note">Go back to the bot chat and send your payment screenshot there.</p>' +
            '<button class="ss-btn-main" id="ss-more">Continue Shopping</button>' +
            '<button class="ss-btn-flat" id="ss-close">Close App</button>' +
            '</div>';
    }

    document.body.appendChild(screen);

    // Animate in
    setTimeout(function() { screen.classList.add('visible'); }, 10);

    // Send data to bot
    setTimeout(function() {
        try { tg.sendData(payload); } catch(e) { console.log('sendData:', e); }
    }, 200);

    // Continue shopping
    document.getElementById('ss-more').onclick = function() {
        screen.remove();
        var appEl = document.getElementById('app');
        if (appEl) appEl.style.display = 'block';
        if (type === 'order' && newBal !== undefined) {
            S.balance = newBal;
            updateWallet();
        }
    };

    // Close
    document.getElementById('ss-close').onclick = function() {
        tg.close();
    };
}

// ══ TOAST ══
var toastTimer;
function showToast(msg, type) {
    type = type || 'info';
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast ' + type + ' show';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { el.classList.remove('show'); }, 3000);
}
