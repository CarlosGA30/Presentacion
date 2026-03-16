export function initMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const sidebar = document.getElementById('content-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (!toggleBtn || !sidebar) return;

    // Función para abrir sidebar
    function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Evitar scroll del body
    }

    // Función para cerrar sidebar
    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
        overlay.classList.add('hidden');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    // Event Listeners
    toggleBtn.addEventListener('click', openSidebar);
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Cerrar al hacer clic en un enlace del menú
    const menuLinks = sidebar.querySelectorAll('a[href^="#"]');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) { // Solo en móvil
                closeSidebar();
            }
        });
    });

    // Cerrar al cambiar tamaño de ventana a desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            closeSidebar();
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initMobileMenu);