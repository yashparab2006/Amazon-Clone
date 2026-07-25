document.addEventListener("DOMContentLoaded", () => {
    AmazonStore.initNavbar();

    if (!AmazonStore.getUser()) {
        window.location.href = "login.html?redirect=checkout.html";
        return;
    }

    const cart = AmazonStore.getCart();
    if (cart.length === 0) {
        window.location.href = "cart.html";
        return;
    }

    const user = AmazonStore.getUser();
    const orderItemsEl = document.getElementById("orderItems");
    const orderTotalEl = document.getElementById("orderTotal");
    const checkoutForm = document.getElementById("checkoutForm");
    const checkoutContent = document.getElementById("checkoutContent");
    const orderSuccess = document.getElementById("orderSuccess");

    document.getElementById("fullName").value = user.name || "";

    const savedCity = AmazonStore.getCity();
    if (savedCity && savedCity !== "India") {
        document.getElementById("city").value = savedCity;
    }

    orderItemsEl.innerHTML = cart
        .map(
            (item) => `
            <div class="order-item">
                <span>${item.name} x${item.qty}</span>
                <span>${formatPrice(item.price * item.qty)}</span>
            </div>
        `
        )
        .join("");

    orderTotalEl.textContent = formatPrice(AmazonStore.getCartTotal());

    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const order = {
            id: "AMZ-" + Date.now(),
            date: new Date().toLocaleDateString(),
            user: user.email,
            items: [...cart],
            total: AmazonStore.getCartTotal(),
            address: {
                name: document.getElementById("fullName").value,
                phone: document.getElementById("phone").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                pincode: document.getElementById("pincode").value
            },
            payment: document.querySelector('input[name="payment"]:checked').value
        };

        const orders = JSON.parse(localStorage.getItem("amazonOrders")) || [];
        orders.push(order);
        localStorage.setItem("amazonOrders", JSON.stringify(orders));

        AmazonStore.setCity(document.getElementById("city").value);
        AmazonStore.clearCart();

        checkoutContent.style.display = "none";
        orderSuccess.style.display = "block";
        document.getElementById("orderId").textContent = order.id;
    });
});
