const loadProducts = async () => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    try {
        const res = await fetch(`${API}/products`);
        const products = await res.json();

        if (products.length === 0) {
            grid.innerHTML = '<div class="empty">No products found</div>';
            return;
        }

        grid.innerHTML = products.map(product => `
            <div class="product-card"
                onclick="window.location.href='product.html?id=${product._id}'"
                style="cursor:pointer;">
                <img src="${product.image}"
                    alt="${product.name}"
                    onerror="this.src='https://via.placeholder.com/300x200'">
                <div class="card-body">
                    <p class="category">${product.category}</p>
                    <h3>${product.name}</h3>
                    ${product.stock <= 5 && product.stock > 0
                        ? `<p style="color:#f39c12; font-size:12px;
                                    font-weight:600; margin-bottom:4px;">
                            Only ${product.stock} left!
                        </p>`
                        : product.stock === 0
                        ? `<p style="color:#e74c3c; font-size:12px;
                                    font-weight:600; margin-bottom:4px;">
                            Out of Stock
                        </p>`
                        : ''}
                    <p class="price">₹${product.price.toLocaleString()}</p>
                    <button class="btn-add"
                        onclick="event.stopPropagation();
                                addToCart('${product._id}',
                                '${product.name}',
                                ${product.price},
                                '${product.image}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        grid.innerHTML = '<div class="empty">Failed to load products</div>';
    }
};

const addToCart = (id, name, price, image) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ id, name, price, image, qty: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${name} added to cart!`);
};

loadProducts();