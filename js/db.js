const formularioAgregar = document.querySelector(".add-recipe");

db.collection("platillos").onSnapshot((snapshot) => {


    snapshot.docChanges().forEach((cambio) => {



        if (cambio.type === "added") {


            mostrarPlatillo(
                cambio.doc.data(),
                cambio.doc.id
            );


        }



        if (cambio.type === "modified") {


            actualizarPlatillo(
                cambio.doc.data(),
                cambio.doc.id
            );


        }




        if (cambio.type === "removed") {


            eliminarPlatillo(
                cambio.doc.id
            );


        }



    });



}, (error)=>{


    console.error(
        "Error Firebase:",
        error
    );


});

if(formularioAgregar){



formularioAgregar.addEventListener(
"submit",
(e)=>{


e.preventDefault();



const nombre =
formularioAgregar.title.value.trim();



const ingredientes =
formularioAgregar.ingredients.value.trim();



const precio =
formularioAgregar.price.value.trim();





if(
nombre === "" ||
ingredientes === "" ||
precio === ""
){


M.toast({

html:"Completa todos los campos",

classes:"orange"

});


return;


}




const nuevoPlatillo = {


nombre:nombre,


ingredientes:ingredientes,


Precio:Number(precio)


};





db.collection("platillos")
.add(nuevoPlatillo)



.then(()=>{



formularioAgregar.reset();



M.updateTextFields();




const sidenav =
document.querySelector("#side-form");



const instancia =
M.Sidenav.getInstance(sidenav);



if(instancia){

instancia.close();

}





M.toast({

html:"Platillo agregado",

classes:"green"

});





})



.catch((error)=>{



console.error(error);



M.toast({

html:"Error al guardar platillo",

classes:"red"

});



});



});



}