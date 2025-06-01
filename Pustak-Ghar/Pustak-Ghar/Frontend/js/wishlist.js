
const user_id = sessionStorage.getItem('UserID');
const jwt = sessionStorage.getItem('jwtToken');
var wishlist_ids = []
if (!user_id || !jwt) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You need to login to access this page",
        confirmButtonText: "OK"
    }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
            window.location.href = 'Login.html';
        }
    });
}

const notification = document.createElement('div');
notification.className = 'notification';
document.body.appendChild(notification);
function showNotification(message, isError = false) {
    notification.textContent = message;
    notification.style.backgroundColor = isError ? '#ff6b6b' : 'var(--primary-color)';
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';

    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
    }, 3000);
}

if (user_id && jwt) {
    var AccountDiv = document.getElementById('user-icon');
    var row = `
                    <div class="icon" style="display: inline-flex; align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             width="24" height="24">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </div>
                    <span style="margin-left: 0.5rem;">Logout</span>
                    `;
    AccountDiv.innerHTML = row;
    AccountDiv.style.cursor = "pointer";
    AccountDiv.onclick = () => {
        sessionStorage.removeItem('UserID');
        sessionStorage.removeItem('jwtToken');
        window.location.href = 'Login.html';
    };
}

function getAllCarts() {
    const cartsString = localStorage.getItem('user_carts');
    return cartsString ? JSON.parse(cartsString) : {};
}

function getUserCart(userId) {
    if (!userId) return [];
    const allCarts = getAllCarts();
    return allCarts[userId] || [];
}

function saveUserCart(userId, cartData) {
    if (!userId) return;

    const allCarts = getAllCarts();
    allCarts[userId] = cartData;
    localStorage.setItem('user_carts', JSON.stringify(allCarts));
}

function Addtocart(id) {
    console.log(id)
    if (user_id) {
        let userCart = getUserCart(user_id);
        let bookExists = false;
        for (let i = 0; i < userCart.length; i++) {
            if (userCart[i].bookId === id) {
                userCart[i].quantity += 1;
                bookExists = true;
                saveUserCart(user_id, userCart);
                showNotification("Amount in cart Updated");
                break;
            }
        }
        if (!bookExists) {

        }
    }
    else {
        Swal.fire({
            title: "Placing order?",
            text: "Please login to add items in your cart",
            icon: "error"
        }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
                window.location.href = "/Login.html";
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    function rolecheck() {
        const userRole = sessionStorage.getItem("UserRole")
        if (userRole == "Member" || userRole == null) {
            document.getElementById('admin').style.display = 'none'
        }
    }
    rolecheck()

    function renderWishlistItems(books) {
        const booksGrid = document.getElementById('wishlist-books');
        if (!booksGrid) return;
        booksGrid.innerHTML = '';
        booksGrid.style.display = 'grid';
        document.getElementById('empty-wishlist').style.display = 'none';
        books.forEach(book => {
            wishlist_ids.push(book.wishlistId)
            booksGrid.innerHTML += `
                                    <div class="book-card" data-id="${book.wishlistId}" data-book-id="${book.bookId}">
                                        <div class="book-img">
                                            <img src="${book.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop"}" alt="${book.title}">
                                            <button class="remove-btn" aria-label="Remove from wishlist" onclick="removeFromWishlist('${book.wishlistId}', this.closest('.book-card'))">
                                                <!-- Star icon instead of heart -->
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                </svg>
                                            </button>
                                        </div>
                                        ${book.isNewRelease
                    ? '<div class="book-badge">New Release</div>'
                    : book.isBestseller
                        ? '<div class="book-badge">Bestseller</div>'
                        : book.isOnSale
                            ? '<div class="book-badge">Sale</div>'
                            : ""
                }
                                        <div class="book-info">
                                            <h3>${book.title}</h3>
                                            <input value="${book.bookId}" hidden id="bookId" />
                                            <p class="author">by ${book.author}</p>
                                            <div class="book-details">
                                                <span class="format">${book.format || "Paperback"}</span>
                                                <span class="rating">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                    </svg>
                                                    ${book.rating || "4.5"}
                                                </span>
                                            </div>
                                            <p class="price">$${book.price ? book.price.toFixed(2) : "19.99"}</p>
                                            <button class="add-to-cart" onclick="Addtocart('${book.bookId}')">Add to Cart</button>
                                        </div>
                                    </div>
                                `;

        });
    }

    function fetchWishlist() {
        if (!user_id) {
            showEmptyWishlist();
            return;
        }

        fetch(`https://localhost:7048/Wishlist/get-wishlist?userId=${user_id}`, {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch wishlist');
                return response.json();
            })
            .then(data => {
                const wishlistItems = Array.isArray(data) ? data : [];
                if (wishlistItems.length === 0) {
                    showEmptyWishlist();
                }
                else {
                    renderWishlistItems(wishlistItems);
                }
                updateWishlistCount(wishlistItems.length);
            })
            .catch(error => {
                console.error('Error fetching wishlist:', error);
                showEmptyWishlist();
            });
    }

    function updateWishlistCount(count) {
        const countElement = document.getElementById('wishlist-number');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    document.getElementById('clear-all-wishlist').addEventListener('click', () => {
        console.log(wishlist_ids)
        for (i = 0; i < wishlist_ids.length; i++) {
            console.log(wishlist_ids[i])
            fetch(`https://localhost:7048/Wishlist/delete-wishlist-item/${wishlist_ids[i],{
                method:'DELETE'
            }}`)
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            throw (`Error deleting wishlist ID ${wishlist_ids[i]}: ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data)
                })
                .catch(error => {
                    console.error(error);
                });
        }
    })
    function addAllToCart() {
        currentbook_id = 0
        for (i = 0; i < wishlist_ids.length; i++) {
            currentbook_id = wishlist_ids[i]
            console.log(currentbook_id)
            fetch(`https://localhost:7048/Wishlist/delete-wishlist-item/${currentbook_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => { return response.json() })
                .then((data) => {
                    console.log(data)
                    if (data) {
                        showNotification('Book removed from wishlist');
                        console.log(`removed wishlist of if : ${currentbook_id}`)
                        // setTimeout(()=>{window.location.reload()},700)
                    }
                })
        }
    }

    function showEmptyWishlist() {
        document.getElementById('wishlist-books').style.display = 'none';
        document.getElementById('empty-wishlist').style.display = 'block';
        updateWishlistCount(0);
    }

    const addAllBtn = document.getElementById('add-all-to-cart');
    if (addAllBtn) {
        addAllBtn.addEventListener('click', addAllToCart);
    }
    fetchWishlist();

});
