const menuGlobal = [
    { titulo: "Inicio", icono: "bi-house-door", url: "index.html" },
    { titulo: "Actividades", icono: "bi-journal-check", url: "actividades.html" },
    { titulo: "Acerca de", icono: "bi-info-circle", url: "acerca.html" }
];

export function renderSidebar() {
    // 1. Renderizar Navbar Superior
    const navbarContainer = document.getElementById('navbar-menu');
    
    if (navbarContainer) {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

        let html = '';
        menuGlobal.forEach(item => {
            const isActive = currentPage.includes(item.url) || (item.url === 'index.html' && currentPage === '');
            
            // Estilos para botones horizontales
            const activeClass = isActive 
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600 border-b-2 border-transparent';

            html += `
                <a href="${item.url}" 
                   class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm ${activeClass}">
                    <i class="bi ${item.icono} text-lg"></i>
                    <span class="hidden md:inline">${item.titulo}</span>
                </a>
            `;
        });
        navbarContainer.innerHTML = html;
    }

    // 2. Si existe el sidebar lateral (para páginas internas que lo usen diferente)
    // En este caso, index.html usa 'global-navbar', así que esta parte es opcional o para otras páginas
    const sidebar = document.getElementById('global-sidebar');
    if(sidebar) {
        // Lógica antigua si se necesita mantener compatibilidad
        sidebar.innerHTML = ''; 
    }
}