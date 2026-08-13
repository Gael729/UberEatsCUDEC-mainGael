document.addEventListener('DOMContentLoaded', function () {

    // =====================================
    // MENÚ DE LAS 3 RAYAS
    // =====================================

    const sideMenu = document.getElementById('side-menu');

    if (sideMenu) {

        M.Sidenav.init(sideMenu, {
            edge: 'right'
        });

    }


    // =====================================
    // FORMULARIO DEL BOTÓN +
    // =====================================

    const sideForm = document.getElementById('side-form');

    if (sideForm) {

        M.Sidenav.init(sideForm, {
            edge: 'right'
        });

    }


    // =====================================
    // AGREGAR PLATILLO
    // =====================================

    const formPlatillo = document.getElementById('formPlatillo');

    if (formPlatillo) {

        formPlatillo.addEventListener('submit', function (event) {

            event.preventDefault();

            const nombre = document.getElementById('title').value;
            const ingredientes = document.getElementById('ingredients').value;
            const precio = document.getElementById('price').value;

            console.log('Platillo:', nombre);
            console.log('Ingredientes:', ingredientes);
            console.log('Precio:', precio);

            alert(
                'Platillo agregado:\n\n' +
                nombre +
                '\n$' +
                precio
            );

            // Limpiar formulario
            formPlatillo.reset();

            // Actualizar labels de Materialize
            M.updateTextFields();

            // Cerrar formulario
            const instancia = M.Sidenav.getInstance(sideForm);

            if (instancia) {
                instancia.close();
            }

        });

    }

});