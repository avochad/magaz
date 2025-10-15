// Данные товаров
const products = [
    { id: 1, name: "Наушники накладные", price: 1000, category: "electronics", image: "images/products/product1.jpg" },
    { id: 2, name: "Наушники капельки", price: 1500, category: "electronics", image: "images/products/product2.jpg" },
    { id: 3, name: "Футболка нормис", price: 2000, category: "clothing", image: "images/products/product3.jpg" },
    { id: 4, name: "Штаны свага", price: 2500, category: "clothing", image: "images/products/product4.jpg" }
];

// Функции для работы с корзиной
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(element => {
        element.textContent = count;
    });
}

function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.image
            });
        }
    }
    
    saveCart(cart);
    updateCartCount();
    alert('Товар добавлен в корзину!');
}

// Загрузка товаров в каталог
function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    const searchTerm = document.getElementById('search')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('category')?.value || '';
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
            <h3>${product.name}</h3>
            <p class="price">${product.price} руб.</p>
            <button class="add-to-cart" data-id="${product.id}">В корзину</button>
        </div>
    `).join('');
}

// Загрузка корзины
function loadCart() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('total-price');
    if (!container) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Корзина пуста</p>';
        totalElement.textContent = '0';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" width="50" onerror="this.src='images/placeholder.jpg'">
            <div>
                <h3>${item.name}</h3>
                <p>${item.price} руб. × ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart(${item.id})">Удалить</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = total;
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    loadCart();
    updateCartCount();
}

// Обработка формы регистрации
function handleRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }
        
        alert('Регистрация успешна!');
        form.reset();
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadProducts();
    loadCart();
    handleRegisterForm();
    
    // Обработчики для кнопок "В корзину"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    // Обработчики фильтров
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    
    if (searchInput) {
        searchInput.addEventListener('input', loadProducts);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', loadProducts);
    }
    
    // Обработчик кнопки оформления заказа
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            alert('Заказ оформлен! Спасибо за покупку!');
            localStorage.removeItem('cart');
            updateCartCount();
            loadCart();
        });
    }
});