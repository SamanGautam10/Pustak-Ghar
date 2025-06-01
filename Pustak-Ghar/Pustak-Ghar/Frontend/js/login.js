
        document.addEventListener('DOMContentLoaded', function () {
            const loginForm = document.getElementById('login-form');
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                fetch('https://localhost:7048/login', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                })
                    .then(response => {
                        if (response.status == 401) {
                            const error = document.getElementById('error');
                            error.textContent = 'Invalid Email Password';
                            error.style.color = 'red';
                            setTimeout(() => {
                                error.textContent = "Please enter your details to sign in";
                                error.style.color = '#666666';
                            }, 3000);
                        }
                        else { return response.json() }

                    })
                    .then(data => {
                        if (data && data.accessToken) {
                            sessionStorage.setItem('jwtToken', data.accessToken);
                            const storedToken = sessionStorage.getItem('jwtToken');
                            if (storedToken) {
                                window.location = 'https://localhost:7048/Home.html';
                            }
                            else {
                                console.error("Failed to save JWT or User ID before redirecting.");
                            }
                        }
                    })

                    .catch(error => {
                        console.error('Login failed:', error);
                        showNotification('Login failed. Please try again.');
                    });
            });

            const signupButton = document.getElementById('signup-button');
            signupButton.addEventListener('click', function () {
                window.location.href = 'register.html';
            });

            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('focus', function () {
                    this.parentElement.style.transform = 'translateX(5px)';
                    setTimeout(() => {
                        this.parentElement.style.transform = 'translateX(0)';
                    }, 300);
                });
            });

            function showNotification(message) {
                let notification = document.querySelector('.notification');

                if (!notification) {
                    notification = document.createElement('div');
                    notification.className = 'notification';
                    document.body.appendChild(notification);
                }

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
    