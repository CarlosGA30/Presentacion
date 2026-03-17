// ============================================
// FUNCIÓN PRINCIPAL MODIFICADA
// ============================================
export function renderContent(dataList, container, isNested = false, globalIndex = 0) {
    
    // Helper: Extraer ID de video de YouTube
    const getYouTubeId = (url) => {
        if (!url) return null;
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
            /youtube\.com\/shorts\/([^&\n?#]+)/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match?.[1]) return match[1];
        }
        return null;
    };

    // Helper: Generar thumbnail de YouTube
    const getYouTubeThumbnail = (videoId, quality = 'hqdefault') => {
        return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    };

    // Fondo parallax solo en nivel principal
    const getParallaxBG = (index) => {
        if (isNested) return null;
        if ((index + 1) % 2 === 0) {
            let bg = document.createElement("div");
            bg.className = "absolute inset-0 bg-fixed bg-cover bg-center opacity-30 pointer-events-none";
            bg.style.backgroundImage = "url('assets/index-paralax.jpg')";
            return bg;
        }
        return null;
    };

    // Función para crear el HTML de imagen/video con botón de ampliar
    const createMediaWithZoom = (src, alt, tipo = 'IMAGEN') => {
        const zoomBtn = `
            <button type="button" 
                    class="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white text-gray-700 hover:text-blue-600 
                           rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 
                           focus:ring-blue-400 opacity-0 group-hover:opacity-100"
                    onclick="event.stopPropagation(); openMediaModal('${encodeURIComponent(src)}', '${encodeURIComponent(alt)}', '${tipo}')"
                    aria-label="Ampliar"
                    title="Ampliar">
                <i class="bi bi-arrows-fullscreen text-lg"></i>
            </button>
        `;
        
        // Overlay de play para videos
        const playOverlay = tipo === 'VIDEO' ? `
            <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <i class="bi bi-play-fill text-3xl text-gray-800 ml-1"></i>
                </div>
            </div>
        ` : '';

        if (tipo === 'DIAGRAMA') {
            return `
                <div class="relative group w-full h-full">
                    <div class="mermaid w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                         onclick="openMediaModal(this, '${encodeURIComponent(alt)}', 'DIAGRAMA')">
                        ${src}
                    </div>
                    ${zoomBtn}
                </div>
            `;
        }
        
        if (tipo === 'VIDEO') {
            const videoId = getYouTubeId(src);
            const thumbnail = videoId ? getYouTubeThumbnail(videoId) : 'assets/cargando.svg';
            return `
                <div class="relative group w-full h-full">
                    <img src="${thumbnail}" 
                         alt="${alt}" 
                         class="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                         onerror="this.src='assets/cargando.svg'">
                    ${playOverlay}
                    ${zoomBtn}
                </div>
            `;
        }
        
        // IMAGEN por defecto
        return `
            <div class="relative group w-full h-full">
                <img src="${src}" 
                     alt="${alt}" 
                     class="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                     onerror="this.src='assets/cargando.svg'"
                     onclick="openMediaModal('${encodeURIComponent(src)}', '${encodeURIComponent(alt)}', 'IMAGEN')">
                ${zoomBtn}
            </div>
        `;
    };

    dataList.forEach((item, localIndex) => {
        let globalIdx = globalIndex + localIndex;

        // Contenedor principal de la sección
        let div_n = document.createElement('seccion');
        div_n.className = 'relative pb-10 pt-10';
        div_n.id = `secc-${item.id}`;

        let section = document.createElement('section');
        section.className = "max-w-7xl mx-auto bg-white overflow-hidden rounded-xl shadow-md border border-gray-100 relative z-10";
        
        // Preparar contenido multimedia
        let contenidoMedia = null;
        
        if (item.img?.tipo) {
            const tipo = item.img.tipo.toUpperCase();
            const src = tipo === 'DIAGRAMA' ? item.img.mermaid : (item.img.url || 'assets/cargando.svg');
            contenidoMedia = createMediaWithZoom(src, item.titulo, tipo);
        }
        
        let img_cont = contenidoMedia ? `
            <div class="w-full md:w-1/3 h-48 md:h-64 rounded-lg overflow-hidden shrink-0 bg-gray-200 ring-1 ring-gray-200 relative">
                ${contenidoMedia}
            </div>
        ` : '';

        let btn_detalle = item.datos ? `
            <button onclick="window.toggleSection(${item.id})"
                    class="group flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md px-2 py-1">
                <span id="btn-text-${item.id}">Ver más información</span>
                <svg id="icon-${item.id}" class="w-4 h-4 ml-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
        ` : '';

        // HEADER
        let headerHTML = `
            <div class="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start relative z-10 bg-white">
                ${img_cont}
                <div class="flex-1 space-y-4">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900">${item.titulo}</h2>
                        <p class="text-2xl text-blue-500 font-medium mt-1">${item.subtitulo || ''}</p>
                    </div>
                    ${btn_detalle}
                </div>
            </div>
        `;

        // DETAILS - generación corregida de detalles
        let detallesHTML = '';
        if (item.datos?.data?.length) {
            detallesHTML = item.datos.data.map(e => {
                let detalleMedia = '';
                if (e.img?.tipo) {
                    const tipo = e.img.tipo.toUpperCase();
                    const src = tipo === 'DIAGRAMA' ? e.img.mermaid : (e.img.url || 'assets/cargando.svg');
                    detalleMedia = createMediaWithZoom(src, item.titulo, tipo);
                }

                let img_cont = detalleMedia ? `
                    <div class="w-full md:w-1/3 h-48 md:h-64 rounded-lg overflow-hidden shrink-0 bg-gray-200 ring-1 ring-gray-200 relative">
                        ${detalleMedia}
                    </div>
                ` : '';
                
                return `
                <div class="md:col-span-3 space-y-2">
                    <p class="text-gray-700 leading-relaxed text-2xl">${e.text || ''}</p>
                    ${detalleMedia}
                    <div id="subinfo-${item.id}" class="mt-8 space-y-6"></div>
                </div>
                `;
            }).join('');
        }
        
        let detailsHTML = `
            <div id="details-${item.id}" class="details-content bg-gray-50/80 border-t border-gray-100 backdrop-blur-sm">
                <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    ${detallesHTML}
                </div>
            </div>
        `;

        section.innerHTML = headerHTML + detailsHTML;

        // Fondo parallax opcional
        let parallaxBG = getParallaxBG(globalIdx);
        if (parallaxBG) div_n.appendChild(parallaxBG);

        div_n.appendChild(section);
        container.appendChild(div_n);

        // Render recursivo de subinfo
        if (item.datos?.subinfo?.length) {
            let subContainer = div_n.querySelector(`#subinfo-${item.id}`);
            if (subContainer) {
                renderContent(item.datos.subinfo, subContainer, true, globalIdx + 1);
                subContainer.classList.add('space-y-4', 'pl-0', 'md:pl-6');
            }
        }
    });
}

// ============================================
// FUNCIÓN DE INICIALIZACIÓN DE MERMAID
// ============================================
function initDiagram() {
    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({ startOnLoad: false });
      mermaid.run({
        nodes: document.getElementsByClassName('mermaid'),
      });
    } else {
      setTimeout(initDiagram, 100);
    }
}

