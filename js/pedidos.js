// =========================================================
// PEDIDOS.JS - MECHE
// =========================================================

console.log("=================================");
console.log("PEDIDOS.JS CARGADO");
console.log("=================================");


// =========================================================
// VARIABLES
// =========================================================

let map = null;
let marcador = null;

let platillos = {};

let streamCamara = null;
let fotoDataURL = null;


// =========================================================
// INICIO
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Página de pedidos cargada");


    // =====================================================
    // MENÚ LATERAL
    // =====================================================

    const sideMenu =
        document.getElementById("side-menu");


    if (sideMenu) {

        if (typeof M !== "undefined") {

            M.Sidenav.init(sideMenu, {
                edge: "right"
            });

            console.log(
                "Materialize: menú lateral iniciado"
            );

        } else {

            console.warn(
                "Materialize no está cargado."
            );

            // Menú manual
            const botonMenu =
                document.querySelector(
                    ".sidenav-trigger"
                );

            if (botonMenu) {

                botonMenu.addEventListener(
                    "click",
                    function () {

                        sideMenu.classList.toggle(
                            "mostrar-menu"
                        );

                    }
                );

            }

        }

    }


    // =====================================================
    // INICIAR MAPA
    // =====================================================

    iniciarMapa();


    // =====================================================
    // CARGAR PLATILLOS
    // =====================================================

    cargarPlatillos();


    // =====================================================
    // SELECT DE PLATILLOS
    // =====================================================

    const lista =
        document.getElementById(
            "listaPlatillos"
        );


    if (lista) {

        lista.addEventListener(
            "change",
            function () {

                console.log(
                    "Platillo seleccionado:",
                    this.value
                );

                mostrarInformacionPlatillo(
                    this.value
                );

            }
        );

    }


    // =====================================================
    // BOTÓN UBICACIÓN
    // =====================================================

    const btnUbicacion =
        document.getElementById(
            "btnUbicacion"
        );


    if (btnUbicacion) {

        btnUbicacion.addEventListener(
            "click",
            obtenerUbicacion
        );

    }


    // =====================================================
    // BOTÓN CÁMARA
    // =====================================================

    const btnCamara =
        document.getElementById(
            "btnCamara"
        );


    if (btnCamara) {

        btnCamara.addEventListener(
            "click",
            iniciarCamara
        );

    }


    // =====================================================
    // BOTÓN TOMAR FOTO
    // =====================================================

    const btnCapturar =
        document.getElementById(
            "btnCapturar"
        );


    if (btnCapturar) {

        btnCapturar.addEventListener(
            "click",
            tomarFoto
        );

    }


    // =====================================================
    // BOTÓN CANCELAR
    // =====================================================

    const btnCancelar =
        document.getElementById(
            "btnCancelar"
        );


    if (btnCancelar) {

        btnCancelar.addEventListener(
            "click",
            limpiarPedido
        );

    }


    // =====================================================
    // BOTÓN GUARDAR
    // =====================================================

    const btnGuardar =
        document.getElementById(
            "btnGuardar"
        );


    if (btnGuardar) {

        btnGuardar.addEventListener(
            "click",
            guardarPedido
        );

    }


    console.log(
        "Todos los eventos configurados."
    );

});


// =========================================================
// INICIAR MAPA
// =========================================================

function iniciarMapa() {

    const mapaElemento =
        document.getElementById("mapa");


    if (!mapaElemento) {

        console.warn(
            "No existe #mapa"
        );

        return;

    }


    // =====================================================
    // SI LEAFLET NO ESTÁ CARGADO
    // =====================================================

    if (typeof L === "undefined") {

        console.warn(
            "Leaflet no está cargado."
        );

        mapaElemento.innerHTML = `
            <div style="
                padding:30px;
                text-align:center;
                background:#eeeeee;
                border-radius:10px;
            ">

                <i class="material-icons">
                    location_on
                </i>

                <br>

                El mapa se mostrará cuando
                obtengas tu ubicación.

            </div>
        `;

        return;

    }


    // =====================================================
    // POSICIÓN INICIAL
    // =====================================================

    const posicionInicial = [
        19.4326,
        -99.1332
    ];


    map =
        L.map("mapa")
        .setView(
            posicionInicial,
            12
        );


    // =====================================================
    // OPENSTREETMAP
    // =====================================================

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"

        }
    ).addTo(map);


    // =====================================================
    // MARCADOR
    // =====================================================

    marcador =
        L.marker(
            posicionInicial
        ).addTo(map);


    marcador.bindPopup(
        "Ubicación inicial"
    );


    console.log(
        "Mapa iniciado correctamente."
    );

}


