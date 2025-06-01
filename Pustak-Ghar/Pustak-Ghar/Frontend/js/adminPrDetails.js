
        const queryurl = window.location.search
        const editBookModalOverlay = document.getElementById("edit-book-modal-overlay")
        const closeEditModalBtn = document.getElementById("close-edit-modal")
        const cancelEditBtn = document.getElementById("cancel-edit-btn")
        const saveEditBtn = document.getElementById("save-edit-btn")
        const timedSaleModalOverlay = document.getElementById("timed-sale-modal-overlay")
        const closeTimedSaleModalBtn = document.getElementById("close-timed-sale-modal")
        const cancelTimedSaleBtn = document.getElementById("cancel-timed-sale-btn")
        const saveTimedSaleBtn = document.getElementById("save-timed-sale-btn")
        function setupEventListeners() {
            document.addEventListener("click", (e) => {
                if (e.target && e.target.id === "edit-product-btn") {
                    populateEditForm()
                    editBookModalOverlay.classList.add("active")
                }
                if (e.target && e.target.id === "timed-sale-btn") {
                    const defaultEndDate = new Date()
                    defaultEndDate.setDate(defaultEndDate.getDate() + 7)

                    // Format date as YYYY-MM-DD for input field
                    const formattedDate = defaultEndDate.toISOString().split("T")[0]
                    document.getElementById("sale-end-date").value = formattedDate

                    timedSaleModalOverlay.classList.add("active")
                }
            })
            // Close Edit Book Modal  
            closeEditModalBtn.addEventListener("click", () => {
                editBookModalOverlay.classList.remove("active")
            })
            // Close Edit Book Modal via cancel btn
            cancelEditBtn.addEventListener("click", () => {
                editBookModalOverlay.classList.remove("active")
            })

            // Save Edit Book
            saveEditBtn.addEventListener("click", (e) => {
                e.preventDefault()
                const updatedBook = {
                    id: document.getElementById("edit-book-id").value,
                    description: document.getElementById("edit-book-desc").value,
                    title: document.getElementById("edit-book-title").value,
                    isbn: document.getElementById("edit-book-isbn").value,
                    author: document.getElementById("edit-book-author").value,
                    publisher: document.getElementById("edit-book-publisher").value,
                    genre: document.getElementById("edit-book-genre").value,
                    price: Number.parseFloat(document.getElementById("edit-book-price").value),
                    publicationDate: document.getElementById("edit-book-publication-date").value,
                    format: document.getElementById("edit-book-format").value,
                    language: document.getElementById("edit-book-language").value,
                    is_awardwinning: document.getElementById("edit-is-award-winning").checked,
                }
                fetch(`https://localhost:7048/Book/update-book/${updatedBook.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedBook)
                })
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        console.log(data)
                        showNotification("Updated Sucessfully", "success");

                    })
                    .catch(error => {
                        showNotification(error.message, "error");
                        console.error("Error from backend:", error.message);
                    });
                editBookModalOverlay.classList.remove("active")
            })

            // Close Timed Sale Modal
            closeTimedSaleModalBtn.addEventListener("click", () => {
                timedSaleModalOverlay.classList.remove("active")
            })
            // Cancel Timed Sale
            cancelTimedSaleBtn.addEventListener("click", () => {
                timedSaleModalOverlay.classList.remove("active")
            })

            saveTimedSaleBtn.addEventListener("click", (e) => {
                e.preventDefault()
                const bookID = queryurl.split("=")[1]
                const discount = Number.parseFloat(document.getElementById("sale-discount").value)
                const endDate = new Date(document.getElementById("sale-end-date").value)
                if (discount < 0 || discount > 100) {
                    showNotification("Discount must be between 0 and 100", "error")
                    return
                }
                const saleData = {
                    discountPercent: discount,
                    discountEndDate: endDate.toISOString(),
                }
                console.log(JSON.stringify(saleData))
                fetch(`https://localhost:7048/Book/update-discount/${bookID}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(saleData)
                })
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        timedSaleModalOverlay.classList.remove("active")
                        showNotification("Timed sale added successfully!", "success")
                        setTimeout(() => {
                            window.location.reload();
                        }, 700);

                    })

            })
        }
        // function to get the data from the url
        document.addEventListener("DOMContentLoaded", () => {
            if (queryurl) {
                const bookID = queryurl.split("=")[1]
                fetch(`https://localhost:7048/Book/${bookID}`)
                    .then((response) => {
                        return response.json()
                    })
                    .then((data) => {
                        updateBookDisplay(data)
                        populateEditForm(data)
                        setupEventListeners()
                    })
                    .catch((error) => {
                        console.error("Error fetching book data:", error)
                        showNotification("Failed to load book data", "error")
                    })
            }
            else {
                window.location.href = 'home.html'
            }
        })
        // Function to populate the edit form with book data
        function populateEditForm() {
            const bookID = queryurl.split("=")[1]
            fetch(`https://localhost:7048/Book/${bookID}`)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    document.getElementById("edit-book-id").value = data.bookId
                    document.getElementById("edit-book-desc").value = data.description
                    document.getElementById("edit-book-title").value = data.title
                    document.getElementById("edit-book-isbn").value = data.isbn
                    document.getElementById("edit-book-author").value = data.author
                    document.getElementById("edit-book-publisher").value = data.publisher
                    document.getElementById("edit-book-genre").value = data.genre
                    document.getElementById("edit-book-price").value = data.price
                    document.getElementById("edit-book-stock").value = data.stockCount
                    // Format date for input field (YYYY-MM-DD)
                    const pubDate = new Date(data.publicationDate)
                    const formattedDate = pubDate.toISOString().split("T")[0]
                    document.getElementById("edit-book-publication-date").value = formattedDate

                    document.getElementById("edit-book-format").value = data.format
                    document.getElementById("edit-book-language").value = data.language
                    document.getElementById("edit-is-award-winning").checked = data.is_awardwinning
                })
                .catch((error) => {
                    console.error("Error fetching book data:", error)
                    showNotification("Failed to load book data", "error")
                })
        }
        //update book with a bookdataparameter...
        function updateBookDisplay(bookData) {
            const container = document.getElementById("product-container")
            const date = new Date(bookData.publicationDate)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const formattedTime = `${year}/${month < 10 ? "0" : ""}${month}/${day < 10 ? "0" : ""}${day}`
            const row = `
    <div class="product-details">
        <div class="product-image-container">
            <img src="${bookData.imageurl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop"}"
                 alt="${bookData.title}" class="product-image">
            <div class="product-badges" id="badges">
                <!-- Dynamic data here  --!>
            </div>
        </div>

        <div class="product-info">
            <div class="product-info-header">
                <h1 class="product-info-title">${bookData.title}</h1>
                <p class="product-info-author">by ${bookData.author}</p>
                <div class="product-info-price">
                    ${bookData.discountPercent > 0
                    ? `
                    <span class="current-price">$${bookData.discountedPrice}</span>
                    <span class="original-price">$${bookData.price}.00</span>
                    <span class="discount-badge">${bookData.discountPercent}% Off</span> 
                        `
                    : `
                         <span class="current-price">$${bookData.price}.00</span>
                        `
                }
                </div>
                <div class="product-actions">
                    <button id="edit-product-btn" class="edit-product-btn">
                        Edit Book
                    </button>
                    <button id="timed-sale-btn" class="timed-sale-btn">
                        Add Timed Sale
                    </button>
                </div>
            </div>

            <div class="product-info-content">
                <div class="product-info-section">
                    <h3>Book Details</h3>
                    <ul class="product-info-list">
                        <li>
                            <span class="label">ISBN:</span>
                            <span class="value">${bookData.isbn}</span>
                        </li>
                        <li>
                            <span class="label">Publisher:</span>
                            <span class="value">${bookData.publisher}</span>
                        </li>
                        <li>
                            <span class="label">Publication Date:&nbsp;</span>
                            <span class="value">${formattedTime}</span>
                        </li>
                        <li>
                            <span class="label">Language: </span>
                            <span class="value">${bookData.language}</span>
                        </li>
                        <li>
                            <span class="label">Format:</span>
                            <span class="value">${bookData.format}</span>
                        </li>
                        <li>
                            <span class="label">Genre:</span>
                            <span class="value">${bookData.genre || bookData.format}</span>
                        </li>
                    </ul>
                </div>

                <div class="product-info-section">
                    <h3>Inventory</h3>
                    <ul class="product-info-list">
                        <li>
                            <span class="label">Stock Count:</span>
                            <span class="value">${bookData.stockCount}</span>
                        </li>
                        <li>
                            <span class="label">Sold Count:</span>
                            <span class="value">${bookData.soldCount}</span>
                        </li>
                        <li>
                            <span class="label">Status:</span>
                            <span class="value">${bookData.stockCount > 0 ? "In Stock" : "Out of Stock"}</span>
                        </li>
                        <li>
                            <span class="label">On Sale:</span>
                            <span class="value">${bookData.discountPercent > 0 ? "Yes" : "No"}</span>
                        </li>
                        ${bookData.discountPercent > 0
                    ? `<li>
                            <span class="label">Discount:</span>
                            <span class="value">${bookData.discountPercent}%</span>
                        </li>`
                    : ""
                }
                        <li>
                            <span class="label">Award Winner:</span>
                            <span class="value">${bookData.is_awardwinning == true ? "Yes" : "No"}</span>
                        </li>
                    </ul>
                </div>

                <div class="product-description">
                    <h3>Description</h3>
                    <p>
                        ${bookData.description || "No description available."}
                    </p>
                </div>
            </div>
        </div>
    </div>
    `

            container.innerHTML = row

            const badgecontainer = document.getElementById("badges")
            let badgesHTML = ""
            if (bookData.discountPercent > 0) {
                badgesHTML += `<span class="product-badge on-sale">On Sale</span>`
            }
            if (bookData.stockCount > 0) {
                badgesHTML += `<span class="product-badge in-stock">In Stock</span>`
            }
            if (bookData.is_awardwinning) {
                badgesHTML += `<span class="product-badge award">Award Winner</span>`
            }
            badgecontainer.innerHTML = badgesHTML
        }

        function showNotification(message, type = "success") {
            const notification = document.createElement("div")
            notification.className = `notification ${type}`
            notification.textContent = message
            document.body.appendChild(notification)
            setTimeout(() => {
                notification.classList.add("show")
            }, 10)
            setTimeout(() => {
                notification.classList.remove("show")
                setTimeout(() => {
                    document.body.removeChild(notification)
                }, 300)
            }, 3000)
        }
    