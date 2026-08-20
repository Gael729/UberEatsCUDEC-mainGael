document.addEventListener('DOMContentLoaded', function() {
  // Inicializar menú lateral
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
});

let contenidoLista = '';

// Cargar platillos desde Firestore
db.collection("platillos").onSnapshot((datos) => {
  datos.docChanges().forEach((registro) => {
    if (registro.type === "added"){
      agregarALista(registro.doc.data(), registro.doc.id);
    }
  });
  var elems = document.querySelectorAll('select');
  M.FormSelect.init(elems, {});
});

function agregarALista(platillo, id){
  contenidoLista += `<option value='${id}'>${platillo.nombre}</option>`;
  document.getElementById('listaPlatillos').innerHTML = contenidoLista;
}

M.AutoInit();

// ==========================================
// LÓGICA DE LA CÁMARA
// ==========================================
let streamCamara = null;
let fotoDataURL = null; // Almacenará la imagen en formato Base64

const btnCamara = document.getElementById('btnCamara');
const btnCapturar = document.getElementById('btnCapturar');
const contenedorCamara = document.getElementById('contenedorCamara');
const videoCamara = document.getElementById('videoCamara');
const canvasFoto = document.getElementById('canvasFoto');
const contenedorPreview = document.getElementById('contenedorPreview');
const fotoPreview = document.getElementById('fotoPreview');

// 1. Encender cámara
if (btnCamara) {
  btnCamara.addEventListener('click', async () => {
    try {
      streamCamara = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Usa cámara trasera en móviles
        audio: false
      });
      videoCamara.srcObject = streamCamara;
      contenedorCamara.style.display = 'block';
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      M.toast({html: 'No se pudo acceder a la cámara. Revisa los permisos.'});
    }
  });
}

// 2. Tomar la foto
if (btnCapturar) {
  btnCapturar.addEventListener('click', () => {
    const context = canvasFoto.getContext('2d');
    canvasFoto.width = videoCamara.videoWidth;
    canvasFoto.height = videoCamara.videoHeight;
    context.drawImage(videoCamara, 0, 0, canvasFoto.width, canvasFoto.height);

    // Convertir el encuadre en imagen Base64
    fotoDataURL = canvasFoto.toDataURL('image/png');
    fotoPreview.src = fotoDataURL;
    contenedorPreview.style.display = 'block';

    detenerCamara();
  });
}

// Apagar el sensor de la cámara
function detenerCamara() {
  if (streamCamara) {
    streamCamara.getTracks().forEach(track => track.stop());
    videoCamara.srcObject = null;
  }
  contenedorCamara.style.display = 'none';
}

// ==========================================
// BOTONES DE ACCIÓN (UBICACIÓN, GUARDAR, CANCELAR)
// ==========================================

// Obtener Ubicación
document.getElementById('btnUbicacion').addEventListener('click', function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(exito, error);
  }
});

// Guardar Pedido en Firebase
document.getElementById('btnGuardar').addEventListener('click', async () => {
  const select = document.getElementById('listaPlatillos');
  const platilloId = select.value;
  const direccion = document.getElementById('title').value.trim();
  const usuario = document.getElementById('usuario') ? document.getElementById('usuario').value.trim() : '';

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
      usuario: usuario,
      foto: fotoDataURL || null, // Se guarda la foto si existe
      fecha: new Date()
    });

    M.toast({html: 'Pedido guardado correctamente'});
    window.location.href = '/';
  } catch (error) {
    console.error('Error al guardar el pedido:', error);
    M.toast({html: 'Ocurrió un error al guardar'});
  }
});

// Cancelar
document.getElementById('btnCancelar').addEventListener('click', () => {
  detenerCamara();
  window.location.href = '/';
});

// Callback Ubicación Exitosa
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
    let ciudad = data.address.city || data.address.town || data.address.village || '';
    let pais = data.address.country || '';
    document.getElementById("title").value = `${ciudad}, ${pais}`;
    
    // Crear mapa si existe el elemento contenedor
    const elementoMapa = document.getElementById('mapa');
    if (elementoMapa) {
      var map = L.map(elementoMapa).setView([latitud, longitud], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
      L.marker([latitud, longitud]).addTo(map);
    }
  })
  .catch(err => console.error(err));
}

// Callback Ubicación Error
function error(err) {
  alert("Error al obtener ubicación");
  console.log(err);
}