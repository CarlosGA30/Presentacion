

// ===============================
// TIPOS DE ELEMENTOS
// ===============================
const TIPO_ELEMN = {
    ESTADO: 'ESTADO',
    TRANSICION: 'TRANSICION',
    ESTADO_INICIAL: 'ESTADO INICIAL',
    ESTADO_FINAL: 'ESTADO FINAL'
};

const ELEMENTO = {
    ESTADO_INICIAL: '⬤',
    Apagada: 'Apagada',
    Encendida: 'Encendida',
    EsperandoSeleccion: 'EsperandoSeleccion',
    PreparandoCafe: 'PreparandoCafe',
    Sirviendo: 'Sirviendo',
    Mantenimiento: 'Mantenimiento',
    ESTADO_FINAL: '◯',
    t_iniciarSistema: 'iniciarSistema',
    t_presionarBotonEncendido: 'presionarBotonEncendido',
    t_encendidoCompleto: 'encendidoCompleto',
    t_seleccionarCafe: 'seleccionarCafe',
    t_presionarBotonApagado: 'presionarBotonApagado',
    t_cafeListo: 'cafeListo',
    t_errorPreparacion: 'errorPreparacion',
    t_cafeServido: 'cafeServido',
    t_activarMantenimiento: 'activarMantenimiento',
    t_finalizarMantenimiento: 'finalizarMantenimiento',
    t_sistemaDesconectado: 'sistemaDesconectado'
};

const ELEMENTOS_TIPO = {
    [ELEMENTO.ESTADO_INICIAL]: TIPO_ELEMN.ESTADO_INICIAL,
    [ELEMENTO.Apagada]: TIPO_ELEMN.ESTADO,
    [ELEMENTO.Encendida]: TIPO_ELEMN.ESTADO,
    [ELEMENTO.EsperandoSeleccion]: TIPO_ELEMN.ESTADO,
    [ELEMENTO.PreparandoCafe]: TIPO_ELEMN.ESTADO,
    [ELEMENTO.Sirviendo]: TIPO_ELEMN.ESTADO,
    [ELEMENTO.Mantenimiento]: TIPO_ELEMN.ESTADO,
    [ELEMENTO.ESTADO_FINAL]: TIPO_ELEMN.ESTADO_FINAL,
    [ELEMENTO.t_iniciarSistema]: TIPO_ELEMN.TRANSICION,
    [ELEMENTO.t_presionarBotonEncendido]: TIPO_ELEMN.TRANSICION,
    [ELEMENTO.t_encendidoCompleto]: TIPO_ELEMN.TRANSICION,
    [ELEMENTO.t_seleccionarCafe]: TIPO_ELEMN.TRANSICION,
    [ELEMENTO.t_presionarBotonApagado]: TIPO_ELEMN.TRANSICION,
    [ELEMENTO.t_cafeListo]: TIPO_ELEMN.TRANSICION,
    [ELEMENTO.t_errorPreparacion]: TIPO_ELEMN.TRANSICION,
    [ELEMENTO.t_cafeServido]: TIPO_ELEMN.TRANSICION,
    [ELEMENTO.t_activarMantenimiento]: TIPO_ELEMN.TRANSICION,
    [ELEMENTO.t_finalizarMantenimiento]: TIPO_ELEMN.TRANSICION,
    [ELEMENTO.t_sistemaDesconectado]: TIPO_ELEMN.TRANSICION
};

