// Initialize Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Expands the web app to full height

// Setup User Data in Header
document.addEventListener("DOMContentLoaded", () => {
    const user = tg.initDataUnsafe?.user;
    if (user) {
        document.getElementById('user-greeting').innerText = `Welcome, ${user.first_name}`;
        // Note: Telegram doesn't pass the avatar URL directly for privacy, 
        // but we can generate a nice initial avatar using ui-avatars
        const avatarUrl = `https://ui-avatars.com/api/?name=${user.first_name}&background=f39c12&color=fff`;
        document.getElementById('user-avatar').src = avatarUrl;
    }
});

// --- Product Database (Mirrors your Python dicts) ---
const products = {
    instagram: [
        { id: "100f", name: "100 Followers", price: 20, type: "profile" },
        { id: "500f", name: "500 Followers", price: 70, type: "profile" },
        { id: "1kv", name: "1,000 Views", price: 17, type: "post" },
        { id: "100l", name: "100 Likes", price: 8, type: "post" }
        // Note: Add the rest of your products here later!
    ],
    telegram: [
        { id: "100m", name: "100 Members", price: 28, type: "profile" },
        { id: "1ktv", name: "1,000 Views", price: 10, type: "post" },
        { id: "100r", name: "100 Reactions", price: 15, type: "post" }
    ],
    facebook: [
        { id: "100fb", name: "100 Followers", price: 25, type: "profile" }
    ]
};

// --- DOM Elements ---
const productContainer = document.getElementById('product-container');
const categoryBtns = document.querySelectorAll('.cat-btn');
const modal = document.getElementById('purchase-modal');
const closeModalBtn = document.getElementById('close-modal');
const confirmBuyBtn = document.getElementById('btn-confirm-buy');
const targetInput = document.getElementById('target-link');
const inputError = document.getElementById('input-error');

let selectedProduct = null;

// --- Rendering Logic ---
function renderProducts(category) {
    productContainer.innerHTML = ''; // Clear loading state
    const items = products[category] || [];

    if (items.length === 0) {
        productContainer.innerHTML = '<p style="color: var(--hint-color); text-align: center; grid-column: 1/-1;">Coming soon!</p>';
        return;
    }

    items.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Pick icon based on name
        let iconHtml = '<i class="fa-solid fa-users product-icon"></i>';
        if(prod.name.includes("Views")) iconHtml = '<i class="fa-solid fa-eye product-icon"></i>';
        if(prod.name.includes("Likes") || prod.name.includes("Reactions")) iconHtml = '<i class="fa-solid fa-heart product-icon"></i>';

        card.innerHTML = `
            ${iconHtml}
            <h4>${prod.name}</h4>
            <div class="price">₹${prod.price}</div>
            <button class="btn-buy-small" onclick="openModal('${prod.id}', '${prod.name}', ${prod.price}, '${prod.type}', '${category}')">Select</button>
        `;
        productContainer.appendChild(card);
    });
}

// Category Switching
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.category);
    });
});

// Initial Render
renderProducts('instagram');

// --- Modal & Purchase Logic ---
window.openModal = function(id, name, price, type, category) {
    selectedProduct = { id, name, price, type, category };
    
    document.getElementById('modal-product-name').innerText = name;
    document.getElementById('modal-price').innerText = `₹${price}`;
    
    // Change input label based on what the product needs
    const label = document.getElementById('modal-input-label');
    if (type === 'post') {
        label.innerText = category === 'instagram' ? "Paste Post/Reel Link" : "Paste Public Message Link";
        targetInput.placeholder = "https://...";
    } else {
        label.innerText = category === 'instagram' ? "Enter Username" : "Enter Channel Link/Username";
        targetInput.placeholder = "@username";
    }

    targetInput.value = '';
    inputError.style.display = 'none';
    modal.classList.add('active');
};

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    selectedProduct = null;
});

// Deposit Button Logic (Sends specific signal back to bot)
document.getElementById('btn-deposit').addEventListener('click', () => {
    const data = JSON.stringify({ action: "deposit_request" });
    tg.sendData(data);
});

// Validate and Submit Order
confirmBuyBtn.addEventListener('click', () => {
    const link = targetInput.value.trim();
    
    if (link.length < 2) {
        inputError.innerText = "Please enter a valid link or username.";
        inputError.style.display = 'block';
        return;
    }

    // Basic frontend validation for post links
    if (selectedProduct.type === 'post' && !link.includes('http')) {
        inputError.innerText = "Please provide a full URL (https://...) for views/likes.";
        inputError.style.display = 'block';
        return;
    }

    // If valid, send data invisibly back to Python Bot!
    const orderData = {
        action: "purchase",
        product_id: selectedProduct.id,
        target: link
    };
    
    tg.sendData(JSON.stringify(orderData));
});
