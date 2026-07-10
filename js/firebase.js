// ==========================================
// CONFIGURACIÓN DE FIREBASE - MECHE
// ==========================================

var firebaseConfig = {
  apiKey: "AIzaSyC4VvL-JcyFpqCNTH0CFuYI_DYoHthKKCk",
  authDomain: "uber-eats-cudec.firebaseapp.com",
  projectId: "uber-eats-cudec",
  storageBucket: "uber-eats-cudec.firebasestorage.app",
  messagingSenderId: "436356053645",
  appId: "1:436356053645:web:78fa8b36bdab91de23c0c4",
  measurementId: "G-BWZ6KMKFZQ"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Base de datos Firestore
const db = firebase.firestore();