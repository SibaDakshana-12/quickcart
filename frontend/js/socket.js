const connectSocket = () => {
    const socketScript = document.createElement('script');
    socketScript.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
    document.head.appendChild(socketScript);

    socketScript.onload = () => {
        const socketURL = window.location.hostname === '127.0.0.1' ||
                          window.location.hostname === 'localhost'
            ? 'http://localhost:5000'
            : 'https://quickcart-api-zoje.onrender.com';

        const socket = io(socketURL);

        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
        });

        socket.on('orderStatusUpdated', (data) => {
            console.log('Order status updated:', data);

            const statusEl = document.getElementById(
                `status-text-${data.orderId}`
            );

            const badgeEl = document.getElementById(
                `badge-${data.orderId}`
            );

            const trackingContainer = document.getElementById(
                `tracking-container-${data.orderId}`
            );

            if (statusEl) {
                statusEl.textContent = data.status;
                statusEl.style.color = getStatusColor(data.status);
            }

            if (badgeEl) {
                badgeEl.textContent = data.status;
                badgeEl.style.background = getStatusColor(data.status);
            }

            if (trackingContainer) {
                trackingContainer.innerHTML =
                    getProgressBar(data.status, data.orderId);
            }

            showToast(`Order status updated: ${data.status}`);
        });

        socket.on('orderPlaced', (data) => {
            console.log('New order placed:', data);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    };
};