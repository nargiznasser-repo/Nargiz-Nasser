// @ts-nocheck
let selectedProduct = null; // Make selectedProduct global
const cartList = [];

document.addEventListener("DOMContentLoaded", () => {

    // Open Product Modal
    document.addEventListener("click", (e) => {
        const productCardSection = document.querySelector("#product-card-section");
        if (!productCardSection) return;

        const btn = e.target.closest(".openModalBtn");
        if (!btn || !productCardSection.contains(btn)) return;

        e.preventDefault();

        selectedProduct = {
            title: btn.dataset.title,
            price: btn.dataset.price,
            image: btn.dataset.image,
            colors: btn.dataset.colors ? btn.dataset.colors.split(",") : [],
            sizes: btn.dataset.sizes ? btn.dataset.sizes.split(",") : [],
            desc: btn.dataset.desc
        };

        // Set modal content
        document.getElementById("modalImage").src = selectedProduct.image;
        document.getElementById("modalImage").alt = selectedProduct.title;
        document.getElementById("modalTitle").textContent = selectedProduct.title;
        document.getElementById("modalPrice").textContent = selectedProduct.price;
        document.getElementById("modalDesc").innerHTML = selectedProduct.desc;

        // Render Colors
        const modalColorsContainer = document.getElementById("modalColors");
        modalColorsContainer.innerHTML = "";
        if (selectedProduct.colors.length > 0) {
            const numColors = selectedProduct.colors.length
            selectedProduct.colors.forEach(color => {
                const colorBtn = document.createElement("button");
                colorBtn.className = "color-button";

                const colorBar = document.createElement("span");
                colorBar.className = "color-bar";
                colorBar.style.background = color;
                if (color.toLowerCase() === "white") {
                    colorBar.style.border = "1px solid #888";
                }
                colorBar.style.width = "7.84px";
                colorBar.style.height = "100%";
                colorBar.style.display = "inline-block";
                colorBar.style.marginRight = "8px";

                const colorText = document.createElement("span");
                colorText.textContent = color;
                colorText.class = "colorbuttonText";

                colorBtn.appendChild(colorBar);
                colorBtn.appendChild(colorText);
                colorBtn.style.flex = `1 1 ${100 / numColors}%`;
                colorBtn.addEventListener("click", () => {
                    // Remove selection from all buttons
                    document.querySelectorAll("#modalColors .color-button").forEach(btn => {
                        btn.classList.remove("selected");
                    });

                    // Mark this one as selected
                    colorBtn.classList.add("selected");

                    // Store selected color globally
                    selectedProduct.chosenColor = color;
                });

                modalColorsContainer.appendChild(colorBtn);
            });
        } else {
            document.getElementById("modalColors").innerHTML = "<p class='text-gray-400 text-sm'>No colors available</p>";
        }

        // Render Sizes
        const modalSizes = document.getElementById("modalSizes");
        modalSizes.innerHTML = "";

        // Add the placeholder as a disabled option
        const placeholder = document.createElement("option");
        placeholder.textContent = "Choose your size";
        placeholder.disabled = true;
        placeholder.selected = true;
        modalSizes.appendChild(placeholder);

        if (selectedProduct.sizes.length > 0) {
            selectedProduct.sizes.forEach(size => {
                const option = document.createElement("option");
                option.value = size;
                option.textContent = size;
                option.className = "colorbuttonText"
                option.style.textAlign = "center";
                document.getElementById("modalSizes").appendChild(option);
            });
        }

        modalSizes.addEventListener("focus", () => {
            if (modalSizes.options[0].disabled) {
                modalSizes.options[0].style.display = "none";
            }
        });

        modalSizes.addEventListener("blur", () => {
            if (modalSizes.selectedIndex === -1 || modalSizes.selectedIndex === 0) {
                modalSizes.options[0].style.display = "block";
            }
        });

        const modalArrow = document.getElementById("modalSizesArrow");
        let isOpen = false;
        modalSizes.addEventListener("mousedown", () => {
            isOpen = !isOpen;
            modalArrow.style.transform = isOpen
                ? "translateY(-50%) rotate(180deg)" // open: arrow up
                : "translateY(-50%) rotate(0deg)";  // closed: arrow down
        });
        modalSizes.addEventListener("change", () => {
            isOpen = false;
            modalArrow.style.transform = "translateY(-50%) rotate(0deg)";
        });

        // Show Modal
        document.getElementById("popupModal").classList.remove("hidden");
        document.getElementById("popupModal").classList.add("flex");
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = scrollBarWidth + "px";

        const arrobtn = e.target.closest(".arrowBox")

    });

    document.getElementById("popupModal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("popupModal")) {
            document.getElementById("popupModal").classList.add("hidden");
            document.getElementById("popupModal").classList.remove("flex");
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0px";
        }
    });

});

function closeModal() {
    document.getElementById("popupModal").classList.add("hidden");
    document.getElementById("popupModal").classList.remove("flex");
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";
}

function addToCart() {
    if (!selectedProduct) return;
    cartList.push(selectedProduct);
    renderCart();
    openCartDrawer();
    document.getElementById("popupModal").classList.add("hidden");
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";
}

function closeCart() {
    document.getElementById("drawer").classList.add("hidden");

}

// Render Cart
function renderCart() {
    document.getElementById("cartGrid").innerHTML = "";
    let subtotal = 0;
    let selectedColor = document.getElementById("modalColors").value || selectedProduct.colors[0]
    let selectedSize = document.getElementById("modalSizes").value || selectedProduct.sizes[0]


    if (cartList.length === 0) {
        document.getElementById("cartGrid").innerHTML = `<p class="text-gray-500 text-center py-4">Your cart is empty</p>`;
        document.getElementById("subtotalPrice").textContent = "€0.00";
        return;
    }

    cartList.forEach((product, index) => {
        const priceValue = parseFloat(product.price.replace(/[^\d.,]/g, "").replace(",", "."));
        subtotal += priceValue;

        const cartItem = document.createElement("div");
        cartItem.className = "flex items-center gap-4 p-3 border rounded-md bg-white shadow-sm";

        cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="w-20 h-20 rounded-md border object-cover" />
                <div class="flex-1">
                    <h3 class="text-gray-900 font-semibold">${product.title}</h3>
                    <p class="text-gray-500 text-sm">${product.price}</p>
                    <p class="text-xs text-gray-400">Colors: ${selectedColor}</p>
                    <p class="text-xs text-gray-400">Sizes: ${selectedSize}</p>
                </div>
                <button onclick="removeFromCart(${index})"
                    class="text-red-500 hover:text-red-700 font-medium transition">Remove</button>
            `;

        cartGrid.appendChild(cartItem);
    });

    document.getElementById("subtotalPrice").textContent = `€${subtotal.toFixed(2)}`;
}

// Open Cart Drawer
function openCartDrawer() {
    document.getElementById("drawer").classList.remove("hidden");
}

// Make removeFromCart globally accessible
window.removeFromCart = (/** @type {number} */ index) => {
    cartList.splice(index, 1);
    renderCart();
};
