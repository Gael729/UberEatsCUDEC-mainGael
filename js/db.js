const formularioAgregar = document.querySelector("#formPlatillo");
const contenedorPlatillos = document.querySelector(".recipes");

function mostrarPlatillos(data, id) {

    if (!contenedorPlatillos) {
        console.error("No se encontró .recipes");
        return;
    }

    const tarjeta = document.createElement("div");

    tarjeta.className = "card recipe";
    tarjeta.id = id;

    tarjeta.innerHTML = `
        <div class="card-content">

            <span class="card-title">
                ${data.nombre}
            </span>

            <p>
                <strong>Ingredientes:</strong>
                ${data.ingredientes}
            </p>

            <p class="green-text text-darken-2">
                <strong>Precio:</strong>
                $${data.precio}
            </p>

            <button 
                class="btn-floating red right"
                onclick="eliminarPlatillo('${id}')">
                <i class="material-icons">delete</i>
            </button>

        </div>
    `;

    contenedorPlatillos.appendChild(tarjeta);
}

db.collection("platillos").onSnapshot((snapshot) => {

    snapshot.docChanges().forEach((change) => {

        if (change.type === "added") {

            mostrarPlatillos(
                change.doc.data(),
                change.doc.id
            );

        }

        if (change.type === "modified") {

            actualizarPlatillo(
                change.doc.data(),
                change.doc.id
            );

        }

        if (change.type === "removed") {

            const elemento =
                document.getElementById(change.doc.id);

            if (elemento) {
                elemento.remove();
            }

        }

    });

}, (error) => {

    console.error("Error Firebase:", error);

});

function actualizarPlatillo(data, id) {

    const elemento = document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.innerHTML = `
        <div class="card-content">

            <span class="card-title">
                ${data.nombre}
            </span>

            <p>
                <strong>Ingredientes:</strong>
                ${data.ingredientes}
            </p>

            <p class="green-text text-darken-2">
                <strong>Precio:</strong>
                $${data.precio}
            </p>

            <button 
                class="btn-floating red right"
                onclick="eliminarPlatillo('${id}')">
                <i class="material-icons">delete</i>
            </button>

        </div>
    `;
}

function eliminarPlatillo(id) {

    const confirmar = confirm(
        "¿Quieres eliminar este platillo?"
    );

    if (!confirmar) {
        return;
    }

    db.collection("platillos")
        .doc(id)
        .delete()

        .then(() => {

            M.toast({
                html: "Platillo eliminado",
                classes: "red"
            });

        })

        .catch((error) => {

            console.error(
                "Error al eliminar:",
                error
            );

            M.toast({
                html: "Error al eliminar el platillo",
                classes: "red"
            });

        });

}

if (formularioAgregar) {

    formularioAgregar.addEventListener("submit", (e) => {

        e.preventDefault();

        const nombre =
            formularioAgregar.title.value.trim();

        const ingredientes =
            formularioAgregar.ingredients.value.trim();

        const precio =
            formularioAgregar.price.value.trim();

        if (
            nombre === "" ||
            ingredientes === "" ||
            precio === ""
        ) {

            M.toast({
                html: "Completa todos los campos",
                classes: "orange"
            });

            return;
        }

        const platillo = {

            nombre: nombre,
            ingredientes: ingredientes,
            precio: Number(precio)

        };

        db.collection("platillos")
            .add(platillo)

            .then(() => {

                formularioAgregar.reset();

                M.updateTextFields();

                // CERRAR FORMULARIO

                const sidenav =
                    document.querySelector("#side-form");

                if (sidenav) {

                    const instancia =
                        M.Sidenav.getInstance(sidenav);

                    if (instancia) {
                        instancia.close();
                    }

                }

                M.toast({
                    html: "Platillo agregado",
                    classes: "green"
                });

            })

            .catch((err) => {

                console.error(err);

                M.toast({
                    html: "Error al guardar el platillo",
                    classes: "red"
                });

            });

    });

}