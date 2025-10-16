// 🚨 ¡IMPORTANTE! REEMPLAZA ESTA URL CON LA URL DE TU IMPLEMENTACIÓN /exec MÁS RECIENTE
// Usando una URL de ejemplo
const API_URL = 'https://script.google.com/macros/s/AKfycbxLi6bDJfXdfpzgnFnlZRQ0C7krQ6tXYs1uC-uAm6yWhUNNPsYwKPSe8JcqcQ9E0DHs/exec';

let courseData = []; 

// Elementos del DOM
const dniInput = document.getElementById('dniInput');
const loadingMessage = document.getElementById('loading-message');
const noResultsMessage = document.getElementById('no-results-message');
const certificateDetails = document.getElementById('certificate-details');

const certCourse = document.getElementById('cert-course');
const certName = document.getElementById('cert-name');
const certDNI = document.getElementById('cert-dni');
const certStatus = document.getElementById('cert-status');
const certExpiry = document.getElementById('cert-expiry');

// FUNCIÓN DE AYUDA: Convierte el número de serie de fecha de Google Sheets (ej: 46311.70...)
function serialDateToReadable(serialDate) {
    if (!serialDate) return 'N/A';
    
    // El formato de fecha de serie de Google Sheets comienza el 30/12/1899.
    // Usamos Date.UTC para manejar las zonas horarias
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const dateOffset = new Date(Date.UTC(1899, 11, 30));
    const finalDate = new Date(dateOffset.getTime() + (serialDate * MS_PER_DAY));
    
    // Devuelve la fecha en formato local (ej: 16/10/2025)
    return finalDate.toLocaleDateString('es-AR');
}


// 1. FUNCIÓN PARA CARGAR LOS DATOS DE LA API
async function loadCourseData() {
    loadingMessage.textContent = 'Cargando datos del curso...';
    loadingMessage.style.color = '#3498db'; 

    try {
        const response = await fetch(API_URL);
        
        // Manejo de respuesta no OK si el script falla en el servidor
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        courseData = data; 
        
        loadingMessage.textContent = 'Datos cargados. ¡Listo para buscar!';
        loadingMessage.style.color = 'green';
        dniInput.focus();
        
        console.log(`Certificados activos cargados: ${courseData.length}`);

    } catch (error) {
        loadingMessage.textContent = 'Error: No se pudieron cargar los datos. Revisa la consola para más detalles.';
        loadingMessage.style.color = 'red';
        console.error("Error al cargar la API:", error);
    }
}

// 2. FUNCIÓN DE BÚSQUEDA (se ejecuta al escribir)
function searchCertificate() {
    // Normaliza el DNI ingresado por el usuario
    const queryDNI = dniInput.value.trim().replaceAll('.', '').replaceAll('-', ''); 
    
    noResultsMessage.style.display = 'none';
    certificateDetails.style.display = 'none';

    if (queryDNI.length < 5) { 
        return; 
    }
    
    // Busca el certificado coincidente
    const foundCert = courseData.find(cert => {
        const apiDNI = cert.DNI ? cert.DNI.toString().trim().replaceAll('.', '').replaceAll('-', '') : '';
        return apiDNI === queryDNI;
    });

    // 3. MUESTRA LOS RESULTADOS
    if (foundCert) {
        
        // 🚨 CORRECCIÓN 1: Accede al nombre usando la clave exacta de la hoja
        certName.textContent = foundCert['Nombre y Apellido']; 
        
        certCourse.textContent = 'HTML'; 
        certDNI.textContent = foundCert.DNI;
        
        // Estado y color (viene del script: Estado y color)
        certStatus.textContent = foundCert.Estado;
        certStatus.style.color = foundCert.Color; 
        
        // 🚨 CORRECCIÓN 2: Accede a la clave de la fecha y la formatea
        const serialDate = foundCert['FECHA_VENCIM.']; // Usando la clave con el punto
        certExpiry.textContent = serialDateToReadable(serialDate);
        
        certificateDetails.style.display = 'block'; // Muestra la tarjeta de resultados
    } else {
        noResultsMessage.style.display = 'block';
    }
}

// Vincula la función al input y carga los datos al inicio
dniInput.addEventListener('input', searchCertificate);
loadCourseData();
