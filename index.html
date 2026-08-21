// =========================================================
// MECHE - INDEX.JS
// =========================================================


// =========================================================
// VARIABLES DE CÁMARA
// =========================================================

let streamCamara = null;
let camaraActiva = false;


// =========================================================
// FOTO ACTUAL
// =========================================================

let fotoActual = "";


// =========================================================
// INICIO
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("index.js cargado correctamente");


    // =====================================================
    // MATERIALIZE
    // =====================================================

    if (typeof M === "undefined") {

        console.error("Materialize no está cargado");

        return;

    }


    // =====================================================
    // MENÚ DE LAS 3 RAYAS
    // =====================================================

    const sideMenu =
        document.getElementById("side-menu");


    if (sideMenu) {

        M.Sidenav.init(sideMenu, {
            edge: "right"
        });

        console.log("Menú funcionando");

    }


    // =====================================================
    // FORMULARIO DEL BOTÓN +
    // =====================================================

    const sideForm =
        document.getElementById("side-form");


    let formularioSidenav = null;


    if (sideForm) {

        formularioSidenav =
            M.Sidenav.init(sideForm, {
                edge: "right"
            })[0];

        console.log("Formulario + funcionando");

    }


    // =====================================================
    // INICIAR CÁMARA
    // =====================================================

    iniciarControlesCamara();


    // =====================================================
    // FORMULARIO
    // =====================================================

    const formulario =
        document.getElementById("formPlatillo");


    if (!formulario) {

        console.error(
            "No se encontró #formPlatillo"
        );

        cargarPlatillos();

        return;

    }


    // =====================================================
    // AGREGAR PLATILLO
    // =====================================================

    formulario.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // =============================================
            // OBTENER DATOS
            // =============================================

            const nombre =
                document.getElementById("title")
                    .value
                    .trim();


            const ingredientes =
                document.getElementById("ingredients")
                    .value
                    .trim();


            const precio =
                document.getElementById("price")
                    .value
                    .trim();


            // =============================================
            // VALIDACIONES
            // =============================================

            if (nombre === "") {

                M.toast({
                    html:
                        "Escribe el nombre del platillo",
                    classes:
                        "red"
                });

                return;

            }


            if (ingredientes === "") {

                M.toast({
                    html:
                        "Escribe los ingredientes",
                    classes:
                        "red"
                });

                return;

            }


            if (precio === "") {

                M.toast({
                    html:
                        "Escribe el precio",
                    classes:
                        "red"
                });

                return;

            }


            const precioNumero =
                Number(precio);


            if (
                isNaN(precioNumero) ||
                precioNumero < 0
            ) {

                M.toast({
                    html:
                        "Ingresa un precio válido",
                    classes:
                        "red"
                });

                return;

            }


            // =============================================
            // FIREBASE
            // =============================================

            if (typeof db === "undefined") {

                console.error(
                    "Firebase no está conectado"
                );

                M.toast({
                    html:
                        "Firebase no está conectado",
                    classes:
                        "red"
                });

                return;

            }


            // =============================================
            // BOTÓN
            // =============================================

            const boton =
                document.getElementById(
                    "btnAgregarPlatillo"
                );


            if (boton) {

                boton.disabled = true;

                boton.innerHTML = `
                    <i class="material-icons left">
                        hourglass_empty
                    </i>
                    Guardando...
                `;

            }


            // =============================================
            // GUARDAR EN FIRESTORE
            // =============================================

            db.collection("platillos")
                .add({

                    nombre:
                        nombre,

                    ingredientes:
                        ingredientes,

                    precio:
                        precioNumero,

                    // =====================================
                    // FOTO
                    // =====================================

                    foto:
                        fotoActual || "",

                    fecha:
                        new Date()

                })

                .then(function (docRef) {

                    console.log(
                        "Platillo guardado:",
                        docRef.id
                    );


                    // =====================================
                    // MENSAJE
                    // =====================================

                    M.toast({

                        html:
                            "Platillo agregado correctamente",

                        classes:
                            "green"

                    });


                    // =====================================
                    // LIMPIAR FORMULARIO
                    // =====================================

                    formulario.reset();

                    M.updateTextFields();


                    // =====================================
                    // LIMPIAR FOTO
                    // =====================================

                    limpiarFoto();


                    // =====================================
                    // CERRAR CÁMARA
                    // =====================================

                    detenerCamara();


                    // =====================================
                    // CERRAR PANEL
                    // =====================================

                    if (formularioSidenav) {

                        formularioSidenav.close();

                    }

                })

                .catch(function (error) {

                    console.error(
                        "Error al guardar:",
                        error
                    );


                    M.toast({

                        html:
                            "Error al guardar el platillo",

                        classes:
                            "red"

                    });

                })

                .finally(function () {

                    if (boton) {

                        boton.disabled = false;

                        boton.innerHTML = `
                            <i class="material-icons left">
                                add
                            </i>
                            Agregar Platillo
                        `;

                    }

                });

        }
    );


    // =====================================================
    // CARGAR PLATILLOS
    // =====================================================

    cargarPlatillos();

});



