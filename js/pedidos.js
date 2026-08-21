// =========================================================
// PEDIDOS.JS - DITS / MECHE
// =========================================================


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

    console.log("=================================");
    console.log("DITS - PEDIDOS.JS");
    console.log("=================================");


    // =====================================================
    // MENÚ LATERAL
    // =====================================================

    const menus = document.querySelectorAll(".sidenav");

    if (typeof M !== "undefined") {

        M.Sidenav.init(menus);

        console.log(
            "Menú lateral iniciado correctamente."
        );

    }


    // =====================================================
    // INICIAR MAPA
    // =====================================================

    iniciarMapa();


    // =====================================================
    // OBTENER UBICACIÓN AUTOMÁTICAMENTE
    // =====================================================

    setTimeout(function () {

        console.log(
            "Solicitando ubicación automáticamente..."
        );

        obtenerUbicacion();

    }, 500);


    // =====================================================
    // CARGAR PLATILLOS
    // =====================================================

    cargarPlatillos();


    // =====================================================
    // SELECT DE PLATILLOS
    // =====================================================

    const lista =
        document.getElementById("listaPlatillos");

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
        document.getElementById("btnUbicacion");

    if (btnUbicacion) {

        btnUbicacion.addEventListener(
            "click",
            obtenerUbicacion
        );

    }


    // =====================================================
    // BOTÓN CANCELAR
    // =====================================================

    const btnCancelar =
        document.getElementById("btnCancelar");

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
        document.getElementById("btnGuardar");

    if (btnGuardar) {

        btnGuardar.addEventListener(
            "click",
            guardarPedido
        );

    }


    // =====================================================
    // BOTÓN CÁMARA
    // =====================================================

    const btnCamara =
        document.getElementById("btnCamara");

    if (btnCamara) {

        btnCamara.addEventListener(
            "click",
            iniciarCamara
        );

    }


    // =====================================================
    // BOTÓN CAPTURAR
    // =====================================================

    const btnCapturar =
        document.getElementById("btnCapturar");

    if (btnCapturar) {

        btnCapturar.addEventListener(
            "click",
            tomarFoto
        );

    }


    console.log(
        "Eventos configurados correctamente."
    );

});


// =========================================================
// INICIAR MAPA
// =========================================================

