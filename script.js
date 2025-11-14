// script.js

// Al cargar el documento, adjuntamos el event listener al formulario.
document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        // Ejecutamos la función prepararEnvio cuando el formulario se envía
        quizForm.addEventListener('submit', prepararEnvio);
    }
});


// Función principal que maneja el cálculo y el envío
async function prepararEnvio(event) {
    // 1. Evitar el envío por defecto para manejarlo con JavaScript
    event.preventDefault(); 

    let puntuacionTotal = 0;
    
    // Función auxiliar para obtener el valor del radio button seleccionado
    const getRadioValue = (name) => {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : null;
    };

    // ---------------------------------------------
    // 2. ASIGNACIÓN DE PUNTOS POR RESPUESTA
    // ---------------------------------------------

    // P1: Registro de Ingresos/Gastos (q1_registro)
    const p1 = getRadioValue('q1_registro');
    if (p1 === 'siempre') puntuacionTotal += 3;
    else if (p1 === 'a_veces') puntuacionTotal += 1;

    // P2: Porcentaje de Ahorro (q2_ahorro_porcentaje)
    const p2 = getRadioValue('q2_ahorro_porcentaje');
    if (p2 === 'mas_20') puntuacionTotal += 3;
    else if (p2 === 'entre_10_20') puntuacionTotal += 2;
    else if (p2 === 'menos_10') puntuacionTotal += 1;

    // P3: Fondo de Emergencia (q3_fondo_emergencia)
    const p3 = getRadioValue('q3_fondo_emergencia');
    if (p3 === 'si') puntuacionTotal += 3;
    else if (p3 === 'en_proceso') puntuacionTotal += 1;

    // P4: Seguros de Vida/Gastos Médicos (q4_seguros)
    const p4 = getRadioValue('q4_seguros');
    if (p4 === 'ambos') puntuacionTotal += 3;
    else if (p4 === 'solo_uno') puntuacionTotal += 1;

    // P5: Respaldo Familiar (q5_respaldo_familiar)
    const p5 = getRadioValue('q5_respaldo_familiar');
    if (p5 === 'si') puntuacionTotal += 3;
    else if (p5 === 'no_seguro') puntuacionTotal += 1;

    // P6: Plan de Retiro (q6_plan_retiro)
    const p6 = getRadioValue('q6_plan_retiro');
    if (p6 === 'si') puntuacionTotal += 3;
    else if (p6 === 'me_interesa') puntuacionTotal += 1;

    // P7: Cálculo de Necesidad de Retiro (q7_necesidad_retiro)
    const p7 = getRadioValue('q7_necesidad_retiro');
    if (p7 === 'si') puntuacionTotal += 3;

    // P8: Deducciones Fiscales (q8_deducciones)
    const p8 = getRadioValue('q8_deducciones');
    if (p8 === 'si') puntuacionTotal += 3;

    // ---------------------------------------------
    // 3. LÓGICA DE DIAGNÓSTICO Y MENSAJES
    // ---------------------------------------------

    let tituloDiagnostico = "";
    let mensajeCompleto = "";
    let estadoEmergencia = "";
    let estadoProteccion = "";
    let recProteccionDetalle = "";
    let recRetiroDetalle = "";

    if (puntuacionTotal >= 18) { // 75% o más
        tituloDiagnostico = "¡Salud Financiera Óptima!";
        mensajeCompleto = "Tienes bases muy sólidas. Tu gestión y planificación están por encima del promedio, asegurando tu tranquilidad futura.";
        estadoEmergencia = "Cubierto";
        estadoProteccion = "Excelente";
        recProteccionDetalle = "Tu protección es adecuada y completa. Solo queda revisar periodicamente que las pólizas se ajusten a tus necesidades actuales.";
        recRetiroDetalle = "Estás en excelente posición. Considera optimizar la diversificación de tus inversiones y planificar el patrimonio.";

    } else if (puntuacionTotal >= 10) { // Cerca del 40% al 75%
        tituloDiagnostico = "Buen Camino, Requiere Ajustes.";
        mensajeCompleto = "Tienes bases sólidas, pero identificamos áreas clave en protección y planeación que necesitan atención. Una asesoría te ayudará a cerrar brechas.";
        estadoEmergencia = (p3 === 'si') ? "Cubierto" : "Pendiente";
        estadoProteccion = (p4 === 'ambos') ? "Adecuada" : "Necesita mejora";
        recProteccionDetalle = "Tu cobertura podría ser insuficiente. Te recomendamos explorar opciones de seguros de vida o de gastos médicos mayores para cerrar brechas de riesgo.";
        recRetiroDetalle = "Existen oportunidades para maximizar tus aportaciones a instrumentos de inversión a largo plazo y aprovechar beneficios fiscales. ¡Es el momento de actuar!";

    } else { // Menos del 40%
        tituloDiagnostico = "Foco Rojo, ¡Es Momento de Actuar! 🚨";
        mensajeCompleto = "Tu chequeo muestra que no tienes protección ni planificación a largo plazo. Es urgente establecer prioridades para asegurar tu bienestar futuro.";
        estadoEmergencia = "Ausente";
        estadoProteccion = "Crítica";
        recProteccionDetalle = "Urge establecer alguna forma de protección para tu familia. Explorar opciones básicas de seguros es el primer paso vital para mitigar riesgos.";
        recRetiroDetalle = "No hay un plan de retiro. Es fundamental empezar a construir un futuro financiero seguro. Un plan sencillo puede hacer una gran diferencia.";
    }

    // Unir el diagnóstico para el correo de la asesora
    const resultadoParaEmail = `Diagnóstico: ${tituloDiagnostico} | Puntuación: ${puntuacionTotal}/24. Mensaje: ${mensajeCompleto}`;
    
    // Obtener el nombre del usuario para el título de la página
    const nombreUsuario = document.querySelector('input[name="Nombre_Usuario"]').value || 'Estimado/a';

    // ---------------------------------------------
    // 4. ENVÍO DEL FORMULARIO (Asíncrono con fetch)
    // ---------------------------------------------
    
    // Inyectar el resultado final en el campo oculto
    document.getElementById('resultado_calculado').value = resultadoParaEmail;

    const form = document.getElementById('quizForm');
    const formData = new FormData(form);

    try {
        await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json' 
            }
        });
    } catch (error) {
        console.error("Error al enviar el formulario a Formspree:", error);
        // Podrías mostrar un mensaje de error genérico al usuario si falla el envío
    }

    // ---------------------------------------------
    // 5. MOSTRAR RESULTADOS AL USUARIO EN LA PÁGINA
    // ---------------------------------------------

    // Ocultar el formulario de la calculadora y mostrar resultados
    document.getElementById('calculadora').classList.add('hidden');
    const resultadosSection = document.getElementById('resultados-analisis');
    resultadosSection.classList.remove('hidden');

    // Llenar los campos dinámicos de la sección de resultados
    document.getElementById('titulo-resultados').innerText = `Aquí están tus resultados, ${nombreUsuario}`;
    document.getElementById('subtitulo-resultados').innerText = mensajeCompleto; 
    document.getElementById('diagnostico-titulo').innerText = tituloDiagnostico;
    document.getElementById('diagnostico-mensaje').innerText = mensajeCompleto;
    
    // Llenar Métricas Clave
    document.getElementById('metrica-puntuacion').innerText = `${puntuacionTotal}/24`;
    document.getElementById('estado-puntuacion').className = (puntuacionTotal >= 18) ? 'estado-positivo' : (puntuacionTotal >= 10) ? 'estado-neutro' : 'estado-alerta';
    
    document.getElementById('metrica-emergencia').innerText = estadoEmergencia;
    document.getElementById('estado-emergencia').className = (p3 === 'si') ? 'estado-positivo' : 'estado-alerta';

    document.getElementById('metrica-proteccion').innerText = estadoProteccion;
    document.getElementById('estado-proteccion').className = (p4 === 'ambos') ? 'estado-positivo' : 'estado-alerta';


    // Recomendaciones detalladas
    document.getElementById('rec-proteccion-detalle').innerText = recProteccionDetalle;
    document.getElementById('rec-retiro-detalle').innerText = recRetiroDetalle;

    // Opcional: Desplazarse suavemente a la sección de resultados
    resultadosSection.scrollIntoView({ behavior: 'smooth' });

}