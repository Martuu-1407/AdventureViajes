// Destination data
const destinations = {
    'Madrid': {
        name: 'Madrid',
        title: 'Vuelos baratos a Madrid',
        price: '$1.044.962',
        priceUSD: '$2,610',
        background: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop',
        savings: '261.240'
    },
    'Rio De Janeiro': {
        name: 'Rio De Janeiro',
        title: 'Vuelos baratos a Rio De Janeiro',
        price: '$235.200',
        priceUSD: '$588',
        background: 'https://images.pexels.com/photos/351283/pexels-photo-351283.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop',
        savings: '58.800'
    },
    'Miami': {
        name: 'Miami',
        title: 'Vuelos baratos a Miami',
        price: '$807.600',
        priceUSD: '$2,019',
        background: 'https://images.pexels.com/photos/210307/pexels-photo-210307.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop',
        savings: '201.900'
    }
};

let currentDestination = 'Madrid';
let isUSDMode = false;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Get destination from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('destino') || 'Madrid';
    currentDestination = destination;
    
    loadDestinationData(destination);
    createInteractiveBarChart();
    initializeEventListeners();
});

// Load destination specific data
function loadDestinationData(destination) {
    const data = destinations[destination];
    if (!data) return;
    
    document.getElementById('destinationName').textContent = data.name;
    document.getElementById('destinationTitle').textContent = data.title;
    document.getElementById('destinationPrice').textContent = data.price;
    document.getElementById('destinationBackground').style.backgroundImage = `url(${data.background})`;
    
    // Update page title
    document.title = `${data.name} - Adventure Viajes`;
    
    // Update savings amount
    const savingsAmount = document.querySelector('.savings-amount .amount');
    if (savingsAmount) {
        savingsAmount.textContent = data.savings;
    }
}

