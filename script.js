// TU NUEVA URL DE GOOGLE APPS SCRIPT
const URL_API = "https://script.google.com/macros/s/AKfycby9RjEXd-lw3nBeHsKdmBIrPrHSV0pu-Zqp5Nw8ZHAN7a3O1haNOgzqaeFwIre7_nwTqw/exec";

// Elementos de la interfaz para control de pantallas
const loginScreen = document.getElementById('loginScreen');
const appScreen = document.getElementById('appScreen');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const loginError = document.getElementById('loginError');

// --- COMPROBACIÓN AUTOMÁTICA DE TOKEN AL CARGAR LA PÁGINA ---
async function verificarSesion() {
    const tokenGuardado = localStorage.getItem('session_token');
    
    if (tokenGuardado) {
        try {
            const response = await fetch(URL_API, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                },
                body: JSON.stringify({ action: "validarToken", token: tokenGuardado })
            });
            const data = await response.json();
            if (data.success) {
                mostrarApp();
                return;
            }
        } catch (e) {
            console.error("Error validando token remoto", e);
        }
    }
    mostrarLogin();
}

// --- EVENTO DE LOGIN ---
btnLogin.addEventListener('click', async () => {
    const usuario = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();
    
    if (!usuario || !password) {
        loginError.innerText = "Por favor, llena todos los campos.";
        return;
    }
    
    loginError.innerText = "Verificando...";
    
    try {
        const response = await fetch(URL_API, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({ action: "login", usuario: usuario, password: password })
        });
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('session_token', data.token);
            localStorage.setItem('operador_nombre', usuario); // Guardamos el nombre para el guion
            mostrarApp();
        } else {
            loginError.innerText = data.message || "Error al iniciar sesión.";
        }
    } catch (error) {
        loginError.innerText = "Error de conexión con el servidor.";
        console.error(error);
    }
});

// --- CERRAR SESIÓN ---
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('operador_nombre');
    mostrarLogin();
});

function mostrarApp() {
    loginScreen.style.display = "none";
    appScreen.style.display = "block";
    actualizarGuiones(); 
}

function mostrarLogin() {
    loginScreen.style.display = "flex";
    appScreen.style.display = "none";
    loginError.innerText = "";
    document.getElementById('loginUser').value = "";
    document.getElementById('loginPass').value = "";
}