// =========================================================
// CARGAR PLATILLOS
// =========================================================

function cargarPlatillos() {

    if (typeof db === "undefined") {

        console.error(
            "Firebase no está disponible"
        );

        return;

    }


    const contenedor =
        document.querySelector(".recipes");


    if (!contenedor) {

        console.error(
            "No se encontró .recipes"
        );

        return;

    }


    db.collection("platillos")
        .onSnapshot(

            function (coleccion) {

                // =========================================
                // LIMPIAR
                // =========================================

                contenedor.innerHTML = "";


                // =========================================
                // SIN PLATILLOS
                // =========================================

                if (coleccion.empty) {

                    contenedor.innerHTML = `

                        <div
                            class="center grey-text"
                            style="
                                margin-top:40px;
                            "
                        >

                            <i
                                class="material-icons"
                                style="
                                    font-size:60px;
                                "
                            >
                                restaurant
                            </i>

                            <h5>
                                No hay platillos
                            </h5>

                            <p>
                                Presiona el botón +
                                para agregar un platillo.
                            </p>

                        </div>

                    `;

                    return;

                }


                // =========================================
                // RECORRER PLATILLOS
                // =========================================

                coleccion.forEach(
                    function (documento) {

                        const datos =
                            documento.data();

                        const id =
                            documento.id;


                        // =================================
                        // TARJETA
                        // =================================

                        const tarjeta =
                            document.createElement("div");


                        tarjeta.className =
                            "card-panel white";


                        tarjeta.setAttribute(
                            "data-id",
                            id
                        );


                        // =================================
                        // IMAGEN
                        // =================================

                        let imagenHTML = "";


                        if (
                            datos.foto &&
                            typeof datos.foto === "string" &&
                            datos.foto.trim() !== ""
                        ) {

                            imagenHTML = `

                                <img
                                    src="${escapeHTML(datos.foto)}"
                                    alt="${escapeHTML(
                                        datos.nombre ||
                                        "Platillo"
                                    )}"
                                    style="
                                        width:120px;
                                        height:120px;
                                        object-fit:cover;
                                        border-radius:12px;
                                        display:block;
                                        margin:0 auto 15px auto;
                                    "
                                >

                            `;

                        }

                        else {

                            imagenHTML = `

                                <div
                                    style="
                                        width:120px;
                                        height:120px;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        background:#eeeeee;
                                        border-radius:12px;
                                        margin:0 auto 15px auto;
                                    "
                                >

                                    <i
                                        class="
                                            material-icons
                                            grey-text
                                        "
                                        style="
                                            font-size:55px;
                                        "
                                    >
                                        restaurant
                                    </i>

                                </div>

                            `;

                        }


                        // =================================
                        // CONTENIDO
                        // =================================

                        tarjeta.innerHTML = `

                            <div>

                                ${imagenHTML}


                                <h5
                                    style="
                                        margin-top:0;
                                        font-weight:bold;
                                    "
                                >
                                    ${escapeHTML(
                                        datos.nombre ||
                                        "Sin nombre"
                                    )}
                                </h5>


                                <p>

                                    <strong>
                                        Ingredientes:
                                    </strong>

                                    ${escapeHTML(
                                        datos.ingredientes ||
                                        "Sin ingredientes"
                                    )}

                                </p>


                                <p
                                    style="
                                        font-size:18px;
                                        font-weight:bold;
                                    "
                                >

                                    $${Number(
                                        datos.precio || 0
                                    ).toFixed(2)} MXN

                                </p>


                                <div
                                    class="right-align"
                                >

                                    <button
                                        type="button"
                                        class="
                                            btn
                                            red
                                            waves-effect
                                            waves-light
                                            btn-eliminar-platillo
                                        "
                                        data-id="${escapeHTML(id)}"
                                    >

                                        <i
                                            class="
                                                material-icons
                                                left
                                            "
                                        >
                                            delete
                                        </i>

                                        Eliminar

                                    </button>

                                </div>


                                <div
                                    style="
                                        clear:both;
                                    "
                                ></div>

                            </div>

                        `;


                        contenedor.appendChild(
                            tarjeta
                        );

                    }
                );

            },

            function (error) {

                console.error(
                    "Error cargando platillos:",
                    error
                );

                M.toast({

                    html:
                        "Error al cargar los platillos",

                    classes:
                        "red"

                });

            }

        );

}