const NODO_INFO = {
    [ELEMENTO.ESTADO_INICIAL]: { nodo_sig: [ELEMENTO.t_iniciarSistema], nodo_ant: null },
    [ELEMENTO.Apagada]: { nodo_sig: [ELEMENTO.t_presionarBotonEncendido,ELEMENTO.t_sistemaDesconectado], nodo_ant: [ELEMENTO.t_iniciarSistema,ELEMENTO.t_presionarBotonApagado] },
    [ELEMENTO.Encendida]: { nodo_sig: [ELEMENTO.t_encendidoCompleto], nodo_ant: [ELEMENTO.t_presionarBotonEncendido] },
    [ELEMENTO.EsperandoSeleccion]: { nodo_sig: [ELEMENTO.t_seleccionarCafe,ELEMENTO.t_presionarBotonApagado,ELEMENTO.t_activarMantenimiento], nodo_ant: [ELEMENTO.t_encendidoCompleto,ELEMENTO.t_errorPreparacion,ELEMENTO.t_cafeServido,ELEMENTO.t_finalizarMantenimiento] },
    [ELEMENTO.PreparandoCafe]: { nodo_sig: [ELEMENTO.t_cafeListo,ELEMENTO.t_errorPreparacion], nodo_ant: [ELEMENTO.t_seleccionarCafe] },
    [ELEMENTO.Sirviendo]: { nodo_sig: [ELEMENTO.t_cafeServido], nodo_ant: [ELEMENTO.t_cafeListo] },
    [ELEMENTO.Mantenimiento]: { nodo_sig: [ELEMENTO.t_finalizarMantenimiento], nodo_ant: [ELEMENTO.t_activarMantenimiento] },
    [ELEMENTO.ESTADO_FINAL]: { nodo_sig: null, nodo_ant: [ELEMENTO.t_sistemaDesconectado] },
    [ELEMENTO.t_iniciarSistema]: { nodo_sig: ELEMENTO.Apagada, nodo_ant: ELEMENTO.ESTADO_INICIAL, accion:'iniciarSistema()' },
    [ELEMENTO.t_presionarBotonEncendido]: { nodo_sig: ELEMENTO.Encendida, nodo_ant: ELEMENTO.Apagada, accion:'presionarBotonEncendido()' },
    [ELEMENTO.t_encendidoCompleto]: { nodo_sig: ELEMENTO.EsperandoSeleccion, nodo_ant: ELEMENTO.Encendida, accion:'encendidoCompleto()' },
    [ELEMENTO.t_seleccionarCafe]: { nodo_sig: ELEMENTO.PreparandoCafe, nodo_ant: ELEMENTO.EsperandoSeleccion, accion:'seleccionarCafe()' },
    [ELEMENTO.t_presionarBotonApagado]: { nodo_sig: ELEMENTO.Apagada, nodo_ant: ELEMENTO.EsperandoSeleccion, accion:'presionarBotonApagado()' },
    [ELEMENTO.t_cafeListo]: { nodo_sig: ELEMENTO.Sirviendo, nodo_ant: ELEMENTO.PreparandoCafe, accion:'cafeListo()' },
    [ELEMENTO.t_errorPreparacion]: { nodo_sig: ELEMENTO.EsperandoSeleccion, nodo_ant: ELEMENTO.PreparandoCafe, accion:'errorPreparacion()' },
    [ELEMENTO.t_cafeServido]: { nodo_sig: ELEMENTO.EsperandoSeleccion, nodo_ant: ELEMENTO.Sirviendo, accion:'cafeServido()' },
    [ELEMENTO.t_activarMantenimiento]: { nodo_sig: ELEMENTO.Mantenimiento, nodo_ant: ELEMENTO.EsperandoSeleccion, accion:'activarMantenimiento()' },
    [ELEMENTO.t_finalizarMantenimiento]: { nodo_sig: ELEMENTO.EsperandoSeleccion, nodo_ant: ELEMENTO.Mantenimiento, accion:'finalizarMantenimiento()' },
    [ELEMENTO.t_sistemaDesconectado]: { nodo_sig: ELEMENTO.ESTADO_FINAL, nodo_ant: ELEMENTO.Apagada, accion:'sistemaDesconectado()' }
};