function iniciarMapa() {

    const mapaElemento =
        document.getElementById("map");


    if (!mapaElemento) {

        console.warn(
            "No existe el elemento #map."
        );

        return;

    }


    if (typeof L === "undefined") {

        console.error(
            "Leaflet no está cargado."
        );


        mapaElemento.innerHTML = `
            <div style="
                padding:30px;
                text-align:center;
                background:#eeeeee;
                border-radius:10px;
            ">
                <i class="material-icons"
                   style="font-size:40px;">
                    location_on
                </i>

                <br><br>

                El mapa no está disponible.
            </div>
        `;

        return;

    }


    const posicionInicial = [
        19.4326,
        -99.1332
    ];


    map = L.map("map").setView(
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


    if (typeof db === "undefined") {

        console.error(
            "ERROR: db no está definido."
        );


        mostrarErrorPlatillos(
            "Firebase no está disponible."
        );


        return;

    }


    const select =
        document.getElementById(
            "listaPlatillos"
        );


    if (!select) {

        console.error(
            "No existe #listaPlatillos."
        );

        return;

    }


    db.collection("platillos").onSnapshot(

        function (coleccion) {

            console.log(
                "Platillos recibidos:",
                coleccion.size
            );


            select.innerHTML = "";


            const opcionInicial =
                document.createElement("option");


            opcionInicial.value = "";


            opcionInicial.textContent =
                "-- Selecciona un platillo --";


            opcionInicial.selected = true;


            select.appendChild(
                opcionInicial
            );


            platillos = {};


            if (coleccion.empty) {

                const opcionVacia =
                    document.createElement("option");


                opcionVacia.disabled = true;


                opcionVacia.textContent =
                    "No hay platillos registrados";


                select.appendChild(
                    opcionVacia
                );


                return;

            }


            coleccion.forEach(
                function (documento) {

                    const datos =
                        documento.data();


                    const id =
                        documento.id;


                    platillos[id] =
                        datos;


                    const option =
                        document.createElement("option");


                    option.value =
                        id;


                    const precio =
                        parseFloat(
                            datos.precio || 0
                        );


                    option.textContent =
                        (datos.nombre ||
                            "Platillo sin nombre") +
                        " - $" +
                        precio.toFixed(2);


                    select.appendChild(
                        option
                    );


                    console.log(
                        "Platillo:",
                        id,
                        datos
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
                "Error leyendo platillos:",
                error
            );


            mostrarErrorPlatillos(
                "Error al cargar los platillos."
            );

        }

    );

}


// =========================================================
// MOSTRAR ERROR DE PLATILLOS
// =========================================================

function mostrarErrorPlatillos(mensaje) {

    const select =
        document.getElementById(
            "listaPlatillos"
        );


    if (!select) {
        return;
    }


    select.innerHTML = "";


    const option =
        document.createElement("option");


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

function mostrarInformacionPlatillo(id) {

    const ingredientesVista =
        document.getElementById(
            "ingredientesVista"
        );


    const costoVista =
        document.getElementById(
            "costoVista"
        );


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

            ingredientesInput.value = "";

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

    const btn =
        document.getElementById(
            "btnUbicacion"
        );


    if (!navigator.geolocation) {

        mostrarEstado(
            "Tu navegador no permite obtener la ubicación.",
            true
        );

        return;

    }


    if (btn) {

        btn.disabled = true;


        btn.innerHTML = `
            <i class="material-icons left">
                location_searching
            </i>
            Obteniendo...
        `;

    }


    mostrarEstado(
        "Solicitando tu ubicación...",
        false
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
            // INPUTS OCULTOS
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
            // COORDENADAS VISIBLES
            // =================================================

            const latitudVista =
                document.getElementById(
                    "latitudVista"
                );


            const longitudVista =
                document.getElementById(
                    "longitudVista"
                );


            if (latitudVista) {

                latitudVista.textContent =
                    latitud.toFixed(6);

            }


            if (longitudVista) {

                longitudVista.textContent =
                    longitud.toFixed(6);

            }


            // =================================================
            // MAPA
            // =================================================

            if (map) {

                map.setView(
                    [
                        latitud,
                        longitud
                    ],
                    17
                );

            }


            if (marcador) {

                marcador.setLatLng([
                    latitud,
                    longitud
                ]);


                marcador.bindPopup(
                    "Tu ubicación"
                );


                marcador.openPopup();

            }


            // =================================================
            // OBTENER DIRECCIÓN
            // =================================================

            obtenerDireccion(
                latitud,
                longitud
            );

        },

        function (error) {

            console.error(
                "Error de geolocalización:",
                error
            );


            let mensaje =
                "No se pudo obtener tu ubicación.";


            switch (error.code) {

                case error.PERMISSION_DENIED:

                    mensaje =
                        "Permiso de ubicación denegado.";

                    break;


                case error.POSITION_UNAVAILABLE:

                    mensaje =
                        "La ubicación no está disponible.";

                    break;


                case error.TIMEOUT:

                    mensaje =
                        "Se agotó el tiempo para obtener la ubicación.";

                    break;

            }


            mostrarEstado(
                mensaje,
                true
            );


            restaurarBotonUbicacion();

        },

        {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }

    );

}


// =========================================================
// OBTENER DIRECCIÓN
// =========================================================

async function obtenerDireccion(
    latitud,
    longitud
) {

    const direccion =
        document.getElementById(
            "txtDireccion"
        );


    if (direccion) {

        direccion.value =
            "Buscando dirección...";

    }


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
                "No se pudo consultar la dirección."
            );

        }


        const datos =
            await respuesta.json();


        const address =
            datos.address || {};


        const calle =
            address.road ||
            address.pedestrian ||
            address.footway ||
            address.path ||
            "";


        const numero =
            address.house_number ||
            "";


        const colonia =
            address.suburb ||
            address.neighbourhood ||
            address.quarter ||
            "";


        const ciudad =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            "";


        const estado =
            address.state ||
            "";


        const codigoPostal =
            address.postcode ||
            "";


        let direccionFinal = "";


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


        if (direccion) {

            direccion.value =
                direccionFinal;

        }


        actualizarMaterialize();


        mostrarEstado(
            "✓ Ubicación encontrada correctamente.",
            false
        );


        restaurarBotonUbicacion(true);


        if (marcador) {

            marcador.bindPopup(
                "<strong>Ubicación de entrega</strong><br>" +
                direccionFinal
            );


            marcador.openPopup();

        }

    }

    catch (error) {

        console.error(
            "Error obteniendo dirección:",
            error
        );


        if (direccion) {

            direccion.value =
                latitud +
                ", " +
                longitud;

        }


        actualizarMaterialize();


        mostrarEstado(
            "Ubicación obtenida, pero no se pudo encontrar la dirección.",
            true
        );


        restaurarBotonUbicacion();

    }

}