// =========================================================
// CARGAR PLATILLOS DESDE FIREBASE
// =========================================================

function cargarPlatillos() {

    console.log(
        "Intentando cargar platillos..."
    );


    // =====================================================
    // COMPROBAR FIREBASE
    // =====================================================

    if (typeof db === "undefined") {

        console.error(
            "ERROR: db NO está definido."
        );

        mostrarErrorPlatillos(
            "Firebase no está disponible."
        );

        return;

    }


    console.log(
        "Firebase encontrado correctamente."
    );


    const select =
        document.getElementById(
            "listaPlatillos"
        );


    if (!select) {

        console.error(
            "No existe #listaPlatillos"
        );

        return;

    }


    // =====================================================
    // LEER PLATILLOS
    // =====================================================

    db.collection("platillos")
        .onSnapshot(

            function (coleccion) {

                console.log(
                    "Colección platillos recibida."
                );


                console.log(
                    "Cantidad:",
                    coleccion.size
                );


                select.innerHTML = "";


                // OPCIÓN INICIAL

                const opcionInicial =
                    document.createElement(
                        "option"
                    );


                opcionInicial.value = "";

                opcionInicial.textContent =
                    "Selecciona un platillo";


                opcionInicial.selected =
                    true;


                select.appendChild(
                    opcionInicial
                );


                platillos = {};


                // =================================================
                // SI NO HAY PLATILLOS
                // =================================================

                if (coleccion.empty) {

                    const opcionVacia =
                        document.createElement(
                            "option"
                        );


                    opcionVacia.disabled =
                        true;


                    opcionVacia.textContent =
                        "No hay platillos registrados";


                    select.appendChild(
                        opcionVacia
                    );


                    return;

                }


                // =================================================
                // RECORRER PLATILLOS
                // =================================================

                coleccion.forEach(
                    function (documento) {

                        const datos =
                            documento.data();


                        const id =
                            documento.id;


                        console.log(
                            "Platillo:",
                            id,
                            datos
                        );


                        platillos[id] =
                            datos;


                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            id;


                        option.textContent =
                            (datos.nombre ||
                                "Platillo sin nombre") +
                            " - $" +
                            parseFloat(
                                datos.precio || 0
                            ).toFixed(2);


                        select.appendChild(
                            option
                        );

                    }
                );


                console.log(
                    "Platillos cargados:",
                    coleccion.size
                );

            },

            function (error) {

                console.error(
                    "Error cargando platillos:",
                    error
                );


                mostrarErrorPlatillos(
                    "Error al cargar los platillos."
                );

            }

        );

}


// =========================================================
// ERROR DE PLATILLOS
// =========================================================

function mostrarErrorPlatillos(
    mensaje
) {

    const select =
        document.getElementById(
            "listaPlatillos"
        );


    if (!select) {
        return;
    }


    select.innerHTML = "";


    const option =
        document.createElement(
            "option"
        );


    option.value = "";

    option.textContent =
        mensaje;


    select.appendChild(
        option
    );

}


// =========================================================
// MOSTRAR INFORMACIÓN DEL PLATILLO
// =========================================================

