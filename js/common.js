const AmazonStore = {
    getCart() {
        return JSON.parse(localStorage.getItem("amazonCart")) || [];
    },

    saveCart(cart) {
        localStorage.setItem("amazonCart", JSON.stringify(cart));
        this.updateCartBadge();
    },

    getCartCount() {
        return this.getCart().reduce((sum, item) => sum + item.qty, 0);
    },

    getCartTotal() {
        return this.getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
    },

    addToCart(productId, qty = 1) {
        const product = getProductById(productId);
        if (!product) return false;

        const cart = this.getCart();
        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                qty
            });
        }

        this.saveCart(cart);
        return true;
    },

    updateCartQty(productId, qty) {
        const cart = this.getCart();
        const item = cart.find((i) => i.id === Number(productId));
        if (!item) return;

        if (qty <= 0) {
            this.removeFromCart(productId);
            return;
        }

        item.qty = qty;
        this.saveCart(cart);
    },

    removeFromCart(productId) {
        const cart = this.getCart().filter((i) => i.id !== Number(productId));
        this.saveCart(cart);
    },

    clearCart() {
        localStorage.removeItem("amazonCart");
        this.updateCartBadge();
    },

    getUser() {
        return JSON.parse(localStorage.getItem("amazonUser")) || null;
    },

    setUser(user) {
        localStorage.setItem("amazonUser", JSON.stringify(user));
        this.updateUserUI();
    },

    logout() {
        localStorage.removeItem("amazonUser");
        this.updateUserUI();
    },

    getUsers() {
        return JSON.parse(localStorage.getItem("amazonUsers")) || [];
    },

    saveUsers(users) {
        localStorage.setItem("amazonUsers", JSON.stringify(users));
    },

    registerUser({ name, email, password }) {
        const users = this.getUsers();
        if (users.some((u) => u.email === email)) {
            return { success: false, message: "Email already registered." };
        }
        users.push({ name, email, password });
        this.saveUsers(users);
        return { success: true };
    },

    loginUser(email, password) {
        const user = this.getUsers().find(
            (u) => u.email === email && u.password === password
        );
        if (!user) {
            return { success: false, message: "Invalid email or password." };
        }
        this.setUser({ name: user.name, email: user.email });
        return { success: true, user };
    },

    getCity() {
        return localStorage.getItem("city") || "India";
    },

    setCity(city) {
        localStorage.setItem("city", city);
        const el = document.querySelector(".add-sec");
        if (el) el.textContent = city;
    },

    updateCartBadge() {
        const badge = document.getElementById("cartCount");
        if (badge) badge.textContent = this.getCartCount();
    },

    updateUserUI() {
        const user = this.getUser();
        const greeting = user ? `Hello, ${user.name}` : "Hello, sign in";
        const signinSpan = document.querySelector(".nav-signin span");
        const sidebarUser = document.getElementById("sidebarUser");
        if (signinSpan) signinSpan.textContent = greeting;
        if (sidebarUser) sidebarUser.textContent = greeting;
    },

    initNavbar() {
        this.updateCartBadge();
        this.updateUserUI();

        const cityEl = document.querySelector(".add-sec");
        if (cityEl) cityEl.textContent = this.getCity();

        const logoBtn = document.getElementById("logoBtn");
        if (logoBtn) {
            logoBtn.addEventListener("click", () => {
                window.location.href = "index.html";
            });
        }

        const cartBtn = document.getElementById("cartBtn");
        if (cartBtn) {
            cartBtn.addEventListener("click", () => {
                window.location.href = "cart.html";
            });
        }

        const signinBtn = document.getElementById("signinBtn");
        if (signinBtn) {
            signinBtn.addEventListener("click", () => {
                if (AmazonStore.getUser()) {
                    if (confirm("Do you want to sign out?")) {
                        AmazonStore.logout();
                        showToast("Signed out successfully");
                    }
                } else {
                    window.location.href = "login.html";
                }
            });
        }

        const locationBtn = document.getElementById("locationBtn");
        if (locationBtn) {
            locationBtn.addEventListener("click", () => {
                const city = prompt("Enter your delivery city:");
                if (city && city.trim()) {
                    AmazonStore.setCity(city.trim());
                    showToast(`Delivery set to ${city.trim()}`);
                }
            });
        }

        const ordersBtn = document.getElementById("ordersBtn");
        if (ordersBtn) {
            ordersBtn.addEventListener("click", () => {
                window.location.href = "cart.html";
            });
        }

        const backToTop = document.getElementById("backToTop");
        if (backToTop) {
            backToTop.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
    },

    initSidebar() {
        const panelAll = document.getElementById("panelAll");
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("sidebarOverlay");

        if (!panelAll || !sidebar || !overlay) return;

        const open = () => {
            sidebar.classList.add("active");
            overlay.classList.add("active");
            document.body.style.overflow = "hidden";
        };

        const close = () => {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
            document.body.style.overflow = "";
        };

        panelAll.addEventListener("click", open);
        overlay.addEventListener("click", close);

        document.querySelectorAll(".sidebar-link[data-category]").forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const cat = link.dataset.category;
                window.location.href = `index.html?category=${encodeURIComponent(cat)}`;
            });
        });

        const signInLink = document.querySelector(".sidebar-link-signin");
        if (signInLink) {
            signInLink.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = "login.html";
            });
        }
    }
};

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function requireLogin(redirectUrl = "login.html") {
    if (!AmazonStore.getUser()) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

function populateSearchCategories(selectEl) {
    if (!selectEl) return;
    selectEl.innerHTML = CATEGORIES.map(
        (cat) => `<option value="${cat}">${cat === "All" ? "All" : cat.split(" ")[0]}</option>`
    ).join("");
}

function createProductCard(product) {
    const box = document.createElement("div");
    box.className = "box";
    box.dataset.id = product.id;
    box.dataset.product = product.name;
    box.dataset.category = product.category;
    if (product.deals) box.dataset.deals = "true";

    box.innerHTML = `
        <div class="box-content">
            <h2>${product.name}</h2>
            <div class="box-img" style="background-image: url('${product.image}');"></div>
            <p class="product-price">${formatPrice(product.price)}</p>
            <p class="product-rating">${renderStars(product.rating)} <span>(${product.reviews})</span></p>
            <p class="see-more">See more</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
    `;

    box.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart-btn")) return;
        window.location.href = `product-detail.html?id=${product.id}`;
    });

    box.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        AmazonStore.addToCart(product.id);
        showToast(`${product.name} added to cart`);
    });

    return box;
}
