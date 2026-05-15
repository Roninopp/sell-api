// Tiger Deals Mini App — Full Logic
const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// ── Config ──
const UPI_ID  = "vivek-6896@ptyes";
const UPI_NAME = "Vivek";
const BOT_TOKEN = ""; // Leave blank — image upload goes via bot API directly using user's file
const MIN_DEP = 10;
const MAX_DEP = 10000;

// ── Products (must match bot's product keys exactly) ──
const PRODUCTS = {
    instagram: [
        { id:"100f",   name:"100 Followers",  price:20,  type:"profile", icon:"👤", clr:"#7b5cfa,#00d4ff" },
        { id:"500f",   name:"500 Followers",  price:70,  type:"profile", icon:"👤", clr:"#7b5cfa,#00d4ff" },
        { id:"1000f",  name:"1K Followers",   price:160, type:"profile", icon:"👤", clr:"#7b5cfa,#00d4ff" },
        { id:"5kf",    name:"5K Followers",   price:420, type:"profile", icon:"👤", clr:"#7b5cfa,#00d4ff" },
        { id:"1kv",    name:"1K Views",       price:17,  type:"post",    icon:"👁️", clr:"#00d4ff,#0077ff" },
        { id:"100kv",  name:"100K Views",     price:190, type:"post",    icon:"👁️", clr:"#00d4ff,#0077ff" },
        { id:"1mv",    name:"1M Views",       price:300, type:"post",    icon:"👁️", clr:"#00d4ff,#0077ff" },
        { id:"100l",   name:"100 Likes",      price:8,   type:"post",    icon:"❤️", clr:"#ff6eb4,#ff3366" },
        { id:"10kl",   name:"10K Likes",      price:50,  type:"post",    icon:"❤️", clr:"#ff6eb4,#ff3366" },
        { id:"100kl",  name:"100K Likes",     price:70,  type:"post",    icon:"❤️", clr:"#ff6eb4,#ff3366" },
        { id:"1kc",    name:"1K Comments",    price:120, type:"post",    icon:"💬", clr:"#00e5a0,#00a86b" },
    ],
    telegram: [
        { id:"100m",   name:"100 Members",    price:25,  type:"profile", icon:"👥", clr:"#2ea6ff,#0066cc" },
        { id:"200m",   name:"200 Members",    price:49,  type:"profile", icon:"👥", clr:"#2ea6ff,#0066cc" },
        { id:"500m",   name:"500 Members",    price:120, type:"profile", icon:"👥", clr:"#2ea6ff,#0066cc" },
        { id:"1000m",  name:"1000 Members",   price:240, type:"profile", icon:"👥", clr:"#2ea6ff,#0066cc" },
        { id:"1ktv",   name:"1K Views",       price:10,  type:"post",    icon:"👁️", clr:"#00d4ff,#0077ff" },
        { id:"100r",   name:"100 Reactions",  price:15,  type:"post",    icon:"⚡", clr:"#ffaa00,#ff6600" },
    ],
    facebook: [
        { id:"100fb",  name:"100 Followers",  price:25,  type:"profile", icon:"👤", clr:"#4267B2,#1a4a9e" },
        { id:"200fb",  name:"200 Followers",  price:49,  type:"profile", icon:"👤", clr:"#4267B2,#1a4a9e" },
        { id:"500fb",  name:"500 Followers",  price:120, type:"profile", icon:"👤", clr:"#4267B2,#1a4a9e" },
        { id:"1000fb", name:"1000 Followers", price:240, type:"profile", icon:"👤", clr:"#4267B2,#1a4a9e" },
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

// ── State ──
let S = { balance:0, cat:"instagram", sub:"All", prod:null, depAmt:0, depFile:null };

// ── DOM shortcuts ──
const $ = id => document.getElementById(id);
const overlay   = $('overlay');
const depSheet  = $('dep-sheet');
const buySheet  = $('buy-sheet');
const toastEl   = $('toast');

// ══ BOOT ══
document.addEventListener("DOMContentLoaded", () => {
    const user = tg.initDataUnsafe?.user;
    if (user) {
        $('uname').textContent = `Welcome, ${user.first_name}`;
        $('ava').textContent   = user.first_name.slice(0,2).toUpperCase();
    }

    const p   = new URLSearchParams(window.location.search);
    S.balance = parseFloat(p.get('balance') || '0') || 0;
    updateWallet();
    renderSubs();
    renderGrid();
    bindAll();
});

function updateWallet() {
    $('wamt').textContent    = `₹${S.balance.toFixed(2)}`;
    $('bh-bal').textContent  = `₹${S.balance.toFixed(2)}`;
}

// ══ RENDER ══
function renderSubs() {
    const wrap = $('subs');
    wrap.innerHTML = '';
    (SUBS[S.cat] || ['All']).forEach(f => {
        const b = document.createElement('button');
        b.className = 'sub-btn' + (f === S.sub ? ' active' : '');
        b.textContent = f;
        b.onclick = () => { S.sub = f; renderSubs(); renderGrid(); };
        wrap.appendChild(b);
    });
}

function renderGrid() {
    let items = PRODUCTS[S.cat] || [];
    if (S.sub !== 'All') {
        const kw = SUB_KEY[S.sub] || S.sub;
        items = items.filter(p => p.name.includes(kw));
    }
    const labels = { instagram:'Instagram', telegram:'Telegram', facebook:'Facebook' };
    $('gtitle').textContent = `${labels[S.cat]} Services`;
    $('gcount').textContent = `${items.length} deals`;
    const grid = $('grid');
    grid.innerHTML = '';
    if (!items.length) {
        grid.innerHTML = `<div class="empty"><i class="fa-solid fa-box-open"></i>No services here yet</div>`;
        return;
    }
    items.forEach((p, i) => {
        const [c1] = p.clr.split(',');
        const card = document.createElement('div');
        card.className = 'pcard';
        card.innerHTML = `
            <div class="pcard-orb" style="background:radial-gradient(circle,${c1}55,transparent 70%)"></div>
            <div class="pcard-icon">${p.icon}</div>
            <div class="pcard-name">${p.name}</div>
            <div class="pcard-price" style="color:${c1}">₹${p.price}</div>
            <button class="pcard-btn" style="background:${c1}22;border:1px solid ${c1}55;color:${c1}">Select →</button>
        `;
        card.onclick = () => openBuySheet(p);
        grid.appendChild(card);
    });
}

// ══ SHEETS ══
function openSheet(el) {
    overlay.classList.add('on');
    el.classList.add('open');
    tg.BackButton.show();
    tg.BackButton.onClick(closeAll);
}

function closeAll() {
    overlay.classList.remove('on');
    depSheet.classList.remove('open');
    buySheet.classList.remove('open');
    tg.BackButton.hide();
    S.prod = null;
    S.depFile = null;
    // Reset deposit UI
    resetDepositUI();
}

overlay.onclick = closeAll;

// ── Deposit ──
function openDepSheet() {
    S.depAmt = 0;
    S.depFile = null;
    resetDepositUI();
    openSheet(depSheet);
}

function resetDepositUI() {
    if ($('dep-amount')) $('dep-amount').value = '';
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('on'));
    const preview = $('img-preview');
    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
    }
    const imgLabel = $('img-upload-label');
    if (imgLabel) imgLabel.textContent = '📷 Upload Payment Screenshot';
    const depBtn = $('btn-dep-ok');
    if (depBtn) depBtn.disabled = false;
}