function mostrarInformacionPlatillo(
    id
) {

    const ingredientesVista =
        document.getElementById(
            "ingredientesVista"
        );


    const costoVista =
        document.getElementById(
            "costoVista"
        );


    // =====================================================
    // EL HTML PRINCIPAL DE MECHE NO TIENE ESTOS CAMPOS
    // PERO LOS BUSCAMOS POR SI LOS AGREGAS
    // =====================================================

    const ingredientesInput =
        document.getElementById(
            "txtIngredientes"
        );


    const costoInput =
        document.getElementById(
            "txtCosto"
        );


    if (!id || !platillos[id]) {

        if (ingredientesVista) {

            ingredientesVista.textContent =
                "Selecciona un platillo";

        }


        if (costoVista) {

            costoVista.textContent =
                "$0.00 MXN";

        }


        if (ingredientesInput) {

            ingredientesInput.value =
                "";

        }


        if (costoInput) {

            costoInput.value =
                "$0.00 MXN";

        }


        actualizarMaterialize();

        return;

    }


    const platillo =
        platillos[id];


    const ingredientes =
        platillo.ingredientes ||
        "No especificados";


    const precio =
        parseFloat(
            platillo.precio || 0
        );


    console.log(
        "Mostrando información:",
        platillo
    );


    if (ingredientesVista) {

        ingredientesVista.textContent =
            ingredientes;

    }


    if (costoVista) {

        costoVista.textContent =
            "$" +
            precio.toFixed(2) +
            " MXN";

    }


    if (ingredientesInput) {

        ingredientesInput.value =
            ingredientes;

    }


    if (costoInput) {

        costoInput.value =
            "$" +
            precio.toFixed(2) +
            " MXN";

    }


    actualizarMaterialize();

}


// =========================================================
// OBTENER UBICACIÓN
// =========================================================

function obtenerUbicacion() {

    if (!navigator.geolocation) {

        mostrarMensaje(
            "Tu navegador no permite obtener ubicación.",
            "red"
        );

        return;

    }


    const btn =
        document.getElementById(
            "btnUbicacion"
        );


    if (btn) {

        btn.disabled =
            true;

        btn.innerHTML = `
            <i class="material-icons left">
                location_searching
            </i>
            Obteniendo...
        `;

    }


    mostrarMensaje(
        "Obteniendo ubicación...",
        "blue"
    );


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitud =
                position.coords.latitude;


            const longitud =
                position.coords.longitude;


            console.log(
                "Latitud:",
                latitud
            );


            console.log(
                "Longitud:",
                longitud
            );


            // =================================================
            // CAMPOS DEL HTML PRINCIPAL
            // =================================================

            const direccion =
                document.getElementById(
                    "title"
                );


            if (direccion) {

                direccion.value =
                    "Lat: " +
                    latitud.toFixed(6) +
                    ", Lon: " +
                    longitud.toFixed(6);

            }


            // =================================================
            // CAMPOS OCULTOS SI EXISTEN
            // =================================================

            const txtLatitud =
                document.getElementById(
                    "txtLatitud"
                );


            const txtLongitud =
                document.getElementById(
                    "txtLongitud"
                );


            if (txtLatitud) {

                txtLatitud.value =
                    latitud;

            }


            if (txtLongitud) {

                txtLongitud.value =
                    longitud;

            }


            // =================================================
            // MOSTRAR MAPA
            // =================================================

            mostrarMapaUbicacion(
                latitud,
                longitud
            );


            // =================================================
            // OBTENER DIRECCIÓN REAL
            // =================================================

            obtenerDireccion(
                latitud,
                longitud
            );


        },

        function (error) {

            console.error(
                "Error de ubicación:",
                error
            );


            let mensaje =
                "No se pudo obtener la ubicación.";


            switch (error.code) {

                case 1:

                    mensaje =
                        "Permiso de ubicación denegado.";

                    break;


                case 2:

                    mensaje =
                        "Ubicación no disponible.";

                    break;


                case 3:

                    mensaje =
                        "Tiempo agotado.";

                    break;

            }


            mostrarMensaje(
                mensaje,
                "red"
            );


            restaurarBotonUbicacion();

        },

        {

            enableHighAccuracy:
                true,

            timeout:
                20000,

            maximumAge:
                0

        }

    );

}


// =========================================================
// MOSTRAR UBICACIÓN EN MAPA
// =========================================================