// ============================================
// TOGGLE DE SECCIÓN
// ============================================
window.toggleSection = function(id) {
    const details = document.getElementById(`details-${id}`);
    const btnText = document.getElementById(`btn-text-${id}`);
    const icon = document.getElementById(`icon-${id}`);
    initDiagram();
    
    if (!details) return;

    const isOpen = details.classList.contains('open');
    if (isOpen) {
        details.classList.remove('open');
        if (btnText) btnText.innerText = "Ver más información";
        if (icon) icon.classList.remove("rotate-180");
    } else {
        details.classList.add('open');
        if (btnText) btnText.innerText = "Ver menos";
        if (icon) icon.classList.add("rotate-180");
    }
};

// ============================================
// 🆕 FUNCIONES PARA MODAL DE IMÁGENES Y VIDEOS
// ============================================

// Crear el modal una sola vez en el DOM
function createMediaModal() {
    if (document.getElementById('media-modal')) return;
    
    const modalHTML = `
        <div id="media-modal" 
             class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm opacity-0 invisible transition-all duration-300"
             role="dialog" 
             aria-modal="true"
             aria-labelledby="modal-title">
            
            <!-- Overlay para cerrar -->
            <div class="absolute inset-0" onclick="closeMediaModal()"></div>
            
            <!-- Contenedor del modal -->
            <div class="relative z-10 max-w-6xl w-full max-h-[90vh] flex flex-col">
                
                <!-- Header del modal -->
                <div class="flex justify-between items-center mb-4">
                    <h3 id="modal-title" class="text-white text-lg font-semibold truncate pr-4"></h3>
                    <button type="button"
                            class="text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2"
                            onclick="closeMediaModal()"
                            aria-label="Cerrar modal">
                        <i class="bi bi-x-lg text-2xl"></i>
                    </button>
                </div>
                
                <!-- Contenido del modal -->
                <div class="flex-1 flex items-center justify-center bg-black/50 rounded-lg overflow-hidden">
                    <div id="modal-content-container" class="w-full h-full flex items-center justify-center">
                        <!-- Contenido dinámico: imagen, video o diagrama -->
                    </div>
                </div>
                
                <!-- Footer con controles (solo para imágenes) -->
                <div id="modal-actions" class="flex justify-center gap-4 mt-4">
                    <button type="button"
                            class="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-1"
                            onclick="downloadMedia()">
                        <i class="bi bi-download"></i>
                        <span>Descargar</span>
                    </button>
                    <button type="button"
                            class="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-1"
                            onclick="openMediaInNewTab()">
                        <i class="bi bi-box-arrow-up-right"></i>
                        <span>Abrir en nueva pestaña</span>
                    </button>
                </div>
            </div>
            
            <!-- Botones de navegación -->
            <button type="button"
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 
                           rounded-full p-3 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                    onclick="navigateModal(-1)"
                    aria-label="Anterior">
                <i class="bi bi-chevron-left text-2xl"></i>
            </button>
            <button type="button"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 
                           rounded-full p-3 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                    onclick="navigateModal(1)"
                    aria-label="Siguiente">
                <i class="bi bi-chevron-right text-2xl"></i>
            </button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMediaModal();
    });
}

// Helper: Extraer ID de YouTube (versión global para el modal)
const getYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match?.[1]) return match[1];
    }
    return null;
};

// Helper: Obtener parámetro start de URL de YouTube
const getYouTubeStartTime = (url) => {
    if (!url) return 0;
    // Formato ?t=120 o &t=120 o ?start=120
    const match = url.match(/[?&](?:t|start)=(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
};

// Abrir el modal con contenido multimedia
window.openMediaModal = function(src, alt, tipo = 'IMAGEN') {
    // Decodificar parámetros
    src = decodeURIComponent(src);
    alt = decodeURIComponent(alt);
    
    createMediaModal();
    
    const modal = document.getElementById('media-modal');
    const container = document.getElementById('modal-content-container');
    const title = document.getElementById('modal-title');
    const actions = document.getElementById('modal-actions');
    
    // Guardar referencia para funciones auxiliares
    modal.dataset.currentSrc = src;
    modal.dataset.currentAlt = alt;
    modal.dataset.currentType = tipo;
    
    // Actualizar título
    title.textContent = alt || 'Contenido multimedia';
    
    // Mostrar/ocultar acciones según el tipo
    if (tipo === 'VIDEO' || tipo === 'DIAGRAMA') {
        actions.style.display = 'none';
    } else {
        actions.style.display = 'flex';
    }
    
    // Generar contenido según el tipo
    if (tipo === 'VIDEO') {
        const videoId = getYouTubeId(src);
        const startTime = getYouTubeStartTime(src);
        
        if (videoId) {
            // Embed de YouTube con autoplay y parámetros optimizados
            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1${startTime ? `&start=${startTime}` : ''}`;
            container.innerHTML = `
                <div class="w-full h-full max-w-5xl max-h-[75vh] aspect-video">
                    <iframe 
                        src="${embedUrl}"
                        title="${alt}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                        class="w-full h-full rounded-lg shadow-2xl">
                    </iframe>
                </div>
            `;
        } else {
            // Fallback si no se detecta video válido
            container.innerHTML = `
                <div class="text-white text-center p-8">
                    <i class="bi bi-exclamation-triangle text-4xl mb-4"></i>
                    <p class="text-lg">No se pudo identificar el video de YouTube</p>
                    <p class="text-sm text-gray-400 mt-2">${src}</p>
                </div>
            `;
        }
    } 
    else if (tipo === 'DIAGRAMA') {
        // Para diagramas Mermaid, capturar SVG renderizado
        const mermaidElement = typeof src === 'string' ? null : src;
        const svgContent = mermaidElement?.querySelector('svg')?.outerHTML || src;
        
        container.innerHTML = `
            <div class="max-w-full max-h-[75vh] overflow-auto bg-white rounded-lg p-4">
                ${svgContent}
            </div>
        `;
    } 
    else {
        // Para imágenes normales
        container.innerHTML = `
            <img src="${src}" 
                 alt="${alt}" 
                 class="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                 onerror="this.src='assets/cargando.svg'">
        `;
    }
    
    // Mostrar modal con animación
    setTimeout(() => {
        modal.classList.remove('opacity-0', 'invisible');
        modal.classList.add('opacity-100', 'visible');
        document.body.style.overflow = 'hidden';
    }, 10);
};

