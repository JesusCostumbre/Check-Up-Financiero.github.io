// Lógica de JavaScript para manejar el formulario y mostrar resultados
document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quizForm');
    const resultadosSection = document.getElementById('resultados-analisis');
    const calculadoraSection = document.getElementById('calculadora');
    const heroSection = document.getElementById('hero');
    // Si 'asesora-seccion' no existe, usamos la clase para evitar errores
    const asesoraSection = document.getElementById('asesora-seccion') || document.querySelector('.asesora-presentacion'); 
    const btnRegresarInicio = document.getElementById('btn-regresar-inicio');

    const scoreValues = {
        // =======================================================
        // Sección 1: Hábitos financieros (Máx 9 puntos)
        // =======================================================
        q1_registro: { 'siempre': 3, 'a_veces': 1, 'no_nunca': 0 },
        q2_ahorro_porcentaje: { 'mas_20': 3, 'entre_10_20': 2, 'menos_10': 1, 'no_ahorro': 0 },
        q3_fondo_emergencia: { 'si': 3, 'en_proceso': 2, 'no': 0 }, 
        
        // =======================================================
        // Sección 2: Protección y seguridad (Máx 6 puntos)
        // =======================================================
        q4_seguros: { 'ambos': 3, 'solo_uno': 2, 'ninguno': 0 }, 
        q5_respaldo_familiar: { 'si': 3, 'no_seguro': 1, 'no': 0 }, 
        
        // =======================================================
        // Sección 3: Planeación y futuro (Máx 9 puntos)
        // =======================================================
        q6_plan_retiro: { 'si': 3, 'me_interesa': 1, 'no': 0 },
        q7_necesidad_retiro: { 'si': 3, 'no_calculado': 0 },
        q8_deducciones: { 'si': 3, 'no': 0, 'no_se': 1 }, 

        // =======================================================
        // Sección 4: Tu relación con el dinero (Máx 9 puntos)
        // =======================================================
        q9_relacion_dinero: { 
        'en_control': 3,      // Opción #3 en el HTML = 3 puntos
        'tranquilidad': 2,    // Opción #1 en el HTML = 2 puntos
        'manejar_mejor': 1, 
        'estres': 0 
          },
        q10_cien_mil: { 
             'invertir': 3, 'ahorrar_e_invertir': 2, 'pagar_deudas': 2, 'gastar': 0, 'no_saber': 0 
        },
        q11_donde_ahorras: { 
             'inversiones': 3, 'cuenta_tradicional': 1, 'casa_efectivo': 0, 'no_tengo_ahorros': 0 
        } 
    };
    
    // Máximo de puntos: 33
    const maxScore = 33; 
    
    // Rangos de diagnóstico ajustados a 33 puntos (75% y 45%)
    const RANGO_EXCELENTE = 25; 
    const RANGO_BUENO = 15;     

    // Función para calcular la puntuación y el diagnóstico
    function calculateAndDisplayResults() {

        // 1. **INICIALIZACIÓN Y CÁLCULO DE PUNTUACIÓN (Orden corregido)**
        let totalScore = 0;
        let results = {};

        // Obtener respuestas y calcular Puntuación
        for (const name in scoreValues) {
            const selectedInput = quizForm.querySelector(`input[name="${name}"]:checked`);
            
            if (selectedInput) {
                const selectedValue = selectedInput.value;
                // Verificar si el valor existe en scoreValues (para evitar errores con valores no esperados)
                totalScore += scoreValues[name][selectedValue] || 0; 
                results[name] = selectedValue;
            } else {
                console.warn(`Alerta: La pregunta ${name} no fue respondida o el name es incorrecto.`); 
            }
        }

        // 2. Cálculo del Porcentaje (Ahora usa el totalScore ya calculado)
        const porcentaje = Math.round((totalScore / maxScore) * 100);

        // 3. Determinar el Diagnóstico General
        let generalDiagnosis = '';
        let diagnosisMessage = '';
        let estadoGeneral = 'estado-neutro';

        if (totalScore >= RANGO_EXCELENTE) {
            generalDiagnosis = '¡Salud Financiera Excelente!';
            diagnosisMessage = 'Tienes una sólida disciplina financiera. Has cubierto tus bases de protección y estás bien encaminado hacia el retiro. Te ayudaremos a optimizar aún más tus estrategias.';
            estadoGeneral = 'estado-satisfactorio';
        } else if (totalScore >= RANGO_BUENO) {
            generalDiagnosis = 'Salud Financiera Buena';
            diagnosisMessage = 'Tienes hábitos saludables, pero hemos identificado áreas de oportunidad clave, especialmente en protección o planificación a largo plazo, para asegurar tu tranquilidad.';
            estadoGeneral = 'estado-neutro';
        } else {
            generalDiagnosis = 'Salud Financiera en Riesgo';
            diagnosisMessage = 'Tu situación requiere atención inmediata en hábitos, protección y planificación. No te preocupes, el primer paso es tomar acción y estamos aquí para ayudarte.';
            estadoGeneral = 'estado-alerta';
        }

        // 4. Determinar la clase de color basada en el diagnóstico (Basado en totalScore)
        let claseColorProgreso;
        if (totalScore >= RANGO_EXCELENTE) {
            claseColorProgreso = 'progreso-satisfactorio';
        } else if (totalScore >= RANGO_BUENO) {
            claseColorProgreso = 'progreso-neutro';
        } else {
            claseColorProgreso = 'progreso-alerta';
        }

        // 5. Aplicar estilos y actualizar el DOM para el GRÁFICO
        const graficoElement = document.getElementById('grafico-progreso');
        const porcentajeElement = document.getElementById('porcentaje-display');

        // Limpiar clases y aplicar la nueva clase de color
        graficoElement.className = 'grafico ' + claseColorProgreso;

        // Obtener el color del diagnóstico (asumiendo que hay una variable CSS para cada estado)
        // Esto previene el error del código original al obtener el color.
        const colorEstado = estadoGeneral.split('-')[1]; // 'satisfactorio', 'neutro', 'alerta'
        const colorDiagnosticoProp = getComputedStyle(document.body).getPropertyValue(`--color-${colorEstado}`) || 'var(--color-primary)'; 

        // Aplica el conic-gradient para dibujar la dona
        graficoElement.style.background = `conic-gradient(
            ${colorDiagnosticoProp} 0deg, 
            ${colorDiagnosticoProp} ${porcentaje * 3.6}deg, 
            var(--color-border) ${porcentaje * 3.6}deg, 
            var(--color-border) 360deg
        )`;

        // Mostrar el porcentaje calculado en el centro
        porcentajeElement.textContent = `${porcentaje}%`;


        // 6. Determinar el Estado de Métricas Clave (Resumen de Análisis)
        
        // Fondo de Emergencia (Q3)
        const emergenciaStatus = {
            'si': { strong: 'Cubierto', span: 'Satisfactorio', class: 'estado-satisfactorio' },
            'en_proceso': { strong: 'En Proceso', span: 'Atención Requerida', class: 'estado-neutro' }, 
            'no': { strong: 'No Cubierto', span: 'Riesgo Alto', class: 'estado-alerta' }
        }[results.q3_fondo_emergencia] || { strong: 'Sin Datos', span: 'Evaluada', class: 'estado-neutro' };

        // Cobertura de Protección (Q4)
        const proteccionStatus = {
            'ambos': { strong: 'Completa', span: 'Satisfactorio', class: 'estado-satisfactorio' },
            'solo_uno': { strong: 'Parcial', span: 'Atención Requerida', class: 'estado-neutro' },
            'ninguno': { strong: 'Ausente', span: 'Riesgo Alto', class: 'estado-alerta' }
        }[results.q4_seguros] || { strong: 'Sin Datos', span: 'Evaluada', class: 'estado-neutro' };

        // NUEVA MÉTRICA: Capacidad de Inversión/Ahorro (Q11)
        const inversionStatus = {
            'inversiones': { strong: 'Optimizada', span: 'Satisfactorio', class: 'estado-satisfactorio' },
            'cuenta_tradicional': { strong: 'Pasivo', span: 'Mejora Necesaria', class: 'estado-neutro' },
            'casa_efectivo': { strong: 'Ineficiente', span: 'Riesgo Alto', class: 'estado-alerta' },
            'no_tengo_ahorros': { strong: 'Ausente', span: 'Riesgo Alto', class: 'estado-alerta' }
        }[results.q11_donde_ahorras] || { strong: 'Sin Datos', span: 'Evaluada', class: 'estado-neutro' };


        // 7. Actualizar el DOM (el resto de las métricas)
        const nombreInput = quizForm.querySelector('input[name="Nombre_Usuario"]').value || 'Estimado Cliente';
        
        // Títulos principales
        document.getElementById('titulo-resultados').textContent = `¡Aquí están tus resultados, ${nombreInput}!`;
        
        // Evaluación General
        document.getElementById('diagnostico-titulo').textContent = generalDiagnosis;
        document.getElementById('diagnostico-mensaje').textContent = diagnosisMessage;

        // Métricas
        document.getElementById('metrica-puntuacion').textContent = `${totalScore}/${maxScore}`;
        
        // Determinar el estado para la puntuación general
        let estadoPuntuacionSpan = 'Evaluación';
        if (totalScore >= RANGO_EXCELENTE) estadoPuntuacionSpan = 'Excelente Evaluación';
        else if (totalScore >= RANGO_BUENO) estadoPuntuacionSpan = 'Buena Evaluación';
        else estadoPuntuacionSpan = 'Baja Evaluación';
        
        document.getElementById('estado-puntuacion').textContent = estadoPuntuacionSpan;
        document.getElementById('estado-puntuacion').className = estadoGeneral;
        
        // Métrica Fondo de Emergencia
        document.getElementById('metrica-emergencia').textContent = emergenciaStatus.strong;
        document.getElementById('estado-emergencia').textContent = emergenciaStatus.span;
        document.getElementById('estado-emergencia').className = emergenciaStatus.class;

        // Métrica Cobertura de Protección
        document.getElementById('metrica-proteccion').textContent = proteccionStatus.strong;
        document.getElementById('estado-proteccion').textContent = proteccionStatus.span;
        document.getElementById('estado-proteccion').className = proteccionStatus.class;

        // Métrica Inversión (Asegúrate que los IDs #metrica-inversion y #estado-inversion existen en tu HTML)
        const metricaInversionElement = document.getElementById('metrica-inversion');
        const estadoInversionElement = document.getElementById('estado-inversion');
        if (metricaInversionElement) metricaInversionElement.textContent = inversionStatus.strong;
        if (estadoInversionElement) {
            estadoInversionElement.textContent = inversionStatus.span;
            estadoInversionElement.className = inversionStatus.class;
        }
        
        // Recomendaciones
        // Recomendación de protección
        const recProteccionDetalle = document.getElementById('rec-proteccion-detalle');
        if (recProteccionDetalle) {
             if (proteccionStatus.strong === 'Ausente' || proteccionStatus.strong === 'Parcial') {
                 recProteccionDetalle.textContent = 'Dado que tu cobertura es ' + proteccionStatus.strong.toLowerCase() + ', te recomendamos explorar opciones flexibles de seguros de vida o de gastos médicos mayores para proteger el patrimonio y los ingresos de tu familia ante un evento inesperado.';
             } else {
                 recProteccionDetalle.textContent = 'Tu cobertura de protección es sólida. Sigue revisando tus pólizas anualmente para asegurar que cubran tus necesidades actuales.';
             }
        }
        
        // Recomendación de retiro
        const recRetiroDetalle = document.getElementById('rec-retiro-detalle');
        if (recRetiroDetalle) {
             if (results.q6_plan_retiro !== 'si' || results.q7_necesidad_retiro !== 'si') {
                 recRetiroDetalle.textContent = 'Es fundamental formalizar un plan de retiro. Te ayudaremos a canalizar tu ahorro a instrumentos que ofrecen ventajas fiscales y crecimiento compuesto para que alcances la meta que necesitas.';
             } else {
                 recRetiroDetalle.textContent = 'Excelente planeación para el retiro. Te ayudaremos a revisar si estás optimizando al máximo las deducciones fiscales disponibles.';
             }
        }

        // NUEVA RECOMENDACIÓN: Inversión
        const recInversionDetalle = document.getElementById('rec-inversion-detalle');
        if (recInversionDetalle) {
             if (results.q11_donde_ahorras !== 'inversiones' || results.q10_cien_mil === 'gastar' || results.q10_cien_mil === 'no_saber') {
                 recInversionDetalle.textContent = 'Para maximizar tus recursos, es crucial mover el dinero de cuentas tradicionales o efectivo a instrumentos de inversión. Te guiaremos para que tu dinero no pierda valor con la inflación.';
             } else {
                 recInversionDetalle.textContent = 'Demuestras una gran mentalidad de crecimiento. Te ayudaremos a diversificar tus vehículos de inversión para asegurar la máxima rentabilidad ajustada al riesgo.';
             }
        }

        // Finalmente, establecer el valor del campo oculto y mostrar la sección de resultados
        resultadosSection.classList.remove('hidden');
        const diagnosticoInput = quizForm.querySelector('input[type="hidden"]');
        if (diagnosticoInput) diagnosticoInput.value = generalDiagnosis;
    }

    // Función para resetear el formulario y los inputs
    function resetForm() {
        quizForm.reset();
    }

    // =======================================================================
    // FUNCIÓN DE ENVÍO
    // =======================================================================
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Detenemos el envío automático del formulario
        
        // 1. Ocultar secciones y calcular y mostrar resultados
        calculadoraSection.classList.add('hidden');
        if (asesoraSection) asesoraSection.classList.add('hidden');
        if (heroSection) heroSection.classList.add('hidden');
        
        calculateAndDisplayResults(); 
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // 2. Enviar los datos a Formspree usando Fetch (para que se envíe el correo)
        const formspreeEndpoint = quizForm.action;
        const formData = new FormData(quizForm);

        fetch(formspreeEndpoint, {
            method: 'POST', 
            body: formData, 
            headers: {
                'Accept': 'application/json' 
            }
        })
        .then(response => {
            if (response.ok) {
                console.log("¡Éxito! Datos enviados a Formspree.");
                // Puedes agregar aquí una confirmación visual de envío si lo deseas
            } else {
                console.error("Error al enviar a Formspree.");
            }
        })
        .catch(error => {
            console.error("Error de conexión/red:", error);
        });
    });
    // =======================================================================

    // Lógica para los botones de Asesoría (WhatsApp)
    const asesoriaButtons = document.querySelectorAll('.btn-asesoria');
    asesoriaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            let userName = quizForm.querySelector('input[name="Nombre_Usuario"]').value;
            
            // Mensaje de WhatsApp codificado
            let baseMessage = "Hola Damaris, acabo de completar el Check Up Financiero y me gustaría agendar una Asesoría Gratuita para revisar mis resultados.";
            
            if (userName) {
                baseMessage += ` Mi nombre es ${userName}.`;
            }
            
            const encodedMessage = encodeURIComponent(baseMessage);
            const whatsappNumber = '5219512513470';
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            window.open(whatsappURL, '_blank');
        });
    });

    // Lógica para el botón de Regresar al Inicio
    if (btnRegresarInicio) {
        btnRegresarInicio.addEventListener('click', (e) => {
            e.preventDefault();
            
            resetForm();

            resultadosSection.classList.add('hidden');
            
            if (heroSection) heroSection.classList.remove('hidden');
            calculadoraSection.classList.remove('hidden');
            if (asesoraSection) asesoraSection.classList.remove('hidden'); 
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});