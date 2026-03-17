import { datosTemaJson } from './informacion.js';

export function renderMenu() {
    const list = document.getElementById('menu-list');
    if (!list) return;

    datosTemaJson.then(info => {
        list.innerHTML = renderItems(info);
    });
}

window.prepareMenuAndScroll = function(event, id) {
    // 1. Lógica para el Contenido Central: Abrir el acordeón PADRE
    const targetSection = document.getElementById(`secc-${id}`);
    if (targetSection && typeof window.toggleSection === 'function') {
        // Buscamos el contenedor 'details-' más cercano hacia arriba
        const parentDetails = targetSection.closest('[id^="details-"]');
        
        if (parentDetails && !parentDetails.classList.contains('open')) {
            // Extraemos el ID numérico del details (ej: details-123 -> 123)
            const parentId = parentDetails.id.replace('details-', '');
            window.toggleSection(parentId);
        }
    }

    // 2. Lógica para el Menú Lateral: Desplegar niveles ocultos
    let currentElem = document.getElementById(`submenu-${id}`) || event.currentTarget;
    let menuParent = currentElem.parentElement;

    while (menuParent && menuParent.id !== 'menu-list') {
        if (menuParent.tagName === 'UL' && menuParent.classList.contains('hidden')) {
            menuParent.classList.remove('hidden');
            const menuId = menuParent.id.replace('submenu-', '');
            const arrow = document.getElementById(`arrow-${menuId}`);
            if (arrow) arrow.classList.add('rotate-90');
        }
        menuParent = menuParent.parentElement;
    }

    // 3. Ejecutar scroll
    scrollToSection(event, `secc-${id}`);
};

function renderItems(items) {
    let html = '';
    items.forEach(item => {
        const hasChildren = item.datos?.subinfo?.length;
        html += `
        <li class="mb-1">
            <div class="flex items-center justify-between">
                <a href="#secc-${item.id}"
                   onclick="prepareMenuAndScroll(event, '${item.id}')"
                   class="flex-1 block px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-primary hover:shadow-sm rounded-md transition-all truncate">
                   ${item.titulo}
                </a>
                ${hasChildren ? `
                <button onclick="toggleMenu('${item.id}')" class="p-1 ml-1 text-gray-500 hover:text-blue-600">
                    <svg id="arrow-${item.id}" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
                ` : ''}
            </div>
            ${hasChildren ? `
            <ul id="submenu-${item.id}" class="ml-4 hidden border-l border-gray-200 pl-2">
                ${renderItems(item.datos.subinfo)}
            </ul>
            ` : ''}
        </li>`;
    });
    return html;
}