// Cerrar el modal
window.closeMediaModal = function() {
    const modal = document.getElementById('media-modal');
    if (!modal) return;
    
    modal.classList.remove('opacity-100', 'visible');
    modal.classList.add('opacity-0', 'invisible');
    document.body.style.overflow = '';
    
    // Detener videos de YouTube al cerrar
    const iframe = modal.querySelector('iframe');
    if (iframe) {
        iframe.src = iframe.src; // Recargar para detener reproducción
    }
    
    // Limpiar contenido después de la animación
    setTimeout(() => {
        const container = document.getElementById('modal-content-container');
        if (container) container.innerHTML = '';
    }, 300);
};

// Navegación entre items (placeholder para galería)
window.navigateModal = function(direction) {
    console.log(`Navegación: ${direction > 0 ? 'siguiente' : 'anterior'}`);
};

// Descargar imagen (solo para tipo IMAGEN)
window.downloadMedia = function() {
    const modal = document.getElementById('media-modal');
    const src = modal?.dataset.currentSrc;
    const alt = modal?.dataset.currentAlt || 'contenido';
    const tipo = modal?.dataset.currentType;
    
    if (!src || tipo !== 'IMAGEN') return;
    
    const link = document.createElement('a');
    link.href = src;
    link.download = `${alt.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
};

// Abrir en nueva pestaña
window.openMediaInNewTab = function() {
    const modal = document.getElementById('media-modal');
    const src = modal?.dataset.currentSrc;
    const tipo = modal?.dataset.currentType;
    
    if (!src) return;
    
    // Para videos, abrir la URL original de YouTube
    if (tipo === 'VIDEO') {
        const videoId = getYouTubeId(src);
        if (videoId) {
            window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
            return;
        }
    }
    
    window.open(src, '_blank', 'noopener,noreferrer');
};