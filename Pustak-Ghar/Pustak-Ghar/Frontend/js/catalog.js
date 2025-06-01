const userId = sessionStorage.getItem("UserID");
const jwt = sessionStorage.getItem("jwtToken");
let wishlistBookIds = [];
const fetchUserWishlistDomain = `https://localhost:7048/Wishlist/get-wishlist?userId=${userId}`;
const userRole = sessionStorage.getItem("UserRole");
var results = document.getElementById("results-number");
var BookContainer = document.getElementById("bookContainer");
const url = window.location.search;
if(url){
    console.log(url)
const queryString = url.split('=')[1];
console.log(queryString)
payload = {
     genre: queryString,
}
jsonPayload = JSON.stringify(payload);
fetch('https://localhost:7048/Book/filter-books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonPayload
    })
        .then(response => response.json())
        .then(data => {
            if (data.message == 'No books found with the given filters.') {
                console.log(data);
            }
            else {
                renderbooks(data);
            }
        })
        .catch(error => {
            console.error('Error applying filters:', error);
            showNotification("Error applying filters");
        });

}

function formatDate(dateString) {
    return dateString ? new Date(dateString).toISOString() : null;
}

document.getElementById('price-range').addEventListener('input', function () {
    document.getElementById('price-value').textContent = '$' + this.value;
});

document.getElementById('clear-filters').addEventListener('click', function () {
    window.location.reload();
});

document.getElementById('close-notification').addEventListener('click', function () {
    document.getElementById('notification').classList.remove('show');
});

if (userId && jwt) {
    const nameSpan = document.getElementById("user-fullname");
    if (nameSpan) {
        nameSpan.innerText = 'Profile';
    }
} else {
    const nameSpan = document.getElementById("user-fullname");
    if (nameSpan) {
        nameSpan.innerText = "Login";
    }
}

if (userRole == "Member" || userRole == null) {
    document.getElementById('admin').style.display = 'none';
}

function logout() {
    sessionStorage.removeItem("UserID");
    sessionStorage.removeItem("jwtToken");
    window.location.href = "/login.html";
}

function getAllCarts() {
    const cartsString = localStorage.getItem('user_carts');
    return cartsString ? JSON.parse(cartsString) : {};
}

function getUserCart(userId) {
    const allCarts = getAllCarts();
    return allCarts[userId] || [];
}

function saveUserCart(userId, cartData) {
    const allCarts = getAllCarts();
    allCarts[userId] = cartData;
    localStorage.setItem('user_carts', JSON.stringify(allCarts));
}

function getCurrentUserCartCount() {
    if (!userId) return 0;

    const userCart = getUserCart(userId);
    let totalItems = 0;

    for (let item of userCart) {
        totalItems += item.quantity;
    }

    return totalItems;
}