function mostrarMapaUbicacion(
    latitud,
    longitud
) {

    const mapaElemento =
        document.getElementById(
            "mapa"
        );


    if (!mapaElemento) {
        return;
    }


    // =====================================================
    // SI LEAFLET NO EXISTE
    // =====================================================

    if (typeof L === "undefined") {

        mapaElemento.style.display =
            "block";


        mapaElemento.innerHTML = `

            <div style="
                background:#eeeeee;
                padding:25px;
                text-align:center;
                border-radius:10px;
            ">

                <i
                    class="material-icons"
                    style="font-size:40px;"
                >
                    location_on
                </i>

                <br>

                <strong>
                    Ubicación obtenida
                </strong>

                <br><br>

                Latitud:
                ${latitud.toFixed(6)}

                <br>

                Longitud:
                ${longitud.toFixed(6)}

            </div>

        `;

        return;

    }


    // =====================================================
    // CREAR MAPA SI NO EXISTE
    // =====================================================

    if (!map) {

        iniciarMapa();

    }


    if (!map) {
        return;
    }


    // =====================================================
    // MOVER MAPA
    // =====================================================

    map.setView(
        [
            latitud,
            longitud
        ],
        17
    );


    // =====================================================
    // MOVER MARCADOR
    // =====================================================

    if (!marcador) {

        marcador =
            L.marker([
                latitud,
                longitud
            ]).addTo(map);

    } else {

        marcador.setLatLng([
            latitud,
            longitud
        ]);

    }


    marcador.bindPopup(
        "Tu ubicación"
    );


    marcador.openPopup();

}


// =========================================================
// OBTENER DIRECCIÓN CON OPENSTREETMAP
// =========================================================

async function obtenerDireccion(
    latitud,
    longitud
) {

    const direccion =
        document.getElementById(
            "title"
        );


    if (!direccion) {
        return;
    }


    direccion.value =
        "Buscando dirección...";


    actualizarMaterialize();


    try {

        const url =
            "https://nominatim.openstreetmap.org/reverse" +
            "?format=jsonv2" +
            "&lat=" +
            encodeURIComponent(latitud) +
            "&lon=" +
            encodeURIComponent(longitud) +
            "&zoom=18" +
            "&addressdetails=1";


        const respuesta =
            await fetch(
                url,
                {
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo obtener la dirección."
            );

        }


        const datos =
            await respuesta.json();


        const address =
            datos.address || {};


        const calle =
            address.road ||
            address.pedestrian ||
            "";


        const numero =
            address.house_number ||
            "";


        const colonia =
            address.suburb ||
            address.neighbourhood ||
            "";


        const ciudad =
            address.city ||
            address.town ||
            address.village ||
            "";


        const estado =
            address.state ||
            "";


        const codigoPostal =
            address.postcode ||
            "";


        let direccionFinal =
            "";


        if (calle) {

            direccionFinal +=
                calle;

        }


        if (numero) {

            direccionFinal +=
                " " +
                numero;

        }


        if (colonia) {

            direccionFinal +=
                ", " +
                colonia;

        }


        if (ciudad) {

            direccionFinal +=
                ", " +
                ciudad;

        }


        if (estado) {

            direccionFinal +=
                ", " +
                estado;

        }


        if (codigoPostal) {

            direccionFinal +=
                ", C.P. " +
                codigoPostal;

        }


        if (!direccionFinal.trim()) {

            direccionFinal =
                datos.display_name ||
                latitud +
                ", " +
                longitud;

        }


        direccion.value =
            direccionFinal;


        actualizarMaterialize();


        mostrarMensaje(
            "Ubicación obtenida correctamente.",
            "green"
        );


        if (marcador) {

            marcador.bindPopup(
                "<strong>Ubicación de entrega</strong><br>" +
                direccionFinal
            );

            marcador.openPopup();

        }


        restaurarBotonUbicacion(
            true
        );

    }

    catch (error) {

        console.error(
            "Error obteniendo dirección:",
            error
        );


        direccion.value =
            latitud +
            ", " +
            longitud;


        actualizarMaterialize();


        mostrarMensaje(
            "Ubicación obtenida, pero no se encontró la dirección.",
            "orange"
        );


        restaurarBotonUbicacion();

    }

}


// =========================================================
// INICIAR CÁMARA
// =========================================================

async function iniciarCamara() {

    const video =
        document.getElementById(
            "videoCamara"
        );


    const contenedor =
        document.getElementById(
            "contenedorCamara"
        );


    if (!video || !contenedor) {

        console.error(
            "No se encontraron los elementos de cámara."
        );

        return;

    }


    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        mostrarMensaje(
            "Tu navegador no permite utilizar la cámara.",
            "red"
        );

        return;

    }


    try {

        streamCamara =
            await navigator.mediaDevices.getUserMedia({

                video:
                    true,

                audio:
                    false

            });


        video.srcObject =
            streamCamara;


        contenedor.style.display =
            "block";


        console.log(
            "Cámara encendida."
        );

    }

    catch (error) {

        console.error(
            "Error de cámara:",
            error
        );


        mostrarMensaje(
            "No se pudo abrir la cámara. Revisa los permisos.",
            "red"
        );

    }

}


