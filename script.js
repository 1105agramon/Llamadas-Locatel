// PON AQUÍ LA NUEVA URL QUE TE DIO GOOGLE APPS SCRIPT
const URL_API = "https://script.google.com/macros/s/AKfycbzlcB0-X0ngWyvyioX-j8sk9_AXQWbN15dpRJWjCUWjodUjELFLJxtal6E4aqa_Xy9w/exec"; 

const loginScreen = document.getElementById('loginScreen');
const appScreen = document.getElementById('appScreen');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const loginError = document.getElementById('loginError');

// --- COMPROBACIÓN AUTOMÁTICA DE TOKEN ---
async function verificarSesion() {
    const tokenGuardado = localStorage.getItem('session_token');
    
    if (tokenGuardado) {
        try {
            const urlConDatos = `${URL_API}?action=validarToken&token=${encodeURIComponent(tokenGuardado)}`;
            const response = await fetch(urlConDatos);
            const data = await response.json();
            
            if (data.success) {
                mostrarApp();
                return;
            }
        } catch (e) {
            console.error("Error validando token", e);
        }
    }
    mostrarLogin();
}

// --- EVENTO DE LOGIN ---
btnLogin.addEventListener('click', async () => {
    const usuario = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();
    const genero = document.querySelector('input[name="generoOperador"]:checked').value;
    
    if (!usuario || !password) {
        loginError.innerText = "Por favor, llena todos los campos.";
        return;
    }
    
    loginError.innerText = "Verificando...";
    
    try {
        const urlConDatos = `${URL_API}?action=login&usuario=${encodeURIComponent(usuario)}&password=${encodeURIComponent(password)}`;
        
        const response = await fetch(urlConDatos);
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('session_token', data.token);
            localStorage.setItem('operador_nombre', usuario);
            localStorage.setItem('operador_genero', genero);
            mostrarApp();
        } else {
            loginError.innerText = data.message || "Credenciales incorrectas.";
        }
    } catch (error) {
        loginError.innerText = "Error de conexión: " + error.message;
        console.error(error);
    }
});