// --- LÓGICA DEL GENERADOR DE GUIONES ---
function actualizarGuiones() {
    const nombreSol = document.getElementById('nombreSol').value.trim() || "[Nombre de la persona]";
    const contactoSol = document.getElementById('contactoSol').value.trim();
    const nombreTer = document.getElementById('nombreTer').value.trim() || "[Nombre de la cuenta del tercero]";
    
    const tipoCuenta = document.querySelector('input[name="tipoCuenta"]:checked').value;

    const nombreOperador = localStorage.getItem('operador_nombre') || "Operador de Locatel";

    const horaActual = new Date().getHours();
    let saludoCompleto = "Buenas tardes"; 
    if (horaActual >= 20 || horaActual < 5) {
        saludoCompleto = "Buenas noches";
    } else if (horaActual < 12) {
        saludoCompleto = "Buenos días";
    }

    const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactoSol);
    let tipoContacto, tipoContactoRef, tipoContactoCorto;
    
    if (contactoSol === "") {
        tipoContacto = "[número de celular / correo electrónico]";
        tipoContactoRef = "[ese número telefónico / ese correo]";
        tipoContactoCorto = "[número / correo]";
    } else if (esCorreo) {
        tipoContacto = "correo electrónico";
        tipoContactoRef = "ese correo electrónico";
        tipoContactoCorto = "correo";
    } else {
        tipoContacto = "número de celular";
        tipoContactoRef = "ese número telefónico";
        tipoContactoCorto = "número";
    }

    let tituloFinal = "";
    let scriptFinal = "";

    if (tipoCuenta === "con") {
        tituloFinal = "CON CUENTA LLAVE";
        scriptFinal = `1. Saludo e Identificación inicial\n\n${saludoCompleto}.\nMe comunico de *0311 Locatel, Mi nombre es ${nombreOperador}. ¿Tengo el gusto de comunicarme con ${nombreSol}?\n\n2. Motivo de la llamada y Explicación del problema\n\nMucho gusto. El motivo de mi llamada es para darle seguimiento a su solicitud sobre la actualización de sus medios de contacto. Verificando en el sistema, detectamos que el ${tipoContacto} que desea registrar se encuentra actualmente vinculado a la cuenta de un tercero.\n¿Conoce a: ${nombreTer}?\n\n3. Acción a realizar (Desvinculación y Vinculación)\n\nNo se preocupe, para darle solución en este momento voy a realizar el proceso para desvincular ${tipoContactoRef} de la otra cuenta y procederé a vincularlo de manera correcta a su cuenta personal.\n¿Por protocolos de seguridad me puede confirmar su nombre completo por favor?\n\n(Confirmas datos)\n\nMuchas gracias.\n¿Me permite un momento en la línea, por favor, en lo que realizo la actualización en el sistema?\n\n(Haces el proceso en tu sistema. Si tardas más de 1 minuto, puedes regresar a la línea rápido y decir: "Sigo con usted, sigo trabajando en su solicitud").\n\n4. Confirmación del trámite exitoso\n\nLe agradezco mucho su tiempo de espera. Le informo que el proceso ha concluido de manera exitosa. Su ${tipoContactoCorto} ya quedó liberado y ha sido vinculado correctamente a su cuenta. A partir de este momento ya puede utilizarlo sin ningún inconveniente.\n\n5. Cierre y Despedida\n\n¿Hay alguna otra duda o pregunta en la que le pueda apoyar el día de hoy?\n\n(Si dice que no)\nPerfecto, le agradezco mucho que se haya comunicado con nosotros. Le recuerdo que le atendió ${nombreOperador}, operador de Locatel. Que tenga una excelente tarde/noche.`;
    } else {
        tituloFinal = "SIN CUENTA LLAVE";
        scriptFinal = `1. Saludo e Identificación inicial\n\n${saludoCompleto}.\nMe comunico de *0311 Locatel, Mi nombre es ${nombreOperador}. ¿Tengo el gusto de comunicarme con ${nombreSol}?\n\n2. Motivo de la llamada y Explicación del problema\n\n(Una vez que confirme su nombre)\nMucho gusto. El motivo de mi llamada es para darle seguimiento a su reporte sobre la creación de su Cuenta Llave CDMX. Verificando en el sistema, detectamos que el motivo por el cual la página no le permite continuar con su registro es porque su ${tipoContacto} se encuentra vinculado actualmente a la cuenta de una tercera persona.\n\n3. Acción a realizar (Desvinculación)\n\nNo se preocupe, para que usted pueda registrarse sin problemas, en este momento voy a realizar el proceso para desvincular y liberar su ${tipoContactoCorto} de esa otra cuenta.\n¿Por protocolos de seguridad me puede confirmar su nombre completo por favor?\n\n(Esperas confirmación)\n\nMuchas gracias.\n¿Me permite un momento en la línea, por favor, en lo que aplico la actualización en nuestro sistema?\n\n(Realizas el proceso. Recuerda retomar la llamada si tardas más de un minuto para decirle: "Sigo con usted, estoy procesando la liberación de su ${tipoContactoCorto}").\n\n4. Confirmación y Siguientes pasos para el ciudadano\n\nLe agradezco mucho su tiempo de espera. Le informo que el proceso ha concluido de manera exitosa. Su ${tipoContactoCorto} ya quedó totalmente desvinculado y liberado en el sistema.\n\nA partir de este momento, usted ya puede ingresar nuevamente a la página web y comenzar desde cero su registro para crear su Cuenta Llave CDMX. El sistema ya le aceptará su ${tipoContactoCorto} sin marcarle error.\n\n5. Cierre y Despedida\n\n¿Hay alguna otra duda o pregunta en la que le pueda apoyar el día de hoy?\n\n(Si responde que no)\nPerfecto. Siendo así, le agradezco mucho que se haya comunicado con nosotros. Le recuerdo que le atendió ${nombreOperador}, operador de Locatel. Que tenga una excelente tarde/noche.`;
    }

    const tEl = document.getElementById('scriptTitulo');
    const oEl = document.getElementById('outputScript');
    if(tEl && oEl) {
        tEl.innerText = tituloFinal;
        oEl.innerText = scriptFinal;
    }
}

// Agregar Event Listeners a los inputs del formulario
const inputs = document.querySelectorAll('#appScreen input');
inputs.forEach(input => {
    input.addEventListener('input', actualizarGuiones);
    input.addEventListener('change', actualizarGuiones);
});

// Inicializar la aplicación comprobando el estado de la sesión
verificarSesion();
