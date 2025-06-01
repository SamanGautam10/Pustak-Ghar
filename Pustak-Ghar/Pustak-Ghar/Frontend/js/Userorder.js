
        document.addEventListener('DOMContentLoaded', function () {
            const orderContainer = document.getElementById('OrderContainer');
            const id = sessionStorage.getItem('UserID');
            console.log('UserID:', id);

            if (!id) {
                console.error('No UserID found in sessionStorage');
                sessionStorage.clear();
                window.location = '/Login.html'
            }
            else {

                const domain = `https://localhost:7048/api/Order/user/orders/${id}`;
                console.log('API Endpoint:', domain);

                fetch(domain, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
                    }
                })
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        console.log('Orders data:', data);
                        orderContainer.innerHTML = '';
                        if (data.message == "No orders found.") {
                            document.getElementById('Section').style.height = '45rem'
                            orderContainer.innerHTML = `
                            <div style="text-align: center; padding: 2rem; color: #666;">
                                    <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 10H21M7 3V5M17 3V5M6 12H8M11 12H13M6 15H8M11 15H13M6 18H8M11 18H13M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <h3 style="margin-top: 1rem;">No Orders Found</h3>
                                    <p style="margin-top: 0.5rem;">It looks like you haven't placed any orders yet.</p>
                                    <button style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: #A8C69F; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">
                                        Start Shopping
                                    </button>
                                </div>
                            `;
                            return;
                        }

                        data.forEach(order => {
                            const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });

                            // Generate order items HTML
                            let orderItemsHTML = '';
                            order.orderItems.forEach(item => {
                                orderItemsHTML += `
                    <div class="order-item">
                        <div class="item-image">
                            <img src="https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Book cover">
                        </div>
                        <div class="item-details">
                            <div class="item-title">${item.bookTitle}</div>
                            <div class="item-author">${item.bookAuthor}</div>
                            <div class="item-price">Rs.${item.price}</div>
                        </div>
                    </div>`;
                            });

                            const orderCard = `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-id">Order #${order.orderId.substring(0, 8).toUpperCase()}</div>
                        <div class="order-date">${orderDate}</div>
                        <div class="order-status status-${order.status.toLowerCase()}">${order.status}</div>
                    </div>
                    <div class="order-items">
                        ${orderItemsHTML}
                    </div>
                    <div class="order-footer">
                        <div class="order-total">Total: $${order.totalAmount.toFixed(2)}</div>
                        <div class="order-actions">
                            <p style="font-weight: bold;">ClaimCode: <span style="color:#89aa7f">${order.claimCode}</span></p>

                        </div>
                    </div>
                </div>`;

                            orderContainer.innerHTML += orderCard;
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching orders:', error);
                        orderContainer.innerHTML = `<p>Error loading orders: ${error.message}</p>`;
                    });
            }

            const logoutBtn = document.querySelector('.logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function () {
                        sessionStorage.removeItem('UserID');
                        sessionStorage.removeItem('jwtToken');
                        window.location.href = 'Login.html'
                }); 
            }
            function showNotification(message, type = 'success') {
                let notification = document.querySelector('.notification');
                if (!notification) {
                    notification = document.createElement('div');
                    notification.className = 'notification';
                    document.body.appendChild(notification);
                    notification.style.position = 'fixed';
                    notification.style.bottom = '20px';
                    notification.style.right = '20px';
                    notification.style.padding = '12px 20px';
                    notification.style.borderRadius = '8px';
                    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    notification.style.zIndex = '1000';
                    notification.style.transition = 'all 0.3s ease';
                    notification.style.transform = 'translateY(100px)';
                    notification.style.opacity = '0';
                }
                if (type === 'error') {
                    notification.style.backgroundColor = '#e74c3c';
                } else {
                    notification.style.backgroundColor = 'var(--primary-color)';
                }

                notification.style.color = 'white';
                notification.textContent = message;
                setTimeout(() => {
                    notification.style.transform = 'translateY(0)';
                    notification.style.opacity = '1';
                }, 10);
                setTimeout(() => {
                    notification.style.transform = 'translateY(100px)';
                    notification.style.opacity = '0';
                }, 3000);
            }
        });
    