// =========================================================
// ELIMINAR PLATILLO
// =========================================================

function eliminarPlatillo(id) {

    if (!id) {

        return;

    }


    if (typeof db === "undefined") {

        M.toast({

            html:
                "Firebase no está conectado",

            classes:
                "red"

        });

        return;

    }


    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar este platillo?"
        );


    if (!confirmar) {

        return;

    }


    db.collection("platillos")
        .doc(id)
        .delete()

        .then(function () {

            M.toast({

                html:
                    "Platillo eliminado correctamente",

                classes:
                    "green"

            });

        })

        .catch(function (error) {

            console.error(
                "Error eliminando:",
                error
            );

            M.toast({

                html:
                    "No se pudo eliminar el platillo",

                classes:
                    "red"

            });

        });

}



// =========================================================
// BOTÓN ELIMINAR
// =========================================================

document.addEventListener(
    "click",
    function (event) {

        const boton =
            event.target.closest(
                ".btn-eliminar-platillo"
            );


        if (!boton) {

            return;

        }


        const id =
            boton.getAttribute(
                "data-id"
            );


        eliminarPlatillo(id);

    }
);



// =========================================================
// CÁMARA
// =========================================================

function iniciarControlesCamara() {

    const btnCamara =
        document.getElementById(
            "btnCamara"
        );


    const btnCapturar =
        document.getElementById(
            "btnCapturar"
        );


    const btnLimpiar =
        document.getElementById(
            "btnLimpiar"
        );


    const btnFoto =
        document.getElementById(
            "btnFoto"
        );


    const video =
        document.getElementById(
            "Video"
        );


    const canvas =
        document.getElementById(
            "Canvas"
        );


    if (
        !btnCamara ||
        !btnCapturar ||
        !btnLimpiar ||
        !video ||
        !canvas
    ) {

        console.warn(
            "No se encontraron todos los elementos de cámara."
        );

        return;

    }


    // =====================================================
    // SELECCIONAR FOTO
    // =====================================================

    if (btnFoto) {

        btnFoto.addEventListener(
            "change",
            function (event) {

                const archivo =
                    event.target.files &&
                    event.target.files[0];


                if (!archivo) {

                    return;

                }


                if (
                    !archivo.type.startsWith(
                        "image/"
                    )
                ) {

                    mostrarErrorCamara(
                        "Selecciona una imagen válida."
                    );

                    return;

                }


                mostrarEstadoCamara(
                    "Comprimiendo imagen..."
                );


                const lector =
                    new FileReader();


                lector.onload =
                    function (e) {

                        const imagen =
                            new Image();


                        imagen.onload =
                            function () {

                                const resultado =
                                    comprimirImagen(
                                        imagen
                                    );


                                fotoActual =
                                    resultado;


                                mostrarFoto(
                                    resultado
                                );


                                mostrarEstadoCamara(
                                    "✓ Imagen comprimida y lista."
                                );

                            };


                        imagen.onerror =
                            function () {

                                mostrarErrorCamara(
                                    "No se pudo cargar la imagen."
                                );

                            };


                        imagen.src =
                            e.target.result;

                    };


                lector.onerror =
                    function () {

                        mostrarErrorCamara(
                            "No se pudo leer la imagen."
                        );

                    };


                lector.readAsDataURL(
                    archivo
                );

            }
        );

    }


    // =====================================================
    // ABRIR CÁMARA
    // =====================================================

    btnCamara.addEventListener(
        "click",
        abrirCamara
    );


    // =====================================================
    // CAPTURAR
    // =====================================================

    btnCapturar.addEventListener(
        "click",
        capturarFoto
    );


    // =====================================================
    // LIMPIAR
    // =====================================================

    btnLimpiar.addEventListener(
        "click",
        limpiarFoto
    );

}



