// @ts-nocheck

const chooseGiftBtn = document.querySelector('.choose-gift-btn');
const shopNowBtn = document.querySelector('.shop-now-btn');
const productGridSection = document.getElementById('product-card-section');

function scrollToProductGrid(e) {
    e.preventDefault();
    if (productGridSection) {
        const offset = 20;
        const topPos = productGridSection.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top: topPos,
            behavior: 'smooth'
        });
    }
}

if (chooseGiftBtn) chooseGiftBtn.addEventListener('click', scrollToProductGrid);
if (shopNowBtn) shopNowBtn.addEventListener('click', scrollToProductGrid);