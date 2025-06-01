
        document.addEventListener('DOMContentLoaded', function () {
            // Get user ID from session storage
            const userId = sessionStorage.getItem('UserID');
            const jwtToken = sessionStorage.getItem('jwtToken');

            // DOM elements
            const orderList = document.getElementById('order-list');
            const loadingContainer = document.getElementById('loading-container');
            const orderDetailModalOverlay = document.getElementById('order-detail-modal-overlay');
            const orderDetailContent = document.getElementById('order-detail-content');
            const closeDetailModalBtn = document.getElementById('close-detail-modal');
            const closeDetailBtn = document.getElementById('close-detail-btn');
            const cancelDetailBtn = document.getElementById('cancel-detail-btn');
            const cancelModalOverlay = document.getElementById('cancel-modal-overlay');
            const closeCancelModalBtn = document.getElementById('close-cancel-modal');
            const cancelCancelBtn = document.getElementById('cancel-cancel-btn');
            const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
            const statusFilter = document.getElementById('status-filter');
            const timeFilter = document.getElementById('time-filter');
            const orderSearch = document.getElementById('order-search');

            // Store orders data globally
            let ordersData = [];

            // Account display logic
            if (userId && jwtToken) {
                var AccountDiv = document.getElementById('user-icon');
                var row = `
                        <div style="display: inline-flex; align-items: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                 width="24" height="24">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </div>
                    `;
                AccountDiv.innerHTML = row;
                AccountDiv.style.cursor = "pointer";
                AccountDiv.onclick = () => {
                    sessionStorage.removeItem('UserID');
                    sessionStorage.removeItem('jwtToken');
                    window.location.href = 'Login.html';
                };
            } else {
                // Redirect to login if not logged in
                window.location.href = 'Login.html';
            }

            // Fetch orders from API
            function fetchOrders() {
                loadingContainer.style.display = 'flex';

                fetch(`https://localhost:7048/api/Order/user/orders/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch orders');
                        }
                        return response.json();
                    })
                    .then(data => {
                        ordersData = data;
                        loadingContainer.style.display = 'none';
                        console.log(data);

                        if (data.length === 0) {
                            orderList.innerHTML = `
                <div class="no-orders">
                    <h3>No Orders Found</h3>
                    <p>You haven't placed any orders yet.</p>
                    <a href="catalog.html">
                        <button>Browse Books</button>
                    </a>
                </div>
            `;
                        } else {
                            renderOrders(data);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching orders:', error);
                        loadingContainer.style.display = 'none';
                        orderList.innerHTML = `
            <div class="no-orders">
                <h3>Error Loading Orders</h3>
                <p>${error.message}</p>
                <button onclick="window.location.reload()">Try Again</button>
            </div>
        `;
                    });
            }

            // Format date for display
            function formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            // Format short date
            function formatShortDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }

            // Get status class
            function getStatusClass(status) {
                status = status.toLowerCase();
                if (status === 'pending') return 'pending';
                if (status === 'processing') return 'processing';
                if (status === 'shipped') return 'shipped';
                if (status === 'delivered') return 'delivered';
                if (status === 'canceled') return 'canceled';
                return 'pending'; // Default
            }

            // Render orders
            function renderOrders(orders) {
    orderList.innerHTML = '';

    orders.forEach(order => {
        const statusClass = getStatusClass(order.status);
        const canCancel = !order.isCanceled && (order.status.toLowerCase() === 'pending' || order.status.toLowerCase() === 'processing');
        const shortOrderId = order.orderId.substring(0, 8);
        const formattedDate = formatShortDate(order.orderDate);

        // Calculate total items
        const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

        // Create order items HTML
        let orderItemsHtml = '';
        order.orderItems.forEach(item => {
            orderItemsHtml += `
                    <div class="order-item">
                        <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop" alt="${item.bookTitle}" class="order-item-image">
                        <div class="order-item-details">
                            <div class="order-item-title">${item.bookTitle}</div>
                            <div class="order-item-author">by ${item.bookAuthor}</div>
                            <div class="order-item-price">
                                <span class="order-item-quantity">Qty: ${item.quantity}</span>
                                <span class="order-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                `;
        });

        // Create order card
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
                <div class="order-card-header">
                    <div>
                        <div class="order-id">Order #${shortOrderId}</div>
                        <div class="order-date">${formattedDate}</div>
                    </div>
                    <span class="order-status ${statusClass}">${order.status}</span>
                </div>
                <div class="order-card-body">
                    <div class="order-items">
                        ${orderItemsHtml}
                    </div>
                    <div class="order-summary">
                        <div class="order-summary-row">
                            <span class="order-summary-label">Claim Code:</span>
                            <span class="order-summary-value">${order.claimCode}</span>
                        </div>
                        <div class="order-summary-row">
                            <span class="order-summary-label">Total Items:</span>
                            <span class="order-summary-value">${totalItems}</span>
                        </div>
                        <div class="order-summary-row">
                            <span class="order-summary-label">Total:</span>
                            <span class="order-total">$${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div class="order-card-footer">
                    <button class="view-more-btn" data-order-id="${order.orderId}">View Details</button>
                    <button class="cancel-order-btn ${order.isCanceled ? 'disabled' : ''}" 
                            data-order-id="${order.orderId}" 
                            ${!canCancel ? 'disabled' : ''}>
                        Cancel Order
                    </button>
                </div>
            `;

        orderList.appendChild(orderCard);
    });

    // Add event listeners after all cards are created
    addEventListeners();
}
            // Add event listeners to dynamically created elements
            function addEventListeners() {
                // View details buttons
                const viewMoreButtons = document.querySelectorAll('.view-more-btn');
                viewMoreButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const orderId = this.getAttribute('data-order-id');
                        showOrderDetails(orderId);
                    });
                });

                // Cancel order buttons
                const cancelOrderButtons = document.querySelectorAll('.cancel-order-btn:not(.disabled)');
                cancelOrderButtons.forEach(button => {
                    button.addEventListener('click', function (e) {
                        e.stopPropagation();
                        const orderId = this.getAttribute('data-order-id');
                        confirmCancelBtn.setAttribute('data-order-id', orderId);
                        cancelModalOverlay.classList.add('active');
                    });
                });
            }

            // Show order details in modal
            function showOrderDetails(orderId) {
                const order = ordersData.find(o => o.orderId === orderId);
                if (!order) return;

                const statusClass = getStatusClass(order.status);
                const canCancel = !order.isCanceled && (order.status.toLowerCase() === 'pending' || order.status.toLowerCase() === 'processing');
                const formattedDate = formatDate(order.orderDate);
                const shortOrderId = order.orderId.substring(0, 8);

                // Calculate subtotal (without shipping and tax)
                const subtotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const shipping = 10.00; // Assuming fixed shipping cost
                const tax = order.totalAmount - subtotal - shipping;

                // Create order items HTML
                let orderItemsHtml = '';
                order.orderItems.forEach(item => {
                    orderItemsHtml += `
                            <div class="order-detail-item">
                                <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop" alt="${item.bookTitle}" class="order-detail-item-image">
                                <div class="order-detail-item-info">
                                    <div class="order-detail-item-title">${item.bookTitle}</div>
                                    <div class="order-detail-item-author">by ${item.bookAuthor}</div>
                                    <div class="order-detail-item-price">
                                        <div class="order-detail-item-quantity">Quantity: ${item.quantity} × $${item.price.toFixed(2)}</div>
                                        <div class="order-detail-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        `;
                });

                // Update modal content
                orderDetailContent.innerHTML = `
                        <div class="order-detail-header">
                            <div class="order-detail-info">
                                <div class="order-detail-id">Order #${shortOrderId}</div>
                                <div class="order-detail-date">Placed on ${formattedDate}</div>
                                <div class="order-detail-claim">
                                    <span class="order-detail-claim-label">Claim Code:</span>
                                    <span class="order-detail-claim-code">${order.claimCode}</span>
                                </div>
                            </div>
                            <div class="order-detail-status-container">
                                <div class="order-detail-status ${statusClass}">${order.status}</div>
                                <div class="order-detail-total">$${order.totalAmount.toFixed(2)}</div>
                            </div>
                        </div>

                        <div class="order-detail-items">
                            <h3 class="order-detail-items-title">Order Items</h3>
                            ${orderItemsHtml}
                        </div>
                    `;

                // Update cancel button state
                if (canCancel) {
                    cancelDetailBtn.classList.remove('disabled');
                    cancelDetailBtn.disabled = false;
                } else {
                    cancelDetailBtn.classList.add('disabled');
                    cancelDetailBtn.disabled = true;
                }

                cancelDetailBtn.setAttribute('data-order-id', order.orderId);

                // Show modal
                orderDetailModalOverlay.classList.add('active');
            }

           
            function cancelOrder(orderId) {
                console.log(orderId)
                fetch(`https://localhost:7048/api/Order/delete/${orderId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => {
                                console.log("Raw response text:", err);
                                throw new Error(err.message);
                            });
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log(data);
                        showNotification(`Order #${orderId.substring(0, 8)} has been canceled successfully.`, 'success');
                        setTimeout(() => {
                            window.location.reload();
                        }, 7000);
                    })
                    .catch(error => {
                        console.error(error);
                        showNotification(`Failed to cancel order: ${error.message}`, 'error');
                    });
            }

            function showNotification(message, type = 'success') {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.textContent = message;
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.classList.add('show');
                }, 10);

                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 3000);
            }


            // Modal close buttons
            closeDetailModalBtn.addEventListener('click', function () {
                orderDetailModalOverlay.classList.remove('active');
            });

            closeDetailBtn.addEventListener('click', function () {
                orderDetailModalOverlay.classList.remove('active');
            });

            // Cancel from detail view
            cancelDetailBtn.addEventListener('click', function () {
                if (!this.disabled) {
                    const orderId = this.getAttribute('data-order-id');
                    confirmCancelBtn.setAttribute('data-order-id', orderId);
                    orderDetailModalOverlay.classList.remove('active');
                    cancelModalOverlay.classList.add('active');
                }
            });

            closeCancelModalBtn.addEventListener('click', function () {
                cancelModalOverlay.classList.remove('active');
            });

            cancelCancelBtn.addEventListener('click', function () {
                cancelModalOverlay.classList.remove('active');
            });

            confirmCancelBtn.addEventListener('click', function () {
                const orderId = this.getAttribute('data-order-id');
                cancelOrder(orderId);
                cancelModalOverlay.classList.remove('active');
            });
            fetchOrders();
        });
    