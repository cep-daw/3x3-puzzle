let contadorClicks = 0;
let tiempoInicio;
let intervaloCronometro;
let juegoTerminado = false;
let tiempoFormateado;


//Rutas a las carpetas de imágenes del puzzle.
const carpetasImagenes = [
    "./img/3x3/set1/",
    "./img/3x3/set2/",
    "./img/3x3/set3/"
];

// Rutas a las imágenes que muestran el puzzle completo.
const imagenesPistas = [
    "./img/pistas/set1_pista.jpg",
    "./img/pistas/set2_pista.jpg",
    "./img/pistas/set3_pista.jpg"
];

//Selecciona aleatoriamente una carpeta de imágenes y su correspondiente pista.
const indiceAleatorio = Math.floor(Math.random() * carpetasImagenes.length);
const carpetaSeleccionada = carpetasImagenes[indiceAleatorio];
const imagenPistaSeleccionada = imagenesPistas[indiceAleatorio];

const ids = [
    ["id1", "id2", "id3"],
    ["id4", "id5", "id6"],
    ["id7", "id8", "id9"]
];

/**
 * Devuelve la ruta de la imagen asociada al valor dado.
 * Si el valor es 0, devuelve una cadena vacía.
 * @param {number} valor - El valor de la celda.
 * @returns {string} Ruta de la imagen.
 */
function obtenerImagen(valor) {
    return valor === 0 ? "" : `${carpetaSeleccionada}${valor}.jpg`;
}

/**
 * Inicializa una matriz 3x3 aleatoria de números entre 0 y 8 que sea solucionable.
 * @returns {number[][]} Matriz solucionable.
 */
function inicializarMatrizAleatoria() {
    let matriz;
    do {
        let numeros = Array.from({ length: 9 }, (_, i) => i);
        numeros = numeros.sort(() => Math.random() - 0.5);
        matriz = [
            [numeros[0], numeros[1], numeros[2]],
            [numeros[3], numeros[4], numeros[5]],
            [numeros[6], numeros[7], numeros[8]]
        ];
    } while (!esSolucionable(matriz));

    return matriz;
}

/**
 * Cuenta el número de inversiones en un arreglo plano.
 * @param {number[]} numeros - Lista de números a analizar.
 * @returns {number} Número de inversiones.
 */
function contarInversiones(numeros) {
    let inversiones = 0;
    for (let i = 0; i < numeros.length; i++) {
        for (let j = i + 1; j < numeros.length; j++) {
            if (numeros[i] > numeros[j] && numeros[i] !== 0 && numeros[j] !== 0) {
                inversiones++;
            }
        }
    }
    return inversiones;
}

/**
 * Verifica si una matriz de puzzle es solucionable.
 * Una matriz es solucionable si el número de inversiones es par.
 * @param {number[][]} matriz - Matriz del puzzle.
 * @returns {boolean} `true` si es solucionable, de lo contrario `false`.
 */
function esSolucionable(matriz) {
    const numeros = matriz.flat(); // Convierte la matriz en un array
    const inversions = contarInversiones(numeros);

    if (inversions % 2 === 0) { 
        console.log("Es solucionable");
        return true;
    } else {
        console.log("No es solucionable");
        return false;
    }
}

/**
 * Inicia el cronómetro y actualiza el tiempo cada segundo.
 */
function iniciarCronometro() {
    tiempoInicio = Date.now();
    intervaloCronometro = setInterval(actualizarCronometro, 1000); //cada segundo
}

/**
 * Actualiza el cronómetro en el DOM, mostrando el tiempo transcurrido en minutos y segundos.
 */
function actualizarCronometro() {
    const tiempoActual = Date.now();
    const segundosTranscurridos = Math.floor((tiempoActual - tiempoInicio) / 1000);

    // Calcula minutos y segundos
    const minutos = Math.floor(segundosTranscurridos / 60);
    const segundos = segundosTranscurridos % 60;
    const tiempoFormateado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

    // Actualiza HTML
    const elementoTiempo = document.querySelector(".tiempo");
    if (elementoTiempo) {
        elementoTiempo.textContent = `Tiempo: ${tiempoFormateado}`;
    }
}

/**
 * Detiene el cronómetro y cancela el intervalo.
 */
function detenerCronometro() {
    if (!juegoTerminado) {
        clearInterval(intervaloCronometro);
        juegoTerminado = true;      
    }
}


/**
 * Actualiza el contador de clicks en el DOM.
 */
function actualizarContadorClicks() {
    const elementoClicks = document.querySelector(".clicks");
    if (elementoClicks) {
        elementoClicks.textContent = "Clicks: " + contadorClicks;
    }
}

/**
 * Muestra un popup con la imagen completa de la solución al pasar el ratón sobre el ícono de pista (bombilla).
 * @function pistaBombilla
 * @description Este evento se activa cuando el usuario pasa el ratón sobre el elemento de pista. 
 * Muestra un popup (tooltip) con la imagen de la solución y lo oculta al retirar el ratón.
 */
