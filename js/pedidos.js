document.addEventListener("DOMContentLoaded", () => {

    const menus = document.querySelectorAll(".side-menu");
    M.Sidenav.init(menus, {
        edge: "right"
    });

    const selects = document.querySelectorAll("select");
    M.FormSelect.init(selects);

});



const listaPlatillos = document.getElementById("listaPlatillos");
const formularioPedido = document.getElementById("formPedido");
const listaPedidos = document.getElementById("listaPedidos");



db.collection("platillos").onSnapshot((snapshot) => {

    let opciones = `
        <option value="" disabled selected>
            Selecciona un platillo
        </option>
    `;

    snapshot.forEach((doc) => {

        const platillo = doc.data();

        opciones += `
            <option value="${doc.id}">
                ${platillo.nombre}
            </option>
        `;

    });

    listaPlatillos.innerHTML = opciones;

    M.FormSelect.init(document.querySelectorAll("select"));

});


formularioPedido.addEventListener("submit", (e) => {

    e.preventDefault();

    const cliente = document.getElementById("cliente").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    const opcion =
        listaPlatillos.options[listaPlatillos.selectedIndex];

    if (
        cliente === "" ||
        direccion === "" ||
        listaPlatillos.value === ""
    ) {

        M.toast({
            html: "Completa todos los campos",
            classes: "orange"
        });

        return;

    }

    const pedido = {

        cliente: cliente,
        direccion: direccion,
        platillo: opcion.text,
        idPlatillo: listaPlatillos.value,
        estado: "Pendiente",
        fecha: firebase.firestore.Timestamp.now()

    };

    db.collection("pedidos")
        .add(pedido)
        .then(() => {

            formularioPedido.reset();

            M.updateTextFields();

            M.FormSelect.init(document.querySelectorAll("select"));

            M.toast({
                html: "Pedido registrado",
                classes: "green"
            });

        })
        .catch((error) => {

            console.error(error);

            M.toast({
                html: "Error al guardar",
                classes: "red"
            });

        });

});


db.collection("pedidos")
.onSnapshot((snapshot) => {

    listaPedidos.innerHTML = "";

    snapshot.forEach((doc) => {

        const pedido = doc.data();

        listaPedidos.innerHTML += `

        <div class="card-panel white" id="${doc.id}">

            <h6>
                <strong>${pedido.cliente}</strong>
            </h6>

            <p>

                <b>Dirección:</b><br>
                ${pedido.direccion}

            </p>

            <p>

                <b>Platillo:</b><br>
                ${pedido.platillo}

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


document.addEventListener("click", (e) => {

    if (e.target.classList.contains("btnEliminar")) {

        const id = e.target.dataset.id;

        if (confirm("¿Eliminar pedido?")) {

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
                    html: "Error al eliminar",
                    classes: "red"
                });

            });

        }

    }

});