function Addtocart(id) {
    if (userId) {
        let userCart = getUserCart(userId);
        let bookExists = false;
        for (let i = 0; i < userCart.length; i++) {
            if (userCart[i].bookId === id) {
                userCart[i].quantity += 1;
                bookExists = true;
                break;
            }
        }
        if (!bookExists) {
            const bookDataStr = document.getElementById(`bookdata-${id}`).value;
            const bookData = JSON.parse(bookDataStr);

            userCart.push({
                quantity: 1,
                userId: userId,
                bookId: id,
                book: bookData
            });
        }
        saveUserCart(userId, userCart);
        showNotification("Book added to cart!");
    } else {
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

function AddtoWishlist(id) {
    console.log(id);
    const user_id = sessionStorage.getItem('UserID');
    if (!user_id) {
        Swal.fire({
            title: "Love the Book?",
            text: "Please login to add it in your wishlist",
            icon: "question"
        }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
                window.location.href = "/Login.html";
            }
        });
    } else {
        const bookId = id;
        const formdata = {
            userId: user_id,
            bookId: bookId
        };
        console.log(formdata);
        fetch('https://localhost:7048/Wishlist/add-to-wishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formdata)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success == true) {
                    showNotification('Wishlist Data Updated Successfully');
                    setTimeout(() => window.location.reload(), 700);
                } else {
                    console.log(data);
                    showNotification(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function openbookpage(id) {
    window.location.href = `https://localhost:7048/ProductDetails.html?id=${id}`;
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    notificationMessage.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}


function filterBooks() {
    const selectedFilters = {
        title: null,
        isAwardWinning: false,
        minRating: null,
        genre: null,
        format: null,
        isInStock: null,
        language: null,
        minPrice: null,
        maxPrice: null,
        onSale: null
    };
    const titleInput = document.getElementById('title-filter').value.trim();
    selectedFilters.title = titleInput !== "" ? titleInput.toLowerCase() : null;
    selectedFilters.isAwardWinning = document.getElementById('award-winning').checked;
    const ratingRadio = document.querySelector('input[name="rating"]:checked');
    selectedFilters.minRating = ratingRadio ? parseInt(ratingRadio.value) : null;
    const genreRadio = document.querySelector('input[name="genre"]:checked');
    selectedFilters.genre = genreRadio ? genreRadio.value : null;
    const formatRadio = document.querySelector('input[name="format"]:checked');
    selectedFilters.format = formatRadio ? formatRadio.value : null;
    const availabilityRadio = document.querySelector('input[name="availability"]:checked');
    if (availabilityRadio && availabilityRadio.value === "on") {
        selectedFilters.isInStock = true;
    }

    const onsale = document.querySelector('input[name="onsale"]:checked');
    if (onsale && onsale.value === "on") {
        selectedFilters.onSale = true;
    }

    const languageRadio = document.querySelector('input[name="language"]:checked');
    selectedFilters.language = languageRadio ? languageRadio.value : null;
    selectedFilters.maxPrice = parseInt(document.getElementById('price-range').value);
    const payload = {};
    for (const key in selectedFilters) {
        const value = selectedFilters[key];
        if (value === null || value === undefined || value === "") continue;

        // Specifically exclude 0 for minRating and maxRating
        if ((key === "maxPrice" || key === "maxPrice") && value === 0) continue;
        if ((key === "isAwardWinning") && value == false) continue;

        payload[key] = value;
    }

    const jsonPayload = JSON.stringify(payload);
    console.log("JSON Payload:", jsonPayload);
    fetch('https://localhost:7048/Book/filter-books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonPayload
    })
        .then(response => response.json())
        .then(data => {
            if (data.message == 'No books found with the given filters.') {
                console.log(data);
            }
            else {
                renderbooks(data);
            }
        })
        .catch(error => {
            console.error('Error applying filters:', error);
            showNotification("Error applying filters");
        });
}

const sortSelect = document.getElementById("sort-select");

sortSelect.addEventListener("change", function () {
    const selectedValue = sortSelect.value;
    const sortField = selectedValue.split('-')[0];
    const sortOrder = selectedValue.split('-')[1];
    const payload = {
        sortField: sortField,
        sortOrder: sortOrder
    };
    console.log("Selected Sort Option:", selectedValue);
    fetch('https://localhost:7048/Book/sort-books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            renderbooks(data)
            console.log("Sorted Data:", data);
        })
        .catch(error => {
            console.error('Errorsorting', error);
            showNotification("Error applying sorts");
        });
})



fetch(fetchUserWishlistDomain, {
    method: 'GET'
})
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data.success === false) {
            console.log('Failed to fetch wishlist:', data.message || 'Unknown error');
        } else {
            wishlistBookIds = data.map(item => item.bookId);
            markWishlistBooks();
        }
    })
    .catch(error => {
        console.error('Error fetching wishlist:', error);
    });

function markWishlistBooks() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        const bookId = button.getAttribute('data-book-id');
        if (wishlistBookIds.includes(bookId)) {
            button.style.backgroundColor = 'var(--primary-color)';
            button.style.color = 'var(--white)';
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            `;
        }
    });
}

// Load books on page load
fetch('https://localhost:7048/Book/all-books', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})
    .then(response => response.json())
    .then(data => {
        results.textContent = data.length;
        let books = data;
        BookContainer.innerHTML = '';
        if (data.hasbook == false) {
            showempty();
        }
        else {
            renderbooks(books);
        }
    })
    .catch(error => {
        console.error('Error fetching books:', error);
        BookContainer.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem; width: 100%;">
                <h3>Unable to load books</h3>
                <p>There was a problem connecting to the server. Please try again later.</p>
                <p>Error details: ${error.message}</p>
            </div>
        `;
    });

