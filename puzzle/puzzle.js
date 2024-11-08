// Inicializa una matriz 3x3 de forma aleatoria con números del 0 al 8.
function inicializarMatrizAleatoria() {
    let numeros = Array.from({ length: 9 }, (_, i) => i);
    numeros = numeros.sort(() => Math.random() - 0.5);

    let matriz = [
        [numeros[0], numeros[1], numeros[2]],
        [numeros[3], numeros[4], numeros[5]],
        [numeros[6], numeros[7], numeros[8]]
    ];

    return matriz;
}

// Matriz bidimensional de las id's del HTML.
var ids = [
    ["id1", "id2", "id3"],
    ["id4", "id5", "id6"],
    ["id7", "id8", "id9"]
];


// Ejecuta el juego al cargar la página cuando todos los recursos están cargados

window.onload = function () {
    matriz = inicializarMatrizAleatoria();
    cargar();
    actualizarVista();
};


// Asocia cada elemento del HTML al evento onclick para mover las celdas e identifica los elementos fila y col en la matriz

function cargar() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let parrafo = document.getElementById(ids[i][j]);
            parrafo.onclick = intercambiar;
            parrafo.setAttribute("fila", i);
            parrafo.setAttribute("col", j);
        }
    }
}

/**
 * Actualiza visualmente cada celda de la cuadrícula de juego en función de los valores de `matriz`.
 * 
 * La función recorre una matriz de 3x3 y asigna el valor de cada posición en `matriz`
 * al contenido de texto del elemento HTML correspondiente en la cuadrícula.
 * Si el valor es `0`, deja la celda vacía para representar un espacio.
 */
function actualizarVista() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let parrafo = document.getElementById(ids[i][j]);
            parrafo.innerText = matriz[i][j] === 0 ? "" : matriz[i][j]; // Deja vacío el espacio del 0
        }
    }
}

function intercambiar() {
    let fila = parseInt(this.getAttribute("fila"));
    let col = parseInt(this.getAttribute("col"));

    if (checkMover(fila, col)) {
        actualizarVista();
        resuelto();
    }
}

// Revisar si se puede mover
function checkMover(fila, col) {
    if (col < 2 && matriz[fila][col + 1] === 0) { // Derecha
        swap(fila, col, fila, col + 1);
        return true;
    } else if (col > 0 && matriz[fila][col - 1] === 0) { // Izquierda
        swap(fila, col, fila, col - 1);
        return true;
    } else if (fila < 2 && matriz[fila + 1][col] === 0) { // Abajo
        swap(fila, col, fila + 1, col);
        return true;
    } else if (fila > 0 && matriz[fila - 1][col] === 0) { // Arriba
        swap(fila, col, fila - 1, col);
        return true;
    }
    return false;
}

// Intercambiar posiciones en la matriz
function swap(fila1, col1, fila2, col2) {
    [matriz[fila1][col1], matriz[fila2][col2]] = [matriz[fila2][col2], matriz[fila1][col1]];
}

// Verificar si el puzzle está resuelto
function resuelto() {
    let valor = 1;
    let totalAciertos = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // 0 en la posición final = correcto
            if (i === 2 && j === 2 && matriz[i][j] === 0) {
                totalAciertos++;
            } else if (matriz[i][j] === valor) {
                totalAciertos++;
            }
            valor++;
        }
    }

    if (totalAciertos === 9) {
        alert("¡Puzzle resuelto!");
    } else {
        console.log("Solo tienes " + totalAciertos + " aciertos");
    }
}