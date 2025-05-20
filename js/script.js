// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 99.99,
        category: "electronics",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300",
            "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300"
        ]
    },
    {
        id: 2,
        name: "Smart Watch",
        description: "Feature-packed smartwatch with health monitoring",
        price: 199.99,
        category: "electronics",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"]
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt",
        price: 24.99,
        category: "clothing",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"]
    },
    // ... rest of your products
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');
const cartCountElements = document.querySelectorAll('#cart-count');
const featuredProductsGrid = document.getElementById('featured-products');
const allProductsGrid = document.getElementById('all-products');
const categoryFilter = document.getElementById('category-filter');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }

    // Load featured products on home page
    if (featuredProductsGrid) {
        loadFeaturedProducts();
    }

    // Load all products on products page
    if (allProductsGrid) {
        loadAllProducts();
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterProducts);
        }
    }

    // Load cart on cart page
    if (cartItemsContainer) {
        loadCart();
    }

    // Update cart count on all pages
    updateCartCount();
});

// Load featured products (first 4 products)
function loadFeaturedProducts() {
    featuredProductsGrid.innerHTML = '';
    const featuredProducts = products.slice(0, 4);
    
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        featuredProductsGrid.appendChild(productCard);
    });
}

// Load all products
function loadAllProducts() {
    allProductsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        allProductsGrid.appendChild(productCard);
    });
}

    function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // Get the first image (works for both single image and multiple images)
    const mainImage = product.images ? product.images[0] : product.image;
    
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${mainImage}" alt="${product.name}" class="main-image zoomable-image">
            <div class="zoom-modal">
                <span class="close-zoom">&times;</span>
                <img src="${mainImage}" alt="${product.name}">
            </div>
            ${product.images && product.images.length > 1 ? '<div class="image-thumbnails"></div>' : ''}
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    // Add thumbnails if multiple images exist
    if (product.images && product.images.length > 1) {
        const thumbnailsContainer = productCard.querySelector('.image-thumbnails');
        product.images.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.alt = `${product.name} thumbnail ${index + 1}`;
            thumb.classList.add('thumbnail');
            thumb.addEventListener('click', () => {
                const mainImg = productCard.querySelector('.main-image');
                mainImg.src = img;
                // Also update the zoom modal image
                productCard.querySelector('.zoom-modal img').src = img;
            });
            thumbnailsContainer.appendChild(thumb);
        });
    }
    
    // Add zoom functionality
    const img = productCard.querySelector('.zoomable-image');
    const modal = productCard.querySelector('.zoom-modal');
    const close = productCard.querySelector('.close-zoom');
    
    if (img && modal && close) {
        img.addEventListener('click', () => {
            modal.style.display = 'block';
        });
        
        close.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Add event listener to the add to cart button
    const addToCartBtn = productCard.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => addToCart(product.id));
    
    return productCard;
}


// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    alert(`${product.name} has been added to your cart!`);
}

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Load cart items
function loadCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        checkoutBtn.disabled = true;
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="cart-item-quantity">
                <button class="decrease-quantity" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-quantity" data-id="${item.id}">+</button>
                <span class="remove-item" data-id="${item.id}">Remove</span>
            </div>
            <div class="cart-item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
        total += item.price * item.quantity;
    });
    
    // Update total
    document.querySelector('.cart-total span').textContent = total.toFixed(2);
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(parseInt(this.dataset.id), 1);
        });
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(parseInt(this.dataset.id), -1);
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            removeItem(parseInt(this.dataset.id));
        });
    });
    
    // Enable checkout button
    checkoutBtn.disabled = false;
    checkoutBtn.addEventListener('click', proceedToCheckout);
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Reload cart
    loadCart();
    
    // Update cart count
    updateCartCount();
}

// Remove item from cart
function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Reload cart
    loadCart();
    
    // Update cart count
    updateCartCount();
}

// Proceed to checkout
function proceedToCheckout() {
    alert('Thank you for your purchase!');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}