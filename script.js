 // Lógica de JavaScript para manejar el formulario y mostrar resultados
        document.addEventListener('DOMContentLoaded', () => {
            const quizForm = document.getElementById('quizForm');
            const resultadosSection = document.getElementById('resultados-analisis');
            const calculadoraSection = document.getElementById('calculadora');
            const heroSection = document.getElementById('hero');
            const asesoraSection = document.getElementById('asesora-seccion'); 
            const btnRegresarInicio = document.getElementById('btn-regresar-inicio');
            // Se eliminó la variable btnDescargarPDF

            // --- Lógica de Puntuación ---
            const scoreValues = {
                // Sección 1: Hábitos financieros (Máx 9 puntos)
                q1_registro: { 'siempre': 3, 'a_veces': 1, 'no_nunca': 0 },
                q2_ahorro_porcentaje: { 'mas_20': 3, 'entre_10_20': 2, 'menos_10': 1, 'no_ahorro': 0 },
                q3_fondo_emergencia: { 'si': 3, 'en_proceso': 1, 'no': 0 },

                // Sección 2: Protección y seguridad (Máx 6 puntos)
                q4_seguros: { 'ambos': 3, 'solo_uno': 1, 'ninguno': 0 },
                q5_respaldo_familiar: { 'si': 3, 'no_seguro': 1, 'no': 0 },

                // Sección 3: Planeación y futuro (Máx 9 puntos)
                q6_plan_retiro: { 'si': 3, 'me_interesa': 1, 'no': 0 },
                q7_necesidad_retiro: { 'si': 3, 'no_calculado': 0 },
                q8_deducciones: { 'si': 3, 'no': 0, 'no_se': 1 }, 
            };
            const maxScore = 24; // 8 preguntas * 3 puntos máx. (q7 tiene menos opciones pero 3 es el máx)

            // Función para calcular la puntuación y el diagnóstico
            function calculateAndDisplayResults() {
                let totalScore = 0;
                let results = {};

                // 1. Calcular Puntuación y obtener respuestas
                for (const name in scoreValues) {
                    const selected = quizForm.elements[name].value;
                    if (selected) {
                        totalScore += scoreValues[name][selected] || 0;
                        results[name] = selected;
                    }
                }

                // 2. Determinar el Diagnóstico General
                let generalDiagnosis = '';
                let diagnosisMessage = '';
                let estadoGeneral = 'estado-neutro';

                if (totalScore >= 20) {
                    generalDiagnosis = '¡Salud Financiera Excelente!';
                    diagnosisMessage = 'Tienes una sólida disciplina financiera. Has cubierto tus bases de protección y estás bien encaminado hacia el retiro. Te ayudaremos a optimizar aún más tus estrategias.';
                    estadoGeneral = 'estado-satisfactorio';
                } else if (totalScore >= 12) {
                    generalDiagnosis = 'Salud Financiera Buena';
                    diagnosisMessage = 'Tienes hábitos saludables, pero hemos identificado áreas de oportunidad clave, especialmente en protección o planificación a largo plazo, para asegurar tu tranquilidad.';
                    estadoGeneral = 'estado-neutro';
                } else {
                    generalDiagnosis = 'Salud Financiera en Riesgo';
                    diagnosisMessage = 'Tu situación requiere atención inmediata en hábitos, protección y planificación. No te preocupes, el primer paso es tomar acción y estamos aquí para ayudarte.';
                    estadoGeneral = 'estado-alerta';
                }

                // 3. Determinar el Estado de Métricas Clave (Resumen de Análisis)
                
                // Fondo de Emergencia (Q3)
                const emergenciaStatus = {
                    'si': { strong: 'Cubierto', span: 'Satisfactorio', class: 'estado-satisfactorio' },
                    'en_proceso': { strong: 'En Proceso', span: 'Atención Requerida', class: 'estado-warning' },
                    'no': { strong: 'No Cubierto', span: 'Riesgo Alto', class: 'estado-alerta' }
                }[results.q3_fondo_emergencia] || { strong: 'Sin Datos', span: 'Evaluada', class: 'estado-neutro' };

                // Cobertura de Protección (Q4)
                const proteccionStatus = {
                    'ambos': { strong: 'Completa', span: 'Satisfactorio', class: 'estado-satisfactorio' },
                    'solo_uno': { strong: 'Parcial', span: 'Atención Requerida', class: 'estado-warning' },
                    'ninguno': { strong: 'Ausente', span: 'Riesgo Alto', class: 'estado-alerta' }
                }[results.q4_seguros] || { strong: 'Sin Datos', span: 'Evaluada', class: 'estado-neutro' };


                // 4. Actualizar el DOM
                const nombreInput = quizForm.querySelector('input[name="Nombre_Usuario"]').value || 'Estimado Cliente';
                
                // Títulos principales
                document.getElementById('titulo-resultados').textContent = `¡Aquí están tus resultados, ${nombreInput}!`;
                document.getElementById('subtitulo-resultados').textContent = diagnosisMessage;
                
                // Evaluación General
                document.getElementById('diagnostico-titulo').textContent = generalDiagnosis;
                document.getElementById('diagnostico-mensaje').textContent = diagnosisMessage;

                // Métricas
                document.getElementById('metrica-puntuacion').textContent = `${totalScore}/${maxScore}`;
                
                // Determinar el estado para la puntuación general
                let estadoPuntuacionSpan = 'Evaluación';
                if (totalScore >= 20) estadoPuntuacionSpan = 'Excelente Evaluación';
                else if (totalScore >= 12) estadoPuntuacionSpan = 'Buena Evaluación';
                else estadoPuntuacionSpan = 'Baja Evaluación';
                
                document.getElementById('estado-puntuacion').textContent = estadoPuntuacionSpan;
                document.getElementById('estado-puntuacion').className = estadoGeneral;
                
                document.getElementById('metrica-emergencia').textContent = emergenciaStatus.strong;
                document.getElementById('estado-emergencia').textContent = emergenciaStatus.span;
                document.getElementById('estado-emergencia').className = emergenciaStatus.class;

                document.getElementById('metrica-proteccion').textContent = proteccionStatus.strong;
                document.getElementById('estado-proteccion').textContent = proteccionStatus.span;
                document.getElementById('estado-proteccion').className = proteccionStatus.class;
                
                // Recomendaciones
                // La recomendación de protección necesita detalle si es Ausente o Parcial
                if (proteccionStatus.strong === 'Ausente' || proteccionStatus.strong === 'Parcial') {
                    document.getElementById('rec-proteccion-detalle').textContent = 'Dado que tu cobertura es ' + proteccionStatus.strong.toLowerCase() + ', te recomendamos explorar opciones flexibles de seguros de vida o de gastos médicos mayores para proteger el patrimonio y los ingresos de tu familia ante un evento inesperado.';
                } else {
                    document.getElementById('rec-proteccion-detalle').textContent = 'Tu cobertura de protección es sólida. Sigue revisando tus pólizas anualmente para asegurar que cubran tus necesidades actuales.';
                }

                // La recomendación de retiro necesita detalle si está en Riesgo (Q6 y Q7)
                if (results.q6_plan_retiro !== 'si' || results.q7_necesidad_retiro !== 'si') {
                    document.getElementById('rec-retiro-detalle').textContent = 'Es fundamental formalizar un plan de retiro. Te ayudaremos a canalizar tu ahorro a instrumentos que ofrecen ventajas fiscales y crecimiento compuesto para que alcances la meta que necesitas.';
                } else {
                    document.getElementById('rec-retiro-detalle').textContent = 'Excelente planeación para el retiro. Te ayudaremos a revisar si estás optimizando al máximo las deducciones fiscales disponibles.';
                }

                // Finalmente, mostrar la sección de resultados
                resultadosSection.classList.remove('hidden');
                quizForm.querySelector('input[type="hidden"]').value = generalDiagnosis; // Guarda el resultado en el formulario oculto
            }

            // Función para resetear el formulario y los inputs
            function resetForm() {
                quizForm.reset();
                // No necesitamos limpiar manualmente, quizForm.reset() se encarga de los radios/textos.
            }

            // Simulación de envío del formulario (Ahora con cálculo)
            quizForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Ocultamos las secciones principales
                calculadoraSection.classList.add('hidden');
                asesoraSection.classList.add('hidden'); 
                heroSection.classList.add('hidden');
                
                // Llamamos a la nueva función de cálculo
                calculateAndDisplayResults();
                
                // Mover el scroll al inicio de los resultados
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Lógica para los botones de Asesoría (WhatsApp)
            const asesoriaButtons = document.querySelectorAll('.btn-asesoria');
            asesoriaButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Intentamos obtener el nombre del campo de contacto
                    let userName = quizForm.querySelector('input[name="Nombre_Usuario"]').value;
                    
                    // Mensaje de WhatsApp codificado
                    let baseMessage = "Hola Damaris, acabo de completar el Check Up Financiero y me gustaría agendar una Asesoría Gratuita para revisar mis resultados.";
                    
                    if (userName) {
                        baseMessage += ` Mi nombre es ${userName}.`;
                    }
                    
                    const encodedMessage = encodeURIComponent(baseMessage);
                    const whatsappNumber = '5219512513470';
                    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                    
                    // Abrir en una nueva pestaña
                    window.open(whatsappURL, '_blank');
                });
            });


            // Lógica para el botón de Regresar al Inicio
            if (btnRegresarInicio) {
                btnRegresarInicio.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    resetForm();

                    resultadosSection.classList.add('hidden');
                    
                    heroSection.classList.remove('hidden');
                    calculadoraSection.classList.remove('hidden');
                    asesoraSection.classList.remove('hidden'); 
                    
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
        });