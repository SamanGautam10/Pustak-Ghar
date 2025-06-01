
            document.addEventListener('DOMContentLoaded', () => {
                const registerForm = document.getElementById('register-form');
                const loginButton = document.getElementById('login-button');
                loginButton.addEventListener('click', function () {
                    window.location.href = 'login.html';
                });

                registerForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const text = document.getElementById('error');
                    const password = document.getElementById('password').value;
                    const formData = {
                        email: document.getElementById('email').value,
                        password: password,
                        firstName: document.getElementById('firstName').value,
                        lastName: document.getElementById('lastName').value,
                        phoneNumber: document.getElementById('phoneNumber').value,
                        gender: document.getElementById('gender').value,
                        address: document.getElementById('address').value,
                        userrole:"Member"
                    };
                    fetch('https://localhost:7048/Account/register', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    }) 
                        .then(response => {
                            return response.json()
                        })
                        .then(data => {
                            if (data.status == 'Success') {
                                text.textContent = data.message;
                                text.style.color = 'green';
                                setTimeout(() => {
                                    window.location.href = 'login.html';
                                }, 1000);
                            }
                            if (data.message && data.status =='Error') {
                                console.log(data)
                                text.textContent = data.message;
                                text.style.color = 'red';
                                setTimeout(() => {
                                    text.textContent = 'Please enter your details to register';
                                    text.style.color = '#666666';
                                }, 2000);
                            }
                            else if (Array.isArray(data.errors)) {
                                text.textContent = data.errors[0].description;
                                text.style.color = 'red';
                                window.errorTimeout = setTimeout(() => {
                                    text.textContent = 'Please enter your details to register';
                                    text.style.color = '#666666';
                                }, 2000);
                            }
                        })
                        .catch(error => {
                            console.error(error.message)
                        });
                });
            });
        