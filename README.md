<div align="center">

# 🍴 MECHE

## Plataforma web para consulta de alimentos y gestión de pedidos

**Progressive Web App (PWA)**

Aplicación web progresiva orientada a la consulta de alimentos,
registro de pedidos, ubicación de entrega y captura de fotografías
mediante dispositivos móviles.

<br>

![MECHE](https://img.shields.io/badge/MECHE-PWA-edb90c?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![PWA](https://img.shields.io/badge/Progressive-Web%20App-purple?style=for-the-badge)

<br>

**Proyecto académico**

**Martínez Merlín Luis Fernando**  
**Sistemas Computacionales**  
**Programación Avanzada**  
**ISC181**  
**Universidad Multicultural CUDEC**

**2026**

</div>

---

# 📋 Índice

- [📖 Descripción del proyecto](#-descripción-del-proyecto)
- [🎯 Objetivos](#-objetivos)
- [✨ Características principales](#-características-principales)
- [🛠️ Tecnologías utilizadas](#️-tecnologías-utilizadas)
- [📂 Estructura del proyecto](#-estructura-del-proyecto)
- [🔄 Funcionamiento general](#-funcionamiento-general)
- [🗄️ Base de datos](#️-base-de-datos)
- [📱 Progressive Web App](#-progressive-web-app)
- [📍 Sistema de ubicación](#-sistema-de-ubicación)
- [📷 Sistema de cámara](#-sistema-de-cámara)
- [📸 Evidencias](#-evidencias)
- [🚀 Instalación](#-instalación)
- [▶️ Ejecución](#️-ejecución)
- [📚 Uso de la aplicación](#-uso-de-la-aplicación)
- [🔐 Seguridad](#-seguridad)
- [👨‍💻 Autor](#-autor)
- [📄 Licencia](#-licencia)

---

# 📖 Descripción del proyecto

**MECHE** es una aplicación web progresiva (**Progressive Web App**)
desarrollada para facilitar la consulta de alimentos y el registro
de pedidos desde una interfaz sencilla y adaptable.

El sistema permite visualizar los productos disponibles y consultar
información relacionada con cada alimento, incluyendo:

- 🍴 Nombre del platillo.
- 🧂 Ingredientes.
- 💰 Precio.
- 📷 Imagen del producto.

Los usuarios pueden seleccionar un platillo desde el apartado de
pedidos y proporcionar los datos necesarios para realizar una solicitud
de entrega.

Durante el registro del pedido, la aplicación permite obtener la
ubicación actual del dispositivo mediante los servicios de
geolocalización y mostrarla mediante un mapa interactivo.

También se incorpora el acceso a la cámara del dispositivo para
capturar fotografías relacionadas con el pedido.

La información utilizada por la aplicación se almacena mediante
**Firebase Cloud Firestore**, permitiendo consultar y actualizar los
datos de forma dinámica.

MECHE fue desarrollada como un proyecto académico con el objetivo de
integrar diferentes tecnologías web en una aplicación funcional,
adaptable a computadoras y dispositivos móviles.

---

# 🎯 Objetivos

## 🎯 Objetivo general

Desarrollar una **Progressive Web App** que permita consultar
productos alimenticios y registrar pedidos utilizando una interfaz
web adaptable, almacenamiento en la nube, geolocalización y acceso a
funciones del dispositivo.

---

## 📌 Objetivos específicos

- Diseñar una interfaz web sencilla y fácil de utilizar.
- Crear un catálogo de alimentos disponibles.
- Registrar información de los platillos.
- Almacenar nombre, ingredientes y precio.
- Asociar imágenes a los productos.
- Mostrar dinámicamente los alimentos disponibles.
- Permitir seleccionar un platillo para realizar un pedido.
- Registrar el nombre del usuario.
- Registrar la dirección de entrega.
- Obtener las coordenadas del dispositivo.
- Mostrar la ubicación mediante un mapa interactivo.
- Obtener una dirección aproximada a partir de la ubicación.
- Registrar los pedidos realizados.
- Mostrar los pedidos registrados en la aplicación.
- Permitir administrar la información almacenada.
- Utilizar la cámara del dispositivo.
- Permitir capturar fotografías desde teléfonos móviles.
- Implementar una Progressive Web App.
- Utilizar un Service Worker para las funciones relacionadas con la PWA.
- Adaptar la aplicación a diferentes tamaños de pantalla.

---

# ✨ Características principales

## 🍽️ Catálogo de alimentos

MECHE cuenta con un sistema para mostrar los alimentos disponibles
dentro de la aplicación.

### Funciones:

- ➕ Registrar alimentos.
- 📝 Agregar nombre del platillo.
- 🧂 Registrar ingredientes.
- 💰 Establecer precio.
- 📷 Asociar una fotografía.
- 👁️ Consultar productos disponibles.
- 🗑️ Eliminar productos.
- 🔄 Actualizar información desde Firebase.
- 📱 Visualizar el catálogo desde dispositivos móviles.

---

## 🛒 Gestión de pedidos

El sistema permite seleccionar un alimento y generar un pedido
proporcionando la información necesaria para su entrega.

### Proceso:

```text
Seleccionar alimento
        ↓
Consultar información del platillo
        ↓
Mostrar ingredientes y precio
        ↓
Ingresar datos del usuario
        ↓
Ingresar dirección de entrega
        ↓
Obtener ubicación
        ↓
Mostrar posición en el mapa
        ↓
Capturar fotografía
        ↓
Confirmar pedido
        ↓
Guardar información
        ↓
Mostrar pedido en la aplicación
