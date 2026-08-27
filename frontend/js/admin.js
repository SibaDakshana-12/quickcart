/* =========================
   STATUS COLORS
========================= */

const getStatusColor = (status) => {
    const colors = {
        'Order Placed': '#3498db',
        'Being Packed': '#f39c12',
        'Shipped': '#9b59b6',
        'Out for Delivery': '#e67e22',
        'Delivered': '#27ae60',
        'Cancelled': '#e74c3c'
    };

    return colors[status] || '#888';
};


/* =========================
   LOAD ORDERS
========================= */

const loadOrders = async () => {
    const container = document.getElementById('orders-container');

    try {
        const res = await fetch(`${API}/orders`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        const orders = await res.json();

        if (orders.length === 0) {
            container.innerHTML =
                '<div class="empty">No orders yet</div>';

            return;
        }

        document.getElementById('total-orders').textContent =
            orders.length;

        document.getElementById('pending-orders').textContent =
            orders.filter(o =>
                o.orderStatus !== 'Delivered' &&
                o.orderStatus !== 'Cancelled'
            ).length;

        document.getElementById('delivered-orders').textContent =
            orders.filter(o =>
                o.orderStatus === 'Delivered'
            ).length;

        document.getElementById('total-revenue').textContent =
            '₹' +
            orders
                .filter(o =>
                    o.orderStatus !== 'Cancelled'
                )
                .reduce(
                    (sum, o) => sum + o.totalPrice,
                    0
                )
                .toLocaleString();


        container.innerHTML = `
            <div style="overflow-x:auto;">

                <table class="admin-table">

                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Update</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${orders.map(order => `

                            <tr>

                                <td style="font-weight:600;">
                                    #${order._id
                                        .slice(-8)
                                        .toUpperCase()}
                                </td>

                                <td>
                                    <p style="font-weight:500;">
                                        ${order.user
                                            ? order.user.name
                                            : 'N/A'}
                                    </p>

                                    <p style="font-size:12px;
                                              color:#888;">
                                        ${order.user
                                            ? order.user.email
                                            : ''}
                                    </p>
                                </td>

                                <td>
                                    ${order.orderItems.map(item =>
                                        `<p style="font-size:13px;">
                                            ${item.name} × ${item.qty}
                                        </p>`
                                    ).join('')}
                                </td>

                                <td style="font-weight:700;
                                           color:#e94560;">
                                    ₹${order.totalPrice
                                        .toLocaleString()}
                                </td>

                                <td>
                                    ${order.paymentMethod}
                                </td>

                                <td>
                                    ${new Date(
                                        order.createdAt
                                    ).toLocaleDateString('en-IN')}
                                </td>

                                <td>
                                    <span class="status-badge"
                                          style="background:
                                          ${getStatusColor(
                                              order.orderStatus
                                          )};">
                                        ${order.orderStatus}
                                    </span>
                                </td>

                                <td>

                                    ${
                                        order.orderStatus !==
                                        'Delivered' &&
                                        order.orderStatus !==
                                        'Cancelled'
                                        ? `

                                        <select
                                            class="status-select"
                                            onchange="updateStatus(
                                                '${order._id}',
                                                this.value
                                            )">

                                            <option value="">
                                                Update Status
                                            </option>

                                            <option value="Being Packed">
                                                Being Packed
                                            </option>

                                            <option value="Shipped">
                                                Shipped
                                            </option>

                                            <option value="Out for Delivery">
                                                Out for Delivery
                                            </option>

                                            <option value="Delivered">
                                                Delivered
                                            </option>

                                        </select>

                                    `
                                        : `

                                        <span style="
                                            font-size:13px;
                                            color:#888;">
                                            No actions
                                        </span>

                                    `
                                    }

                                </td>

                            </tr>

                        `).join('')}

                    </tbody>

                </table>

            </div>
        `;

    } catch (error) {
        console.error('Load orders error:', error);

        container.innerHTML =
            '<div class="empty">Failed to load orders</div>';
    }
};