// ===============================
// Utilidades
// ===============================
function obtenerEstados(){ return Object.keys(ELEMENTOS_TIPO).filter(k=>ELEMENTOS_TIPO[k]!==TIPO_ELEMN.TRANSICION); }
function obtenerTransiciones(){ return Object.keys(ELEMENTOS_TIPO).filter(k=>ELEMENTOS_TIPO[k]===TIPO_ELEMN.TRANSICION); }
function obtenerAcciones(){ return obtenerTransiciones().map(t=>NODO_INFO[t].accion); }
function randomElemento(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function generarOpciones(correcta,pool){ 
    let opciones = new Set(); 
    opciones.add(correcta); 
    while(opciones.size<4){ 
        let o=randomElemento(pool); 
        if(o!==correcta) opciones.add(o);
    } 
    return [...opciones].sort(()=>Math.random()-0.5); 
}

// ===============================
// Generador de Preguntas
// ===============================
function generarPregunta(){
    let tipo = Math.floor(Math.random()*3);
    tipo+=1;
    if(tipo===0) return preguntaConceptual();
    if(tipo===1) return preguntaEstadoOrigen();
    if(tipo===2) return preguntaEstadoDestino();
    if(tipo===3) return preguntaAccionEstado();
}
function estadoHTML(estado){
    return `<span class="font-bold text-black-600">${estado}</span>`;
}
function preguntaConceptual(){
    const correcta = "Representa un elemento del sistema en un momento específico";
    const pool = [correcta,"Solo el estado inicial","Solo una transición","Solo un estado final"];
    return {pregunta:"¿Qué es un estado según el modelado de estados?", correcta, opciones: generarOpciones(correcta,pool)};
}

function preguntaEstadoOrigen(){
    let t = randomElemento(obtenerTransiciones());
    let correcta = NODO_INFO[t].nodo_ant;
    return {pregunta:`¿Qué estado lanzó la acción ${estadoHTML(NODO_INFO[t].accion)}?`, correcta, opciones: generarOpciones(correcta,obtenerEstados())};
}

function preguntaEstadoDestino(){
    let t = randomElemento(obtenerTransiciones());
    let correcta = NODO_INFO[t].nodo_sig;
    return {pregunta:`¿Qué estado sigue si ocurre la acción ${estadoHTML(NODO_INFO[t].accion)}?`, correcta, opciones: generarOpciones(correcta,obtenerEstados())};
}

function preguntaAccionEstado(){
    let estado = randomElemento(obtenerEstados());
    let trans = NODO_INFO[estado].nodo_sig;
    let t_trans = NODO_INFO[estado].nodo_sig;
    if(!trans) return preguntaEstadoDestino();
    if(Array.isArray(trans)) trans=randomElemento(trans);
    let correcta = NODO_INFO[trans].accion;
    let ops = generarOpciones(correcta,obtenerAcciones())
    ops.forEach(e=>{if (t_trans.includes(e) && e!==correcta){
        ops.remove(e);
        ops.add(ELEMENTO.ESTADO_FINAL)

    }});
    return {pregunta:`¿Qué acción puede salir del estado ${estadoHTML(estado)}?`, correcta, opciones: ops };
}

// ===============================
// ESTADO DEL JUEGO
// ===============================
let tiempo = 60, puntaje = 0, errores = 0, racha = 0, rachaMaxima = 0;
let tiempo_espera = 5
let preguntaActual = null, timer = null, juegoActivo = false;
const TIEMPO_BASE = 60; // 1 minuto

// ===============================
// SISTEMA DE TIEMPO AVANZADO
// ===============================
function actualizarTiempo(){
    if (tiempo > 10) {
        // Normal: resta 5 segundos
        tiempo -= tiempo_espera;
    } else if (tiempo === 10) {
        // En 10 segundos: resta 2 segundos
        tiempo_espera = 2
        tiempo -= tiempo_espera;

    } else {
        // Debajo de 10: se divide entre 2
        tiempo_espera = 1;
        tiempo -= tiempo_espera;
    }
    if (tiempo < 0) {
        tiempo = 0
        tiempo_espera = 5;
    };
}

function actualizarBarraTiempo(){
    const barra = document.getElementById('timer-bar');
    const porcentaje = (tiempo / TIEMPO_BASE) * 100;
    barra.style.width = porcentaje + '%';
    
    // Cambiar color según el tiempo restante
    if (tiempo > 30) {
        barra.className = 'timer-bar bg-success';
    } else if (tiempo > 10) {
        barra.className = 'timer-bar bg-warning';
    } else {
        barra.className = 'timer-bar bg-danger timer-warning';
    }
}

function iniciarTemporizador(){
    clearTimeout(timer);
    if (tiempo <= 0) {
        finalizarJuego('tiempo');
        return;
    }
    timer = setTimeout(() => {
        actualizarTiempo();
        actualizarBarraTiempo();
        actualizarDisplay();
        iniciarTemporizador();
    }, 1000*(tiempo_espera>=1? tiempo_espera: 1));
}

// ===============================
// CONTROL DEL JUEGO
// ===============================
function iniciarJuego(){
    // Resetear todo
    tiempo = TIEMPO_BASE;
    puntaje = 0;
    errores = 0;
    racha = 0;
    rachaMaxima = 0;
    juegoActivo = true;
    
    // Ocultar modal
    document.getElementById('modal-fin-juego').classList.add('invisible');
    
    // Actualizar display
    actualizarBarraTiempo();
    actualizarDisplay();
    
    // Generar primera pregunta
    nuevaPregunta();
    
    // Iniciar temporizador
    iniciarTemporizador();
    
    // Deshabilitar botón de iniciar
    document.getElementById('btn-iniciar').disabled = true;
    document.getElementById('btn-iniciar').classList.add('opacity-50', 'cursor-not-allowed');
}

function nuevaPregunta(){
    if (!juegoActivo) return;
    preguntaActual = generarPregunta();
    mostrarPregunta(preguntaActual);
}

function responder(opcion, btnElement){
    if (!juegoActivo || !preguntaActual) return;
    
    // Deshabilitar todos los botones
    const botones = document.querySelectorAll('#opciones button');
    botones.forEach(b => b.disabled = true);
    
    if (opcion === preguntaActual.correcta) {
        // Respuesta correcta
        btnElement.classList.add('correct');
        puntaje++;
        racha++;
        if (racha > rachaMaxima) rachaMaxima = racha;
        actualizarTiempo();
        actualizarBarraTiempo();
        actualizarDisplay();
        
        // Siguiente pregunta después de un breve delay
        setTimeout(() => {
            nuevaPregunta();
        }, 800);
    } else {
        // Respuesta incorrecta
        btnElement.classList.add('incorrect');
        // Mostrar la correcta
        botones.forEach(b => {
            if (b.innerText === preguntaActual.correcta) {
                b.classList.add('correct');
            }
        });
        errores++;
        racha = 0;
        actualizarDisplay();
        
        // Fin del juego después de un breve delay
        setTimeout(() => {
            finalizarJuego('error');
        }, 1500);
    }
}

function finalizarJuego(motivo){
    juegoActivo = false;
    clearTimeout(timer);
    
    // Calcular precisión
    const totalIntentos = puntaje + errores;
    const precision = totalIntentos > 0 ? Math.round((puntaje / totalIntentos) * 100) : 0;
    
    // Configurar modal
    const modal = document.getElementById('modal-fin-juego');
    const icon = document.getElementById('modal-icon');
    const titulo = document.getElementById('modal-titulo');
    const mensaje = document.getElementById('modal-mensaje');
    
    if (motivo === 'tiempo') {
        icon.innerText = '⏰';
        titulo.innerText = '¡Tiempo Agotado!';
        mensaje.innerText = 'Se acabó el tiempo. ¡Inténtalo de nuevo!';
    } else {
        icon.innerText = '❌';
        titulo.innerText = '¡Respuesta Incorrecta!';
        mensaje.innerText = 'Has cometido un error. ¡Mejora tu racha!';
    }
    
    document.getElementById('modal-puntaje').innerText = puntaje;
    document.getElementById('modal-errores').innerText = errores;
    document.getElementById('modal-racha').innerText = rachaMaxima;
    document.getElementById('modal-precision').innerText = precision + '%';
    
    // Mostrar modal
    if (juegoActivo)
        modal.classList.add('invisible');
    else
        modal.classList.remove('invisible');
    
    // Habilitar botón de iniciar
    document.getElementById('btn-iniciar').disabled = false;
    document.getElementById('btn-iniciar').classList.remove('opacity-50', 'cursor-not-allowed');
}

function reiniciarJuego(){
    iniciarJuego();
}

function actualizarDisplay(){
    document.getElementById('tiempo').innerText = tiempo;
    document.getElementById('puntaje').innerText = puntaje;
    document.getElementById('errores').innerText = errores;
    document.getElementById('racha').innerText = racha;
}

// ===============================
// Mostrar preguntas en HTML
// ===============================
function mostrarPregunta(p){
    document.getElementById("pregunta").innerHTML = p.pregunta;
    const cont = document.getElementById("opciones");
    cont.innerHTML = "";
    p.opciones.forEach(op => {
        let btn = document.createElement("button");
        btn.innerText = op;
        btn.className = "btn-option";
        btn.onclick = () => responder(op, btn);
        cont.appendChild(btn);
    });
}

// Inicializar display
actualizarDisplay();
actualizarBarraTiempo();