// =========================================================
// ABRIR CÁMARA
// =========================================================

async function abrirCamara() {

    const video =
        document.getElementById(
            "Video"
        );


    if (!video) {

        return;

    }


    const error =
        document.getElementById(
            "cameraError"
        );


    if (error) {

        error.textContent =
            "";

    }


    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        mostrarErrorCamara(
            "Tu navegador no permite usar la cámara."
        );

        return;

    }


    detenerCamara();


    mostrarEstadoCamara(
        "Solicitando permiso para usar la cámara..."
    );


    try {

        streamCamara =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode: {
                        ideal:
                            "environment"
                    },

                    width: {
                        ideal:
                            640
                    },

                    height: {
                        ideal:
                            480
                    }

                },

                audio:
                    false

            });


        video.srcObject =
            streamCamara;


        video.muted =
            true;


        video.setAttribute(
            "playsinline",
            ""
        );


        await video.play();


        camaraActiva =
            true;


        mostrarEstadoCamara(
            "✓ Cámara activa. Puedes tomar la foto."
        );


        video.style.display =
            "block";

    }

    catch (errorCamara) {

        console.error(
            "Error al abrir cámara:",
            errorCamara
        );


        camaraActiva =
            false;


        let mensaje =
            "No se pudo abrir la cámara.";


        if (
            errorCamara.name ===
            "NotAllowedError"
        ) {

            mensaje =
                "Permiso de cámara denegado.";

        }

        else if (
            errorCamara.name ===
            "NotFoundError"
        ) {

            mensaje =
                "No se encontró ninguna cámara.";

        }

        else if (
            errorCamara.name ===
            "NotReadableError"
        ) {

            mensaje =
                "La cámara está siendo utilizada por otra aplicación.";

        }

        else if (
            errorCamara.name ===
            "SecurityError"
        ) {

            mensaje =
                "El navegador bloqueó la cámara. Usa HTTPS o localhost.";

        }


        mostrarErrorCamara(
            mensaje
        );

    }

}



// =========================================================
// CAPTURAR FOTO
// =========================================================

function capturarFoto() {

    const video =
        document.getElementById(
            "Video"
        );


    const canvas =
        document.getElementById(
            "Canvas"
        );


    if (
        !video ||
        !canvas
    ) {

        return;

    }


    if (
        !streamCamara ||
        !camaraActiva ||
        video.readyState < 2
    ) {

        mostrarErrorCamara(
            "Primero activa la cámara."
        );

        return;

    }


    const ancho =
        video.videoWidth;


    const alto =
        video.videoHeight;


    if (
        !ancho ||
        !alto
    ) {

        mostrarErrorCamara(
            "La cámara todavía no está lista."
        );

        return;

    }


    // =====================================================
    // REDUCIR FOTO
    // =====================================================

    const maxWidth =
        500;


    let nuevoAncho =
        ancho;


    let nuevoAlto =
        alto;


    if (
        nuevoAncho >
        maxWidth
    ) {

        nuevoAlto =
            nuevoAlto *
            (
                maxWidth /
                nuevoAncho
            );


        nuevoAncho =
            maxWidth;

    }


    canvas.width =
        Math.round(
            nuevoAncho
        );


    canvas.height =
        Math.round(
            nuevoAlto
        );


    const contexto =
        canvas.getContext(
            "2d",
            {
                alpha: false
            }
        );


    contexto.imageSmoothingEnabled =
        true;


    contexto.imageSmoothingQuality =
        "medium";


    contexto.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =====================================================
    // JPEG COMPRIMIDO
    // =====================================================

    const imagen =
        canvas.toDataURL(
            "image/jpeg",
            0.40
        );


    fotoActual =
        imagen;


    mostrarFoto(
        imagen
    );


    mostrarEstadoCamara(
        "✓ Foto capturada y comprimida."
    );


    const error =
        document.getElementById(
            "cameraError"
        );


    if (error) {

        error.textContent =
            "";

    }

}



