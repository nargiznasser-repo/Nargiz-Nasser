// @ts-nocheck
document.addEventListener("DOMContentLoaded", () => {
    // const productList = [
    //     {
    //         title: "Tailored Jacket",
    //         price: "980,00€",
    //         image: "https://cdn.shopify.com/s/files/1/0873/7842/8199/files/woman-in-the-city_925x_fa6b306e-cdb3-4593-94a7-91ba71d3e059.jpg?v=1715108785",
    //         colors: ["Blue", "Black"],
    //         sizes: ["S", "M", "L", "XL"]
    //     },
    //     {
    //         title: "Sneakers",
    //         price: "250,00€",
    //         image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
    //         colors: ["White", "Gray", "Yellow"],
    //         sizes: ["7", "8", "9", "10"]
    //     },
    //     {
    //         title: "Classic Denim Jacket",
    //         price: "650,00€",
    //         image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
    //         colors: ["Blue", "Light Blue", "Black"],
    //         sizes: ["S", "M", "L"]
    //     },
    //     {
    //         title: "Beige Trench Coat",
    //         price: "1,200,00€",
    //         image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
    //         colors: ["Beige", "Brown", "Black"],
    //         sizes: ["M", "L", "XL"]
    //     },
    //     {
    //         title: "Classic Denim Jacket",
    //         price: "650,00€",
    //         image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
    //         colors: ["Blue", "Light Blue", "Black"],
    //         sizes: ["S", "M", "L"]
    //     },
    //     {
    //         title: "Beige Trench Coat",
    //         price: "1,200,00€",
    //         image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
    //         colors: ["Beige", "Brown", "Black"],
    //         sizes: ["M", "L", "XL"]
    //     }
    // ];
    // const productsGrid = document.getElementById("productsGrid");

    // productList.forEach((product, index) => {
    //     const productCard = document.createElement("div");

    //     // Make cards equal height using flex layout
    //     productCard.className =
    //         "group relative cursor-pointer border rounded-md shadow hover:shadow-lg transition flex flex-col";

    //     productCard.innerHTML = `
    //     <div class="relative">
    //         <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-cover rounded-t-md" />
    //         <!-- Plus Icon Button -->
    //         <button data-index="${index}" class="openModalBtn absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-200 transition">
    //             +
    //         </button>
    //     </div>
    //     <div class="p-3 flex flex-col flex-grow justify-between">
    //         <div>
    //             <h3 class="text-sm font-semibold text-gray-700 leading-tight min-h-[40px]">
    //                 ${product.title}
    //             </h3>
    //             <p class="text-gray-500 text-sm">${product.price}</p>
    //         </div>
    //     </div>
    // `;
    //     productsGrid.appendChild(productCard);
    // });


    // Render Products Dynamically
    const productsGrid = document.getElementById("productsGrid");
    const productsDataEl = document.getElementById("products-data");
    const productList = productsDataEl ? JSON.parse(productsDataEl.textContent) : [];
    console.log(productList);


    // Parse products from Liquid JSON
    if (productsDataEl) {
        try {
            productList = JSON.parse(productsDataEl.textContent);
        } catch (e) {
            console.error("Failed to parse product data:", e);
            productList = [];
        }
    }

    // If no products found, show a message
    if (!productList || productList.length === 0) {
        productsGrid.innerHTML = `
            <p class="text-gray-500 text-center col-span-full">
                No products found in this collection.
            </p>
        `;
        return;
    }

    // Clear grid before rendering
    productsGrid.innerHTML = "";

    // Render Products Dynamically
    productList.forEach((product, index) => {
        const productCard = document.createElement("div");

        // Make cards equal height using flex layout
        productCard.className =
            "group relative cursor-pointer border rounded-md shadow hover:shadow-lg transition flex flex-col bg-white";

        productCard.innerHTML = `
            <div class="relative">
                <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-cover rounded-t-md" />
                <!-- Plus Icon Button -->
                <button data-index="${index}" class="openModalBtn absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-200 transition">
                    +
                </button>
            </div>
            <div class="p-3 flex flex-col flex-grow justify-between">
                <div>
                    <h3 class="text-sm font-semibold text-gray-700 leading-tight min-h-[40px]">
                        ${product.title}
                    </h3>
                    <p class="text-gray-500 text-sm">${product.price}</p>
                </div>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });

    const modal = document.getElementById("popupModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalPrice = document.getElementById("modalPrice");
    const modalImage = document.getElementById("modalImage");
    const modalColors = document.getElementById("modalColors");
    const modalSizes = document.getElementById("modalSizes");
    const closeBtn = document.getElementById("closeModalBtn");
    const addToCartBtn = document.getElementById("addToCartBtn");
    const cartDrawer = document.getElementById("drawer");
    const cartGrid = document.getElementById("cartGrid");
    const subtotalEl = document.getElementById("subtotalPrice");

    /**
     * @type {{ title: string; price: string; image: string; colors: string[]; sizes: string[]; } | null | undefined}
     */
    let selectedProduct = null;
    /**
     * @type {any[]}
     */
    const cartList = [];

    // Open Product Modal
    document.addEventListener("click", (e) => {
        if (e.target.closest(".openModalBtn")) {
            const index = e.target.closest(".openModalBtn").dataset.index;
            selectedProduct = productList[index];

            modalTitle.innerText = selectedProduct.title;
            modalPrice.innerText = selectedProduct.price;
            modalImage.src = selectedProduct.image;

            // Render Colors
            const colorMap = {
                "blue": "#1e3a8a",
                "black": "#000",
                "white": "#fff",
                "gray": "#6b7280",
                "yellow": "#facc15",
                "light blue": "#60a5fa",
                "beige": "#f5f5dc",
                "brown": "#8b5c2a"
                // Add more as needed
            };
            modalColors.innerHTML = "";
            selectedProduct.colors.forEach(color => {
                const colorBtn = document.createElement("button");
                colorBtn.className =
                    "flex items-center border border-gray-300 text-sm font-medium hover:border-black focus:ring-2 focus:ring-black transition relative w-full";
                colorBtn.style.position = "relative";
                colorBtn.style.overflow = "hidden";
                colorBtn.style.height = "40px"; // Optional: set a fixed height for consistency

                // Create the colored vertical bar
                const colorBar = document.createElement("span");
                colorBar.className = "color-bar";
                colorBar.style.background = colorMap[color.toLowerCase()] || color.toLowerCase();
                // Add a border for white for visibility
                if (color.toLowerCase() === "white" || colorMap[color.toLowerCase()] === "#fff") {
                    colorBar.style.border = "1px solid #888";
                }

                const colorText = document.createElement("span");
                colorText.textContent = color;
                colorText.style.paddingRight = "12px";

                colorBtn.appendChild(colorBar);
                colorBtn.appendChild(colorText);
                modalColors.appendChild(colorBtn);
            });

            // Render Sizes
            modalSizes.innerHTML = `<option value="" disabled selected>Choose your size</option>`;
            selectedProduct.sizes.forEach(size => {
                const option = document.createElement("option");
                option.value = size;
                option.innerText = size;
                modalSizes.appendChild(option);
            });

            modal.classList.remove("hidden");
            modal.classList.add("flex");
        }
    });

    // Close Modal
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    });

    // Add to Cart
    addToCartBtn.addEventListener("click", () => {
        if (!selectedProduct) return;
        cartList.push(selectedProduct);
        renderCart();
        openCartDrawer();
        modal.classList.add("hidden");
    });

    // Render Cart
    function renderCart() {
        cartGrid.innerHTML = "";
        let subtotal = 0;

        if (cartList.length === 0) {
            cartGrid.innerHTML = `<p class="text-gray-500 text-center py-4">Your cart is empty</p>`;
            subtotalEl.textContent = "€0.00";
            return;
        }

        cartList.forEach((product, index) => {
            const priceValue = parseFloat(product.price.replace(/[^\d,]/g, "").replace(",", "."));
            subtotal += priceValue;

            const cartItem = document.createElement("div");
            cartItem.className = "flex items-center gap-4 p-3 border rounded-md bg-white shadow-sm";

            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="w-20 h-20 rounded-md border object-cover" />
                <div class="flex-1">
                    <h3 class="text-gray-900 font-semibold">${product.title}</h3>
                    <p class="text-gray-500 text-sm">${product.price}</p>
                    <p class="text-xs text-gray-400">Colors: ${product.colors.join(", ")}</p>
                    <p class="text-xs text-gray-400">Sizes: ${product.sizes.join(", ")}</p>
                </div>
                <button onclick="removeFromCart(${index})"
                    class="text-red-500 hover:text-red-700 font-medium transition">Remove</button>
            `;

            cartGrid.appendChild(cartItem);
        });

        subtotalEl.textContent = `€${subtotal.toFixed(2)}`;
    }

    // Open Cart Drawer
    function openCartDrawer() {
        cartDrawer.classList.remove("hidden");
    }

    // Close Cart Drawer
    document.getElementById("closeDrawerBtn").addEventListener("click", () => {
        cartDrawer.classList.add("hidden");
    });

    // Make removeFromCart globally accessible
    window.removeFromCart = (/** @type {number} */ index) => {
        cartList.splice(index, 1);
        renderCart();
    };
});