function pistaBombilla() {
    const btnPista = document.getElementById("btnPista");
    const pistaPopup = document.getElementById("pistaPopup");
    const pistaOverlay = document.getElementById("pistaOverlay");

    if (!btnPista || !pistaPopup || !pistaOverlay) return;

    // Ocultar popup y overlay si se hace click fuera
    document.addEventListener("click", function (e) {
        if (
            pistaPopup.style.display === "block" &&
            !btnPista.contains(e.target) &&
            !pistaPopup.contains(e.target)
        ) {
            pistaPopup.style.display = "none";
            pistaOverlay.style.display = "none";
        }
    });

    btnPista.addEventListener("click", function (e) {
        e.stopPropagation();
        const isVisible = pistaPopup.style.display === "block";
        pistaPopup.style.display = isVisible ? "none" : "block";
        pistaOverlay.style.display = isVisible ? "none" : "block";
    });

    pistaOverlay.addEventListener("click", function () {
        pistaPopup.style.display = "none";
        pistaOverlay.style.display = "none";
    });
}

/**
 * Actualiza visualmente la cuadrícula del puzzle en la interfaz.
 * @function actualizarVista
 * @description Recorre la matriz del puzzle y actualiza cada celda con la imagen correspondiente
 * o la deja vacía si el valor es 0.
 */
function actualizarVista() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let celda = document.getElementById(ids[i][j]);
            let valor = matriz[i][j];

            // Elimina el contenido previo de la celda
            celda.innerHTML = "";

            // Si el valor no es 0, asigna una imagen
            if (valor !== 0) {
                let img = document.createElement("img");
                img.src = obtenerImagen(valor);
                celda.appendChild(img);
            }
        }
    }
}

/**
 * Maneja el evento de clic en una celda para intercambiarla con el espacio vacío.
 * @function intercambiar
 * @param {Event} event - Evento de clic generado al interactuar con una celda.
 * @description Llama a `checkMover` para verificar si el movimiento es válido,
 * actualiza la vista y verifica si el puzzle está resuelto.
 */
function intercambiar(event) {
    let fila = parseInt(this.getAttribute("data-fila"));
    let col = parseInt(this.getAttribute("data-col"));

    if (checkMover(fila, col)) {
        contadorClicks++;
        actualizarContadorClicks();
        actualizarVista();

        if (resuelto(tiempoFormateado)){
            detenerCronometro();
        }
    }
}

/**
 * Verifica si una celda puede moverse hacia el espacio vacío.
 * @function checkMover
 * @param {number} fila - Índice de la fila de la celda seleccionada.
 * @param {number} col - Índice de la columna de la celda seleccionada.
 * @returns {boolean} `true` si la celda puede moverse, de lo contrario `false`.
 */
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

/**
 * Intercambia dos posiciones en la matriz del puzzle.
 * @function swap
 * @param {number} fila1 - Índice de la primera fila.
 * @param {number} col1 - Índice de la primera columna.
 * @param {number} fila2 - Índice de la segunda fila.
 * @param {number} col2 - Índice de la segunda columna.
 * @description Realiza un intercambio de valores entre las posiciones especificadas.
 */
function swap(fila1, col1, fila2, col2) {
    [matriz[fila1][col1], matriz[fila2][col2]] = [matriz[fila2][col2], matriz[fila1][col1]];
}

/**
 * Verifica si el puzzle está resuelto.
 * @returns {boolean} `true` si está resuelto, de lo contrario `false`.
 */
function resuelto(tiempoFormateado) {
    if (esPuzzleResuelto(matriz)) {
        detenerCronometro();
        tiempoFormateado = calcularTiempoFormateado(tiempoInicio);
        mostrarPuzzleResuelto(imagenPistaSeleccionada, tiempoFormateado);
        return true;
    } else {
        console.log(`Solo tienes ${contarAciertos(matriz)} aciertos`);
        return false;
    }
}

/**
 * Verifica si la matriz actual coincide con la solución del puzzle.
 * @function esPuzzleResuelto
 * @param {number[][]} matriz - Matriz actual del puzzle.
 * @returns {boolean} `true` si la matriz está en el estado objetivo.
 */
function esPuzzleResuelto(matriz) {
    const totalAciertos = contarAciertos(matriz);
    return totalAciertos === 9;
}

/**
 * Cuenta cuántas celdas están en su posición correcta.
 * @function contarAciertos
 * @param {number[][]} matriz - Matriz del puzzle.
 * @returns {number} Número de celdas en su posición correcta.
 */
function contarAciertos(matriz) {
    let valor = 1;
    let totalAciertos = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (i === 2 && j === 2 && matriz[i][j] === 0) {
                totalAciertos++;
            } else if (matriz[i][j] === valor) {
                totalAciertos++;
            }
            valor++;
        }
    }

    return totalAciertos;
}

/**
 * Calcula el tiempo transcurrido desde el inicio del cronómetro y lo formatea.
 * @function calcularTiempoFormateado
 * @param {number} tiempoInicio - Marca de tiempo en milisegundos al inicio del cronómetro.
 * @returns {string} Tiempo transcurrido en formato "mm:ss".
 */
