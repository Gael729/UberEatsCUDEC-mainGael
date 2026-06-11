db.collection("platillos").onSnapshot((datos) => {
    datos.docChanges().forEach((registro) => {
        if (registro.type === "added") {
            mostrarPlatillos(registro.doc.data(), registro.doc.id);
        }
        if (registro.type === "modified") {
            mostrarPlatillos(registro.doc.data(), registro.doc.id);
        }
    }
);
});

const formularioAgregar = document.querySelector("form");
formularioAgregar.addEventListener("submit", (e) => {
    e.preventDefault();
    const platilloNuevo = {
        nombre: formularioAgregar.title.value,
        ingredientes: formularioAgregar.ingredientes.value,
        Precio: formularioAgregar.Precio.value
    }
    db.collection("platillos").add(platilloNuevo)
    .catch((error) => {
        console.log(error);
        alert("Error al agregar el platillo");
    } 
    );

    formularioAgregar.title.value = "";
    formularioAgregar.ingredientes.value = "";
    formularioAgregar.Precio.value = "";
    alert("Platillo agregado");
});