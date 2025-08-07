// Sample product data
const products = [
    {
        id: 1,
        name: 'Madu Hutan Asli',
        price: 150000,
        image: 'https://images.unsplash.com/photo-1580824113809-994b412a16de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        description: 'Madu hutan asli yang kaya akan nutrisi dan khasiat alami.'
    },
    {
        id: 2,
        name: 'Madu Randu',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        description: 'Madu dari nektar bunga randu dengan rasa manis yang khas.'
    },
    {
        id: 3,
        name: 'Madu Klanceng',
        price: 200000,
        image: 'https://images.unsplash.com/photo-1580824113809-994b412a16de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        description: 'Madu langka dari lebah klanceng dengan khasiat luar biasa.'
    },
    {
        id: 4,
        name: 'Madu Kopi',
        price: 180000,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        description: 'Perpaduan madu murni dengan ekstrak kopi pilihan.'
    }
];

// Shopping cart
let cart = [];

// DOM Elements
const productContainer = document.getElementById('product-container');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.createElement('div');
cartModal.className = 'modal';
cartModal.id = 'cartModal';
document.body.appendChild(cartModal);

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(amount);
};

// Display products
const displayProducts = () => {
    productContainer.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <button class="add-to-cart" data-id="${product.id}">Tambah ke Keranjang</button>
            </div>
        `;
        productContainer.appendChild(productElement);
    });
    
    // Add event listeners to all add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
};

// Add to cart function
const addToCart = (e) => {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCartCount();
        showNotification(`${product.name} telah ditambahkan ke keranjang`);
    }
};

// Update cart count
const updateCartCount = () => {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Save cart to localStorage
    localStorage.setItem('honeyCart', JSON.stringify(cart));
};

// Show notification
const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles for the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
};

// Show cart modal
const showCart = () => {
    cartModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Keranjang Belanja</h2>
            <div class="cart-items">
                ${cart.length === 0 ? '<p>Keranjang Anda kosong</p>' : ''}
                ${cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">${formatCurrency(item.price)} x ${item.quantity}</div>
                        </div>
                        <div>
                            <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                            <span style="margin: 0 10px;">${item.quantity}</span>
                            <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                            <button class="remove-btn" data-id="${item.id}" style="margin-left: 10px; color: #ff4444;">Hapus</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${cart.length > 0 ? `
                <div class="cart-total">
                    Total: ${formatCurrency(calculateTotal())}
                </div>
                <button class="checkout-btn">Checkout</button>
            ` : ''}
        </div>
    `;
    
    cartModal.style.display = 'flex';
    
    // Add event listeners for modal close and buttons
    cartModal.querySelector('.close').addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Add event listeners for quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', updateQuantity);
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', removeItem);
    });
    
    // Add event listener for checkout button
    const checkoutBtn = cartModal.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
};

// Calculate total price
const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Update item quantity
const updateQuantity = (e) => {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const action = e.target.getAttribute('data-action');
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity -= 1;
        }
        
        updateCartCount();
        showCart();
    }
};

// Remove item from cart
const removeItem = (e) => {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    
    updateCartCount();
    showCart();
    
    if (cart.length === 0) {
        setTimeout(() => {
            cartModal.style.display = 'none';
        }, 1000);
    }
};

// Checkout function
const checkout = () => {
    if (cart.length === 0) return;
    
    // In a real application, you would redirect to a checkout page or process payment
    alert('Terima kasih telah berbelanja! Silakan lanjutkan pembayaran.');
    
    // Clear cart after checkout
    cart = [];
    updateCartCount();
    cartModal.style.display = 'none';
};

// Load cart from localStorage when page loads
const loadCart = () => {
    const savedCart = localStorage.getItem('honeyCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
};

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Initialize the page
const init = () => {
    displayProducts();
    loadCart();
    
    // Add event listener for cart icon
    document.querySelector('.cart').addEventListener('click', showCart);
    
    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.product-card, .testimonial-card, .about-content > div');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial check for elements in viewport
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Add animation for elements
    document.querySelectorAll('.product-card, .testimonial-card, .about-content > div').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
};

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
