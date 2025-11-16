 // Lógica de JavaScript para manejar el formulario y mostrar resultados
        document.addEventListener('DOMContentLoaded', () => {
            const quizForm = document.getElementById('quizForm');
            const resultadosSection = document.getElementById('resultados-analisis');
            const calculadoraSection = document.getElementById('calculadora');
            const heroSection = document.getElementById('hero');
            // Elemento de la asesora
            const asesoraSection = document.getElementById('asesora-seccion'); 
            // Definimos el nuevo botón de regreso al inicio
            const btnRegresarInicio = document.getElementById('btn-regresar-inicio');

            // Función para resetear el formulario y los inputs
            function resetForm() {
                quizForm.reset();
                // Limpiar cualquier estilo o validación personalizada si existiera
                const selectedLabels = document.querySelectorAll('fieldset input[type="radio"]:checked + span');
                selectedLabels.forEach(span => {
                    span.parentElement.classList.remove('checked-label'); 
                });
            }

            // Simulación de envío del formulario para mostrar resultados
            quizForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Ocultar formulario, la sección de la asesora y el título principal
                calculadoraSection.classList.add('hidden');
                asesoraSection.classList.add('hidden'); // Ocultar solo la tarjeta de la asesora
                
                // Ocultar el título/descripción principal de #hero si es necesario, si no, lo dejamos visible.
                // En este diseño, es mejor ocultar hero y la asesora, dejando el formulario y resultados fuera de hero.
                // Sin embargo, si movemos calculadora y resultados fuera de hero, solo necesitamos:
                
                // Ocultamos el título principal y la sección de la asesora
                heroSection.classList.add('hidden');
                
                // Mostramos la sección de resultados
                resultadosSection.classList.remove('hidden');

                // Obtener el nombre para la personalización (si existe)
                const nombreInput = document.querySelector('input[name="Nombre_Usuario"]').value || '[Nombre del Usuario]';
                document.getElementById('titulo-resultados').textContent = `¡Aquí están tus resultados, ${nombreInput}!`;
                
                // Mover el scroll al inicio de los resultados
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Lógica para el botón de Regresar al Inicio
            if (btnRegresarInicio) {
                btnRegresarInicio.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Resetear el formulario a su estado inicial
                    resetForm();

                    // Ocultar resultados y mostrar el contenido principal
                    resultadosSection.classList.add('hidden');
                    
                    // Mostrar el título principal y la sección de la asesora/formulario
                    heroSection.classList.remove('hidden');
                    calculadoraSection.classList.remove('hidden');
                    asesoraSection.classList.remove('hidden'); 
                    
                    // Mover el scroll al inicio del HERO
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
        });