// =========================================================
// TOMAR FOTO
// =========================================================

function tomarFoto() {

    const video =
        document.getElementById(
            "videoCamara"
        );


    const canvas =
        document.getElementById(
            "canvasFoto"
        );


    const preview =
        document.getElementById(
            "fotoPreview"
        );


    const contenedor =
        document.getElementById(
            "contenedorPreview"
        );


    if (!video || !canvas) {

        return;

    }


    if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ) {

        mostrarMensaje(
            "La cámara todavía no está lista.",
            "orange"
        );

        return;

    }


    canvas.width =
        video.videoWidth;


    canvas.height =
        video.videoHeight;


    const contexto =
        canvas.getContext("2d");


    contexto.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    fotoDataURL =
        canvas.toDataURL(
            "image/jpeg",
            0.7
        );


    if (preview) {

        preview.src =
            fotoDataURL;

    }


    if (contenedor) {

        contenedor.style.display =
            "block";

    }


    detenerCamara();


    mostrarMensaje(
        "Foto tomada correctamente.",
        "green"
    );

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


        streamCamara =
            null;

    }


    const video =
        document.getElementById(
            "videoCamara"
        );


    const contenedor =
        document.getElementById(
            "contenedorCamara"
        );


    if (video) {

        video.srcObject =
            null;

    }


    if (contenedor) {

        contenedor.style.display =
            "none";

    }

}


// =========================================================
// GUARDAR PEDIDO
// =========================================================

function guardarPedido() {

    const lista =
        document.getElementById(
            "listaPlatillos"
        );


    const direccion =
        document.getElementById(
            "title"
        );


    const usuario =
        document.getElementById(
            "usuario"
        );


    // =====================================================
    // VALIDAR PLATILLO
    // =====================================================

    if (!lista || !lista.value) {

        mostrarMensaje(
            "Selecciona un platillo.",
            "orange"
        );

        return;

    }


    // =====================================================
    // VALIDAR DIRECCIÓN
    // =====================================================

    if (
        !direccion ||
        !direccion.value.trim()
    ) {

        mostrarMensaje(
            "Ingresa una dirección.",
            "orange"
        );


        if (direccion) {

            direccion.focus();

        }


        return;

    }


    // =====================================================
    // VALIDAR USUARIO
    // =====================================================

    if (
        !usuario ||
        !usuario.value.trim()
    ) {

        mostrarMensaje(
            "Ingresa el usuario.",
            "orange"
        );


        if (usuario) {

            usuario.focus();

        }


        return;

    }


    // =====================================================
    // FIREBASE
    // =====================================================

    if (typeof db === "undefined") {

        mostrarMensaje(
            "Firebase no está disponible.",
            "red"
        );

        return;

    }


    // =====================================================
    // OBTENER PLATILLO
    // =====================================================

    const platillo =
        platillos[
            lista.value
        ];


    if (!platillo) {

        mostrarMensaje(
            "No se encontró el platillo.",
            "red"
        );

        return;

    }


    const precio =
        parseFloat(
            platillo.precio || 0
        );


    // =====================================================
    // PEDIDO
    // =====================================================

    const pedido = {

        platilloId:
            lista.value,

        platillo:
            platillo.nombre ||
            "",

        ingredientes:
            platillo.ingredientes ||
            "",

        precio:
            precio,

        direccion:
            direccion.value.trim(),

        usuario:
            usuario.value.trim(),

        foto:
            fotoDataURL ||
            null,

        fecha:
            new Date()

    };


    // =====================================================
    // BOTÓN GUARDAR
    // =====================================================

    const btn =
        document.getElementById(
            "btnGuardar"
        );


    if (btn) {

        btn.disabled =
            true;


        btn.innerHTML = `
            <i class="material-icons left">
                hourglass_empty
            </i>
            Guardando...
        `;

    }


    // =====================================================
    // GUARDAR FIREBASE
    // =====================================================

    db.collection("pedidos")
        .add(pedido)

        .then(function (docRef) {

            console.log(
                "Pedido guardado:",
                docRef.id
            );


            mostrarMensaje(
                "Pedido guardado correctamente.",
                "green"
            );


            // =================================================
            // GUARDAR PARA INDEX
            // =================================================

            const platilloParaIndex = {

                id:
                    "pedido_" +
                    docRef.id,

                nombre:
                    platillo.nombre ||
                    "Sin nombre",

                ingredientes:
                    platillo.ingredientes ||
                    "Sin ingredientes",

                precio:
                    precio,

                foto:
                    platillo.foto ||
                    "",

                pedidoId:
                    docRef.id,

                cliente:
                    usuario.value.trim(),

                direccion:
                    direccion.value.trim(),

                fecha:
                    new Date().toISOString()

            };


            localStorage.setItem(
                "nuevoPlatilloIndex",
                JSON.stringify(
                    platilloParaIndex
                )
            );


            // =================================================
            // LIMPIAR
            // =================================================

            setTimeout(
                function () {

                    limpiarPedido();


                    // =================================================
                    // REGRESAR AL INDEX
                    // =================================================

                    window.location.href =
                        "../index.html";

                },
                1000
            );

        })

        .catch(function (error) {

            console.error(
                "Error guardando pedido:",
                error
            );


            mostrarMensaje(
                "Ocurrió un error al guardar el pedido.",
                "red"
            );

        })

        .finally(function () {

            if (btn) {

                btn.disabled =
                    false;


                btn.innerHTML = `
                    <i class="material-icons left">
                        save
                    </i>
                    Guardar
                `;

            }

        });

}


