// Datos del gráfico de precios
const priceData = {
    months: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'],
    avgPrices: [270000, 320000, 350000, 290000, 250000, 260000, 380000, 420000, 330000, 310000, 280000, 360000],
    bestPrices: [250000, 300000, 330000, 270000, 230000, 240000, 360000, 400000, 310000, 290000, 260000, 340000]
};

// Función para formatear precios
function formatPrice(price) {
    return '$' + (price / 1000) + 'K';
}

// Función para animar las barras al cargar la página
function animateBars() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.transform = 'scaleY(1)';
        }, index * 100);
    });
}

// Función para manejar hover en las barras
function setupBarHovers() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Configurar animaciones iniciales
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.style.opacity = '0';
        bar.style.transform = 'scaleY(0)';
        bar.style.transformOrigin = 'bottom';
        bar.style.transition = 'all 0.6s ease-out';
    });
    
    // Animar barras después de un pequeño delay
    setTimeout(animateBars, 300);
    
    // Configurar eventos de hover
    setupBarHovers();
});

// Función para cambiar moneda (placeholder)
document.addEventListener('DOMContentLoaded', function() {
    const cambiarMonedaBtn = document.querySelector('.cambiar-moneda-btn');
    if (cambiarMonedaBtn) {
        cambiarMonedaBtn.addEventListener('click', function() {
            // Aquí se puede implementar la lógica para cambiar moneda
            console.log('Cambiar a USD');
        });
    }
});