import { datosTemaJson } from './informacion.js';

export function renderMenu() {
    const list = document.getElementById('menu-list');
    if (!list) return;

    datosTemaJson.then(info => {
        list.innerHTML = renderItems(info);
    });
}

function renderItems(items) {
    let html = '';

    items.forEach(item => {
        html += `
            <li>
                <a href="#secc-${item.id}" 
                   class="block px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-primary hover:shadow-sm rounded-md transition-all truncate">
                    ${item.titulo}
                </a>
        `;

        // Si tiene subinfo → render recursivo
        if (item.datos?.subinfo?.length) {
            html += `<ul class="ml-4">`;
            html += renderItems(item.datos.subinfo);
            html += `</ul>`;
        }

        html += `</li>`;
    });

    return html;
}