// =========================================================
// CANCELAR / LIMPIAR
// =========================================================

function limpiarPedido() {

    detenerCamara();


    fotoDataURL =
        null;


    const lista =
        document.getElementById(
            "listaPlatillos"
        );


    const direccion =
        document.getElementById(
            "title"
        );


    const usuario =
        document.getElementById(
            "usuario"
        );


    if (lista) {

        lista.value =
            "";

    }


    if (direccion) {

        direccion.value =
            "";

    }


    if (usuario) {

        usuario.value =
            "";

    }


    // =====================================================
    // FOTO
    // =====================================================

    const preview =
        document.getElementById(
            "contenedorPreview"
        );


    const imagen =
        document.getElementById(
            "fotoPreview"
        );


    if (preview) {

        preview.style.display =
            "none";

    }


    if (imagen) {

        imagen.src =
            "";

    }


    // =====================================================
    // MAPA
    // =====================================================

    const mapa =
        document.getElementById(
            "mapa"
        );


    if (mapa) {

        mapa.style.display =
            "none";

    }


    mostrarMensaje(
        "Pedido cancelado.",
        "red"
    );

}


// =========================================================
// RESTAURAR BOTÓN UBICACIÓN
// =========================================================

function restaurarBotonUbicacion(
    correcto = false
) {

    const btn =
        document.getElementById(
            "btnUbicacion"
        );


    if (!btn) {
        return;
    }


    btn.disabled =
        false;


    if (correcto) {

        btn.innerHTML = `
            <i class="material-icons left">
                check
            </i>
            Ubicación obtenida
        `;

    }

    else {

        btn.innerHTML = `
            <i class="material-icons left">
                location_on
            </i>
            Ubicación
        `;

    }

}


// =========================================================
// MENSAJES
// =========================================================

function mostrarMensaje(
    mensaje,
    clase
) {

    if (
        typeof M !== "undefined" &&
        M.toast
    ) {

        M.toast({

            html:
                mensaje,

            classes:
                clase

        });

    }

    else {

        console.log(
            "[" +
            clase +
            "] " +
            mensaje
        );

    }

}


// =========================================================
// MATERIALIZE OPCIONAL
// =========================================================

function actualizarMaterialize() {

    if (
        typeof M !== "undefined" &&
        M.updateTextFields
    ) {

        M.updateTextFields();

    }

}


// =========================================================
// RESIZE DEL MAPA
// =========================================================

window.addEventListener(
    "resize",
    function () {

        if (map) {

            setTimeout(
                function () {

                    map.invalidateSize();

                },
                200
            );

        }

    }
);