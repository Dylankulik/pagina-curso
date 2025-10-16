// 🚨 URL DE LA API: La URL de implementación que termina en /exec
const API_URL = 'https://script.google.com/macros/s/AKfycbxKngNdCtwQMY4iFt9WL_vzzBXw50bJimqecyoEOatN5QbctLecFfRinLCdLsjC8rlZ/exec';

let courseData = []; 

// Elementos del DOM (Asegúrate que estos IDs existan en tu HTML)
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
    loadingMessage.style.color = '#3498db'; 

    try {
        const response = await fetch(API_URL);
        
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

// 2. FUNCIÓN DE BÚSQUEDA 
function searchCertificate() {
    // Normaliza el DNI ingresado
    const queryDNI = dniInput.value.trim().replaceAll('.', '').replaceAll('-', ''); 
    
    noResultsMessage.style.display = 'none';
    certificateDetails.style.display = 'none';

    if (queryDNI.length < 5) { 
        return; 
    }
    
    // Busca el certificado
    const foundCert = courseData.find(cert => {
        // Normaliza el DNI de la API
        const apiDNI = cert.DNI ? cert.DNI.toString().trim().replaceAll('.', '').replaceAll('-', '') : '';
        
        return apiDNI === queryDNI;
    });

    // 3. MUESTRA LOS RESULTADOS
    if (foundCert) {
        certCourse.textContent = 'HTML'; 
        // Accedemos a las claves usando corchetes por los espacios y puntos en el encabezado
        certName.textContent = foundCert['Nombre y Apellido']; 
        certDNI.textContent = foundCert.DNI;
        
        // Estado y color
        certStatus.textContent = foundCert.Estado;
        certStatus.style.color = foundCert.Color; 
        
        certExpiry.textContent = foundCert['FECHA_VENCIM.']; 
        
        certificateDetails.style.display = 'block'; 
    } else {
        noResultsMessage.style.display = 'block';
    }
}

// Vincula la función al input
dniInput.addEventListener('input', searchCertificate);

// Inicia la carga de datos al abrir la página
loadCourseData();
