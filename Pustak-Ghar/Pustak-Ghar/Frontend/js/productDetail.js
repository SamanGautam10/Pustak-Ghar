
        const sessionUserId = sessionStorage.getItem('UserID')
        document.addEventListener('DOMContentLoaded', function () {
            const url = window.location.search;
            console.log(url)
            const queryString = url.split('=')[1];
            console.log(typeof (queryString))
            const bookId = queryString
            console.log(bookId)
            fetchBookDetails(bookId);
            // Fetch reviews
            fetchReviews(bookId);
            // Handle review form submission
            document.getElementById('review-form').addEventListener('submit', function (e) {
                e.preventDefault();
                submitReview(bookId);
            });
            // Handle quantity buttons
            document.addEventListener('click', function (e) {
                if (e.target.classList.contains('quantity-btn')) {
                    const input = e.target.parentElement.querySelector('.quantity-input');
                    let value = parseInt(input.value);

                    if (e.target.classList.contains('minus')) {
                        if (value > 1) {
                            input.value = value - 1;
                        }
                    } else if (e.target.classList.contains('plus')) {
                        input.value = value + 1;
                    }
                }
            });
        });

        // Fetch book details from API
        function fetchBookDetails(bookId) {
            fetch(`https://localhost:7048/Book/${bookId}`)
                .then(response => {
                    if (!response.ok) {
                            return response.json().then(err => {
                                throw new Error(err.message);
                            });
                        }
                    return response.json();
                })
                .then(bookData => {
                    displayBookDetails(bookData);
                })
                .catch(error => {
                    console.error('Error:', error.message);
                    showNotification(error.message, 'error');
                });
        }

        function displayBookDetails(book) {
            console.log()
            const bookDetailsContainer = document.getElementById('book-details');
            const pubDate = new Date(book.publicationDate);
            const formattedDate = pubDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const starsHtml = generateStarsHtml(book.ratings);
            const discountHtml = book.onSale ?
                `<span class="book-original-price">$${book.price.toFixed(2)}</span>
                    <span class="discount-badge">${book.discountPercent}% OFF</span>` : '';
            const stockStatusClass = book.isInStock ? 'in-stock' : 'out-of-stock';
            const stockStatusText = book.isInStock ? 'In Stock' : 'Out of Stock';
            const awardBadge = book.is_awardwinning ?
                `<div class="meta-item">
                        <span class="meta-label">Awards</span>
                        <span class="meta-value">Award Winner</span>
                    </div>` : '';
            const html = `
                    <div class="book-image-container">
                        <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop" alt="${book.title}" class="book-image">
                    </div>
                    <div class="book-info">
                        <h1 class="book-title">${book.title}</h1>
                        <p class="book-author">by ${book.author}</p>
                        <p class="book-publisher">Published by ${book.publisher} on ${formattedDate}</p>

                        <div class="book-rating">
                            <div class="stars">
                                ${starsHtml}
                            </div>
                            <span class="rating-count">${book.ratings} out of 5</span>
                        </div>

                        <div class="book-price-container">
                            <span class="book-price">$${book.price.toFixed(2)}</span>
                            ${discountHtml}
                        </div>

                        <div class="book-meta">
                            <div class="meta-item">
                                <span class="meta-label">Format</span>
                                <span class="meta-value">${book.format}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Language</span>
                                <span class="meta-value">${book.language}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Genre</span>
                                <span class="meta-value">${book.genre}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">ISBN</span>
                                <span class="meta-value">${book.isbn}</span>
                            </div>
                            ${awardBadge}
                        </div>

                        <div class="book-description">
                            <h3>Description</h3>
                            <p>${book.description}</p>
                        </div>

                        <div class="stock-status ${stockStatusClass}">${stockStatusText}</div>

                        <div class="quantity-selector">
                            <button class="quantity-btn minus">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                            <input type="number" value="1" min="1" max="${book.stockCount}" class="quantity-input">
                            <button class="quantity-btn plus">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                        </div>

                        <div class="book-actions">
                            <button class="add-to-cart-btn" onclick="addToCart('${book.bookId}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                Add to Cart
                            </button>
                            <button class="add-to-wishlist-btn" onclick="addToWishlist('${book.bookId}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                `;

            bookDetailsContainer.innerHTML = html;
        }
        
        function generateStarsHtml(rating) {
            let html = '';
            const fullStars = Math.floor(rating);
            const halfStar = rating % 1 >= 0.5;

            // Add full stars
            for (let i = 0; i < fullStars; i++) {
                html += `
                        <svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    `;
            }
            if (halfStar) {
                html += `
                        <svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0">
                            <defs>
                                <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="50%" stop-color="currentColor" />
                                    <stop offset="50%" stop-color="transparent" stop-opacity="0" />
                                </linearGradient>
                            </defs>
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half-star)"></polygon>
                        </svg>
                    `;
            }
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
            for (let i = 0; i < emptyStars; i++) {
                html += `
                        <svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="transparent" stroke="currentColor" stroke-width="1">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    `;
            }

            return html;
        }

        function fetchReviews(bookId) {
            fetch(`https://localhost:7048/Review/getbookreview/${bookId}`)
                .then(response => {
                    return response.json();
                })
                .then(reviews => {
                    if (reviews.success == false || reviews.length === 0) {
                        const reviewsContainer = document.getElementById('reviews-container');
                        reviewsContainer.innerHTML = `
                            <div class="no-reviews" style="text-align: center; padding: 40px; background-color: var(--primary-light); border-radius: var(--border-radius);">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px;">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <h3 style="font-family: var(--font-heading); color: var(--text-color); margin-bottom: 10px;">No Reviews Yet</h3>
                                <p style="color: var(--text-light); margin-bottom: 20px;">Be the first to share your thoughts about this book!</p>
                                <button class="scroll-to-review-btn" style="background-color: var(--primary-color); color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: background-color 0.3s ease;"
                                        onclick="document.getElementById('review-form').scrollIntoView({behavior: 'smooth'})">
                                    Write a Review
                                </button>
                            </div>
                        `;
                        console.log(reviews.message);
                    } else {
                        displayReviews(reviews);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        function displayReviews(reviews) {
            console.log(reviews)
            const reviewsContainer = document.getElementById('reviews-container');
            if (reviews.length === 0) {
                reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review this book!</p>';
                return;
            }
            let html = '';
            reviews.forEach(review => {
                const reviewDate = new Date(review.reviewOn);
                const formattedDate = reviewDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const initials = review.username.split(' ')
                    .map(name => name.charAt(0))
                    .join('')
                    .toUpperCase();

                const starsHtml = generateStarsHtml(review.rating);

                html += `
                        <div class="review-card">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <div class="reviewer-avatar">${initials}</div>
                                    <div>
                                        <div class="reviewer-name">${review.username}</div>
                                        <div class="review-date">${formattedDate}</div>
                                    </div>
                                </div>
                                <div class="review-rating">
                                    ${starsHtml}
                                </div>
                            </div>
                            <div class="review-content">
                                <p>${review.comment}</p>
                            </div>
                        </div>
                    `;
            });
            reviewsContainer.innerHTML = html;
        }
        function submitReview(bookId) {
            console.log(sessionUserId)
            if (!sessionUserId) {
                Swal.fire({
                    title: "Please login",
                    text: "You need to login to add Review The book",
                    icon: "error"
                }).then(() => {
                    window.location.href = "/Login.html";
                });
                return;
            }
            else {
                const reviewerName = document.getElementById('reviewer-name').value;
                const rating = document.querySelector('input[name="rating"]:checked')?.value || 5;
                const reviewText = document.getElementById('review-text').value;
                console.log(sessionUserId)
                const reviewData = {
                    rating: rating,
                    comment: reviewText,
                    bookId: bookId,
                    userId: sessionUserId
                };
                console.log(JSON.stringify(reviewData))
                fetch(`https://localhost:7048/Review/add-review`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reviewData)
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => {
                                throw new Error(err.message);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data)
                        showNotification('Review submitted successfully!', 'success');
                        document.getElementById('review-form').reset();
                        setTimeout(() => {
                            window.location.reload()
                        }, 2000)
                    })
                    .catch(error => {
                         showNotification(error.message, "error");
                        console.error("Error from backend:", error.message);
                    });
            }
        }
        function addToCart(bookId) {
            const quantity = document.querySelector('.quantity-input').value;
            console.log(sessionUserId)
            if (!sessionUserId) {
                showNotification('Please log in to add items to your cart', 'error');
                return;
            }
            const allCarts = JSON.parse(localStorage.getItem('user_carts') || '{}');
            const userCart = allCarts[sessionUserId] || [];
            const existingItemIndex = userCart.findIndex(item => item.bookId === bookId);
            if (existingItemIndex >= 0) {
                userCart[existingItemIndex].quantity += parseInt(quantity);
            } else {
                const bookDetails = {
                    bookId: bookId,
                    title: document.querySelector('.book-title').textContent,
                    author: document.querySelector('.book-author').textContent.replace('by ', ''),
                    price: parseFloat(document.querySelector('.book-price').textContent.replace('$', '')),
                    imageUrl: document.querySelector('.book-image').src,
                    format: document.querySelector('.meta-value').textContent
                };

                userCart.push({
                    bookId: bookId,
                    quantity: parseInt(quantity),
                    book: bookDetails
                });
            }
            allCarts[sessionUserId] = userCart;
            localStorage.setItem('user_carts', JSON.stringify(allCarts));
            showNotification('Added to cart successfully!', 'success');
        }

        function addToWishlist(bookId) {
            const userId = sessionStorage.getItem('UserID');
            if (!userId) {
                showNotification('Please log in to add items to your wishlist', 'error');
                return;
            }
            showNotification('Added to wishlist successfully!', 'success');
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
    