document.addEventListener("DOMContentLoaded", () => {

    const menus = document.querySelectorAll(".side-menu");

    M.Sidenav.init(menus, {
        edge: "right"
    });


    const forms = document.querySelectorAll(".side-form");

    M.Sidenav.init(forms, {
        edge: "left"
    });


});


const recipes = document.querySelector(".recipes");

function mostrarPlatillo(platillo, id) {

    if (!recipes) return;


    const html = `

    <div class="card-panel recipe white row"
         id="${id}">


        <div class="recipe-details">


            <div class="recipe-title">

                <strong>
                    ${platillo.nombre}
                </strong>

            </div>



            <div class="recipe-ingredients">

                ${platillo.ingredientes}

            </div>



            <div class="recipe-price">

                Precio: $${platillo.Precio || 0}

            </div>


        </div>



        <div class="recipe-delete">


            <i class="material-icons delete red-text"
               data-id="${id}">

                delete

            </i>


        </div>


    </div>

    `;


    recipes.insertAdjacentHTML(
        "beforeend",
        html
    );


}

function actualizarPlatillo(platillo, id) {


    const tarjeta =
        document.getElementById(id);


    if (!tarjeta) return;



    tarjeta.querySelector(".recipe-title")
        .innerHTML =
        `<strong>${platillo.nombre}</strong>`;



    tarjeta.querySelector(".recipe-ingredients")
        .textContent =
        platillo.ingredientes;



    tarjeta.querySelector(".recipe-price")
        .textContent =
        "Precio: $" + (platillo.Precio || 0);



}

function eliminarPlatillo(id) {


    const tarjeta =
        document.getElementById(id);


    if (tarjeta) {

        tarjeta.remove();

    }


}

document.addEventListener("click", (e)=>{


    if(
        e.target.classList.contains("delete")
    ){


        const id =
            e.target.dataset.id;



        if(!id) return;



        if(confirm("¿Eliminar platillo?")){


            db.collection("platillos")
            .doc(id)
            .delete()
            .then(()=>{


                M.toast({

                    html:"Platillo eliminado",

                    classes:"green"

                });


            })
            .catch((error)=>{


                console.error(error);


                M.toast({

                    html:"Error al eliminar",

                    classes:"red"

                });



            });


        }


    }



});