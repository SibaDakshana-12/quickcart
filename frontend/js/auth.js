const API = window.location.hostname === '127.0.0.1' || 
            window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://quickcart-api-zoje.onrender.com/api';

const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

const getToken = () => {
    const user = getUser();
    return user ? user.token : null;
};

const logout = () => {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
};

const updateNavbar = () => {
    const user = getUser();
    const navLogin = document.getElementById('nav-login');
    const navLogout = document.getElementById('nav-logout');
    const navProfile = document.getElementById('nav-profile');
    const navAdmin = document.getElementById('nav-admin');

    if (user) {
        if (navLogin) navLogin.style.display = 'none';
        if (navLogout) navLogout.style.display = 'block';
        if (navProfile) navProfile.style.display = 'block';
        if (navAdmin) navAdmin.style.display = user.isAdmin ? 'block' : 'none';
    } else {
        if (navLogin) navLogin.style.display = 'block';
        if (navLogout) navLogout.style.display = 'none';
        if (navProfile) navProfile.style.display = 'none';
        if (navAdmin) {
            if (user && user.isAdmin) {
                navAdmin.style.display = 'block';
            } else {
                navAdmin.style.display = 'none';
            }
        }
    }

    const navLogoutBtn = document.getElementById('nav-logout');
    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
};

const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        countEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    }
};

const showToast = (message) => {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
};

updateNavbar();
updateCartCount();