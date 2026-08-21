// ==========================================
// DITS / MECHE - DB.JS
// ==========================================


// ==========================================
// CONTENEDOR DE PLATILLOS
// ==========================================

const contenedorPlatillos =
    document.querySelector(".recipes");


// ==========================================
// MOSTRAR PLATILLO
// ==========================================

function mostrarPlatillo(data, id) {

    if (!contenedorPlatillos) {
        return;
    }


    const tarjeta =
        document.createElement("div");


    tarjeta.className =
        "card recipe";


    tarjeta.id =
        id;


    tarjeta.innerHTML = `

        <div class="card-content">

            <span class="card-title">
                ${escapeHTML(
                    data.nombre || "Sin nombre"
                )}
            </span>


            <p>

                <strong>
                    Ingredientes:
                </strong>

                ${escapeHTML(
                    data.ingredientes ||
                    "No especificados"
                )}

            </p>


            <p class="green-text text-darken-2">

                <strong>
                    Precio:
                </strong>

                $${Number(
                    data.precio || 0
                ).toFixed(2)} MXN

            </p>


            <div
                class="right-align"
                style="margin-top:15px;"
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

                    <i class="material-icons left">
                        delete
                    </i>

                    Eliminar

                </button>

            </div>

        </div>

    `;


    contenedorPlatillos.appendChild(
        tarjeta
    );

}



// ==========================================
// ACTUALIZAR PLATILLO
// ==========================================

function actualizarPlatillo(data, id) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {

        // Si no existe, lo creamos

        mostrarPlatillo(
            data,
            id
        );

        return;

    }


    elemento.innerHTML = `

        <div class="card-content">

            <span class="card-title">

                ${escapeHTML(
                    data.nombre ||
                    "Sin nombre"
                )}

            </span>


            <p>

                <strong>
                    Ingredientes:
                </strong>

                ${escapeHTML(
                    data.ingredientes ||
                    "No especificados"
                )}

            </p>


            <p class="green-text text-darken-2">

                <strong>
                    Precio:
                </strong>

                $${Number(
                    data.precio || 0
                ).toFixed(2)} MXN

            </p>


            <div
                class="right-align"
                style="margin-top:15px;"
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

                    <i class="material-icons left">
                        delete
                    </i>

                    Eliminar

                </button>

            </div>

        </div>

    `;

}



// ==========================================
// FIRESTORE
// ==========================================

if (typeof db !== "undefined") {

    db.collection("platillos")
        .onSnapshot(

            function (snapshot) {

                console.log(
                    "Platillos actualizados:",
                    snapshot.size
                );


                snapshot.docChanges()
                    .forEach(

                        function (change) {

                            // ==========================
                            // AGREGADO
                            // ==========================

                            if (
                                change.type ===
                                "added"
                            ) {

                                mostrarPlatillo(

                                    change.doc.data(),

                                    change.doc.id

                                );

                            }


                            // ==========================
                            // MODIFICADO
                            // ==========================

                            if (
                                change.type ===
                                "modified"
                            ) {

                                actualizarPlatillo(

                                    change.doc.data(),

                                    change.doc.id

                                );

                            }


                            // ==========================
                            // ELIMINADO
                            // ==========================

                            if (
                                change.type ===
                                "removed"
                            ) {

                                const elemento =
                                    document.getElementById(
                                        change.doc.id
                                    );


                                if (elemento) {

                                    elemento.remove();

                                }

                            }

                        }

                    );

            },


            function (error) {

                console.error(
                    "Error Firebase:",
                    error
                );


                if (
                    typeof M !== "undefined"
                ) {

                    M.toast({

                        html:
                            "Error al cargar los platillos",

                        classes:
                            "red"

                    });

                }

            }

        );

}


else {

    console.error(
        "ERROR: db no está disponible"
    );

}



// ==========================================
// ELIMINAR PLATILLO
// ==========================================

function eliminarPlatillo(id) {

    if (!id) {

        return;

    }


    const confirmar =
        confirm(
            "¿Quieres eliminar este platillo?"
        );


    if (!confirmar) {

        return;

    }


    if (typeof db === "undefined") {

        alert(
            "Firebase no está disponible"
        );

        return;

    }


    db.collection("platillos")
        .doc(id)
        .delete()

        .then(

            function () {

                console.log(
                    "Platillo eliminado:",
                    id
                );


                if (
                    typeof M !== "undefined"
                ) {

                    M.toast({

                        html:
                            "Platillo eliminado correctamente",

                        classes:
                            "red"

                    });

                }

            }

        )

        .catch(

            function (error) {

                console.error(
                    "Error al eliminar:",
                    error
                );


                if (
                    typeof M !== "undefined"
                ) {

                    M.toast({

                        html:
                            "Error al eliminar el platillo",

                        classes:
                            "red"

                    });

                }

            }

        );

}



// ==========================================
// BOTÓN ELIMINAR
// ==========================================

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


        if (id) {

            eliminarPlatillo(id);

        }

    }
);



// ==========================================
// ESCAPAR HTML
// ==========================================

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