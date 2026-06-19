// Función principal que actualiza los textos
function actualizarGuiones() {
    // 1. Captura de valores del formulario
    const nombreSol = document.getElementById('nombreSol').value.trim() || "[Nombre de la persona]";
    const contactoSol = document.getElementById('contactoSol').value.trim();
    const nombreTer = document.getElementById('nombreTer').value.trim() || "[Nombre de la cuenta del tercero]";

    // 2. Determinar la hora del día (Días, tardes o noches)
    const horaActual = new Date().getHours();
    let saludoTemporal = "tardes";
    if (horaActual >= 20 || horaActual < 5) {
        saludoTemporal = "noches";
    } else if (horaActual < 12) {
        saludoTemporal = "días";
    }

    // 3. Detectar si el contacto es Correo o Número y ajustar la redacción
    // Expresión regular básica para detectar formato de correo electrónico
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

    // 4. Construcción del guion: CON CUENTA LLAVE
    const scriptConLlave = `1. Saludo e Identificación inicial

Buenas ${saludoTemporal}. 
Me comunico de *0311 Locatel, Mi nombre es José Granados. ¿Tengo el gusto de comunicarme con ${nombreSol}?

2. Motivo de la llamada y Explicación del problema

Mucho gusto. El motivo de mi llamada es para darle seguimiento a su solicitud sobre la actualización de sus medios de contacto. Verificando en el sistema, detectamos que el ${tipoContacto} que desea registrar se encuentra actualmente vinculado a la cuenta de un tercero.
¿Conoce a: ${nombreTer}? 

3. Acción a realizar (Desvinculación y Vinculación)

No se preocupe, para darle solución en este momento voy a realizar el proceso para desvincular ${tipoContactoRef} de la otra cuenta y procederé a vincularlo de manera correcta a su cuenta personal.
¿Por protocolos de seguridad me puede confirmar su nombre completo por favor? 

(Confirmas datos)

Muchas gracias. 
¿Me permite un momento en la línea, por favor, en lo que realizo la actualización en el sistema?

(Haces el proceso en tu sistema. Si tardas más de 1 minuto, puedes regresar a la línea rápido y decir: "Sigo con usted, sigo trabajando en su solicitud").

4. Confirmación del trámite exitoso

Le agradezco mucho su tiempo de espera. Le informo que el proceso ha concluido de manera exitosa. Su ${tipoContactoCorto} ya quedó liberado y ha sido vinculado correctamente a su cuenta. A partir de este momento ya puede utilizarlo sin ningún inconveniente.

5. Cierre y Despedida

¿Hay alguna otra duda o pregunta en la que le pueda apoyar el día de hoy?

(Si dice que no) 
Perfecto, le agradezco mucho que se haya comunicado con nosotros. Le recuerdo que le atendió José Granados, operador de Locatel. Que tenga una excelente ${saludoTemporal}.`;


    // 5. Construcción del guion: SIN CUENTA LLAVE
    const scriptSinLlave = `1. Saludo e Identificación inicial

Buenos ${saludoTemporal}. 
Me comunico de *0311 Locatel, Mi nombre es José Granados. ¿Tengo el gusto de comunicarme con ${nombreSol}?

2. Motivo de la llamada y Explicación del problema

(Una vez que confirme su nombre) 
Mucho gusto. El motivo de mi llamada es para darle seguimiento a su reporte sobre la creación de su Cuenta Llave CDMX. Verificando en el sistema, detectamos que el motivo por el cual la página no le permite continuar con su registro es porque su ${tipoContacto} se encuentra vinculado actualmente a la cuenta de una tercera persona.

3. Acción a realizar (Desvinculación)

No se preocupe, para que usted pueda registrarse sin problemas, en este momento voy a realizar el proceso para desvincular y liberar su ${tipoContactoCorto} de esa otra cuenta.
¿Por protocolos de seguridad me puede confirmar su nombre completo por favor?

(Esperas confirmación)

Muchas gracias.
¿Me permite un momento en la línea, por favor, en lo que aplico la actualización en nuestro sistema?

(Realizas el proceso. Recuerda retomar la llamada si tardas más de un minuto para decirle: "Sigo con usted, estoy procesando la liberación de su ${tipoContactoCorto}").

4. Confirmación y Siguientes pasos para el ciudadano

Le agradezco mucho su tiempo de espera. Le informo que el proceso ha concluido de manera exitosa. Su ${tipoContactoCorto} ya quedó totalmente desvinculado y liberado en el sistema.

A partir de este momento, usted ya puede ingresar nuevamente a la página web y comenzar desde cero su registro para crear su Cuenta Llave CDMX. El sistema ya le aceptará su ${tipoContactoCorto} sin marcarle error.

5. Cierre y Despedida

¿Hay alguna otra duda o pregunta en la que le pueda apoyar el día de hoy?

(Si responde que no) 
Perfecto. Siendo así, le agradezco mucho que se haya comunicado con nosotros. Le recuerdo que le atendió José Granados, operador de Locatel. Que tenga una excelente ${saludoTemporal}.`;

    // 6. Inyección de los guiones en el HTML
    document.getElementById('outputCon').innerText = scriptConLlave;
    document.getElementById('outputSin').innerText = scriptSinLlave;
}

// Función para copiar al portapapeles rápidamente
function copiarTexto(idElemento) {
    const texto = document.getElementById(idElemento).innerText;
    navigator.clipboard.writeText(texto).then(() => {
        // Opcional: una pequeña alerta visual para confirmar
        alert("¡Guion copiado al portapapeles!");
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

// Agregar Event Listeners a los inputs para que se actualice en tiempo real al escribir
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('input', actualizarGuiones);
});

// Llamada inicial para cargar los textos por defecto al abrir la página
actualizarGuiones();