// --- CERRAR SESIÓN ---
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('operador_nombre');
    localStorage.removeItem('operador_genero');
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
    const nombreSol = document.getElementById('nombreSol').value.trim() || "[Nombre del ciudadano]";
    const nombreTer = document.getElementById('nombreTer').value.trim() || "[Nombre del tercero]";
    
    const tipoCuenta = document.querySelector('input[name="tipoCuenta"]:checked').value;
    const tipoMedio = document.querySelector('input[name="tipoMedio"]:checked').value;

    const nombreOperador = localStorage.getItem('operador_nombre') || "Operador";
    const genero = localStorage.getItem('operador_genero') || "M";
    const tituloOperador = genero === "M" ? "operador" : "operadora";

    const horaActual = new Date().getHours();
    let saludoCompleto = "Buenas tardes"; 
    if (horaActual >= 20 || horaActual < 5) {
        saludoCompleto = "Buenas noches";
    } else if (horaActual < 12) {
        saludoCompleto = "Buenos días";
    }

    let tipoContacto, tipoContactoRef, tipoContactoCorto;
    
    if (tipoMedio === "correo") {
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
        scriptFinal = `
<span class="text-action">1. Saludo e Identificación inicial</span><br><br>
<span class="text-read">${saludoCompleto}.<br>Me comunico de *0311 Locatel, mi nombre es ${nombreOperador}. ¿Tengo el gusto de comunicarme con ${nombreSol}?</span><br><br>

<span class="text-action">2. Motivo de la llamada y Explicación del problema</span><br><br>
<span class="text-read">Mucho gusto. El motivo de mi llamada es para darle seguimiento a su solicitud sobre la actualización de sus medios de contacto. Verificando en el sistema, detectamos que el ${tipoContacto} que desea registrar se encuentra actualmente vinculado a la cuenta de un tercero.<br>
¿Conoce a: ${nombreTer}?</span><br><br>

<span class="text-action">3. Acción a realizar (Desvinculación y Vinculación)</span><br><br>
<span class="text-read">No se preocupe, para darle solución en este momento voy a realizar el proceso para desvincular ${tipoContactoRef} de la otra cuenta y procederé a vincularlo de manera correcta a su cuenta personal.<br>
¿Por protocolos de seguridad me puede confirmar su nombre completo por favor?</span><br><br>

<span class="text-action">(Confirmas datos)</span><br><br>

<span class="text-read">Muchas gracias.<br>¿Me permite un momento en la línea, por favor, en lo que realizo la actualización en el sistema?</span><br><br>

<span class="text-action">(Haces el proceso en tu sistema. Si tardas más de 1 minuto, puedes regresar a la línea rápido y decir: "Sigo con usted, sigo trabajando en su solicitud").</span><br><br>

<span class="text-action">4. Confirmación del trámite exitoso</span><br><br>
<span class="text-read">Le agradezco mucho su tiempo de espera. Le informo que el proceso ha concluido de manera exitosa. Su ${tipoContactoCorto} ya quedó liberado y ha sido vinculado correctamente a su cuenta. A partir de este momento ya puede utilizarlo sin ningún inconveniente.</span><br><br>

<span class="text-action">5. Cierre y Despedida</span><br><br>
<span class="text-read">¿Hay alguna otra duda o pregunta en la que le pueda apoyar el día de hoy?</span><br><br>

<span class="text-action">(Si dice que no)</span><br>
<span class="text-read">Perfecto, le agradezco mucho que se haya comunicado con nosotros. Le recuerdo que le atendió ${nombreOperador}, ${tituloOperador} de Locatel. Que tenga una excelente tarde/noche.</span>`;
    } else {
        tituloFinal = "SIN CUENTA LLAVE";
        scriptFinal = `
<span class="text-action">1. Saludo e Identificación inicial</span><br><br>
<span class="text-read">${saludoCompleto}.<br>Me comunico de *0311 Locatel, mi nombre es ${nombreOperador}. ¿Tengo el gusto de comunicarme con ${nombreSol}?</span><br><br>

<span class="text-action">2. Motivo de la llamada y Explicación del problema</span><br><br>
<span class="text-action">(Una vez que confirme su nombre)</span><br>
<span class="text-read">Mucho gusto. El motivo de mi llamada es para darle seguimiento a su reporte sobre la creación de su Cuenta Llave CDMX. Verificando en el sistema, detectamos que el motivo por el cual la página no le permite continuar con su registro es porque su ${tipoContacto} se encuentra vinculado actualmente a la cuenta de una tercera persona.<br>
¿Conoce a: ${nombreTer}?</span><br><br>

<span class="text-action">3. Acción a realizar (Desvinculación)</span><br><br>
<span class="text-read">No se preocupe, para que usted pueda registrarse sin problemas, en este momento voy a realizar el proceso para desvincular y liberar su ${tipoContactoCorto} de esa otra cuenta.<br>
¿Por protocolos de seguridad me puede confirmar su nombre completo por favor?</span><br><br>

<span class="text-action">(Esperas confirmación)</span><br><br>

<span class="text-read">Muchas gracias.<br>¿Me permite un momento en la línea, por favor, en lo que aplico la actualización en nuestro sistema?</span><br><br>

<span class="text-action">(Realizas el proceso. Recuerda retomar la llamada si tardas más de un minuto para decirle: "Sigo con usted, estoy procesando la liberación de su ${tipoContactoCorto}").</span><br><br>

<span class="text-action">4. Confirmación y Siguientes pasos para el ciudadano</span><br><br>
<span class="text-read">Le agradezco mucho su tiempo de espera. Le informo que el proceso ha concluido de manera exitosa. Su ${tipoContactoCorto} ya quedó totalmente desvinculado y liberado en el sistema.<br><br>
A partir de este momento, usted ya puede ingresar nuevamente a la página web y comenzar desde cero su registro para crear su Cuenta Llave CDMX. El sistema ya le aceptará su ${tipoContactoCorto} sin marcarle error.</span><br><br>

<span class="text-action">5. Cierre y Despedida</span><br><br>
<span class="text-read">¿Hay alguna otra duda o pregunta en la que le pueda apoyar el día de hoy?</span><br><br>

<span class="text-action">(Si responde que no)</span><br>
<span class="text-read">Perfecto. Siendo así, le agradezco mucho que se haya comunicado con nosotros. Le recuerdo que le atendió ${nombreOperador}, ${tituloOperador} de Locatel. Que tenga una excelente tarde/noche.</span>`;
    }

    const tEl = document.getElementById('scriptTitulo');
    const oEl = document.getElementById('outputScript');
    if(tEl && oEl) {
        tEl.innerText = tituloFinal;
        oEl.innerHTML = scriptFinal; // Cambio clave: ahora inserta HTML para leer los colores
    }
}

const inputs = document.querySelectorAll('#appScreen input');
inputs.forEach(input => {
    input.addEventListener('input', actualizarGuiones);
    input.addEventListener('change', actualizarGuiones);
});

verificarSesion();
