import { datosTemaJson } from './informacion.js';
import { renderContent } from './renderer.js';
import { renderSidebar } from './sidebar.js';
import { renderMenu } from './menu.js';
import { initQR } from './qr.js';

document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    renderMenu();

    const appContainer = document.getElementById('app-content');
    if(appContainer) {
        datosTemaJson.then(info => {
            // TODO: inicializar app o renderizar
            renderContent(info, appContainer);
        });
        
        setTimeout(() => {
            const firstQRContainer = document.getElementById('qr-container');
            if(firstQRContainer) initQR();
        }, 100);
    }

    // Highlight activo en sidebar al hacer scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLi = document.querySelectorAll('#menu-list li a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('bg-blue-50', 'text-blue-600', 'border-blue-600');
            a.classList.add('border-transparent', 'text-gray-600');
            
            if (a.getAttribute('href').includes(current)) {
                a.classList.remove('border-transparent', 'text-gray-600');
                a.classList.add('bg-blue-50', 'text-blue-600', 'border-blue-600');
            }
        });
    });
});