function showempty() {
    BookContainer.style.display = 'flex';
    document.getElementById('filterDiv').style.display = 'None';
    document.getElementById('control').style.display = 'none';
    document.getElementById('search-container').style.display = 'none';
    document.getElementById('catalog-header').style.display = 'none';
    BookContainer.innerHTML = `
        <div class="no-books-found" style="text-align: center; padding: 2rem; width: 100%;">
            <div style="max-width: 400px; margin: 0 auto;">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#A8C69F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    <path d="M10 2v20"></path>
                    <path d="M2 12h4"></path>
                    <path d="M2 7h4"></path>
                    <path d="M2 17h4"></path>
                    <circle cx="16" cy="12" r="3" fill="#A8C69F" opacity="0.2" stroke="#A8C69F"></circle>
                    <line x1="16" y1="9" x2="16" y2="15" stroke="#fff" stroke-width="1.5"></line>
                    <line x1="13" y1="12" x2="19" y2="12" stroke="#fff" stroke-width="1.5"></line>
                </svg>
                <h3 style="font-family: var(--font-heading); margin: 1.5rem 0 0.5rem; color: var(--text-color);">No Books Found</h3>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">We couldn't find any books in our catalog. Please check back later or try a different search.</p>
                <a href="https://localhost:7048/Home.html" style="display: inline-block;">
                    <button style="background-color: var(--primary-color); color: white; border: none; padding: 12px 24px; border-radius: 30px; font-weight: 500; font-family: var(--font-body); font-size: 0.95rem; transition: all 0.3s ease; box-shadow: 0 4px 10px var(--shadow-color); cursor: pointer;">
                        Go to Homepage
                    </button>
                </a>
            </div>
        </div>
    `;
    document.getElementById("results-number").textContent = "0";
    document.getElementsByTagName('footer')[0].style.marginTop = "0px";
}

function renderbooks(books) {
    BookContainer.innerHTML = '';
    books.forEach(book => {
        let badgesHTML = '';
        if (book.onSale) {
            badgesHTML += `<div class="book-badge badge-sale">${book.discountPercent}% OFF</div>`;
        }

        if (book.is_awardwinning) {
            badgesHTML += '<div class="book-badge badge-award">Award Winning</div>';
        }
        if (book.stockCount < 1) {
            badgesHTML += '<div class="book-badge badge-new">Out of Stock</div>';
        }

        const format = book.format || "Paperback";
        const rating = book.ratings || "0";
        let priceHTML = '';
        if (book.onSale) {
            const originalPrice = book.price;
            const discountPrice = book.discountedPrice.toFixed(2); // 32% discount
            priceHTML = `
                <div class="book-price">
                    <span class="current-price">$${discountPrice}</span>
                    <span class="original-price">$${originalPrice.toFixed(2)}</span>
                </div>
            `;
        } else {
            priceHTML = `
                <div class="book-price">
                    <span class="current-price">$${book.price.toFixed(2)}</span>
                </div>
            `;
        }

        // Generate star rating
        const ratingValue = parseFloat(rating);
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < Math.floor(ratingValue)) {
                starsHTML += `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                `;
            } else if (i === Math.floor(ratingValue) && ratingValue % 1 > 0) {
                // Half star
                starsHTML += `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="fill: url(#half-star-gradient)">
                        <defs>
                            <linearGradient id="half-star-gradient">
                                <stop offset="50%" stop-color="currentColor" />
                                <stop offset="50%" stop-color="transparent" />
                            </linearGradient>
                        </defs>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                `;
            } else {
                starsHTML += `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                `;
            }
        }

        BookContainer.innerHTML += `
            <div class="book-card">
                <div class="book-img">
                    <img src="${book.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop"}" alt="${book.title}">
                    <div class="book-badges">
                        ${badgesHTML}
                    </div>
                    <button id='wishlist-${book.bookId}' class="wishlist-btn" aria-label="Add to wishlist" onclick="AddtoWishlist('${book.bookId}')" data-book-id="${book.bookId}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <input value="${book.bookId}" hidden id="bookId" />
                    <input value='${JSON.stringify(book)}' hidden id="bookdata-${book.bookId}"/>
                    <p class="book-author">by ${book.author}</p>
                    
                    <div class="book-rating">
                        <div class="stars">
                            ${starsHTML}
                        </div>
                        <span class="rating-number">(${rating})</span>
                    </div>
                    
                    ${priceHTML}
                    
                    <div class="book-actions">
                        <button class="read-more-btn" onclick="openbookpage('${book.bookId}')">Read More</button>
                        <button class="add-to-cart-btn" id="cart-${book.bookId}" onclick="Addtocart('${book.bookId}')">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        if (book.stockCount === 0) {
            const cartButton = document.getElementById(`cart-${book.bookId}`);
            const wishlistButton = document.getElementById(`wishlist-${book.bookId}`);
            if (cartButton) {
                cartButton.disabled = true;
                cartButton.style.cursor = "not-allowed";
                cartButton.style.opacity = "0.6";
                cartButton.classList.add("disabled-btn");
            }
            if (wishlistButton) {
                wishlistButton.disabled = true;
                wishlistButton.style.cursor = "not-allowed";
                wishlistButton.style.opacity = "0.6";
                wishlistButton.classList.add("disabled-btn");
            }
        }
    });
    if (wishlistBookIds.length > 0) {
        markWishlistBooks();
    }
}