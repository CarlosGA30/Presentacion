

export function initQR() {
    // Solo generamos QR si existe el contenedor (para evitar errores en otras páginas)
    const container = document.getElementById('qr-container');
    if (!container) return;

    const currentUrl = window.location.href;
    
    // Limpiar contenedor por si acaso
    container.innerHTML = '';

    // Generar QR usando la librería qrcodejs cargada en el HTML
    new QRCode(container, {
        text: currentUrl,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

}