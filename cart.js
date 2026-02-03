/**
 * BLUEPRINT MARKETPLACE SHOPPING CART
 * Technology: sessionStorage
 * Updates: No alerts, supports quantities
 */

const Cart = {
    key: 'blueprint_cart_v1',

    get() {
        return JSON.parse(localStorage.getItem(this.key) || '[]');
    },

    add(product) {
        let cart = this.get();
        const existingIndex = cart.findIndex(i => i.id === product.id);

        if (existingIndex > -1) {
            // Item exists? Increment quantity.
            if (!cart[existingIndex].quantity) cart[existingIndex].quantity = 1;
            cart[existingIndex].quantity += 1;
        } else {
            // New item? Set quantity to 1.
            product.quantity = 1;
            cart.push(product);
        }

        localStorage.setItem(this.key, JSON.stringify(cart));
        this.updateHeaderCount();
        
        // NO ALERTS. Silent update.
    },

    remove(id) {
        let cart = this.get();
        // Remove item completely regardless of quantity
        cart = cart.filter(i => i.id !== id);
        
        localStorage.setItem(this.key, JSON.stringify(cart));
        this.updateHeaderCount();
        
        // If on cart page, re-render
        if (document.getElementById('cart-page-items')) {
            this.renderCartPage();
        }
    },

    updateHeaderCount() {
        const cart = this.get();
        // Sum up all quantities
        const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        
        const badges = document.querySelectorAll('#header-cart-count');
        badges.forEach(b => {
            b.innerText = count;
            // Force visibility logic
            if (count > 0) {
                b.classList.remove('hidden');
                b.style.display = 'flex'; // Enforce flex to override CSS
                b.style.backgroundColor = '#dc2626'; // Tailwind red-600
            } else {
                b.classList.add('hidden');
                b.style.display = 'none';
            }
        });
    },

    // UI Logic for cart.html table
    renderCartPage() {
        const container = document.getElementById('cart-page-items');
        if (!container) return; 

        const cart = this.get();
        const emptyMsg = document.getElementById('empty-cart-msg');
        
        container.innerHTML = '';
        
        if (cart.length === 0) {
            if(emptyMsg) emptyMsg.classList.remove('hidden');
            if(document.getElementById('summary-monthly')) document.getElementById('summary-monthly').innerText = "$0.00";
            if(document.getElementById('summary-onetime')) document.getElementById('summary-onetime').innerText = "$0.00";
            if(document.getElementById('summary-total')) document.getElementById('summary-total').innerText = "$0.00";
            return;
        }

        if(emptyMsg) emptyMsg.classList.add('hidden');
        
        let monthly = 0;
        let onetime = 0;

        cart.forEach(item => {
            const qty = item.quantity || 1;
            let priceVal = 0;
            let priceText = 'Custom';

            if (item.price !== 'Custom') {
                priceVal = parseFloat(item.price);
                const lineTotal = priceVal * qty;
                priceText = `$${priceVal.toLocaleString()}`;
                
                if (item.billing === 'monthly') {
                    monthly += lineTotal;
                    priceText += ' / mo';
                } else if (item.billing === 'onetime') {
                    onetime += lineTotal;
                }
            }

            container.innerHTML += `
                <tr>
                    <td class="py-4 border-b border-gray-100">
                        <div class="font-bold text-gray-900">${item.title}</div>
                        ${qty > 1 ? `<span class="text-xs font-bold text-blueprint-blue bg-blue-50 px-2 py-1 rounded-full mt-1 inline-block">Qty: ${qty}</span>` : ''}
                    </td>
                    <td class="py-4 border-b border-gray-100 text-sm text-gray-500">${item.type || 'Software'}</td>
                    <td class="py-4 border-b border-gray-100 text-sm text-gray-500 capitalize">${item.billing || '-'}</td>
                    <td class="py-4 border-b border-gray-100 font-mono text-sm text-gray-900">${priceText}</td>
                    <td class="py-4 border-b border-gray-100">
                        <button onclick="Cart.remove('${item.id}')" class="text-gray-400 hover:text-red-600 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </td>
                </tr>
            `;
        });

        // Update Summary Sidebar
        if(document.getElementById('summary-monthly')) 
            document.getElementById('summary-monthly').innerText = `$${monthly.toLocaleString()}`;
        
        if(document.getElementById('summary-onetime')) 
            document.getElementById('summary-onetime').innerText = `$${onetime.toLocaleString()}`;
        
        if(document.getElementById('summary-total')) 
            document.getElementById('summary-total').innerText = `$${(monthly + onetime).toLocaleString()}`;
    },

    // Prepares the text summary for the PO Modal
    prepareCheckout() {
        const cart = this.get();
        // Include Quantity in the text summary
        const summary = cart.map(i => {
            const qty = i.quantity || 1;
            const price = i.price === 'Custom' ? 'Custom' : `$${i.price.toLocaleString()}`;
            return `• ${i.title} (x${qty}) - ${price}`;
        }).join('\n');
        
        const summaryBox = document.getElementById('poProductSummary');
        const hiddenInput = document.getElementById('hiddenCartItems');
        
        if(summaryBox) summaryBox.value = summary;
        if(hiddenInput) hiddenInput.value = JSON.stringify(cart);
        
        // Update Total Price Field in PO Modal
        let total = 0;
        let hasCustom = false;
        cart.forEach(i => {
            if(i.price === 'Custom') hasCustom = true;
            else total += (parseFloat(i.price) * (i.quantity || 1));
        });
        
        const priceField = document.getElementById('poPrice');
        if(priceField) {
            priceField.value = `$${total.toLocaleString()}` + (hasCustom ? ' + Custom' : '');
        }
    },

    clear() {
        localStorage.removeItem(this.key);
        this.updateHeaderCount();
        if (document.getElementById('cart-page-items')) this.renderCartPage();
    }
};

// --- INITIALIZATION LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Attempt
    Cart.updateHeaderCount();
    Cart.renderCartPage();

    // 2. CHECKOUT LISTENERS
    if (document.getElementById('checkoutBtn')) {
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            Cart.prepareCheckout();
        });
    }

    // 3. LISTEN FOR "ADD TO CART" (Global Listener)
    document.body.addEventListener('click', function(e) {
        const btn = e.target.closest('.add-to-cart-btn');
        if (btn) {
            e.preventDefault();
            const product = {
                id: btn.dataset.id || Date.now(),
                title: btn.dataset.name || "Unknown Item",
                price: btn.dataset.price || "0",
                type: btn.dataset.type || "Software",
                billing: btn.dataset.billing || "onetime"
            };
            Cart.add(product);
            
            // Visual Feedback
            const originalText = btn.innerText;
            btn.innerText = "Added!";
            btn.classList.add('bg-green-600');
            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.remove('bg-green-600');
            }, 1000);
        }
    });

    // 4. SAFETY CHECK FOR DYNAMIC HEADER (The Fix)
    // Since your header loads via load-components.js, we must keep checking for it.
    const checkInterval = setInterval(() => {
        const badge = document.querySelector('#header-cart-count');
        if (badge) {
            Cart.updateHeaderCount();
        }
    }, 100);

    // Stop checking after 2 seconds to save memory
    setTimeout(() => clearInterval(checkInterval), 2000);
});
