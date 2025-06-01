function cancelOrder(id) {
    const payload = {
        orderId: id,
        status: "Delivered"
    }
    console.log(payload)
    fetch('https://localhost:7048/api/Order/update-status', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("Success:", data);
            showNotification("Order Confirmed successfully!", "success");
            setTimeout(()=>{window.location.reload();},800)
            })
}

document.addEventListener('DOMContentLoaded', function () {
    // Array to store active orders
    let activeOrders = [];

    // Function to populate orders table
    function populateOrdersTable(orders) {
        const tableBody = document.getElementById('orders-table-body');
        tableBody.innerHTML = '';
        if (!orders || orders.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td colspan="7" style="text-align: center; padding: 40px 0;">
                            <div class="no-orders-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="10" cy="20.5" r="1"/>
                                    <circle cx="18" cy="20.5" r="1"/>
                                    <path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1"/>
                                </svg>
                                <h3>No orders found in system</h3>
                                <p>When new orders are placed, they'll appear here</p>
                            </div>
                        </td>
                    `;
            tableBody.appendChild(row);
            document.getElementById('results-number').textContent = 0;
            return;
        }
        orders.forEach(order => {
            const row = document.createElement('tr');
            let statusClass = order.status.toLowerCase();
            row.innerHTML = `
                                    <td>${order.orderId}</td>
                                    <td>${new Date(order.orderDate).toISOString().split('T')[0]}</td>
                                    <td>${order.claimCode}</td>
                                    <td class="order-amount">$${order.totalAmount}</td>
                                    <td>
                                        <div class="order-status">
                                            <span class="status-badge ${statusClass}">${order.status}</span>
                                        </div>
                                    </td>   
                                    <td>
                                        <button class="edit-status-btn" id="cancel-${order.orderId}" onclick="cancelOrder('${order.orderId}')" ${order.status.toLowerCase() === 'delivered' ? 'disabled' : ''}>Confirm</button>
                                    </td>
                                `;
            tableBody.appendChild(row);

        });

        // Update results count
        document.getElementById('results-number').textContent = orders.length;
    }
    // Try to fetch orders from API
    fetch('https://localhost:7048/api/Order/all-orders')
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.message === "No orders found.") {
                console.log('No orders found');
            } else {
                activeOrders = data;
            }
            populateOrdersTable(activeOrders);
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        });



});

