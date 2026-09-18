document.addEventListener("DOMContentLoaded", () => {
    AmazonStore.initNavbar();
    AmazonStore.initSidebar();

    const shopSection = document.getElementById("shopSection");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const searchCategory = document.getElementById("searchCategory");
    const noResults = document.getElementById("noResults");
    const heroSection = document.getElementById("heroSection");

    populateSearchCategories(searchCategory);

    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get("category");
    const urlSearch = params.get("search");

    if (urlCategory) {
        searchCategory.value = urlCategory;
    }
    if (urlSearch) {
        searchInput.value = urlSearch;
    }

    let productBoxes = [];
    let currentProducts = [];

    function renderProducts(list) {
        shopSection.innerHTML = "";
        productBoxes = [];
        currentProducts = list;

        if (list.length === 0) {
            noResults.classList.add("show");
            return;
        }

        noResults.classList.remove("show");

        list.forEach((product) => {
            const card = createProductCard(product);
            shopSection.appendChild(card);
            productBoxes.push(card);
        });
    }

    function filterProducts() {
        const query = searchInput.value;
        const category = searchCategory.value;
        let list = searchProducts(query, category);

        if (category === "deals" || params.get("filter") === "deals") {
            list = getDealsProducts();
        }

        renderProducts(list);
    }

    function sortProducts(sortBy) {
        let sorted = [...currentProducts];

        switch (sortBy) {
            case "price-low":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case "reviews":
                sorted.sort((a, b) => b.reviews - a.reviews);
                break;
            default:
                break;
        }

        renderProducts(sorted);
    }

    // Initial render
    renderProducts(searchProducts(urlSearch || "", searchCategory.value));

    // Event listeners
    searchBtn.addEventListener("click", filterProducts);
    searchInput.addEventListener("input", filterProducts);
    searchCategory.addEventListener("change", filterProducts);

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") filterProducts();
    });

    document.querySelectorAll(".panel-link[data-filter]").forEach((link) => {
        link.addEventListener("click", () => {
            if (link.dataset.filter === "deals") {
                renderProducts(getDealsProducts());
            } else {
                searchCategory.value = link.dataset.filter;
                filterProducts();
            }
            document.getElementById("shopSection").scrollIntoView({ behavior: "smooth" });
        });
    });

    // Hero image carousel
    const heroImages = ["hero_image.jpg", "box1_image.jpg", "box2_image.jpg", "box3_image.jpg"];
    let heroIndex = 0;

    if (heroSection) {
        setInterval(() => {
            heroIndex = (heroIndex + 1) % heroImages.length;
            heroSection.style.backgroundImage = `url('${heroImages[heroIndex]}')`;
        }, 4000);
    }

    // Keyboard shortcut for search
    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // Auto-focus search on page load if coming from search
    if (urlSearch) {
        searchInput.focus();
    }
});