// =========================================================
// CÁMARA
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

        mostrarEstado(
            "Tu navegador no permite utilizar la cámara.",
            true
        );

        return;

    }


    if (streamCamara) {

        return;

    }


    try {

        streamCamara =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: "environment"
                },

                audio: false

            });


        video.srcObject =
            streamCamara;


        video.setAttribute(
            "playsinline",
            ""
        );


        video.muted = true;


        await video.play();


        contenedor.style.display =
            "block";


        mostrarEstado(
            "Cámara activada. Puedes tomar la foto.",
            false
        );


        console.log(
            "Cámara iniciada correctamente."
        );

    }

    catch (error) {

        console.error(
            "Error iniciando cámara:",
            error
        );


        mostrarEstado(
            "No se pudo abrir la cámara. Revisa los permisos.",
            true
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


    const contenedorPreview =
        document.getElementById(
            "contenedorPreview"
        );


    if (!video || !canvas) {

        console.error(
            "No se encontraron video o canvas."
        );

        return;

    }


    if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ) {

        mostrarEstado(
            "La cámara todavía no está lista.",
            true
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


    if (contenedorPreview) {

        contenedorPreview.style.display =
            "block";

    }


    detenerCamara();


    mostrarEstado(
        "✓ Foto capturada correctamente.",
        false
    );


    console.log(
        "Foto capturada."
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

    console.log(
        "================================="
    );

    console.log(
        "INTENTANDO GUARDAR PEDIDO"
    );

    console.log(
        "================================="
    );


    // =====================================================
    // CAMPOS DEL HTML
    // =====================================================

    const lista =
        document.getElementById(
            "listaPlatillos"
        );


    const nombre =
        document.getElementById(
            "txtNombre"
        );


    const direccion =
        document.getElementById(
            "txtDireccion"
        );


    const latitud =
        document.getElementById(
            "txtLatitud"
        );


    const longitud =
        document.getElementById(
            "txtLongitud"
        );


    // =====================================================
    // VALIDAR PLATILLO
    // =====================================================

    if (!lista || !lista.value) {

        mostrarEstado(
            "Selecciona un platillo.",
            true
        );


        alert(
            "Selecciona un platillo."
        );


        return;

    }


    // =====================================================
    // VALIDAR NOMBRE
    // =====================================================

    if (
        !nombre ||
        !nombre.value.trim()
    ) {

        mostrarEstado(
            "Ingresa tu nombre.",
            true
        );


        alert(
            "Ingresa tu nombre."
        );


        if (nombre) {

            nombre.focus();

        }


        return;

    }


    // =====================================================
    // VALIDAR DIRECCIÓN
    // =====================================================

    if (
        !direccion ||
        !direccion.value.trim()
    ) {

        mostrarEstado(
            "Ingresa u obtén tu dirección.",
            true
        );


        alert(
            "Ingresa u obtén tu dirección."
        );


        if (direccion) {

            direccion.focus();

        }


        return;

    }


    // =====================================================
    // FIREBASE
    // =====================================================

    if (typeof db === "undefined") {

        console.error(
            "Firebase / db no está disponible."
        );


        alert(
            "Firebase no está disponible."
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

        console.error(
            "No existe el platillo:",
            lista.value
        );


        alert(
            "No se encontró la información del platillo."
        );


        return;

    }


    // =====================================================
    // PRECIO
    // =====================================================

    const precio =
        parseFloat(
            platillo.precio || 0
        );


    // =====================================================
    // CREAR PEDIDO
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

        nombre:
            nombre.value.trim(),

        usuario:
            nombre.value.trim(),

        direccion:
            direccion.value.trim(),

        latitud:
            latitud &&
            latitud.value
                ? parseFloat(
                    latitud.value
                )
                : null,

        longitud:
            longitud &&
            longitud.value
                ? parseFloat(
                    longitud.value
                )
                : null,

        foto:
            fotoDataURL ||
            null,

        fecha:
            new Date().toISOString()

    };


    console.log(
        "Pedido que se enviará a Firebase:",
        pedido
    );


    // =====================================================
    // BOTÓN
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
    // GUARDAR EN FIREBASE
    // =====================================================

    db.collection("pedidos")
        .add(pedido)

        .then(
            function (docRef) {

                console.log(
                    "================================="
                );


                console.log(
                    "PEDIDO GUARDADO CORRECTAMENTE"
                );


                console.log(
                    "ID:",
                    docRef.id
                );


                console.log(
                    "================================="
                );


                // =================================================
                // PREPARAR INFORMACIÓN PARA INDEX
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
                        nombre.value.trim(),

                    usuario:
                        nombre.value.trim(),

                    direccion:
                        direccion.value.trim(),

                    latitud:
                        pedido.latitud,

                    longitud:
                        pedido.longitud,

                    fecha:
                        pedido.fecha

                };


                // =================================================
                // LOCAL STORAGE
                // =================================================

                localStorage.setItem(
                    "nuevoPlatilloIndex",
                    JSON.stringify(
                        platilloParaIndex
                    )
                );


                console.log(
                    "Pedido preparado para index.html."
                );


                mostrarEstado(
                    "✓ Pedido guardado correctamente.",
                    false
                );


                // =================================================
                // REGRESAR AL INDEX
                // =================================================

                setTimeout(
                    function () {

                        window.location.href =
                            "../index.html";

                    },
                    700
                );

            }
        )

        .catch(
            function (error) {

                console.error(
                    "================================="
                );


                console.error(
                    "ERROR AL GUARDAR PEDIDO"
                );


                console.error(
                    error
                );


                console.error(
                    "Código:",
                    error.code
                );


                console.error(
                    "Mensaje:",
                    error.message
                );


                console.error(
                    "================================="
                );


                alert(
                    "Error al guardar el pedido:\n\n" +
                    error.message
                );


                mostrarEstado(
                    "Error al guardar el pedido.",
                    true
                );

            }
        )

        .finally(
            function () {

                if (btn) {

                    btn.disabled =
                        false;


                    btn.innerHTML = `
                        <i class="material-icons left">
                            save
                        </i>
                        Guardar pedido
                    `;

                }

            }
        );

}


// =========================================================
// LIMPIAR PEDIDO
// =========================================================

function limpiarPedido() {

    detenerCamara();


    fotoDataURL =
        null;


    const lista =
        document.getElementById(
            "listaPlatillos"
        );


    const nombre =
        document.getElementById(
            "txtNombre"
        );


    const direccion =
        document.getElementById(
            "txtDireccion"
        );


    const ingredientes =
        document.getElementById(
            "txtIngredientes"
        );


    const costo =
        document.getElementById(
            "txtCosto"
        );


    const latitud =
        document.getElementById(
            "txtLatitud"
        );


    const longitud =
        document.getElementById(
            "txtLongitud"
        );


    if (lista) {

        lista.value =
            "";

    }


    if (nombre) {

        nombre.value =
            "";

    }


    if (direccion) {

        direccion.value =
            "";

    }


    if (ingredientes) {

        ingredientes.value =
            "";

    }


    if (costo) {

        costo.value =
            "$0.00 MXN";

    }


    if (latitud) {

        latitud.value =
            "";

    }


    if (longitud) {

        longitud.value =
            "";

    }


    const ingredientesVista =
        document.getElementById(
            "ingredientesVista"
        );


    const costoVista =
        document.getElementById(
            "costoVista"
        );


    if (ingredientesVista) {

        ingredientesVista.textContent =
            "Selecciona un platillo";

    }


    if (costoVista) {

        costoVista.textContent =
            "$0.00 MXN";

    }


    const latitudVista =
        document.getElementById(
            "latitudVista"
        );


    const longitudVista =
        document.getElementById(
            "longitudVista"
        );


    if (latitudVista) {

        latitudVista.textContent =
            "No disponible";

    }


    if (longitudVista) {

        longitudVista.textContent =
            "No disponible";

    }


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


    const posicionInicial = [
        19.4326,
        -99.1332
    ];


    if (map) {

        map.setView(
            posicionInicial,
            12
        );

    }


    if (marcador) {

        marcador.setLatLng(
            posicionInicial
        );


        marcador.bindPopup(
            "Ubicación inicial"
        );

    }


    actualizarMaterialize();


    mostrarEstado(
        "",
        false
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
            Obtener ubicación
        `;

    }

}


// =========================================================
// MOSTRAR ESTADO
// =========================================================

function mostrarEstado(
    mensaje,
    error
) {

    const elemento =
        document.getElementById(
            "estadoUbicacion"
        );


    if (!elemento) {
        return;
    }


    elemento.textContent =
        mensaje;


    if (error) {

        elemento.className =
            "red-text";

    }

    else {

        elemento.className =
            "green-text";

    }

}


// =========================================================
// ACTUALIZAR MATERIALIZE
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
