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

    detailEl.innerHTML = `
        <div class="detail-image" style="background-image: url('${product.image}');"></div>
        <div class="detail-info">
            <h1>${product.name}</h1>
            <p class="detail-rating">${renderStars(product.rating)} <a href="#">${product.reviews} ratings</a></p>
            ${product.deals ? '<span class="deal-badge">Today\'s Deal</span>' : ""}
            <hr>
            <p class="detail-price">${formatPrice(product.price)}</p>
            <p class="detail-desc">${product.description}</p>
            <p class="detail-category"><strong>Category:</strong> ${product.category}</p>
            <p class="detail-stock"><i class="fa-solid fa-circle-check"></i> In Stock</p>
            <div class="detail-actions">
                <label>Qty:
                    <select id="detailQty">
                        ${[1, 2, 3, 4, 5].map((n) => `<option value="${n}">${n}</option>`).join("")}
                    </select>
                </label>
                <button class="btn-cart" id="addToCartBtn">Add to Cart</button>
                <button class="btn-buy" id="buyNowBtn">Buy Now</button>
            </div>
        </div>
    `;

    document.getElementById("addToCartBtn").addEventListener("click", () => {
        const qty = Number(document.getElementById("detailQty").value);
        AmazonStore.addToCart(product.id, qty);
        showToast(`${product.name} (x${qty}) added to cart`);
    });

    document.getElementById("buyNowBtn").addEventListener("click", () => {
        const qty = Number(document.getElementById("detailQty").value);
        AmazonStore.addToCart(product.id, qty);
        window.location.href = "checkout.html";
    });

    const related = PRODUCTS.filter(
        (p) => p.category === product.category && p.id !== product.id
    ).slice(0, 4);

    related.forEach((p) => {
        const card = document.createElement("a");
        card.href = `product-detail.html?id=${p.id}`;
        card.className = "related-card";
        card.innerHTML = `
            <div class="related-img" style="background-image: url('${p.image}');"></div>
            <p>${p.name}</p>
            <span>${formatPrice(p.price)}</span>
        `;
        relatedGrid.appendChild(card);
    });

    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    populateSearchCategories(document.getElementById("searchCategory"));

    searchBtn.addEventListener("click", () => {
        window.location.href = `index.html?search=${encodeURIComponent(searchInput.value)}`;
    });
});
