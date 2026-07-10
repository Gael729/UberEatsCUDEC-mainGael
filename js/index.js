// ==========================================
// INICIALIZAR MATERIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const menus = document.querySelectorAll(".sidenav");
    M.Sidenav.init(menus);

});

// ==========================================
// MOSTRAR PLATILLOS
// ==========================================

function mostrarPlatillos(platillo, id) {

    const contenedor = document.querySelector(".recipes");

    if (!contenedor) return;

    const div = document.createElement("div");

    div.classList.add("card-panel", "row");
    div.id = id;

    div.innerHTML = `
        <div class="col s10">
            <h6>${platillo.nombre}</h6>
            <p>${platillo.ingredientes}</p>
            <p>$${platillo.precio}</p>
        </div>

        <div class="col s2 right-align">
            <button class="btn red delete-btn" data-id="${id}">
                <i class="material-icons">delete</i>
            </button>
        </div>
    `;

    contenedor.appendChild(div);

    activarEliminar();

}

// ==========================================
// ACTUALIZAR PLATILLO
// ==========================================

function actualizarPlatillo(platillo, id) {

    const tarjeta = document.getElementById(id);

    if (!tarjeta) return;

    tarjeta.innerHTML = `
        <div class="col s10">
            <h6>${platillo.nombre}</h6>
            <p>${platillo.ingredientes}</p>
            <p>$${platillo.precio}</p>
        </div>

        <div class="col s2 right-align">
            <button class="btn red delete-btn" data-id="${id}">
                <i class="material-icons">delete</i>
            </button>
        </div>
    `;

    activarEliminar();

}

// ==========================================
// ELIMINAR PLATILLO
// ==========================================

function activarEliminar() {

    document.querySelectorAll(".delete-btn").forEach(btn => {

        btn.onclick = () => {

            const id = btn.getAttribute("data-id");

            db.collection("platillos")
                .doc(id)
                .delete()
                .then(() => {

                    M.toast({
                        html: "Platillo eliminado",
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

        };

    });

}