function calcularTiempoFormateado(tiempoInicio) {
    const tiempoFinal = Math.floor((Date.now() - tiempoInicio) / 1000);
    const minutos = Math.floor(tiempoFinal / 60);
    const segundos = tiempoFinal % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

/**
 * Crea un contenedor emergente para el puzzle resuelto.
 * @function crearContenedorResuelto
 * @returns {HTMLElement} Elemento div que contiene la vista del puzzle resuelto.
 */
function crearContenedorResuelto() {
    const resuelto = document.createElement("div");
    resuelto.id = "imagenResuelta";
    resuelto.style.position = "fixed";
    resuelto.style.top = "50%";
    resuelto.style.left = "50%";
    resuelto.style.transform = "translate(-50%, -50%)";
    resuelto.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    resuelto.style.zIndex = "9999";
    resuelto.style.padding = "20px";
    resuelto.style.borderRadius = "10px";
    return resuelto;
}

/**
 * Crea la imagen del puzzle resuelto.
 * @function crearImagenResuelta
 * @param {string} imagenPistaSeleccionada - Ruta de la imagen que representa la solución del puzzle.
 * @returns {HTMLImageElement} Imagen HTML del puzzle resuelto.
 */
function crearImagenResuelta(imagenPistaSeleccionada) {
    const imgResuelto = document.createElement("img");
    imgResuelto.src = imagenPistaSeleccionada;
    imgResuelto.alt = "Puzzle Resuelto";
    imgResuelto.style.maxWidth = "28vw";
    imgResuelto.style.height = "55vh";
    imgResuelto.style.border = "2px solid white";
    return imgResuelto;
}

/**
 * Crea un botón para cerrar la vista del puzzle resuelto.
 * @function crearBotonCerrar
 * @param {string} tiempoFormateado - Tiempo final formateado como "mm:ss".
 * @param {HTMLElement} resuelto - Contenedor del puzzle resuelto.
 * @returns {HTMLButtonElement} Botón para cerrar la vista y continuar con el flujo del juego.
 */
function crearBotonCerrar(tiempoFormateado, resuelto) {
    const boton = document.createElement("button");
    boton.textContent = "Continuar";
    boton.style.display = "block";
    boton.style.margin = "10px auto 0";
    boton.style.padding = "10px 20px";
    boton.style.fontSize = "16px";
    boton.style.cursor = "pointer";
    boton.style.border = "none";
    boton.style.backgroundColor = "#437CA5";
    boton.style.color = "white";
    boton.style.borderRadius = "40px";
    boton.style.transition = "background-color 0.3s ease";

    boton.addEventListener("click", () => {
        document.body.removeChild(resuelto);
        mostrarModalVictoria(tiempoFormateado); // Mostrar ventana modal después
    });

    return boton;
}

/**
 * Muestra el puzzle resuelto en un contenedor emergente.
 * @function mostrarPuzzleResuelto
 * @param {string} imagenPistaSeleccionada - Ruta de la imagen que representa la solución del puzzle.
 * @param {string} tiempoFormateado - Tiempo final formateado como "mm:ss".
 */
function mostrarPuzzleResuelto(imagenPistaSeleccionada, tiempoFormateado) {
    const imagenResuelta = crearContenedorResuelto();
    const img = crearImagenResuelta(imagenPistaSeleccionada);
    const closeButton = crearBotonCerrar(tiempoFormateado, imagenResuelta);

    imagenResuelta.appendChild(img);
    imagenResuelta.appendChild(closeButton);
    document.body.appendChild(imagenResuelta);
}

/**
 * Muestra la ventana modal de victoria, incluyendo el tiempo final y opciones de acción.
 * @function mostrarModalVictoria
 * @param {string} tiempoFormateado - Tiempo final formateado como "mm:ss".
 */
function mostrarModalVictoria(tiempoFormateado) {
    const mensajeTiempo = document.getElementById("mensajeTiempo");
    mensajeTiempo.textContent = `Tu tiempo: ${tiempoFormateado}`;

    const modal = document.getElementById("ventanaVictoria");
    modal.style.display = "flex";

    document.getElementById("btnReiniciar").addEventListener("click", () => {
        location.reload();
    });
}

/**
 * Asocia eventos de clic a las celdas del puzzle para permitir movimientos.
 * @function cargar
 * @description Configura atributos y eventos para cada celda del puzzle al inicio del juego.
 */
function cargar() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let celda = document.getElementById(ids[i][j]);
            celda.setAttribute("data-fila", i); // Asigna fila como atributo de datos
            celda.setAttribute("data-col", j); // Asigna columna como atributo de datos
            celda.addEventListener("click", intercambiar); // Agrega el evento de clic
        }
    }
}

/**
 * Inicializa el juego al cargar la página.
 * @function window.onload
 * @description Configura el puzzle inicial, actualiza la vista y asocia eventos.
 */
window.onload = function () {
    matriz = inicializarMatrizAleatoria();
    cargar();
    actualizarVista();
    actualizarContadorClicks();
    iniciarCronometro();
    pistaBombilla();

    // Cambiar la imagen de la pista
    document.getElementById("pistaPopup").innerHTML = `<img src="${imagenPistaSeleccionada}" alt="Pista del Puzzle">`;
};