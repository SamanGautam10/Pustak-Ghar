
        document.addEventListener('DOMContentLoaded', function () {
            var profileForm = document.getElementById('profileForm');
            var notification = document.getElementById('notification');

            profileForm.addEventListener('submit', function (e) {
                e.preventDefault();

                var userId = sessionStorage.getItem('UserID');
                var jwt = sessionStorage.getItem('jwtToken');

                if (!userId || !jwt) {
                    alert('You must be logged in.');
                    return;
                }

                var payload = {
                    email: document.getElementById('email').value,
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    phoneNumber: document.getElementById('phone').value,
                    gender: document.getElementById('gender').value,
                    address: document.getElementById('address').value
                };

                fetch('https://localhost:7048/account/update-profile/' + userId, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + jwt,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                    .then(function (response) {
                        return response.json().then(function (data) {
                            return { ok: response.ok, body: data };
                        });
                    })
                    .then(function (result) {
                        if (!result.ok) {
                            showNotification(result.body.message || 'Profile update failed.');
                            return;
                        }

                        // Update profile display
                        document.getElementById('userEmail').textContent = payload.email;
                        document.getElementById('userFirstName').textContent = payload.firstName;
                        document.getElementById('userLastName').textContent = payload.lastName;
                        document.getElementById('userPhone').textContent = payload.phoneNumber;
                        document.getElementById('userGender').textContent = payload.gender;
                        document.getElementById('userAddress').textContent = payload.address;
                        document.querySelector('.profile-name h3').textContent = payload.firstName + ' ' + payload.lastName;

                        showNotification('Profile updated successfully!');
                    })
                    .catch(function (error) {
                        console.error('Error updating profile:', error);
                        showNotification('Something went wrong while updating.');
                    });

                function showNotification(message) {
                    notification.textContent = message;
                    notification.style.transform = 'translateY(0)';
                    notification.style.opacity = '1';

                    setTimeout(function () {
                        notification.style.transform = 'translateY(20px)';
                        notification.style.opacity = '0';
                    }, 3000);
                }
            });
        });

        document.addEventListener('DOMContentLoaded', function () {
            // Elements
            const editProfileBtn = document.getElementById('editProfileBtn');
            const changePasswordBtn = document.getElementById('changePasswordBtn');
            const editDialog = document.getElementById('editDialog');
            const passwordDialog = document.getElementById('passwordDialog');
            const closeDialog = document.getElementById('closeDialog');
            const closePasswordDialog = document.getElementById('closePasswordDialog');
            const cancelEdit = document.getElementById('cancelEdit');
            const cancelPassword = document.getElementById('cancelPassword');
            const profileForm = document.getElementById('profileForm');
            const passwordForm = document.getElementById('passwordForm');
            const logoutBtn = document.querySelector('.logout-btn');
            const notification = document.getElementById('notification');

            // Show edit dialog
            editProfileBtn.addEventListener('click', function () {
                editDialog.classList.add('active');
            });

            // Show password dialog
            changePasswordBtn.addEventListener('click', function () {
                passwordDialog.classList.add('active');
            });

            // Close edit dialog
            function closeEditDialog() {
                editDialog.classList.remove('active');
            }

            // Close password dialog
            function closePasswordDialogFunc() {
                passwordDialog.classList.remove('active');
            }

            closeDialog.addEventListener('click', closeEditDialog);
            cancelEdit.addEventListener('click', closeEditDialog);
            closePasswordDialog.addEventListener('click', closePasswordDialogFunc);
            cancelPassword.addEventListener('click', closePasswordDialogFunc);

            // Close dialog when clicking outside
            editDialog.addEventListener('click', function (e) {
                if (e.target === editDialog) {
                    closeEditDialog();
                }
            });

            passwordDialog.addEventListener('click', function (e) {
                if (e.target === passwordDialog) {
                    closePasswordDialogFunc();
                }
            });


            profileForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const email = document.getElementById('email').value;
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const phone = document.getElementById('phone').value;
                const gender = document.getElementById('gender').value;
                const address = document.getElementById('address').value;

                document.getElementById('userEmail').textContent = email;
                document.getElementById('userFirstName').textContent = firstName;
                document.getElementById('userLastName').textContent = lastName;
                document.getElementById('userPhone').textContent = phone;
                document.getElementById('userGender').textContent = gender;
                document.getElementById('userAddress').textContent = address;

                document.querySelector('.profile-name h3').textContent = firstName + ' ' + lastName;

                closeEditDialog();
                showNotification('Profile updated successfully!');
            });
            passwordForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const userId = sessionStorage.getItem('UserID');
                const jwt = sessionStorage.getItem('jwtToken');

                const currentPassword = document.getElementById('currentPassword').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (newPassword !== confirmPassword) {
                    showNotification('New passwords do not match!');
                    return;
                }

                const payload = {
                    userId: userId,
                    oldPassword: currentPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword,

                };

                fetch('https://localhost:7048/account/change-password', {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + jwt,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                    .then(function (response) {
                        return response.json().then(function (data) {
                            return { ok: response.ok, body: data };
                        });
                    })
                    .then(function (result) {
                        if (!result.ok) {
                            showNotification(result.body.message || 'Password change failed.');
                            return;
                        }


                        document.getElementById('currentPassword').value = '';
                        document.getElementById('newPassword').value = '';
                        document.getElementById('confirmPassword').value = '';

                        closePasswordDialogFunc();
                        showNotification('Password changed successfully!');
                    })
                    .catch(function (error) {
                        console.error('Error changing password:', error);
                        showNotification('Something went wrong.');
                    });
            });


            logoutBtn.addEventListener('click', function () {
                sessionStorage.removeItem('UserID');
                sessionStorage.removeItem('jwtToken');
                showNotification('Logged out successfully!');

                setTimeout(function () {
                    window.location.href = 'Login.html';
                }, 1500);
            });


            function showNotification(message) {
                notification.textContent = message;
                notification.style.transform = 'translateY(0)';
                notification.style.opacity = '1';

                setTimeout(function () {
                    notification.style.transform = 'translateY(20px)';
                    notification.style.opacity = '0';
                }, 3000);
            }
        });
    