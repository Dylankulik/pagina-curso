// 🚨 ¡IMPORTANTE! REEMPLAZA ESTA URL CON LA TUYA
// En tu archivo buscador.js
const API_URL = 'https://script.google.com/macros/s/AKfycbwLTAaZavYw1bVQeAgBK0Thv_BGcHnJQZA3BM9G_DegHlB9uZkndaqW0XJJM-Ou3cCQ/exec';
// ^ DEBE SER ASÍ, NO LA URL DE LA HOJA

let courseData = []; // Almacena todos los certificados activos del curso de HTML

// Elementos del DOM para actualizar (asegúrate de que estos IDs existan en tu HTML)
const dniInput = document.getElementById('dniInput');
const loadingMessage = document.getElementById('loading-message');
const noResultsMessage = document.getElementById('no-results-message');
const certificateDetails = document.getElementById('certificate-details');

const certCourse = document.getElementById('cert-course');
const certName = document.getElementById('cert-name');
const certDNI = document.getElementById('cert-dni');
const certStatus = document.getElementById('cert-status');
const certExpiry = document.getElementById('cert-expiry');

// 1. FUNCIÓN PARA CARGAR LOS DATOS DE LA API
async function loadCourseData() {
    loadingMessage.textContent = 'Cargando datos del curso...';
    loadingMessage.style.color = '#3498db'; // Azul

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Almacena los datos (ya filtrados como 'APROBADO' por el Apps Script)
        courseData = data; 
        
        loadingMessage.textContent = 'Datos cargados. ¡Listo para buscar!';
        loadingMessage.style.color = 'green';
        dniInput.focus(); // Pone el foco en el campo de búsqueda
        
        console.log(`Certificados activos cargados: ${courseData.length}`);

    } catch (error) {
        loadingMessage.textContent = 'Error: No se pudieron cargar los datos. Revisa la URL de la API.';
        loadingMessage.style.color = 'red';
        console.error("Error al cargar la API:", error);
    }
}

// 2. FUNCIÓN DE BÚSQUEDA (se ejecuta al escribir)
function searchCertificate() {
    // 1. Normaliza el DNI ingresado por el usuario (elimina espacios, puntos, guiones)
    const queryDNI = dniInput.value.trim().replaceAll('.', '').replaceAll('-', ''); 
    
    // Ocultar mensajes anteriores
    noResultsMessage.style.display = 'none';
    certificateDetails.style.display = 'none';

    if (queryDNI.length < 5) { // Esperamos al menos 5 caracteres para buscar
        return; 
    }
    
    // 2. Busca el certificado coincidente
    const foundCert = courseData.find(cert => {
        // Normaliza el DNI que viene de la API para asegurar la coincidencia exacta
        // Esto es crucial si el DNI en la hoja tiene espacios o está como número/string.
        const apiDNI = cert.DNI ? cert.DNI.toString().trim().replaceAll('.', '').replaceAll('-', '') : '';
        
        // Comprobamos si el DNI de la API coincide exactamente con el DNI ingresado
        return apiDNI === queryDNI;
    });

    // 3. MUESTRA LOS RESULTADOS
    if (foundCert) {
        // Muestra los detalles del certificado
        certCourse.textContent = 'HTML'; // Como solo tienes 1 curso, se puede poner fijo.
        certName.textContent = foundCert.NombreCompleto;
        certDNI.textContent = foundCert.DNI;
        
        // Estado y color (viene del script: Activo/Vencido y color: verde/rojo)
        certStatus.textContent = foundCert.Estado;
        certStatus.style.color = foundCert.Color; 
        
        certExpiry.textContent = foundCert.FechaVencimiento;
        
        certificateDetails.style.display = 'block'; // Muestra la tarjeta de resultados
    } else {
        // Si no se encuentra, muestra el mensaje de no resultados
        noResultsMessage.style.display = 'block';
    }
}

// Inicia la carga de datos al abrir la página
loadCourseData();