// ── Buy ──
function openBuySheet(prod) {
    S.prod = prod;
    $('bh-icon').textContent  = prod.icon;
    $('bh-name').textContent  = prod.name;
    $('bh-price').textContent = `₹${prod.price}`;
    $('tgt-input').value      = '';
    $('tgt-err').textContent  = '';

    let ph = 'Enter username...';
    if (prod.type === 'post') {
        ph = S.cat === 'instagram' ? 'Paste Post/Reel link (https://...)' : 'Paste public message link (https://...)';
    } else {
        if (S.cat === 'instagram') ph = 'Instagram username (without @)';
        if (S.cat === 'telegram')  ph = '@channel or t.me/channel';
        if (S.cat === 'facebook')  ph = 'Facebook profile/page link';
    }
    $('tgt-input').placeholder = ph;

    const warn   = $('bal-warn');
    const buyBtn = $('btn-buy-ok');
    if (S.balance < prod.price) {
        warn.style.display = 'flex';
        $('bal-warn-txt').textContent = `You need ₹${prod.price} but have ₹${S.balance.toFixed(2)}. Please add funds first.`;
        buyBtn.disabled = true;
    } else {
        warn.style.display = 'none';
        buyBtn.disabled = false;
    }
    updateWallet();
    openSheet(buySheet);
}

