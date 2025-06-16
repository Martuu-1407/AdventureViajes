// Mobile menu functionality
function MobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileMenuOverlay');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileNav && overlay && toggle) {
        const isOpen = mobileNav.classList.contains('mobile-nav-open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
}

function openMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileMenuOverlay');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileNav && overlay && toggle) {
        mobileNav.classList.add('mobile-nav-open');
        overlay.classList.add('active');
        overlay.style.display = 'block';
        toggle.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add escape key listener
        document.addEventListener('keydown', handleEscapeKey);
    }
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileMenuOverlay');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileNav && overlay && toggle) {
        mobileNav.classList.remove('mobile-nav-open');
        overlay.classList.remove('active');
        toggle.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Remove escape key listener
        document.removeEventListener('keydown', handleEscapeKey);
        
        // Hide overlay after animation
        setTimeout(() => {
            if (!overlay.classList.contains('active')) {
                overlay.style.display = 'none';
            }
        }, 300);
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
}

// Search functionality
function handleSearch() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departure = document.getElementById('departure').value;
    const returnDate = document.getElementById('return').value;
    const passengers = document.getElementById('passengers').value;
    
    // Validate form
    if (!origin || !destination || !departure) {
        alert('Por favor completa todos los campos obligatorios (Origen, Destino, Fecha de ida)');
        return;
    }
    
    // Create search object
    const searchData = {
        origin,
        destination,
        departure,
        return: returnDate,
        passengers
    };
    
    console.log('Búsqueda realizada:', searchData);
    
    // Show search results (simulate)
    showSearchResults(searchData);
}

// Destination selection
function selectDestination(cityName) {
    const destinationInput = document.getElementById('destinion');
    if (destinationInput) {
        destinationInput.value = cityName;
        
        // Add visual feedback
        const cards = document.querySelectorAll('.destination-card, .enhanced-destination-card');
        cards.forEach(card => {
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
        
        // Scroll to search form
        setTimeout(() => {
            const searchForm = document.querySelector('.search-form');
            if (searchForm) {
                searchForm.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);
        
        // Highlight the destination input
        setTimeout(() => {
            destinationInput.focus();
            destinationInput.style.borderColor = '#10b981';
            setTimeout(() => {
                destinationInput.style.borderColor = '';
            }, 2000);
        }, 500);
    }
}

// Show search results (simulation)
function showSearchResults(searchData) {
    // Create modal HTML
    const modalHTML = `
        <div class="search-results-modal" onclick="closeSearchResults(event)">
            <div class="search-results-content" onclick="event.stopPropagation()">
                <h2>¡Búsqueda Realizada!</h2>
                <div class="search-results-details">
                    <p><strong>Origen:</strong> ${searchData.origin}</p>
                    <p><strong>Destino:</strong> ${searchData.destination}</p>
                    <p><strong>Fecha de ida:</strong> ${searchData.departure}</p>
                    ${searchData.return ? `<p><strong>Fecha de vuelta:</strong> ${searchData.return}</p>` : ''}
                    <p><strong>Pasajeros:</strong> ${searchData.passengers}</p>
                </div>
                <p class="search-results-message">
                    Estamos buscando los mejores vuelos para ti...
                </p>
                <button class="close-btn" onclick="closeSearchResults()">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close search results
function closeSearchResults(event) {
    // If event is passed and it's not clicking the overlay, return
    if (event && event.target.closest('.search-results-content')) {
        return;
    }
    
    const modal = document.querySelector('.search-results-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Currency change functionality
function changeCurrency() {
    const currencyBtn = document.querySelector('.currency-btn');
    const currencyDisplay = document.querySelector('.currency');
    const mobileCurrency = document.querySelector('.mobile-currency span');
    
    if (currencyBtn && currencyDisplay) {
        const currentText = currencyBtn.textContent;
        
        if (currentText.includes('USD')) {
            currencyBtn.textContent = 'Cambiar a AR$';
            currencyDisplay.textContent = 'USD';
            if (mobileCurrency) {
                mobileCurrency.textContent = 'Moneda: USD';
            }
            console.log('Currency changed to USD');
        } else {
            currencyBtn.textContent = 'Cambiar a USD';
            currencyDisplay.textContent = 'AR$';
            if (mobileCurrency) {
                mobileCurrency.textContent = 'Moneda: AR$';
            }
            console.log('Currency changed to AR$');
        }
    }
}

// Form enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const departureInput = document.getElementById('departure');
    const returnInput = document.getElementById('return');
    
    if (departureInput) {
        departureInput.min = today;
    }
    if (returnInput) {
        returnInput.min = today;
    }
    
    // Update return date minimum when departure changes
    if (departureInput && returnInput) {
        departureInput.addEventListener('change', function() {
            returnInput.min = this.value;
            if (returnInput.value && returnInput.value < this.value) {
                returnInput.value = '';
            }
        });
    }
    
    // Add smooth scrolling for navigation items
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
        item.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add loading animation to search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Buscando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        });
    }
    
    // Add currency change functionality
    const currencyBtn = document.querySelector('.currency-btn');
    if (currencyBtn) {
        currencyBtn.addEventListener('click', changeCurrency);
    }
    
    // Add hover effects to form inputs
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = '';
        });
    });
    
    // Add parallax effect to hero background (throttled for performance)
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // Add animation on scroll for destination cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Initially hide cards and observe them
    document.querySelectorAll('.destination-card, .enhanced-destination-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Add banner animation
    const banner = document.querySelector('.promotional-banner');
    if (banner) {
        observer.observe(banner);
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(50px)';
        banner.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileNav = document.getElementById('mobileNav');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (mobileNav && mobileNav.classList.contains('mobile-nav-open')) {
            if (!mobileNav.contains(e.target) && !toggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1023) {
            closeMobileMenu();
        }
    });
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        const form = e.target.closest('.search-form');
        if (form) {
            handleSearch();
        }
    }
});

// Add touch gestures for mobile menu
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 100;
    const diff = touchStartX - touchEndX;
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileNav && mobileNav.classList.contains('mobile-nav-open')) {
        // Swipe right to close menu
        if (diff < -swipeThreshold) {
            closeMobileMenu();
        }
    }
}

// Enhanced know more button functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('know-more-btn')) {
        e.stopPropagation();
        const card = e.target.closest('.enhanced-destination-card, .destination-card');
        const cityName = card.querySelector('h3').textContent;
        
        // Add click animation
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
        
        // Simulate navigation (you can replace this with actual navigation)
        console.log(`Navigating to ${cityName} details page`);
        alert(`Navegando a la página de detalles de ${cityName}`);
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth reveal animations for sections
const revealSections = debounce(function() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (sectionTop < windowHeight - revealPoint) {
            section.classList.add('revealed');
        }
    });
}, 10);

window.addEventListener('scroll', revealSections);

// Initialize reveal on load
document.addEventListener('DOMContentLoaded', revealSections);