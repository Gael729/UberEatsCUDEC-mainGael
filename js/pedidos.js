document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
  });
  
  let contenidoLista = '';
  
  db.collection("platillos").onSnapshot((datos) => {
    datos.docChanges().forEach((registro) => {
      if (registro.type === "added"){
        agregarALista(registro.doc.data(), registro.doc.id)
      }
    });
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
  })
  
  function agregarALista(platillo, id){
    contenidoLista += `<option value='${id}'>${platillo.nombre}</option>`;
    document.getElementById('listaPlatillos').innerHTML = contenidoLista;
  }
  
  M.AutoInit();
  
  document.getElementById('btnUbicacion').addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(exito, error); 
        
      ;
    }
  });
  
   
   
  document.getElementById('btnGuardar').addEventListener('click', async () => {
    const select = document.getElementById('listaPlatillos');
    const platilloId = select.value;
    const direccion = document.getElementById('title').value.trim();
  
    if (!platilloId) {
      M.toast({html: 'Selecciona un platillo'});
      return;
    }
    if (!direccion) {
      M.toast({html: 'Ingresa una dirección'});
      return;
    }
  
    try {
      await db.collection('pedidos').add({
        platilloId: platilloId,
        direccion: direccion,
      
       
      });
  
      M.toast({html: 'Pedido guardado correctamente'});
      window.location.href = '/';
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      M.toast({html: 'Ocurrió un error al guardar'});
    }
  });
  
  document.getElementById('btnCancelar').addEventListener('click', () => {
    window.location.href = '/';
  });
  
  
  
  function exito(posicion) {
    let latitud = posicion.coords.latitude;
    let longitud = posicion.coords.longitude;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}&format=json`, {
      headers: {
        'User-Agent': 'UberEatscudeceliseo/1.0 (eliseogamer64@gmail.com)'
      }
    
   
  })
   .then(respuesta => respuesta.json())
  .then(data => {
    let ciudad = data.address.city;
      let pais = data.address.country;
      document.getElementById("title").value = `${ciudad}, ${pais}`;
      var map = L.map(mapa).setView([latitud, longitud], 13);
      L.tileLayer
      ('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        atrribution: '&copy; <a href="http://www.openstreetmap.org/copyringt">OpenStreetMap</a>'
      }).addTo(map)
       var marker = L.marker([latitud, longitud]).addTo(map);
  
  
      
  })
  .catch(error => console.error( error));
  }
   function error(error){
  alert("Error al obtener ubicacion");
  console.log(error);
   }