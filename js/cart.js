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
            row.className = "cart-item";
            row.innerHTML = `
                <a href="product-detail.html?id=${item.id}" class="cart-item-img" style="background-image:url('${item.image}');"></a>
                <div class="cart-item-info">
                    <a href="product-detail.html?id=${item.id}" class="cart-item-name">${item.name}</a>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                    <div class="cart-item-actions">
                        <label>Qty:
                            <select class="qty-select" data-id="${item.id}">
                                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) =>
                                    `<option value="${n}" ${n === item.qty ? "selected" : ""}>${n}</option>`
                                ).join("")}
                            </select>
                        </label>
                        <button class="cart-remove" data-id="${item.id}">Delete</button>
                    </div>
                </div>
                <p class="cart-item-total">${formatPrice(item.price * item.qty)}</p>
            `;
            cartItemsEl.appendChild(row);
        });

        const totalItems = AmazonStore.getCartCount();
        const totalPrice = AmazonStore.getCartTotal();
        cartSubtotal.innerHTML = `Subtotal (${totalItems} items): <strong>${formatPrice(totalPrice)}</strong>`;

        document.querySelectorAll(".qty-select").forEach((sel) => {
            sel.addEventListener("change", () => {
                AmazonStore.updateCartQty(sel.dataset.id, Number(sel.value));
                renderCart();
            });
        });

        document.querySelectorAll(".cart-remove").forEach((btn) => {
            btn.addEventListener("click", () => {
                AmazonStore.removeFromCart(btn.dataset.id);
                showToast("Item removed from cart");
                renderCart();
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
        window.location.href = "checkout.html";
    });

    renderCart();
});
