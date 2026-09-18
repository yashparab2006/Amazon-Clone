document.addEventListener("DOMContentLoaded", () => {
    AmazonStore.initNavbar();
    populateSearchCategories(document.getElementById("searchCategory"));

    const cartItemsEl = document.getElementById("cartItems");
    const emptyCartEl = document.getElementById("emptyCart");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const cartLayout = document.querySelector(".cart-layout");

    document.getElementById("searchBtn").addEventListener("click", () => {
        window.location.href = `index.html?search=${encodeURIComponent(document.getElementById("searchInput").value)}`;
    });

    function renderCart() {
        const cart = AmazonStore.getCart();

        if (cart.length === 0) {
            cartLayout.style.display = "none";
            emptyCartEl.style.display = "block";
            return;
        }

        cartLayout.style.display = "flex";
        emptyCartEl.style.display = "none";
        cartItemsEl.innerHTML = "";

        cart.forEach((item) => {
            const row = document.createElement("div");
            row.className = "cart-item fade-in";

            const discount = calculateDiscount(item.originalPrice, item.price);
            const originalPriceHTML = discount > 0
                ? `<span class="cart-original-price">${formatPrice(item.originalPrice)}</span>`
                : "";

            row.innerHTML = `
                <a href="product-detail.html?id=${item.id}" class="cart-item-img" style="background-image:url('${item.image}');"></a>
                <div class="cart-item-info">
                    <a href="product-detail.html?id=${item.id}" class="cart-item-name">${item.name}</a>
                    <div class="cart-item-price-section">
                        <p class="cart-item-price">${formatPrice(item.price)}</p>
                        ${originalPriceHTML}
                    </div>
                    <div class="cart-item-actions">
                        <label>Qty:
                            <select class="qty-select" data-id="${item.id}">
                                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) =>
                                    `<option value="${n}" ${n === item.qty ? "selected" : ""}>${n}</option>`
                                ).join("")}
                            </select>
                        </label>
                        <button class="cart-remove" data-id="${item.id}">Delete</button>
                        <button class="cart-save" data-id="${item.id}">Save for later</button>
                    </div>
                </div>
                <p class="cart-item-total">${formatPrice(item.price * item.qty)}</p>
            `;
            cartItemsEl.appendChild(row);
        });

        const totalItems = AmazonStore.getCartCount();
        const totalPrice = AmazonStore.getCartTotal();
        cartSubtotal.innerHTML = `Subtotal (${totalItems} item${totalItems !== 1 ? 's' : ''}): <strong>${formatPrice(totalPrice)}</strong>`;

        // Quantity change handlers
        document.querySelectorAll(".qty-select").forEach((sel) => {
            sel.addEventListener("change", () => {
                AmazonStore.updateCartQty(sel.dataset.id, Number(sel.value));
                renderCart();
            });
        });

        // Remove item handlers
        document.querySelectorAll(".cart-remove").forEach((btn) => {
            btn.addEventListener("click", () => {
                AmazonStore.removeFromCart(btn.dataset.id);
                renderCart();
            });
        });

        // Save for later handlers (placeholder)
        document.querySelectorAll(".cart-save").forEach((btn) => {
            btn.addEventListener("click", () => {
                showToast("Save for later feature coming soon!");
            });
        });
    }

    checkoutBtn.addEventListener("click", () => {
        if (AmazonStore.getCart().length === 0) {
            showToast("Your cart is empty");
            return;
        }
        if (!AmazonStore.getUser()) {
            window.location.href = "login.html?redirect=checkout.html";
            return;
        }

        // Add loading state
        checkoutBtn.classList.add("btn-loading");
        checkoutBtn.textContent = "Processing...";

        setTimeout(() => {
            checkoutBtn.classList.remove("btn-loading");
            checkoutBtn.textContent = "Proceed to Checkout";
            window.location.href = "checkout.html";
        }, 500);
    });

    renderCart();
});
