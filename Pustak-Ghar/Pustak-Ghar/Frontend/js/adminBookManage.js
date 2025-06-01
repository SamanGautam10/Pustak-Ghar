document.addEventListener('DOMContentLoaded', function () {
    var table = document.getElementById('books-table-body')
    // Button elements
    const addBookBtn = document.getElementById('add-book-btn');
    const addannouncement = document.getElementById('add-announcement-btn');

    // Add Book Modal elements
    const addBookModalOverlay = document.getElementById('add-book-modal-overlay');
    const closeAddBookModalBtn = document.getElementById('close-add-book-modal');
    const cancelAddBookBtn = document.getElementById('cancel-add-book-btn');
    const saveAddBookBtn = document.getElementById('save-add-book-btn');
    const addBookForm = document.getElementById('add-book-form');

    // Delete Modal elements
    const deleteModalOverlay = document.getElementById('delete-modal-overlay');
    const closeDeleteModalBtn = document.getElementById('close-delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    // Edit Book Modal elements
    const editBookModalOverlay = document.getElementById('edit-book-modal-overlay');
    const closeEditBookModalBtn = document.getElementById('close-edit-book-modal');
    const cancelEditBookBtn = document.getElementById('cancel-edit-book-btn');
    const saveEditBookBtn = document.getElementById('save-edit-book-btn');
    const editBookForm = document.getElementById('edit-book-form');
    //announcement overlay
    const addannouncementOverlay = document.getElementById('add-announcement-modal-overlay');
    const closeAnnounecment = document.getElementById('close-add-announcement-modal');
    const saveAnnouncementAdd = document.getElementById('save-add-announcement-btn');
    const cancelAnnouncementAdd = document.getElementById('cancel-add-announcement-btn');
    //buttons for input 
    const AnnouncementFile = document.getElementById("AnnouncementFile")
    const Bannerfile = document.getElementById("Bannerfile")

    Bannerfile.addEventListener('click', () => {
        AnnouncementFile.click()
    })
    saveAnnouncementAdd.addEventListener('click', () => {
        const title = document.getElementById('add-announcement-title').value
        const date = document.getElementById('announcement-publication-date').value
        const announcementDescription = document.getElementById('announcement-description').value
        const filename = AnnouncementFile.files[0].name
        fileExtesion = filename.split('.')[1]
        if (fileExtesion == 'png' || fileExtesion == 'jpg' || fileExtesion == 'jpeg') {
            console.log('correct file type')
            const payload = new FormData();
            payload.append("Title", title);
            payload.append("Message", announcementDescription);
            payload.append("ExpireAt", new Date(date).toISOString()); 
            payload.append("Image", AnnouncementFile.files[0]);

            fetch('https://localhost:7048/Admin/create-announcement', {
                method: 'POST',
                body: payload, 
            })
                .then(response => {
                   return response.json()
                })
                .then(data => {
                    console.log(data)
                    addannouncementOverlay.classList.remove('active');
                    showNotification('Banner Creation SucessfUll','success')
                    setTimeout(() => {
                        window.location.reload()
                    }, 900);
                })
                .catch(error => {
                    console.error("Error from backend:", error);
                });
        }
        else {
            showNotification("incorrect file type only png , jpg , jpeg are allowed", "error");
        }
    })

    addannouncement.addEventListener('click', function () {
        console.log(addannouncementOverlay.classList)
        addannouncementOverlay.classList.add('active');
    });

    closeAnnounecment.addEventListener('click', function () {
        addannouncementOverlay.classList.remove('active');
    });

    cancelAnnouncementAdd.addEventListener('click', function () {
        addannouncementOverlay.classList.remove('active');
    });

    // Fetch all books
    function fetchBooks() {
        fetch('https://localhost:7048/Book/all-books', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
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
                console.log('Books data:', data.length);
                if (data.length > 0) {
                    table.innerHTML = '';
                    document.getElementById('results-number').textContent = data.length;
                    for (let i = 0; i < data.length; i++) {
                        const datavalue = data[i];
                        const formatText = datavalue.format || 'Unknown';
                        const inStockBadge = datavalue.isInStock ?
                            '<span class="status-badge in-stock">In Stock</span>' :
                            '<span class="status-badge out-of-stock">Out of Stock</span>';
                        const awardBadge = datavalue.is_awardwinning ?
                            '<span class="status-badge">Award Winner</span>' : '';
                        const newReleaseBadge = new Date(datavalue.publicationDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ?
                            '<span class="status-badge">New Release</span>' : '';
                        const onSaleBadge = datavalue.onSale ?
                            '<span class="status-badge on-sale">On Sale</span>' : '';
                        const originalPrice = datavalue.price;

                        const rows = `
                                    <tr>
                                        <td>
                                            <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop" alt="${datavalue.title}" class="book-image">
                                        </td>
                                        <td>
                                            <div class="book-title">${datavalue.title}</div>
                                            <div class="book-author">by ${datavalue.author}</div>
                                            <div class="book-publisher">${datavalue.publisher}</div>
                                        </td>
                                        <td>${datavalue.isbn}</td>
                                        <td class="book-price">$${originalPrice.toFixed(2)}</td>
                                        <td><span class="book-format">${formatText}</span></td>
                                        <td>${datavalue.stockCount}</td>
                                        <td>
                                            <div class="book-status">
                                                ${inStockBadge}
                                                ${awardBadge}
                                                ${newReleaseBadge}
                                                ${onSaleBadge}
                                            </div>
                                        </td>
                                        <td>
                                           <div class="action-buttons">
                                                <button class="view-btn" data-id="${datavalue.bookId}" onclick="window.location='https://localhost:7048/AdminProdcut.html?bookid=${datavalue.bookId}'">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                </button>
                                                <button class="edit-btn" data-id="${datavalue.bookId}">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button class="delete-btn" data-id="${datavalue.bookId}" >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>`;
                        table.innerHTML += rows;
                    }
                }
                if (data.hasbook == false) {
                    table.style.display = 'none'
                }
                if (data.hasbook == false) {
                    table.style.display = 'none';
                    const noBookFoundHTML = `
            <div class="no-books-found" style="text-align: center; padding: 3rem 1rem; background-color: var(--white); border-radius: var(--border-radius); box-shadow: 0 5px 15px var(--shadow-color);">
                <div style="max-width: 400px; margin: 0 auto;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#A8C69F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1.5rem;">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        <circle cx="12" cy="12" r="4" fill="#A8C69F" opacity="0.2"></circle>
                        <line x1="9" y1="9" x2="15" y2="15" stroke="#fff" stroke-width="1.5"></line>
                        <line x1="15" y1="9" x2="9" y2="15" stroke="#fff" stroke-width="1.5"></line>
                    </svg>
                    <h3 style="font-family: var(--font-heading); margin-bottom: 1rem; color: var(--text-color); font-size: 1.5rem;">No Books Found</h3>
                    <p style="color: var(--text-light); margin-bottom: 1.5rem;">There are currently no books in the database. Add your first book to get started.</p>
                    <button id="add-first-book-btn" style="background-color: var(--primary-color); color: white; border: none; padding: 12px 24px; border-radius: 30px; font-weight: 500; font-family: var(--font-body); font-size: 0.95rem; transition: all 0.3s ease; box-shadow: 0 4px 10px var(--shadow-color); cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Your First Book
                    </button>
                </div>
            </div>
        `;
                    document.getElementById('container').innerHTML = noBookFoundHTML;
                }
            })
            .catch(error => {
                showNotification(error.message, "error");
                console.error("Error from backend:", error.message);
            });
    }

    fetchBooks();
    document.getElementById('add-book-publication-date').valueAsDate = new Date();
    addBookBtn.addEventListener('click', function () {
        addBookForm.reset();
        document.getElementById('add-book-id').value = '';
        document.getElementById('add-book-publication-date').valueAsDate = new Date();
        document.getElementById('add-is-in-stock').checked = true;
        document.getElementById('add-is-on-sale').checked = false;
        document.getElementById('add-is-award-winning').checked = false;
        addBookModalOverlay.classList.add('active');
    });

    closeAddBookModalBtn.addEventListener('click', function () {
        addBookModalOverlay.classList.remove('active');
    });

    cancelAddBookBtn.addEventListener('click', function () {
        addBookModalOverlay.classList.remove('active');
    });
    saveAddBookBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!addBookForm.checkValidity()) {
            addBookForm.reportValidity();
            return;
        }
        const bookData = {
            title: document.getElementById('add-book-title').value,
            isbn: document.getElementById('add-book-isbn').value,
            description: document.getElementById('add-book-description').value,
            author: document.getElementById('add-book-author').value,
            publisher: document.getElementById('add-book-publisher').value,
            genre: document.getElementById('add-book-genre').value,
            price: parseFloat(document.getElementById('add-book-price').value),
            publicationDate: document.getElementById('add-book-publication-date').value,
            isInStock: document.getElementById('add-is-in-stock').checked,
            soldCount: parseInt(document.getElementById('add-book-sold').value),
            onSale: document.getElementById('add-is-on-sale').checked,
            discountPercent: parseFloat(document.getElementById('add-book-discount').value),
            stockCount: parseInt(document.getElementById('add-book-stock').value),
            is_awardwinning: document.getElementById('add-is-award-winning').checked,
            format: document.getElementById('add-book-format').value,
            language: document.getElementById('add-book-language').value
        };
        fetch('https://localhost:7048/book/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
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
                console.log('Book added:', data);
                showNotification('Book added successfully!', 'success');
                addBookModalOverlay.classList.remove('active');
            })
            .catch(error => {
                showNotification(error.message, "error");
                console.error("Error from backend:", error.message);
            });
    });

    document.getElementById('books-table-body').addEventListener('click', function (e) {
        if (e.target.closest('.edit-btn')) {
            const button = e.target.closest('.edit-btn');
            const bookId = button.getAttribute('data-id');
            document.getElementById('edit-book-id').value = bookId;
            fetch(`https://localhost:7048/Book/${bookId}`)
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            console.log("Raw response text:", err);
                            throw new Error(err.message);
                        });
                    }
                    return response.json();
                })
                .then(bookData => {
                    const genreMap = {
                        "Fiction": "0",
                        "Romance": "1",
                        "Mystery": "2",
                        "Biography": "3",
                        "History": "4",
                        "Horror": "5",
                        "Children": "6"
                    };

                    const formatMap = {
                        "Paperback": "0",
                        "Hardcover": "1",
                        "Signed": "2",
                        "Limited": "3",
                        "First": "4"
                    };


                    const languageMap = {
                        "English": "0",
                        "Spanish": "1",
                        "French": "2",
                        "German": "3",
                        "Chinese": "4"
                    };

                    const genreName = bookData.genre || "";
                    const genreValue = genreMap[genreName];

                    console.log(bookData)
                    document.getElementById('edit-book-title').value = bookData.title;
                    document.getElementById('edit-book-isbn').value = bookData.isbn;
                    document.getElementById('edit-book-description').value = bookData.description;
                    document.getElementById('edit-book-author').value = bookData.author;
                    document.getElementById('edit-book-publisher').value = bookData.publisher;
                    document.getElementById('edit-book-genre').value = genreValue;
                    document.getElementById('edit-book-price').value = bookData.price;
                    document.getElementById('edit-book-publication-date').value = bookData.publicationDate.split('T')[0];
                    document.getElementById('edit-book-stock').value = bookData.stockCount;
                    document.getElementById('edit-book-sold').value = bookData.soldCount;
                    document.getElementById('edit-book-discount').value = bookData.discountPercent;
                    document.getElementById('edit-book-format').value = formatMap[bookData.format] || "";
                    document.getElementById('edit-book-language').value = languageMap[bookData.language] || "";
                    document.getElementById('edit-is-in-stock').checked = bookData.isInStock;
                    document.getElementById('edit-is-on-sale').checked = bookData.onSale;
                    document.getElementById('edit-is-award-winning').checked = bookData.is_awardwinning;
                    editBookModalOverlay.classList.add('active');
                })
                .catch(error => {
                    showNotification(error.message, "error");
                    console.error("Error from backend:", error.message);
                });
        }

        if (e.target.closest('.delete-btn')) {
            const button = e.target.closest('.delete-btn');
            const bookId = button.getAttribute('data-id');
            confirmDeleteBtn.setAttribute('data-id', bookId);
            deleteModalOverlay.classList.add('active');
        }
    });

    closeEditBookModalBtn.addEventListener('click', function () {
        editBookModalOverlay.classList.remove('active');
    });

    cancelEditBookBtn.addEventListener('click', function () {
        editBookModalOverlay.classList.remove('active');
    });

    saveEditBookBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!editBookForm.checkValidity()) {
            editBookForm.reportValidity();
            return;
        }

        const bookData = {
            bookId: document.getElementById('edit-book-id').value,
            title: document.getElementById('edit-book-title').value,
            isbn: document.getElementById('edit-book-isbn').value,
            description: document.getElementById('edit-book-description').value,
            author: document.getElementById('edit-book-author').value,
            publisher: document.getElementById('edit-book-publisher').value,
            genre: document.getElementById('edit-book-genre').value,
            price: parseFloat(document.getElementById('edit-book-price').value),
            publicationDate: document.getElementById('edit-book-publication-date').value,
            isInStock: document.getElementById('edit-is-in-stock').checked,
            soldCount: parseInt(document.getElementById('edit-book-sold').value),
            onSale: document.getElementById('edit-is-on-sale').checked,
            discountPercent: parseFloat(document.getElementById('edit-book-discount').value),
            stockCount: parseInt(document.getElementById('edit-book-stock').value),
            is_awardwinning: document.getElementById('edit-is-award-winning').checked,
            format: document.getElementById('edit-book-format').value,
            language: document.getElementById('edit-book-language').value
        };

        fetch(`https://localhost:7048/Book/update-book/${bookData.bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        })
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Failed to update book");
                }

                // Success: proceed
                showNotification('Book updated successfully!', 'success');
                editBookModalOverlay.classList.remove('active');
                fetchBooks();
            })
            .catch(error => {
                showNotification(error.message, "error");
                console.error("Error from backend:", error.message);
            });

    });

    // Close Delete Modal
    closeDeleteModalBtn.addEventListener('click', function () {
        deleteModalOverlay.classList.remove('active');
    });

    cancelDeleteBtn.addEventListener('click', function () {
        deleteModalOverlay.classList.remove('active');
    });

    // Confirm Delete
    confirmDeleteBtn.addEventListener('click', function () {
        const bookId = this.getAttribute('data-id');

        fetch(`https://localhost:7048/Book/${bookId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Delete failed');
                }
                showNotification('Book deleted successfully!', 'success');
                deleteModalOverlay.classList.remove('active');
                fetchBooks();
            })
            .catch(error => {
                console.error(error.message);
                showNotification(error.message);
            });
    });

    // Pagination
    const pageButtons = document.querySelectorAll('.page-btn');

    pageButtons.forEach(button => {
        if (!button.classList.contains('next')) {
            button.addEventListener('click', function () {
                pageButtons.forEach(btn => {
                    if (!btn.classList.contains('next')) {
                        btn.classList.remove('active');
                    }
                });
                this.classList.add('active');
            });
        }
    });


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
});
