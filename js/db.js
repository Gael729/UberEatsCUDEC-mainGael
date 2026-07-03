db.collection("platillos").onSnapshot((datos) => {

    datos.docChanges().forEach((registro) => {

        if (registro.type === "added") {
            mostrarPlatillo(registro.doc.data(), registro.doc.id);
        }

        if (registro.type === "modified") {
            actualizarPlatillo(registro.doc.data(), registro.doc.id);
        }

    });

});

const formularioAgregar = document.querySelector(".add-recipe");

formularioAgregar.addEventListener("submit", (e) => {

    e.preventDefault();

    const platilloNuevo = {
        nombre: formularioAgregar.title.value,
        ingredientes: formularioAgregar.ingredients.value
    };

    db.collection("platillos")
        .add(platilloNuevo)
        .then(() => {

            formularioAgregar.title.value = "";
            formularioAgregar.ingredients.value = "";

            alert("Platillo agregado");

        })
        .catch((error) => {
            console.log(error);
            alert("Error al agregar platillo");
        });

});