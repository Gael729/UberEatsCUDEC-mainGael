// =========================================================
// MECHE - INDEX.JS
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("index.js cargado correctamente");


    // =====================================================
    // MATERIALIZE
    // =====================================================

    if (typeof M === "undefined") {

        console.error("Materialize no está cargado");

        return;

    }


    // =====================================================
    // MENÚ DE LAS 3 RAYAS
    // =====================================================

    const sideMenu =
        document.getElementById("side-menu");


    if (sideMenu) {

        M.Sidenav.init(sideMenu, {
            edge: "right"
        });

        console.log("Menú funcionando");

    }


    // =====================================================
    // FORMULARIO DEL BOTÓN +
    // =====================================================

    const sideForm =
        document.getElementById("side-form");


    let formularioSidenav = null;


    if (sideForm) {

        formularioSidenav =
            M.Sidenav.init(sideForm, {
                edge: "right"
            })[0];

        console.log("Formulario + funcionando");

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    const formulario =
        document.getElementById("formPlatillo");


    if (!formulario) {

        console.error(
            "No se encontró #formPlatillo"
        );

        return;

    }


    // =====================================================
    // AGREGAR PLATILLO
    // =====================================================

    formulario.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // =============================================
            // OBTENER DATOS
            // =============================================

            const nombre =
                document.getElementById("title")
                    .value
                    .trim();


            const ingredientes =
                document.getElementById("ingredients")
                    .value
                    .trim();


            const precio =
                document.getElementById("price")
                    .value
                    .trim();


            // =============================================
            // VALIDACIONES
            // =============================================

            if (nombre === "") {

                M.toast({
                    html:
                        "Escribe el nombre del platillo",
                    classes:
                        "red"
                });

                return;

            }


            if (ingredientes === "") {

                M.toast({
                    html:
                        "Escribe los ingredientes",
                    classes:
                        "red"
                });

                return;

            }


            if (precio === "") {

                M.toast({
                    html:
                        "Escribe el precio",
                    classes:
                        "red"
                });

                return;

            }


            // =============================================
            // FIREBASE
            // =============================================

            if (typeof db === "undefined") {

                console.error(
                    "Firebase no está conectado"
                );

                M.toast({
                    html:
                        "Firebase no está conectado",
                    classes:
                        "red"
                });

                return;

            }


            // =============================================
            // BOTÓN
            // =============================================

            const boton =
                document.getElementById(
                    "btnAgregarPlatillo"
                );


            if (boton) {

                boton.disabled = true;

                boton.innerHTML = `
                    <i class="material-icons left">
                        hourglass_empty
                    </i>
                    Guardando...
                `;

            }


            // =============================================
            // GUARDAR EN FIRESTORE
            // =============================================

            db.collection("platillos")
                .add({

                    nombre:
                        nombre,

                    ingredientes:
                        ingredientes,

                    precio:
                        Number(precio),

                    fecha:
                        new Date()

                })

                .then(function (docRef) {

                    console.log(
                        "Platillo guardado:",
                        docRef.id
                    );


                    // =====================================
                    // MENSAJE
                    // =====================================

                    M.toast({

                        html:
                            "Platillo agregado correctamente",

                        classes:
                            "green"

                    });


                    // =====================================
                    // LIMPIAR FORMULARIO
                    // =====================================

                    formulario.reset();

                    M.updateTextFields();


                    // =====================================
                    // CERRAR PANEL
                    // =====================================

                    if (formularioSidenav) {

                        formularioSidenav.close();

                    }

                })

                .catch(function (error) {

                    console.error(
                        "Error al guardar:",
                        error
                    );


                    M.toast({

                        html:
                            "Error al guardar el platillo",

                        classes:
                            "red"

                    });

                })

                .finally(function () {

                    if (boton) {

                        boton.disabled = false;

                        boton.innerHTML =
                            "Agregar Platillo";

                    }

                });

        }
    );


    // =====================================================
    // CARGAR PLATILLOS
    // =====================================================

    cargarPlatillos();

});



// =========================================================
// CARGAR PLATILLOS
// =========================================================

