
        const accessToken = sessionStorage.getItem('jwtToken');
        if (accessToken !== null) {
            fetch('https://localhost:7048/api/User/current-user-id', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    sessionStorage.setItem('UserID', data.id);
                    user_id = sessionStorage.getItem('UserID')
                    console.log(user_id)
                    document.getElementById('user-fullname').textContent = 'Profile'
                    fetch(`https://localhost:7048/Account/profile/${user_id}`, {
                        method: 'GET'
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                            sessionStorage.setItem('UserRole', data.userRole);
                            if (data.userRole == "Member") {
                                console.log('hide!')
                                document.getElementById('admin').style.display = "none"
                            }
                        })
                })
        }
        else{
            document.getElementById('user-fullname').textContent = 'Login'
            document.getElementById('admin').style.display = 'none'
        }

        fetch('https://localhost:7048/Admin/unexpired-announcement')
        .then(response=>{
            return response.json()
        })
        .then(data=>{
             console.log(data.length)
             console.log(data)
             container=document.getElementById('sliderJS')
             container.innerHTML=``
            if(data.length==0){
                document.getElementById('auto-slider').style.display='none'
            }
            else
            {
                for(i=0;i<data.length;i++){
                    row=`<div class="slide"><img src="${data[i].imageUrl}"></div>`
                    container.innerHTML+=row
                    initialize()
                }
            }
        })
        .catch(error=>{
            console.log(error)
        })

        function logout() {
            const userId = sessionStorage.getItem("UserID");
            const jwt = sessionStorage.getItem("jwtToken");
            sessionStorage.removeItem("UserID");
            sessionStorage.removeItem("jwtToken");
            window.location.href = "/login.html";
        }
        
            // Image Slider JavaScript
            function initialize() {
                const sliderTrack = document.querySelector('.slider-track');
                const slides = document.querySelectorAll('.slide');
                const navButtons = document.querySelectorAll('.slider-nav-btn');
                const prevButton = document.querySelector('.slider-arrow.prev');
                const nextButton = document.querySelector('.slider-arrow.next');
                
                let currentIndex = 0;
                const slideCount = slides.length;
                let autoSlideInterval;
                
                // Function to update the slider position
                function updateSlider() {
                    sliderTrack.style.transform = `translateX(-${currentIndex * 25}%)`;
                    
                    // Update active nav button
                    navButtons.forEach((btn, index) => {
                        if (index === currentIndex) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }
                
                // Function to go to the next slide
                function nextSlide() {
                    currentIndex = (currentIndex + 1) % slideCount;
                    updateSlider();
                }
                
                // Function to go to the previous slide
                function prevSlide() {
                    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
                    updateSlider();
                }
                
                // Set up auto-sliding
                function startAutoSlide() {
                    autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
                }
                
                function resetAutoSlide() {
                    clearInterval(autoSlideInterval);
                    startAutoSlide();
                }
                
                // Event listeners for navigation buttons
                navButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        currentIndex = parseInt(this.getAttribute('data-index'));
                        updateSlider();
                        resetAutoSlide();
                    });
                });
                
                // Event listeners for arrow controls
                nextButton.addEventListener('click', function() {
                    nextSlide();
                    resetAutoSlide();
                });
                
                prevButton.addEventListener('click', function() {
                    prevSlide();
                    resetAutoSlide();
                });
                
                // Touch events for mobile swipe
                let touchStartX = 0;
                let touchEndX = 0;
                
                const sliderContainer = document.querySelector('.slider-container');
                
                sliderContainer.addEventListener('touchstart', function(e) {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });
                
                sliderContainer.addEventListener('touchend', function(e) {
                    touchEndX = e.changedTouches[0].screenX;
                    handleSwipe();
                    resetAutoSlide();
                }, { passive: true });
                
                function handleSwipe() {
                    const swipeThreshold = 50; 
                    if (touchEndX < touchStartX - swipeThreshold) {
                        nextSlide();
                    } else if (touchEndX > touchStartX + swipeThreshold) {
                        prevSlide();
                    }
                }
                updateSlider();
                startAutoSlide();
                sliderContainer.addEventListener('mouseenter', function() {
                    clearInterval(autoSlideInterval);
                });
                
                sliderContainer.addEventListener('mouseleave', function() {
                    startAutoSlide();
                });
            };
        
   