// ══ BIND EVENTS ══
function bindAll() {
    // Tabs
    document.querySelectorAll('.tab').forEach(t => {
        t.onclick = () => {
            document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            S.cat = t.dataset.cat;
            S.sub = 'All';
            renderSubs();
            renderGrid();
        };
    });

    // Open deposit
    $('btn-dep').onclick = openDepSheet;

    // Amount pills
    document.querySelectorAll('.pill').forEach(pill => {
        pill.onclick = () => {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('on'));
            pill.classList.add('on');
            S.depAmt = parseInt(pill.dataset.amount);
            $('dep-amount').value = S.depAmt;
        };
    });

    $('dep-amount').addEventListener('input', e => {
        S.depAmt = parseInt(e.target.value) || 0;
        document.querySelectorAll('.pill').forEach(p => {
            p.classList.toggle('on', parseInt(p.dataset.amount) === S.depAmt);
        });
    });

    // Copy UPI
    $('copy-upi').onclick = () => {
        navigator.clipboard.writeText(UPI_ID)
            .then(() => showToast('UPI ID copied! ✓', 'ok'))
            .catch(() => showToast(UPI_ID, 'info'));
    };

    // Image upload for deposit
    $('img-file-input').addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file', 'err');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            showToast('Image too large (max 10MB)', 'err');
            return;
        }
        S.depFile = file;
        const reader = new FileReader();
        reader.onload = ev => {
            const preview = $('img-preview');
            preview.src = ev.target.result;
            preview.style.display = 'block';
            $('img-upload-label').textContent = '✅ ' + file.name;
        };
        reader.readAsDataURL(file);
    });

    // Deposit confirm — sends data to bot WITH image encoded
    $('btn-dep-ok').onclick = async () => {
        const amt = S.depAmt;
        if (!amt || amt < MIN_DEP) { showToast(`Min deposit ₹${MIN_DEP}`, 'err'); return; }
        if (amt > MAX_DEP)         { showToast(`Max deposit ₹${MAX_DEP}`, 'err'); return; }
        if (!S.depFile)            { showToast('Please upload payment screenshot', 'err'); return; }

        const btn = $('btn-dep-ok');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        try {
            // Convert image to base64
            const base64 = await fileToBase64(S.depFile);

            // Send to bot — bot will receive this via web_app_data
            tg.sendData(JSON.stringify({
                action:    "deposit_request",
                amount:    amt,
                image_b64: base64,
                mime_type: S.depFile.type,
            }));
        } catch (err) {
            showToast('Failed to send. Try again.', 'err');
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> I\'ve Paid — Send Screenshot';
        }
    };

    $('btn-dep-cancel').onclick = closeAll;

    // Buy confirm
    $('btn-buy-ok').onclick = () => {
        const target = $('tgt-input').value.trim();
        const errEl  = $('tgt-err');
        errEl.textContent = '';

        if (!target || target.length < 2) {
            errEl.textContent = '⚠️ Please enter a valid username or link.';
            return;
        }
        if (S.prod.type === 'post' && !target.startsWith('http')) {
            errEl.textContent = '⚠️ Please paste a full link starting with https://';
            return;
        }
        if (S.balance < S.prod.price) {
            showToast('Insufficient balance! Add funds first.', 'err');
            return;
        }

        const btn = $('btn-buy-ok');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Placing order...';

        tg.sendData(JSON.stringify({
            action:       "purchase",
            product_id:   S.prod.id,
            product_name: S.prod.name,
            price:        S.prod.price,
            category:     S.cat,
            target:       target,
        }));
    };

    $('btn-buy-cancel').onclick = closeAll;

    // Referral
    $('btn-ref').onclick = () => tg.sendData(JSON.stringify({ action:"get_referral" }));
}

// ══ UTILS ══
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => {
            // Strip the data:image/...;base64, prefix
            const b64 = reader.result.split(',')[1];
            resolve(b64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

let toastT;
function showToast(msg, type = 'info') {
    toastEl.textContent = msg;
    toastEl.className   = `toast ${type} show`;
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('show'), 3000);
}
