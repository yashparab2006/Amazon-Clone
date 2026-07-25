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

    function renderProducts(list) {
        shopSection.innerHTML = "";
        productBoxes = [];

        list.forEach((product) => {
            const card = createProductCard(product);
            shopSection.appendChild(card);
            productBoxes.push(card);
        });

        noResults.classList.toggle("show", list.length === 0);
    }

    function filterProducts() {
        const query = searchInput.value;
        const category = searchCategory.value;
        let list = searchProducts(query, category);

        if (category === "deals" || params.get("filter") === "deals") {
            list = PRODUCTS.filter((p) => p.deals);
        }

        renderProducts(list);
    }

    renderProducts(searchProducts(urlSearch || "", searchCategory.value));

    searchBtn.addEventListener("click", filterProducts);
    searchInput.addEventListener("input", filterProducts);
    searchCategory.addEventListener("change", filterProducts);

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") filterProducts();
    });

    document.querySelectorAll(".panel-link[data-filter]").forEach((link) => {
        link.addEventListener("click", () => {
            if (link.dataset.filter === "deals") {
                renderProducts(PRODUCTS.filter((p) => p.deals));
            } else {
                searchCategory.value = link.dataset.filter;
                filterProducts();
            }
            document.getElementById("shopSection").scrollIntoView({ behavior: "smooth" });
        });
    });

    const heroImages = ["hero_image.jpg", "box1_image.jpg", "box2_image.jpg", "box3_image.jpg"];
    let heroIndex = 0;

    if (heroSection) {
        setInterval(() => {
            heroIndex = (heroIndex + 1) % heroImages.length;
            heroSection.style.backgroundImage = `url('${heroImages[heroIndex]}')`;
        }, 4000);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });
});
