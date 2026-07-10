// ==========================================
// INICIALIZAR MATERIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const menus = document.querySelectorAll(".sidenav");
    M.Sidenav.init(menus);

    M.FormSelect.init(document.querySelectorAll("select"));

    cargarPlatillos();
    cargarPedidos();

    const btnUbicacion = document.getElementById("btnUbicacion");

    if (btnUbicacion) {
        btnUbicacion.addEventListener("click", obtenerUbicacion);
    }

});

// ==========================================
// VARIABLES GLOBALES
// ==========================================

let map = null;
let marker = null;

const listaPedidos = document.getElementById("listaPedidos");

// ==========================================
// CARGAR PLATILLOS
// ==========================================

function cargarPlatillos() {

    db.collection("platillos").onSnapshot((snapshot) => {

        let opciones = `
            <option value="" disabled selected>
                Selecciona un platillo
            </option>
        `;

        snapshot.forEach((doc) => {

            const platillo = doc.data();

            opciones += `
                <option value="${platillo.nombre}">
                    ${platillo.nombre}
                </option>
            `;

        });

        const select = document.getElementById("platillo");

        select.innerHTML = opciones;

        M.FormSelect.init(select);

    });

}

// ==========================================
// OBTENER UBICACIÓN
// ==========================================

function obtenerUbicacion() {

    if (!navigator.geolocation) {

        M.toast({
            html: "Tu navegador no soporta geolocalización",
            classes: "red"
        });

        return;

    }

    navigator.geolocation.getCurrentPosition(
        exito,
        errorUbicacion,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );

}

// ==========================================
// UBICACIÓN CORRECTA
// ==========================================

function exito(posicion) {

    const latitud = posicion.coords.latitude;
    const longitud = posicion.coords.longitude;

    document.getElementById("latitud").value = latitud;
    document.getElementById("longitud").value = longitud;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}`)
        .then(respuesta => respuesta.json())
        .then(datos => {

            if (datos.display_name) {

                document.getElementById("direccion").value = datos.display_name;

                M.updateTextFields();

            }

            if (!map) {

                map = L.map("mapa").setView([latitud, longitud], 16);

                L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                        maxZoom: 19,
                        attribution: "&copy; OpenStreetMap contributors"
                    }
                ).addTo(map);

            } else {

                map.setView([latitud, longitud], 16);

            }

            if (marker) {

                map.removeLayer(marker);

            }

            marker = L.marker([latitud, longitud])
                .addTo(map)
                .bindPopup("Ubicación del cliente")
                .openPopup();

            M.toast({
                html: "Ubicación obtenida",
                classes: "green"
            });

        })
        .catch((error) => {

            console.error(error);

            M.toast({
                html: "No fue posible obtener la dirección",
                classes: "orange"
            });

        });

}
// ==========================================
// ERROR AL OBTENER UBICACIÓN
// ==========================================

function errorUbicacion(error) {

    switch (error.code) {

        case error.PERMISSION_DENIED:

            M.toast({
                html: "Debes permitir el acceso a la ubicación",
                classes: "red"
            });

            break;

        case error.POSITION_UNAVAILABLE:

            M.toast({
                html: "Ubicación no disponible",
                classes: "orange"
            });

            break;

        case error.TIMEOUT:

            M.toast({
                html: "Tiempo de espera agotado",
                classes: "orange"
            });

            break;

        default:

            M.toast({
                html: "Error al obtener la ubicación",
                classes: "red"
            });

    }

}

// ==========================================
// GUARDAR PEDIDO
// ==========================================

const formularioPedido = document.getElementById("formPedido");

formularioPedido.addEventListener("submit", (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const platillo = document.getElementById("platillo").value;
    const latitud = document.getElementById("latitud").value;
    const longitud = document.getElementById("longitud").value;

    if (
        nombre === "" ||
        direccion === "" ||
        platillo === ""
    ) {

        M.toast({
            html: "Completa todos los campos",
            classes: "orange"
        });

        return;

    }

    const pedido = {

        nombre,
        direccion,
        platillo,
        latitud,
        longitud,
        estado: "Pendiente",
        fecha: firebase.firestore.Timestamp.now()

    };

    db.collection("pedidos")
        .add(pedido)
        .then(() => {

            formularioPedido.reset();

            document.getElementById("latitud").value = "";
            document.getElementById("longitud").value = "";

            M.updateTextFields();
            M.FormSelect.init(document.querySelectorAll("select"));

            if (marker) {

                map.removeLayer(marker);
                marker = null;

            }

            M.toast({
                html: "Pedido registrado correctamente",
                classes: "green"
            });

        })
        .catch((error) => {

            console.error(error);

            M.toast({
                html: "Error al guardar el pedido",
                classes: "red"
            });

        });

});

// ==========================================
// LISTAR PEDIDOS
// ==========================================

function cargarPedidos() {

    db.collection("pedidos").onSnapshot((snapshot) => {

        listaPedidos.innerHTML = "";

        snapshot.forEach((doc) => {

            const pedido = doc.data();

            listaPedidos.innerHTML += `

                <div class="card-panel white" id="${doc.id}">

                    <h6>
                        <strong>${pedido.nombre}</strong>
                    </h6>

                    <p>
                        <b>Dirección:</b><br>
                        ${pedido.direccion}
                    </p>

                    <p>
                        <b>Platillo:</b><br>
                        ${pedido.platillo}
                    </p>

                    <p>
                        <b>Estado:</b>
                        ${pedido.estado}
                    </p>

                    <div class="right">

                        <button
                            class="btn red btnEliminar"
                            data-id="${doc.id}">

                            Eliminar

                        </button>

                    </div>

                    <div style="clear:both"></div>

                </div>

            `;

        });

    });

}

// ==========================================
// ELIMINAR PEDIDOS
// ==========================================

document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("btnEliminar")) return;

    const id = e.target.dataset.id;

    if (!confirm("¿Eliminar este pedido?")) return;

    db.collection("pedidos")
        .doc(id)
        .delete()
        .then(() => {

            M.toast({
                html: "Pedido eliminado",
                classes: "green"
            });

        })
        .catch((error) => {

            console.error(error);

            M.toast({
                html: "Error al eliminar el pedido",
                classes: "red"
            });

        });

});