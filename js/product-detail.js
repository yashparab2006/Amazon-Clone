document.addEventListener("DOMContentLoaded", () => {
    AmazonStore.initNavbar();

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const product = getProductById(productId);

    const detailEl = document.getElementById("productDetail");
    const relatedGrid = document.getElementById("relatedGrid");
    const breadcrumbCategory = document.getElementById("breadcrumbCategory");

    if (!product) {
        detailEl.innerHTML = `
            <div class="empty-state">
                <h2>Product not found</h2>
                <p>The product you are looking for does not exist.</p>
                <a href="index.html" class="btn-primary">Back to Home</a>
            </div>
        `;
        return;
    }

    document.title = `${product.name} - Amazon`;
    breadcrumbCategory.textContent = product.category;

    const discount = calculateDiscount(product.originalPrice, product.price);
    const discountHTML = discount > 0
        ? `<span class="deal-badge">${discount}% off</span>`
        : "";
    const originalPriceHTML = discount > 0
        ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>`
        : "";

    detailEl.innerHTML = `
        <div class="detail-image" style="background-image: url('${product.image}');"></div>
        <div class="detail-info">
            <h1>${product.name}</h1>
            <p class="detail-brand">${product.brand || "Amazon"}</p>
            <p class="detail-rating"><span class="stars">${renderStars(product.rating)}</span> <a href="#">${formatNumber(product.reviews)} ratings</a></p>
            ${product.deals ? '<span class="deal-badge">Today\'s Deal</span>' : ""}
            <hr>
            <div class="price-section">
                <p class="detail-price">${formatPrice(product.price)}</p>
                ${originalPriceHTML}
                ${discountHTML}
            </div>
            <p class="detail-desc">${product.description}</p>
            <p class="detail-category"><strong>Category:</strong> ${product.category}</p>
            <p class="detail-stock"><i class="fa-solid fa-circle-check"></i> In Stock (${product.stock} available)</p>
            <div class="detail-actions">
                <label>Qty:
                    <select id="detailQty">
                        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `<option value="${n}">${n}</option>`).join("")}
                    </select>
                </label>
                <button class="btn-cart" id="addToCartBtn">Add to Cart</button>
                <button class="btn-buy" id="buyNowBtn">Buy Now</button>
            </div>
            <div class="product-features">
                <h3>Key Features:</h3>
                <ul>
                    <li>High quality product from ${product.brand || "Amazon"}</li>
                    <li>Fast and reliable delivery</li>
                    <li>Easy returns and refunds</li>
                    <li>Secure payment options</li>
                </ul>
            </div>
        </div>
    `;

    document.getElementById("addToCartBtn").addEventListener("click", () => {
        const qty = Number(document.getElementById("detailQty").value);
        if (qty > product.stock) {
            showToast(`Only ${product.stock} items available`);
            return;
        }
        AmazonStore.addToCart(product.id, qty);
    });

    document.getElementById("buyNowBtn").addEventListener("click", () => {
        const qty = Number(document.getElementById("detailQty").value);
        if (qty > product.stock) {
            showToast(`Only ${product.stock} items available`);
            return;
        }
        AmazonStore.addToCart(product.id, qty);
        window.location.href = "checkout.html";
    });

    // Load related products
    const related = getRelatedProducts(product.id, product.category, 4);

    if (related.length === 0) {
        relatedGrid.innerHTML = "<p>No related products found.</p>";
    } else {
        related.forEach((p) => {
            const relatedDiscount = calculateDiscount(p.originalPrice, p.price);
            const relatedDiscountHTML = relatedDiscount > 0
                ? `<span class="discount-badge">${relatedDiscount}% off</span>`
                : "";

            const card = document.createElement("a");
            card.href = `product-detail.html?id=${p.id}`;
            card.className = "related-card";
            card.innerHTML = `
                <div class="related-img" style="background-image: url('${p.image}');"></div>
                <p>${p.name}</p>
                <div class="related-price">
                    <span>${formatPrice(p.price)}</span>
                    ${relatedDiscountHTML}
                </div>
            `;
            relatedGrid.appendChild(card);
        });
    }

    // Search functionality
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    populateSearchCategories(document.getElementById("searchCategory"));

    searchBtn.addEventListener("click", () => {
        window.location.href = `index.html?search=${encodeURIComponent(searchInput.value)}`;
    });

    // Add to wishlist functionality (placeholder)
    const wishlistBtn = document.createElement("button");
    wishlistBtn.className = "btn-wishlist";
    wishlistBtn.innerHTML = '<i class="fa-regular fa-heart"></i> Add to Wishlist';
    wishlistBtn.style.cssText = "background: white; border: 1px solid #d5d9d9; padding: 10px 25px; border-radius: 20px; font-size: 0.9rem; cursor: pointer; margin-top: 10px;";

    wishlistBtn.addEventListener("click", () => {
        showToast("Wishlist feature coming soon!");
    });

    const actionsDiv = document.querySelector(".detail-actions");
    if (actionsDiv) {
        actionsDiv.appendChild(wishlistBtn);
    }
});