/* =========================
   UPDATE ORDER STATUS
========================= */

const updateStatus = async (orderId, newStatus) => {
    if (!newStatus) return;

    try {
        const res = await fetch(
            `${API}/orders/${orderId}/status`,
            {
                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },

                body: JSON.stringify({
                    orderStatus: newStatus
                })
            }
        );

        const data = await res.json();

        if (res.ok) {
            showToast(`Order updated to: ${newStatus}`);
            loadOrders();
        } else {
            showToast(data.message);
        }

    } catch (error) {
        console.error('Update status error:', error);

        showToast(
            'Failed to update order status'
        );
    }
};


/* =========================
   LOAD PRODUCTS
========================= */

const loadProducts = async () => {
    const container =
        document.getElementById('products-container');

    try {
        const res = await fetch(`${API}/products`);
        const products = await res.json();

        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty">
                    No products available
                </div>
            `;

            return;
        }

        container.innerHTML = `
            <div style="
                overflow-x:auto;
                background:#fff;
                border-radius:12px;
                box-shadow:0 2px 8px rgba(0,0,0,0.06);">

                <table class="admin-table">

                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${products.map(product => `

                            <tr>

                                <td>

                                    <div style="
                                        display:flex;
                                        align-items:center;
                                        gap:10px;">

                                        <img
                                            src="${product.image}"
                                            alt="${product.name}"
                                            style="
                                                width:48px;
                                                height:48px;
                                                object-fit:cover;
                                                border-radius:6px;"
                                            onerror="
                                                this.src=
                                                'https://via.placeholder.com/48'
                                            ">

                                        <div>

                                            <p style="
                                                font-weight:600;">
                                                ${product.name}
                                            </p>

                                            <p style="
                                                font-size:12px;
                                                color:#888;">
                                                ${product._id
                                                    .slice(-8)
                                                    .toUpperCase()}
                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td>
                                    ${product.category}
                                </td>

                                <td style="
                                    font-weight:700;
                                    color:#e94560;">
                                    ₹${product.price
                                        .toLocaleString()}
                                </td>

                                <td>

                                    <span style="
                                        color:${
                                            product.stock === 0
                                                ? '#e74c3c'
                                                : product.stock < 5
                                                    ? '#f39c12'
                                                    : '#27ae60'
                                        };
                                        font-weight:600;">
                                        ${product.stock}
                                    </span>

                                </td>

                                <td>

                                    <button
                                        onclick="editProduct(
                                            '${product._id}'
                                        )"
                                        style="
                                            padding:7px 12px;
                                            background:#3498db;
                                            color:#fff;
                                            border:none;
                                            border-radius:5px;
                                            cursor:pointer;
                                            margin-right:6px;">
                                        Edit
                                    </button>

                                    <button
                                        onclick="deleteProduct(
                                            '${product._id}'
                                        )"
                                        style="
                                            padding:7px 12px;
                                            background:#e74c3c;
                                            color:#fff;
                                            border:none;
                                            border-radius:5px;
                                            cursor:pointer;">
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        `).join('')}

                    </tbody>

                </table>

            </div>
        `;

    } catch (error) {
        console.error('Load products error:', error);

        container.innerHTML =
            '<div class="empty">Failed to load products</div>';
    }
};


/* =========================
   OPEN PRODUCT FORM
========================= */

const openProductForm = () => {
    document.getElementById(
        'product-form-container'
    ).style.display = 'block';

    document.getElementById(
        'form-title'
    ).textContent = 'Add Product';

    document.getElementById(
        'submit-product-btn'
    ).textContent = 'Add Product';

    document.getElementById(
        'product-form'
    ).reset();

    document.getElementById(
        'product-id'
    ).value = '';

    window.scrollTo({
        top:
            document.getElementById(
                'product-form-container'
            ).offsetTop - 20,

        behavior: 'smooth'
    });
};


/* =========================
   CLOSE PRODUCT FORM
========================= */

const closeProductForm = () => {
    document.getElementById(
        'product-form-container'
    ).style.display = 'none';

    document.getElementById(
        'product-form'
    ).reset();

    document.getElementById(
        'product-id'
    ).value = '';
};


/* =========================
   EDIT PRODUCT
========================= */

const editProduct = async (productId) => {
    try {
        const res = await fetch(
            `${API}/products/${productId}`
        );

        const product = await res.json();

        if (!res.ok) {
            showToast(
                product.message ||
                'Failed to load product'
            );

            return;
        }

        document.getElementById(
            'product-id'
        ).value = product._id;

        document.getElementById(
            'product-name'
        ).value = product.name;

        document.getElementById(
            'product-description'
        ).value = product.description;

        document.getElementById(
            'product-price'
        ).value = product.price;

        document.getElementById(
            'product-image'
        ).value = product.image;

        document.getElementById(
            'product-category'
        ).value = product.category;

        document.getElementById(
            'product-stock'
        ).value = product.stock;

        document.getElementById(
            'form-title'
        ).textContent = 'Edit Product';

        document.getElementById(
            'submit-product-btn'
        ).textContent = 'Update Product';

        document.getElementById(
            'product-form-container'
        ).style.display = 'block';

        window.scrollTo({
            top:
                document.getElementById(
                    'product-form-container'
                ).offsetTop - 20,

            behavior: 'smooth'
        });

    } catch (error) {
        console.error('Edit product error:', error);

        showToast(
            'Failed to load product'
        );
    }
};


/* =========================
   SUBMIT PRODUCT
========================= */

document.getElementById(
    'product-form'
).addEventListener(
    'submit',
    async (event) => {

        event.preventDefault();

        const productId =
            document.getElementById(
                'product-id'
            ).value;

        const productData = {
            name:
                document.getElementById(
                    'product-name'
                ).value.trim(),

            description:
                document.getElementById(
                    'product-description'
                ).value.trim(),

            price:
                Number(
                    document.getElementById(
                        'product-price'
                    ).value
                ),

            image:
                document.getElementById(
                    'product-image'
                ).value.trim(),

            category:
                document.getElementById(
                    'product-category'
                ).value.trim(),

            stock:
                Number(
                    document.getElementById(
                        'product-stock'
                    ).value
                )
        };

        try {
            const isEditing = Boolean(productId);

            const res = await fetch(
                isEditing
                    ? `${API}/products/${productId}`
                    : `${API}/products`,
                {
                    method:
                        isEditing
                            ? 'PUT'
                            : 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',

                        'Authorization':
                            `Bearer ${getToken()}`
                    },

                    body:
                        JSON.stringify(productData)
                }
            );

            const data = await res.json();

            if (res.ok) {
                showToast(
                    isEditing
                        ? 'Product updated successfully'
                        : 'Product added successfully'
                );

                closeProductForm();
                loadProducts();

            } else {
                showToast(
                    data.message ||
                    'Failed to save product'
                );
            }

        } catch (error) {
            console.error('Save product error:', error);

            showToast(
                'Failed to save product'
            );
        }
    }
);


/* =========================
   DELETE PRODUCT
========================= */

const deleteProduct = async (productId) => {
    if (!confirm(
        'Are you sure you want to delete this product?'
    )) {
        return;
    }

    try {
        const res = await fetch(
            `${API}/products/${productId}`,
            {
                method: 'DELETE',

                headers: {
                    'Authorization':
                        `Bearer ${getToken()}`
                }
            }
        );

        const data = await res.json();

        if (res.ok) {
            showToast(
                'Product deleted successfully'
            );

            loadProducts();

        } else {
            showToast(
                data.message ||
                'Failed to delete product'
            );
        }

    } catch (error) {
        console.error('Delete product error:', error);

        showToast(
            'Failed to delete product'
        );
    }
};


/* =========================
   ADMIN CHECK
========================= */

const user = getUser();

if (!user || !user.isAdmin) {
    window.location.href = 'index.html';
} else {
    loadOrders();
    loadProducts();
}