
const user_id = sessionStorage.getItem('UserID');
        const jwt = sessionStorage.getItem('jwtToken');
        var userDiscount = 0
        var subtotal =0 
        function logout() {
            const userId = sessionStorage.getItem("UserID");
            const jwt = sessionStorage.getItem("jwtToken");
            sessionStorage.removeItem("UserID");
            sessionStorage.removeItem("jwtToken");
            window.location.href = "/login.html";
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
        var cartquantity = 0;
        var formdata = {
            "userId": user_id,
            "orderItems": [],
            total: 0
        };
        var cart = getUserCart(user_id) || [];
        for (i = 0; i < cart.length; i++) {
            cartquantity += cart[i].quantity;
        }
        if (user_id) {
            function reduceq(id) {
                let total = 0;
                for (i = 0; i < cart.length; i++) {
                    if (cart[i].bookId == id) {
                        if (cart[i].quantity <= 1) {
                            console.log('cant continue operation');
                        }
                        else {
                            cart[i].quantity -= 1;
                            saveUserCart(user_id, cart);
                        }
                    }
                    if (cart[i].book.discountedPrice > 0) {
                        total += cart[i].quantity * cart[i].book.discountedPrice.toFixed(2);
                        document.getElementById('totalamnt').textContent = `$${total}`;
                    }
                    else {
                            total += cart[i].quantity * cart[i].book.price.toFixed(2);
                            document.getElementById('totalamnt').textContent = `$${total}`;
                    }
                }
                checkForDiscount();
                window.location.reload()
            }
            function addq(id) {
                cart = getUserCart(user_id) || [];
                let total = 0;
                for (i = 0; i < cart.length; i++) {
                    if (cart[i].bookId == id) {
                        cart[i].quantity += 1;
                        saveUserCart(user_id, cart);
                    }
                    if (cart[i].book.discountedPrice > 0) {
                        console.log(subtotal)
                        console.log(document.getElementById('dcnt').value)
                        total += cart[i].quantity * cart[i].book.discountedPrice.toFixed(2);
                        document.getElementById('totalamnt').textContent = `$${total}`;
                    }
                    else {
                        total +=cart[i].quantity * cart[i].book.price.toFixed(2);
                        document.getElementById('totalamnt').textContent = `$${total}`;
                    }
                }
                checkForDiscount();
                window.location.reload()

            }
            function removeFromCart(bookId) {
                let cart = getUserCart(user_id) || [];

                for (let i = 0; i < cart.length; i++) {
                    if (cart[i].bookId === bookId) {
                        cart.splice(i, 1);
                        break;
                    }
                }
                saveUserCart(user_id, cart);
                checkForDiscount();
            }

            function checkForDiscount() {
                userDiscount = 0
                const cart = getUserCart(user_id) || [];
                const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
                domain = `https://localhost:7048/Discount/${user_id}`;
                discount = []
                fetch(domain, {
                    method: 'GET'
                })
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        discount.push(data.discountPercentage)
                        if (cartQuantity >= 5) {
                            discount.push(5)
                        }
                        for (i = 0; i < discount.length; i++) {
                            userDiscount += discount[i]
                        }
                        document.getElementById('dcnt').textContent = `${userDiscount}`;
                        let total = 0;
                        for (let i = 0; i < cart.length; i++) {
                            if(cart[i].book.discountPercent>0){
                                total += parseInt(cart[i].quantity * cart[i].book.discountedPrice);
                            }
                            else{
                                 total += parseInt(cart[i].quantity * cart[i].book.price);
                            }
                            
                        }
                        const discountedPercent = parseInt(document.getElementById('dcnt').textContent) || 0;
                        const discountedTotal = total - (total * discountedPercent / 100);
                        //document.getElementById('MP').textContent = `$${total}`;
                        formdata.total = discountedTotal.toFixed(2)
                        document.getElementById('totalamnt').textContent = `$${discountedTotal.toFixed(2)}`;

                    })
                    .catch(error => {
                        document.getElementById('dcnt').textContent = "0%";
                    });
            }

            cart = getUserCart(user_id) || [];
            discount = []
            setInterval(() => {
                const cart = getUserCart(user_id) || [];
                const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
                document.getElementById('subtotal').textContent = `Subtotal (${cart.length} items)`;
            }, 1000);
            checkForDiscount();
            document.addEventListener('DOMContentLoaded', function () {
                function rolecheck() {
                    const userRole = sessionStorage.getItem("UserRole")
                    if (userRole == "Member" || userRole == null) {
                        document.getElementById('admin').style.display = 'none'
                    }
                }
                rolecheck()

                container = document.getElementById('cartobj');
                container.innerHTML = ``;
                setInterval(() => {
                    cartdata = getUserCart(user_id) || [];
                    if (cartdata.length == 0) {
                        document.getElementById('summary').style.display = 'none';
                        document.getElementById('header').style.display = 'none';
                        container.innerHTML = `
                <div class="no-items-found" style="text-align: center; padding: 2rem; width: 100%;">
                    <div style="max-width: 400px; margin: 0 auto;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#A8C69F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            <path d="M10 2v20"></path>
                            <path d="M2 12h4"></path>
                            <path d="M2 7h4"></path>
                            <path d="M2 17h4"></path>
                            <circle cx="16" cy="12" r="3" fill="#A8C69F" opacity="0.2" stroke="#A8C69F"></circle>
                            <line x1="16" y1="9" x2="16" y2="15" stroke="#fff" strokeWidth="1.5"></line>
                            <line x1="13" y1="12" x2="19" y2="12" stroke="#fff" strokeWidth="1.5"></line>
                        </svg>
                        <h3 style="font-family: var(--font-heading); margin: 1.5rem 0 0.5rem; color: var(--text-color);">No Cart Items Found</h3>
                        <p style="color: var(--text-light); margin-bottom: 1.5rem;">Your cart is currently empty. Please add some books to the cart.</p>
                        <a href="https://localhost:7048/catalog.html" style="display: inline-block;">
                            <button style="background-color: var(--primary-color); color: white; border: none; padding: 12px 24px; border-radius: 30px; font-weight: 500; font-family: var(--font-body); font-size: 0.95rem; transition: all 0.3s ease; box-shadow: 0 4px 10px var(--shadow-color); cursor: pointer;">
                                Go to Catalogue
                            </button>
                        </a>
                    </div>
                </div>
`;
                    }
                }, 700);
                let total = 0;
                if (cart.length > 0) {
                    formdata.orderItems = [];
                    for (i = 0; i < cart.length; i++) {
                        items = {
                            "BookId": cart[i].bookId,
                            "quantity": cart[i].quantity
                        };
                        formdata.orderItems.push(items);
                        book = cart[i].book;
                        var row = `
                         <div class="cart-item">
                             <div class="item-img">
                                 <img src="${book.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop"}" alt="${book.title}">
                             </div>
                             <div class="item-details">
                                 <h3>${book.title}</h3>
                                 <p class="author">${book.author}</p>
                                 <div class="item-meta">
                                     <span class="format">${book.format || "Paperback"}</span>
                                     <span class="rating">
                                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                         </svg>
                                         ${book.rating || "4.5"}
                                     </span>
                                 </div>
                                 <div class="item-controls">
                                     <div class="quantity-selector">
                                         <button class="quantity-btn minus" onclick="reduceq('${book.bookId}')">-</button>
                                         <input type="number" value="${cart[i].quantity}" min="1" class="quantity-input">
                                         <button class="quantity-btn plus" onclick="addq('${book.bookId}')">+</button>
                                     </div>
                                     <button class="remove-item" onclick="removeFromCart('${book.bookId}')">Remove</button>
                                 </div>
                             </div>
                             <div class="item-price" id="item-price">
                                 <p class="price" id="mainprice">$${book.price}</p>
                             </div>
                         </div>
                     `;
                        container.innerHTML += row;
                        if (book.discountPercent > 0) {
                            const maindiv = document.getElementById('item-price')
                            const discountedPrice = document.createElement('p')
                            discountedPrice.className = 'price'
                            discountedPrice.textContent = `$${book.discountedPrice}`
                            actualprice = document.getElementById('mainprice')
                            actualprice.style.textDecoration = 'line-through';
                            maindiv.appendChild(discountedPrice)
                            subtotal+=book.discountedPrice*cart[i].quantity
                        }
                        else{
                            subtotal+=book.price*cart[i].quantity
                        }
                        document.getElementById('MP').textContent=`${subtotal.toFixed(2)}$`

                    }
                }
                else {
                    document.getElementById('summary').style.display = 'none';
                    document.getElementById('header').style.display = 'none';
                    container.innerHTML = `
                 <div class="no-items-found" style="text-align: center; padding: 2rem; width: 100%;">
                     <div style="max-width: 400px; margin: 0 auto;">
                         <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#A8C69F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                             <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                             <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                             <path d="M10 2v20"></path>
                             <path d="M2 12h4"></path>
                             <path d="M2 7h4"></path>
                             <path d="M2 17h4"></path>
                             <circle cx="16" cy="12" r="3" fill="#A8C69F" opacity="0.2" stroke="#A8C69F"></circle>
                             <line x1="16" y1="9" x2="16" y2="15" stroke="#fff" strokeWidth="1.5"></line>
                             <line x1="13" y1="12" x2="19" y2="12" stroke="#fff" strokeWidth="1.5"></line>
                         </svg>
                         <h3 style="font-family: var(--font-heading); margin: 1.5rem 0 0.5rem; color: var(--text-color);">No Cart Items Found</h3>
                         <p style="color: var(--text-light); margin-bottom: 1.5rem;">Your cart is currently empty. Please add some books to the cart.</p>
                         <a href="https://localhost:7048/catalog.html" style="display: inline-block;">
                             <button style="background-color: var(--primary-color); color: white; border: none; padding: 12px 24px; border-radius: 30px; font-weight: 500; font-family: var(--font-body); font-size: 0.95rem; transition: all 0.3s ease; box-shadow: 0 4px 10px var(--shadow-color); cursor: pointer;">
                                 Go to Catalogue
                             </button>
                         </a>
                     </div>
                 </div>
             `;
                }

                const quantityBtns = document.querySelectorAll('.quantity-btn');
                quantityBtns.forEach(btn => {
                    btn.addEventListener('click', function () {
                        const input = this.parentElement.querySelector('.quantity-input');
                        const value = Number.parseInt(input.value);
                        if (this.classList.contains('minus')) {
                            if (value > 1) {
                                input.value = value - 1;
                            }
                        } else if (this.classList.contains('plus')) {
                            input.value = value + 1;
                        }
                    });
                });

                const removeBtns = document.querySelectorAll('.remove-item');
                removeBtns.forEach(btn => {
                    btn.addEventListener('click', function () {
                        const cartItem = this.closest('.cart-item');
                        cartItem.style.animation = 'fadeOut 0.3s ease';

                        setTimeout(() => {
                            cartItem.remove();
                        }, 300);
                    });
                });
            });
        }
        else {
            Swal.fire({
                title: "OOPS",
                text: "Please login to access items in your cart",
                icon: "error"
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                    window.location.href = "Login.html";
                }
            });
        }

        document.getElementById('checkout').addEventListener('click', function () {
            Swal.fire({
                title: 'Placing your order...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            checkForDiscount();

            fetch('https://localhost:7048/api/Order/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata)
            })
                .then(response => {
                    if (!response.ok) {
                            return response.json().then(err => {
                                throw err.message;
                            });
                        }
                    return response.json();
                })
                .then(data => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Order placed successfully!',
                        text: 'Thank you for your purchase.',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    var cart = getUserCart(user_id) || [];
                    cart = []
                    saveUserCart(user_id, cart);
                    console.log(cart)

                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops!',
                        text: error.split(':')[1],
                    });
                    console.error("Order error:", error.split(':')[1]);
                });
        });