function cargarPlatillos() {

    if (typeof db === "undefined") {

        console.error(
            "Firebase no está disponible"
        );

        return;

    }


    const contenedor =
        document.querySelector(".recipes");


    if (!contenedor) {

        console.error(
            "No se encontró .recipes"
        );

        return;

    }


    db.collection("platillos")
        .onSnapshot(

            function (coleccion) {

                // =========================================
                // LIMPIAR
                // =========================================

                contenedor.innerHTML = "";


                // =========================================
                // SIN PLATILLOS
                // =========================================

                if (coleccion.empty) {

                    contenedor.innerHTML = `

                        <div
                            class="center grey-text"
                            style="
                                margin-top:40px;
                            "
                        >

                            <i
                                class="material-icons"
                                style="
                                    font-size:60px;
                                "
                            >
                                restaurant
                            </i>

                            <h5>
                                No hay platillos
                            </h5>

                            <p>
                                Presiona el botón +
                                para agregar un platillo.
                            </p>

                        </div>

                    `;

                    return;

                }


                // =========================================
                // RECORRER PLATILLOS
                // =========================================

                coleccion.forEach(
                    function (documento) {

                        const datos =
                            documento.data();

                        const id =
                            documento.id;


                        // =================================
                        // TARJETA
                        // =================================

                        const tarjeta =
                            document.createElement("div");


                        tarjeta.className =
                            "card-panel white";


                        tarjeta.setAttribute(
                            "data-id",
                            id
                        );


                        tarjeta.innerHTML = `

                            <div>

                                <h5
                                    style="
                                        margin-top:0;
                                        font-weight:bold;
                                    "
                                >
                                    ${escapeHTML(
                                        datos.nombre ||
                                        "Sin nombre"
                                    )}
                                </h5>


                                <p>

                                    <strong>
                                        Ingredientes:
                                    </strong>

                                    ${escapeHTML(
                                        datos.ingredientes ||
                                        "Sin ingredientes"
                                    )}

                                </p>


                                <p
                                    style="
                                        font-size:18px;
                                        font-weight:bold;
                                    "
                                >

                                    $${Number(
                                        datos.precio || 0
                                    ).toFixed(2)} MXN

                                </p>


                                <div
                                    class="right-align"
                                >

                                    <button
                                        type="button"
                                        class="
                                            btn
                                            red
                                            waves-effect
                                            waves-light
                                            btn-eliminar-platillo
                                        "
                                        data-id="${id}"
                                    >

                                        <i
                                            class="
                                                material-icons
                                                left
                                            "
                                        >
                                            delete
                                        </i>

                                        Eliminar

                                    </button>

                                </div>


                                <div
                                    style="
                                        clear:both;
                                    "
                                ></div>

                            </div>

                        `;


                        contenedor.appendChild(
                            tarjeta
                        );

                    }
                );

            },

            function (error) {

                console.error(
                    "Error cargando platillos:",
                    error
                );

                M.toast({

                    html:
                        "Error al cargar los platillos",

                    classes:
                        "red"

                });

            }

        );

}



// =========================================================
// ELIMINAR PLATILLO
// =========================================================

function eliminarPlatillo(id) {

    if (!id) {

        return;

    }


    if (typeof db === "undefined") {

        M.toast({

            html:
                "Firebase no está conectado",

            classes:
                "red"

        });

        return;

    }


    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar este platillo?"
        );


    if (!confirmar) {

        return;

    }


    db.collection("platillos")
        .doc(id)
        .delete()

        .then(function () {

            M.toast({

                html:
                    "Platillo eliminado correctamente",

                classes:
                    "green"

            });

        })

        .catch(function (error) {

            console.error(
                "Error eliminando:",
                error
            );

            M.toast({

                html:
                    "No se pudo eliminar el platillo",

                classes:
                    "red"

            });

        });

}



// =========================================================
// BOTÓN ELIMINAR
// =========================================================

document.addEventListener(
    "click",
    function (event) {

        const boton =
            event.target.closest(
                ".btn-eliminar-platillo"
            );


        if (!boton) {

            return;

        }


        const id =
            boton.getAttribute(
                "data-id"
            );


        eliminarPlatillo(id);

    }
);



// =========================================================
// ESCAPAR HTML
// =========================================================

function escapeHTML(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }


    return String(texto)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}