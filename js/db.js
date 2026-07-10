// ======================================
// VARIABLES
// ======================================

let contenido = "";
const formularioAgregar = document.querySelector("form");

// ======================================
// ESCUCHAR CAMBIOS EN FIRESTORE
// ======================================

db.collection("platillos").onSnapshot((snapshot) => {

    contenido = "";

    snapshot.docChanges().forEach((change) => {

        // AGREGAR
        if (change.type === "added") {

            if (typeof mostrarPlatillos === "function") {
                mostrarPlatillos(
                    change.doc.data(),
                    change.doc.id
                );
            }

        }

        // MODIFICAR
        if (change.type === "modified") {

            if (typeof actualizarPlatillo === "function") {
                actualizarPlatillo(
                    change.doc.data(),
                    change.doc.id
                );
            }

        }

        // ELIMINAR
        if (change.type === "removed") {

            const elemento = document.getElementById(change.doc.id);

            if (elemento) {
                elemento.remove();
            }

            if (typeof eliminarPlatillo === "function") {
                eliminarPlatillo(change.doc.id);
            }

        }

    });

}, (error) => {

    console.error("Error Firebase:", error);

});

// ======================================
// AGREGAR PLATILLO
// ======================================

if (formularioAgregar) {

    formularioAgregar.addEventListener("submit", (e) => {

        e.preventDefault();

        const nombre = formularioAgregar.title.value.trim();
        const ingredientes = formularioAgregar.ingredients.value.trim();
        const precio = formularioAgregar.price.value.trim();

        // VALIDACIÓN
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

                const sidenav = document.querySelector("#side-form");

                if (sidenav) {

                    const instancia = M.Sidenav.getInstance(sidenav);

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

                console.log(err);

                M.toast({
                    html: "Error al guardar el platillo",
                    classes: "red"
                });

            });

    });

}