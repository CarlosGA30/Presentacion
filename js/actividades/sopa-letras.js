const SIZE = 20;
let grid = Array(SIZE).fill().map(() => Array(SIZE).fill(''));
let isDragging = false;
let startCell = null;
let selectedCells = [];
let foundCount = 0;

// 1. Generar Grid
function buildGrid(data) {
    data.forEach(item => {
        let placed = false;
        while (!placed) {
            let dir = Math.random() > 0.5 ? {r:0, c:1} : {r:1, c:0}; // H o V
            let r = Math.floor(Math.random() * (SIZE - (dir.r * item.word.length)));
            let c = Math.floor(Math.random() * (SIZE - (dir.c * item.word.length)));
            let canPlace = true;
            for (let i = 0; i < item.word.length; i++) {
                if (grid[r + i*dir.r][c + i*dir.c] !== '' && grid[r + i*dir.r][c + i*dir.c] !== item.word[i]) { 
                    canPlace = false; break; 
                }
            }
            if (canPlace) {
                for (let i = 0; i < item.word.length; i++) grid[r + i*dir.r][c + i*dir.c] = item.word[i];
                placed = true;
            }
        }
    });
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (grid[r][c] === '') grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
    }
}

// 2. Renderizar Grid y pistas con soporte táctil
function render(data) {
    const gridDiv = document.getElementById('grid');
    const cluesUl = document.getElementById('clues');
    document.getElementById('total').innerText = data.length;

    // Limpia grid y pistas
    gridDiv.innerHTML = '';
    cluesUl.innerHTML = '';

    grid.forEach((row, r) => {
        row.forEach((letter, c) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = letter;
            cell.dataset.r = r;
            cell.dataset.c = c;

            // --- Desktop ---
            cell.onmousedown = () => { 
                isDragging = true; 
                startCell = {r, c}; 
                selectCell(cell); 
            };
            cell.onmouseenter = () => { 
                if (isDragging) updateSelection({r, c}); 
            };

            // --- Mobile touch ---
            cell.ontouchstart = (e) => {
                e.preventDefault(); // evita scroll
                isDragging = true;
                startCell = {r, c};
                selectCell(cell);
            };
            cell.ontouchmove = (e) => {
                e.preventDefault(); // evita scroll
                const touch = e.touches[0];
                const el = document.elementFromPoint(touch.clientX, touch.clientY);
                if (el && el.classList.contains('cell')) {
                    const r2 = parseInt(el.dataset.r);
                    const c2 = parseInt(el.dataset.c);
                    updateSelection({r: r2, c: c2});
                }
            };

            gridDiv.appendChild(cell);
        });
    });

    // Terminar selección
    window.onmouseup = () => { 
        if (isDragging) validateSelection(data); 
        isDragging = false; 
    };
    window.ontouchend = () => { 
        if (isDragging) validateSelection(data); 
        isDragging = false; 
    };

    // Renderizar pistas
    data.forEach(item => {
        const li = document.createElement('li');
        li.id = `hint-${item.word}`;
        li.innerHTML = `<span class="font-bold text-blue-500">•</span> ${item.hint}`;
        cluesUl.appendChild(li);
    });
}

function updateSelection(endCell) {
    document.querySelectorAll('.cell.selected').forEach(c => c.classList.remove('selected'));
    selectedCells = [];

    let dr = endCell.r - startCell.r;
    let dc = endCell.c - startCell.c;
    let steps = Math.max(Math.abs(dr), Math.abs(dc));
    
    let unitR = dr === 0 ? 0 : dr / Math.abs(dr);
    let unitC = dc === 0 ? 0 : dc / Math.abs(dc);

    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return;

    for (let i = 0; i <= steps; i++) {
        let r = startCell.r + (i * unitR);
        let c = startCell.c + (i * unitC);
        let el = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        if (el) {
            el.classList.add('selected');
            selectedCells.push(el);
        }
    }
}

function selectCell(el) {
    el.classList.add('selected');
    selectedCells = [el];
}

function validateSelection(data) {
    let word = selectedCells.map(c => c.textContent).join("");
    let reversed = word.split("").reverse().join("");
    
    let foundMatch = data.find(item => item.word === word || item.word === reversed);

    if (foundMatch) {
        selectedCells.forEach(c => {
            c.classList.remove('selected');
            c.classList.add('found');
        });
        const hintEl = document.getElementById(`hint-${foundMatch.word}`);
        if (hintEl) hintEl.classList.add('concept-done');
        document.getElementById('score').innerText = ++foundCount;
    } else {
        selectedCells.forEach(c => c.classList.remove('selected'));
    }
    selectedCells = [];
}

// Inicializar sopa de letras
function initSopaLetras(wordData){
    const data = [...wordData];

    // reset estado
    foundCount = 0;
    selectedCells = [];
    startCell = null;
    document.getElementById("score").textContent = 0;

    grid = Array(SIZE).fill().map(() => Array(SIZE).fill('')); // reset grid
    buildGrid(data);
    render(data);
}