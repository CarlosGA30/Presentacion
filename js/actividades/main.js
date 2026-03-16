const actividades = [
  { titulo: "Sopa de letras", descripcion: "Completa la sopa de letras.", icono: "bi-pen", archivo: "./actividades/sopa-letras.html" },
  { titulo: "Diagrama de estados", descripcion: "Construye el diagrama.", icono: "bi-diagram-3", archivo: "./actividades/diagrama-estados.html" },
  { titulo: "Refactorización", descripcion: "Refactoriza usando State.", icono: "bi-code-slash", archivo: "./actividades/refactorizacion.html" }
];

const carousel = document.getElementById("carousel");
const actividadDetalle = document.getElementById("actividadDetalle");
const actividadContenido = document.getElementById("actividadContenido");
const tituloVista = document.getElementById("actividadTitulo");

let indexActual = 0;
const cacheVistas = {};

function crearTarjeta(act, idx) {
  return `
  <div class="actividad absolute w-[280px] bg-white p-6 rounded-xl shadow-md border transition-all duration-500">
    <div class="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-xl">
      <i class="bi ${act.icono}"></i>
    </div>
    <h3 class="text-lg font-bold mb-2">${act.titulo}</h3>
    <p class="text-gray-600 text-sm mb-4">${act.descripcion}</p>
    <div class="flex flex-col gap-2">
      <button class="btn-ir w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-semibold transition-colors" data-idx="${idx}">
        Ir a actividad
      </button>
    </div>
  </div>`;
}

// Función para cargar scripts esperando a que terminen
function cargarScript(scriptOriginal) {
  return new Promise((resolve, reject) => {
    const nuevoScript = document.createElement("script");
    if (scriptOriginal.src) {
      nuevoScript.src = scriptOriginal.src;
      nuevoScript.onload = resolve;
      nuevoScript.onerror = reject;
    } else {
      nuevoScript.textContent = scriptOriginal.textContent;
      resolve(); // Los scripts inline se ejecutan al instante
    }
    document.body.appendChild(nuevoScript);
  });
}

async function cargarActividad(idx) {
  const act = actividades[idx];
  const idUnico = `act-wrapper-${idx}`;

  Array.from(actividadContenido.children).forEach(child => child.classList.add("hidden"));

  if (cacheVistas[idUnico]) {
    cacheVistas[idUnico].classList.remove("hidden");
  } else {
    try {
      const response = await fetch(act.archivo);
      const htmlString = await response.text();
      const doc = new DOMParser().parseFromString(htmlString, 'text/html');
      
      const wrapper = document.createElement("div");
      wrapper.id = idUnico;
      wrapper.innerHTML = doc.body.innerHTML;
      actividadContenido.appendChild(wrapper);

      // 🔹 NUEVO: clonar estilos al <head>
      const styles = Array.from(doc.querySelectorAll('link[rel="stylesheet"], style'));
      for (const style of styles) {
        document.head.appendChild(style.cloneNode(true));
      }

      // 🔹 Ejecutar scripts secuencialmente
      const scripts = Array.from(doc.querySelectorAll('script'));
      for (const s of scripts) {
        await cargarScript(s);
      }

      cacheVistas[idUnico] = wrapper;
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  }

  tituloVista.textContent = act.titulo;
  actividadDetalle.classList.remove("hidden");
  actividadDetalle.scrollIntoView({ behavior: "smooth", block: "start" });
}

function reiniciarActividad(idx) {
  const idUnico = `act-wrapper-${idx}`;
  if (cacheVistas[idUnico]) {
    cacheVistas[idUnico].remove();
    delete cacheVistas[idUnico];
    cargarActividad(idx);
  }
}

// Eventos
carousel.addEventListener("click", (e) => {
  const btnIr = e.target.closest(".btn-ir");
  const btnReset = e.target.closest(".btn-reset");
  if (btnIr) cargarActividad(parseInt(btnIr.dataset.idx));
  if (btnReset) reiniciarActividad(parseInt(btnReset.dataset.idx));
});

// Navegación
function render() {
  carousel.innerHTML = actividades.map((act, idx) => crearTarjeta(act, idx)).join('');
  actualizarPosiciones();
}

function actualizarPosiciones() {
  const cards = document.querySelectorAll(".actividad");
  const total = cards.length;
  cards.forEach((card, i) => {
    let offset = i - indexActual;
    if (offset < -Math.floor(total / 2)) offset += total;
    if (offset > Math.floor(total / 2)) offset -= total;
    let scale = (offset === 0) ? 1.2 : (Math.abs(offset) === 1 ? 0.9 : 0.7);
    let opacity = (offset === 0) ? 1 : (Math.abs(offset) === 1 ? 0.6 : 0.3);
    card.style.transform = `translateX(${offset * 300}px) scale(${scale})`;
    card.style.opacity = opacity;
    card.style.zIndex = (offset === 0) ? 30 : 10;
  });
}

document.getElementById("nextBtn").onclick = () => { indexActual = (indexActual + 1) % actividades.length; actualizarPosiciones(); };
document.getElementById("prevBtn").onclick = () => { indexActual = (indexActual - 1 + actividades.length) % actividades.length; actualizarPosiciones(); };

render();
