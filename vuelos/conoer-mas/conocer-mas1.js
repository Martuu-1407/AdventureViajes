// CONFIGURACIÓN DEL GRÁFICO - AQUÍ PUEDES MODIFICAR LOS PRECIOS
const chartConfig = {
    // Datos de precios por mes (en miles para mostrar)
    data: [
        { month: 'Ene', avgPrice: 1200, bestPrice: 980 },
        { month: 'Feb', avgPrice: 1150, bestPrice: 920 },
        { month: 'Mar', avgPrice: 1300, bestPrice: 1050 },
        { month: 'Abr', avgPrice: 1100, bestPrice: 890 },
        { month: 'May', avgPrice: 980, bestPrice: 780 },
        { month: 'Jun', avgPrice: 1020, bestPrice: 820 },
        { month: 'Jul', avgPrice: 1400, bestPrice: 1180 },
        { month: 'Ago', avgPrice: 1350, bestPrice: 1120 },
        { month: 'Sep', avgPrice: 1050, bestPrice: 850 },
        { month: 'Oct', avgPrice: 1080, bestPrice: 880 },
        { month: 'Nov', avgPrice: 1250, bestPrice: 1000 },
        { month: 'Dic', avgPrice: 1450, bestPrice: 1200 }
    ],
    // Colores del gráfico
    avgPriceColor: '#00B2FF',
    bestPriceColor: '#EF4545',
    hoverColor: '#DEB841',
    // Dimensiones y espaciado
    padding: { top: 100, right: 0, bottom: 60, left: 50 },
    barWidth: 30,
    barSpacing: 15,
    // Configuración de animación
    animationDuration: 1500,
    // Configuración de hover
    showTooltip: true
};

// Variables globales
let animationProgress = 0;
let hoveredBar = null;
let isAnimating = true;

// Función principal para inicializar el gráfico
function initChart() {
    const canvas = document.getElementById('precio-cuadro');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar el canvas para alta resolución
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Función para dibujar el gráfico
    function drawChart() {
        const { width, height } = canvas;
        const { padding, data, barWidth, barSpacing } = chartConfig;
        
        // Limpiar canvas
        ctx.clearRect(0, 0, width / dpr, height / dpr);
        
        // Calcular área del gráfico
        const chartWidth = (width / dpr) - padding.left - padding.right;
        const chartHeight = (height / dpr) - padding.top - padding.bottom;
        
        // Encontrar valor máximo para escalar
        const maxPrice = Math.max(...data.map(d => Math.max(d.avgPrice, d.bestPrice)));
        const scale = chartHeight / maxPrice;
        
        // Calcular ancho total necesario para todas las barras
        const totalBarsWidth = data.length * (barWidth * 2 + barSpacing) - barSpacing;
        const startX = padding.left + (chartWidth - totalBarsWidth) / 2;
        
        // Dibujar líneas de cuadrícula
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo((width / dpr) - padding.right, y);
            ctx.stroke();
            
            // Etiquetas del eje Y
            const value = Math.round(maxPrice - (maxPrice / 5) * i);
            ctx.fillStyle = '#666';
            ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(`$${value}k`, padding.left - 10, y + 4);
        }
        
        // Dibujar barras
        data.forEach((item, index) => {
            const x = startX + index * (barWidth * 2 + barSpacing);
            
            // Calcular alturas animadas
            const avgHeight = (item.avgPrice * scale) * animationProgress;
            const bestHeight = (item.bestPrice * scale) * animationProgress;
            
            // Barra de precio promedio
            const avgBarY = (height / dpr) - padding.bottom - avgHeight;
            ctx.fillStyle = hoveredBar === `avg-${index}` ? chartConfig.hoverColor : chartConfig.avgPriceColor;
            ctx.fillRect(x, avgBarY, barWidth, avgHeight);
            
            // Barra de mejor precio
            const bestBarY = (height / dpr) - padding.bottom - bestHeight;
            ctx.fillStyle = hoveredBar === `best-${index}` ? chartConfig.hoverColor : chartConfig.bestPriceColor;
            ctx.fillRect(x + barWidth, bestBarY, barWidth, bestHeight);
            
            // Etiquetas de meses
            ctx.fillStyle = '#333';
            ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.month, x + barWidth, (height / dpr) - padding.bottom + 20);
            
            // Mostrar valores al hacer hover
            if (hoveredBar === `avg-${index}` || hoveredBar === `best-${index}`) {
                ctx.fillStyle = '#333';
                ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.textAlign = 'center';
                
                if (hoveredBar === `avg-${index}`) {
                    ctx.fillText(`$${item.avgPrice}k`, x + barWidth/2, avgBarY - 10);
                } else {
                    ctx.fillText(`$${item.bestPrice}k`, x + barWidth + barWidth/2, bestBarY - 10);
                }
            }
        });
        
        // Título del gráfico
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Variación de Precios por Mes', (width / dpr) / 2, 25);
    }

    // Bucle de animación
    function animate() {
        if (isAnimating && animationProgress < 1) {
            animationProgress += 1 / (chartConfig.animationDuration / 16);
            if (animationProgress >= 1) {
                animationProgress = 1;
                isAnimating = false;
            }
        }
        drawChart();
        requestAnimationFrame(animate);
    }

    // Interacción con el mouse
    function handleMouseMove(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        const { padding, data, barWidth, barSpacing } = chartConfig;
        const chartWidth = (canvas.width / dpr) - padding.left - padding.right;
        const totalBarsWidth = data.length * (barWidth * 2 + barSpacing) - barSpacing;
        const startX = padding.left + (chartWidth - totalBarsWidth) / 2;
        
        let newHoveredBar = null;
        
        data.forEach((item, index) => {
            const x = startX + index * (barWidth * 2 + barSpacing);
            
            // Verificar barra de precio promedio
            if (mouseX >= x && mouseX <= x + barWidth && 
                mouseY >= padding.top && mouseY <= (canvas.height / dpr) - padding.bottom) {
                newHoveredBar = `avg-${index}`;
            }
            
            // Verificar barra de mejor precio
            if (mouseX >= x + barWidth && mouseX <= x + barWidth * 2 && 
                mouseY >= padding.top && mouseY <= (canvas.height / dpr) - padding.bottom) {
                newHoveredBar = `best-${index}`;
            }
        });
        
        if (newHoveredBar !== hoveredBar) {
            hoveredBar = newHoveredBar;
            canvas.style.cursor = hoveredBar ? 'pointer' : 'default';
        }
    }

    function handleMouseLeave() {
        hoveredBar = null;
        canvas.style.cursor = 'default';
    }

    // Agregar event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Iniciar animación
    animate();

    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', function() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        drawChart();
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initChart);