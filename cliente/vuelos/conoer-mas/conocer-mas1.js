// Datos del gráfico de precios
const priceData = {
    months: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'],
    avgPrices: [270000, 320000, 350000, 290000, 250000, 260000, 380000, 420000, 330000, 310000, 280000, 360000],
    bestPrices: [250000, 300000, 330000, 270000, 230000, 240000, 360000, 400000, 310000, 290000, 260000, 340000]
};

// Función para formatear precios
function formatPrice(price) {
  return '$' + (price / 1000).toFixed(1) + 'K';
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

// Clase para manejar el menú desplegable de monedas
class CurrencyDropdown {
    constructor() {
      this.dropdown = document.getElementById('currencyDropdown');
      this.btn = document.getElementById('currencyBtn');
      this.menu = document.getElementById('currencyMenu');
      this.currentFlag = document.getElementById('currentFlag');
      this.currentCode = document.getElementById('currentCode');
      this.options = document.querySelectorAll('.currency-option');
      
      this.init();
    }
  
    init() {
      // Evento para abrir/cerrar el menú
      this.btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
  
      // Eventos para seleccionar moneda
      this.options.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectCurrency(option);
        });
      });
  
      // Cerrar menú al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (!this.dropdown.contains(e.target)) {
          this.closeMenu();
        }
      });
  
      // Cerrar menú con tecla Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMenu();
        }
      });
    }
  
    toggleMenu() {
      if (this.dropdown.classList.contains('open')) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }
  
    openMenu() {
      this.dropdown.classList.add('open');
    }
  
    closeMenu() {
      this.dropdown.classList.remove('open');
    }
  
    selectCurrency(option) {
      const flag = option.dataset.flag;
      const code = option.dataset.code;
      
      // Actualizar la visualización del botón
      this.currentFlag.textContent = flag;
      this.currentCode.textContent = code;
      
      // Actualizar las clases de selección
      this.options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      // Cerrar el menú
      this.closeMenu();
      
      // Opcional: Disparar evento personalizado para notificar el cambio
      const event = new CustomEvent('currencyChanged', {
        detail: { flag, code, name: option.dataset.name }
      });
      document.dispatchEvent(event);
    }
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
    new CurrencyDropdown();
});

// Función para cambiar moneda (placeholder)
document.addEventListener('currencyChanged', (e) => {
    console.log('Moneda cambiada a:', e.detail);
    // Aquí puedes agregar lógica adicional cuando cambie la moneda
  });