// =========================================================
// COMPRIMIR IMAGEN
// =========================================================

function comprimirImagen(
    imagen
) {

    const canvas =
        document.createElement(
            "canvas"
        );


    // =====================================================
    // ANCHO MÁXIMO
    // =====================================================

    const maxWidth =
        500;


    let ancho =
        imagen.width;


    let alto =
        imagen.height;


    if (
        ancho >
        maxWidth
    ) {

        alto =
            alto *
            (
                maxWidth /
                ancho
            );


        ancho =
            maxWidth;

    }


    canvas.width =
        Math.round(
            ancho
        );


    canvas.height =
        Math.round(
            alto
        );


    const contexto =
        canvas.getContext(
            "2d",
            {
                alpha: false
            }
        );


    contexto.imageSmoothingEnabled =
        true;


    contexto.imageSmoothingQuality =
        "medium";


    contexto.drawImage(
        imagen,
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =====================================================
    // CALIDAD JPEG
    // =====================================================

    return canvas.toDataURL(
        "image/jpeg",
        0.40
    );

}



// =========================================================
// MOSTRAR FOTO
// =========================================================

function mostrarFoto(
    imagen
) {

    const foto =
        document.getElementById(
            "foto"
        );


    const fotoInput =
        document.getElementById(
            "fotoInput"
        );


    if (foto) {

        foto.src =
            imagen;


        foto.style.display =
            "block";

    }


    if (fotoInput) {

        fotoInput.value =
            imagen;

    }

}



// =========================================================
// LIMPIAR FOTO
// =========================================================

function limpiarFoto() {

    fotoActual =
        "";


    const foto =
        document.getElementById(
            "foto"
        );


    const fotoInput =
        document.getElementById(
            "fotoInput"
        );


    const btnFoto =
        document.getElementById(
            "btnFoto"
        );


    if (foto) {

        foto.src =
            "";


        foto.style.display =
            "none";

    }


    if (fotoInput) {

        fotoInput.value =
            "";

    }


    if (btnFoto) {

        btnFoto.value =
            "";

    }


    mostrarEstadoCamara(
        "Cámara lista para tomar una foto."
    );


    const error =
        document.getElementById(
            "cameraError"
        );


    if (error) {

        error.textContent =
            "";

    }

}



// =========================================================
// MENSAJES DE CÁMARA
// =========================================================

function mostrarEstadoCamara(
    mensaje
) {

    const elemento =
        document.getElementById(
            "cameraStatus"
        );


    if (elemento) {

        elemento.textContent =
            mensaje;

    }

}



function mostrarErrorCamara(
    mensaje
) {

    const elemento =
        document.getElementById(
            "cameraError"
        );


    if (elemento) {

        elemento.textContent =
            mensaje;

    }


    const status =
        document.getElementById(
            "cameraStatus"
        );


    if (status) {

        status.textContent =
            "Cámara no disponible.";

    }

}



// =========================================================
// DETENER CÁMARA
// =========================================================

function detenerCamara() {

    if (streamCamara) {

        streamCamara
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();

                }
            );

    }


    streamCamara =
        null;


    camaraActiva =
        false;


    const video =
        document.getElementById(
            "Video"
        );


    if (video) {

        video.srcObject =
            null;

    }

}



// =========================================================
// ESCAPAR HTML
// =========================================================

function escapeHTML(
    texto
) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }


    return String(texto)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



// =========================================================
// DETENER CÁMARA AL SALIR
// =========================================================

window.addEventListener(
    "beforeunload",
    function () {

        detenerCamara();

    }
);