// Create interactive bar chart
function createInteractiveBarChart() {
    const canvas = document.getElementById('priceChart');
    const ctx = canvas.getContext('2d');
    
    // Chart data
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const prices = [280, 320, 350, 290, 240, 260, 380, 420, 340, 300, 280, 360];
    const bestPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Bar dimensions
    const barWidth = chartWidth / months.length * 0.7;
    const barSpacing = chartWidth / months.length * 0.3;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Store bar positions for interactivity
    const barPositions = [];
    
    // Draw bars
    prices.forEach((price, index) => {
        const x = padding + (chartWidth / months.length) * index + barSpacing / 2;
        const barHeight = ((price - 200) / (500 - 200)) * chartHeight;
        const y = padding + chartHeight - barHeight;
        
        // Store position for hover detection
        barPositions.push({
            x: x,
            y: y,
            width: barWidth,
            height: barHeight,
            price: price,
            month: months[index],
            isBest: price === bestPrice
        });
        
        // Bar color - highlight best price
        if (price === bestPrice) {
            ctx.fillStyle = '#EF4545';
        } else {
            ctx.fillStyle = '#00B2FF';
        }
        
        // Draw bar with rounded top
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();
        
        // Add subtle shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
    });
    
    // Draw month labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    
    months.forEach((month, index) => {
        const x = padding + (chartWidth / months.length) * index + (chartWidth / months.length) / 2;
        ctx.fillText(month, x, height - 20);
    });
    
    // Draw price labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const price = 200 + (300 / 5) * (5 - i);
        const y = padding + (chartHeight / 5) * i + 5;
        ctx.fillText(`$${Math.round(price)}K`, padding - 10, y);
    }
    
    // Add interactivity
    let hoveredBar = null;
    let tooltip = null;
    
    // Mouse move handler
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Check if mouse is over any bar
        let foundBar = null;
        barPositions.forEach(bar => {
            if (mouseX >= bar.x && mouseX <= bar.x + bar.width &&
                mouseY >= bar.y && mouseY <= bar.y + bar.height) {
                foundBar = bar;
            }
        });
        
        if (foundBar !== hoveredBar) {
            hoveredBar = foundBar;
            
            // Remove existing tooltip
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
            
            if (hoveredBar) {
                // Change cursor
                canvas.style.cursor = 'pointer';
                
                // Create tooltip
                tooltip = document.createElement('div');
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    pointer-events: none;
                    z-index: 1000;
                    white-space: nowrap;
                `;
                tooltip.textContent = `${hoveredBar.month}: $${hoveredBar.price}K${hoveredBar.isBest ? ' (Mejor precio)' : ''}`;
                document.body.appendChild(tooltip);
                
                // Position tooltip
                const tooltipRect = tooltip.getBoundingClientRect();
                tooltip.style.left = (e.clientX - tooltipRect.width / 2) + 'px';
                tooltip.style.top = (e.clientY - tooltipRect.height - 10) + 'px';
                
                // Redraw chart with hover effect
                redrawChartWithHover();
            } else {
                canvas.style.cursor = 'default';
            }
        }
    });
    
    // Mouse leave handler
    canvas.addEventListener('mouseleave', function() {
        hoveredBar = null;
        canvas.style.cursor = 'default';
        
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
        
        // Redraw chart without hover
        createInteractiveBarChart();
    });
    
    // Redraw chart with hover effect
    function redrawChartWithHover() {
        ctx.clearRect(0, 0, width, height);
        
        // Redraw grid
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Redraw bars with hover effect
        barPositions.forEach(bar => {
            const isHovered = bar === hoveredBar;
            
            // Bar color with hover effect
            if (bar.isBest) {
                ctx.fillStyle = isHovered ? '#dc2626' : '#EF4545';
            } else {
                ctx.fillStyle = isHovered ? '#0284c7' : '#00B2FF';
            }
            
            // Scale effect for hovered bar
            const scale = isHovered ? 1.05 : 1;
            const scaledWidth = bar.width * scale;
            const scaledHeight = bar.height * scale;
            const scaledX = bar.x - (scaledWidth - bar.width) / 2;
            const scaledY = bar.y - (scaledHeight - bar.height);
            
            ctx.beginPath();
            ctx.roundRect(scaledX, scaledY, scaledWidth, scaledHeight, [4, 4, 0, 0]);
            ctx.fill();
            
            // Add glow effect for hovered bar
            if (isHovered) {
                ctx.shadowColor = bar.isBest ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 178, 255, 0.4)';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
            }
        });
        
        // Redraw labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        
        months.forEach((month, index) => {
            const x = padding + (chartWidth / months.length) * index + (chartWidth / months.length) / 2;
            ctx.fillText(month, x, height - 20);
        });
        
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const price = 200 + (300 / 5) * (5 - i);
            const y = padding + (chartHeight / 5) * i + 5;
            ctx.fillText(`$${Math.round(price)}K`, padding - 10, y);
        }
    }
    
    // Add click handler for bar selection
    canvas.addEventListener('click', function(e) {
        if (hoveredBar) {
            // Animate selection
            const originalFillStyle = ctx.fillStyle;
            ctx.fillStyle = hoveredBar.isBest ? '#b91c1c' : '#0369a1';
            
            setTimeout(() => {
                createInteractiveBarChart();
            }, 200);
            
            // Show selection feedback
            console.log(`Selected: ${hoveredBar.month} - $${hoveredBar.price}K`);
        }
    });
}

// Toggle currency
function toggleCurrency() {
    isUSDMode = !isUSDMode;
    const btn = document.querySelector('.change-currency-btn');
    const priceElement = document.getElementById('destinationPrice');
    const currencyDisplay = document.querySelector('.currency');
    const data = destinations[currentDestination];
    
    if (isUSDMode) {
        btn.textContent = 'Cambiar a AR$';
        priceElement.textContent = data.priceUSD;
        currencyDisplay.textContent = 'USD';
        
        // Update flight prices
        document.querySelectorAll('.price-amount').forEach(priceEl => {
            const currentPrice = parseInt(priceEl.textContent.replace(/[$.,]/g, ''));
            const usdPrice = Math.round(currentPrice / 400); // Approximate conversion
            priceEl.textContent = `$${usdPrice}`;
        });
    } else {
        btn.textContent = 'Cambiar a USD';
        priceElement.textContent = data.price;
        currencyDisplay.textContent = 'AR$';
        
        // Reset flight prices to ARS
        const flightPrices = ['$1.044.962', '$1.189.750', '$967.500'];
        document.querySelectorAll('.price-amount').forEach((priceEl, index) => {
            if (flightPrices[index]) {
                priceEl.textContent = flightPrices[index];
            }
        });
    }
}

// Filter flights
function filterFlights(type) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide flight cards
    const flightCards = document.querySelectorAll('.flight-card');
    flightCards.forEach(card => {
        const flightType = card.getAttribute('data-type');
        if (type === 'all' || flightType === type) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// Go back to main page
function goBack() {
    window.history.back();
}

// Initialize event listeners
function initializeEventListeners() {
    // Flight selection
    document.querySelectorAll('.select-flight-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const flightCard = this.closest('.flight-card');
            const airline = flightCard.querySelector('.airline-name').textContent;
            const price = flightCard.querySelector('.price-amount').textContent;
            
            // Show selection confirmation
            showFlightSelection(airline, price);
        });
    });
    
    // Flight card hover effects
    document.querySelectorAll('.flight-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Parallax effect for hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.getElementById('destinationBackground');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
        }
    });
    
    // Add smooth scrolling for navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Show flight selection modal
function showFlightSelection(airline, price) {
    const modal = document.createElement('div');
    modal.className = 'flight-selection-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal(this.parentElement)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>Vuelo Seleccionado</h3>
                    <button class="close-btn" onclick="closeModal(this.closest('.flight-selection-modal'))">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="selection-details">
                        <div class="airline-selection">
                            <strong>Aerolínea:</strong> ${airline}
                        </div>
                        <div class="price-selection">
                            <strong>Precio:</strong> ${price} por persona
                        </div>
                        <div class="destination-selection">
                            <strong>Destino:</strong> ${currentDestination}
                        </div>
                    </div>
                    <p class="selection-note">
                        ¡Excelente elección! Te redirigiremos al proceso de reserva.
                    </p>
                </div>
                <div class="modal-actions">
                    <button class="continue-btn" onclick="proceedToBooking()">
                        Continuar con la reserva
                    </button>
                    <button class="cancel-btn" onclick="closeModal(this.closest('.flight-selection-modal'))">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        <style>
            .flight-selection-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1000;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .modal-content {
                background: white;
                border-radius: 16px;
                max-width: 500px;
                width: 100%;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                animation: modalSlideIn 0.3s ease forwards;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px 24px 0;
            }
            
            .modal-header h3 {
                font-size: 20px;
                font-weight: bold;
                color: #111827;
                margin: 0;
            }
            
            .close-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                color: #6b7280;
                transition: all 0.2s ease;
            }
            
            .close-btn:hover {
                background: #f3f4f6;
                color: #111827;
            }
            
            .modal-body {
                padding: 24px;
            }
            
            .selection-details {
                background: #f9fafb;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 16px;
            }
            
            .airline-selection,
            .price-selection,
            .destination-selection {
                margin-bottom: 8px;
                color: #374151;
            }
            
            .selection-note {
                color: #6b7280;
                font-size: 14px;
                margin: 0;
            }
            
            .modal-actions {
                display: flex;
                gap: 12px;
                padding: 0 24px 24px;
            }
            
            .continue-btn {
                flex: 1;
                background: #EF4545;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .continue-btn:hover {
                background: #dc2626;
                transform: translateY(-1px);
            }
            
            .cancel-btn {
                flex: 1;
                background: transparent;
                color: #6b7280;
                border: 2px solid #d1d5db;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .cancel-btn:hover {
                border-color: #9ca3af;
                color: #374151;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalStyles);
    document.body.appendChild(modal);
}

// Close modal
function closeModal(modal) {
    modal.remove();
}

// Proceed to booking
function proceedToBooking() {
    alert('¡Genial! Te redirigiremos al proceso de reserva.');
    closeModal(document.querySelector('.flight-selection-modal'));
}

// Add CSS animations
const styles = `
    <style>
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        #destinationBackground {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            transform: scale(1.1);
            transition: transform 0.1s ease-out;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', styles);