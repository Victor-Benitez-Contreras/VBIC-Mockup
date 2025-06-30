async function copiarTextoAlPortapapeles(texto) {
    if (!navigator.clipboard) {
        console.error('API del portapapeles no soportada en este navegador.');
        return;
    }

    try {
        await navigator.clipboard.writeText(texto);
        mostrarModal(`${texto}`);
    } catch (error) {
        console.error('Error al copiar texto: ', error);
    }
}

function mostrarModal(mensaje) {
    const modal = document.getElementById('myModal');
    const mensajeModal = document.getElementById('modalMessage');
    mensajeModal.textContent = mensaje;
    modal.classList.add('show');

    setTimeout(() => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.opacity = '1'; 
                // Restablecer la opacidad después de un pequeño retraso
            }, 20); // Pequeño retraso adicional
        }, 1500);
    }, 1000);
}

const botonesCopiar = document.querySelectorAll('.copy-btn');

botonesCopiar.forEach(boton => {
    boton.addEventListener('click', function() {
        const formulasId = this.dataset.formulasId;
        const menuDesplegable = this.previousElementSibling;
        const formulaSeleccionadaId = menuDesplegable.value;
        if (formulaSeleccionadaId) {
            const formulaSeleccionada = document.getElementById(formulaSeleccionadaId);
            if (formulaSeleccionada) {
                copiarTextoAlPortapapeles(formulaSeleccionada.textContent);
            }
        } else {
            alert('Por favor, selecciona una fórmula del menú.');
        }
    });
});


//funciones copia de iconos al portapapeles como imagenes

async function copiarSVGAlPortapapeles(svgElement, escala) {
    if (!navigator.clipboard) {
        console.error('API del portapapeles no soportada en este navegador.');
        return;
    }
    try {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = async () => {
            canvas.width = escala;
            canvas.height = escala;
            ctx.drawImage(img, 0, 0, escala, escala);
            try {
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                mostrarModal(`SVG copied to the clipboard as a PNG scaled to a scale of ` + escala + ` X ` + escala + ` pixels`);
            } catch (err) {
                console.error('Error al copiar PNG: ', err);
            }
        };
        img.onerror = (err) => {
            console.error('Error al cargar la imagen SVG: ', err);
        }
        img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
        
    } catch (error) {
        console.error('Error al serializar el SVG: ', error);
    }
}

        const boxCards = document.querySelectorAll('.box-card');

        boxCards.forEach(mainContainer => {
            const iconSelector = mainContainer.querySelector('.icon-selector');
            const iconContainers = mainContainer.querySelectorAll('.icon-container');
            const botonesIconCopiar = mainContainer.querySelectorAll('.copyIcon-png');

            iconSelector.addEventListener('change', () => {
                const selectedIcon = iconSelector.value;
                iconContainers.forEach(container => {
                    container.style.display = 'none';
                });
                mainContainer.querySelector('#' + selectedIcon).style.display = 'flex';
            });

            if (iconContainers.length > 0) {
                iconContainers[0].style.display = 'flex';
            }

            botonesIconCopiar.forEach(boton => {
                boton.addEventListener('click', function() {
                    const iconId = this.dataset.iconId;
                    const iconContainer = mainContainer.querySelector('#' + iconId);
                    const svgElement = iconContainer.querySelector('svg');
                    const scaleSelect = iconContainer.querySelector('.scale-select');
                    const escala = parseInt(scaleSelect.value, 10);
                    if (svgElement) {
                        copiarSVGAlPortapapeles(svgElement, escala);
                    } else {
                        console.error(`No se encontró el elemento SVG en el contenedor con ID: ${iconId}`);
                    }
                });
            });
        });


// Funcion de filtro de iconos

document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.items-container .item');
    const etiquetasContainer = document.getElementById('tag-filter-container');
    const noResultsMessage = document.getElementById('no-results');
    const limpiarBtn = document.getElementById('clean-filter');

    
    // Usamos un Set para almacenar etiquetas únicas y evitar duplicados
    const todasLasEtiquetas = new Set();
    items.forEach(item => {
        const etiquetas = item.dataset.etiquetas.split(' ');
        etiquetas.forEach(etiqueta => todasLasEtiquetas.add(etiqueta));
    });

    // Crear un botón por cada etiqueta única
    todasLasEtiquetas.forEach(etiqueta => {
        const boton = document.createElement('button');
        boton.classList.add('tag-filter');
        boton.textContent = etiqueta;
        boton.dataset.tag = etiqueta; // Guardamos la etiqueta en un data attribute
        etiquetasContainer.appendChild(boton);
    });

    const tagButtons = document.querySelectorAll('.tag-filter');

    // --- 2. LÓGICA DE FILTRADO ---

    const filtrarItems = () => {
        
        const etiquetasActivas = Array.from(document.querySelectorAll('.tag-filter.active'))
                                     .map(btn => btn.dataset.tag);

        let itemsVisibles = 0;

        items.forEach(item => {
            const etiquetasDelItem = item.dataset.etiquetas.split(' ');
            
            // Si no hay filtros activos, mostrar todos los items
            if (etiquetasActivas.length === 0) {
                item.classList.remove('hide');
                itemsVisibles++;
                return; 
            }

            // Comprobar si el item contiene TODAS las etiquetas activas
            const coincide = etiquetasActivas.every(etiquetaActiva => 
                etiquetasDelItem.includes(etiquetaActiva)
            );

            if (coincide) {
                item.classList.remove('hide');
                itemsVisibles++;
            } else {
                item.classList.add('hide');
            }
        });

        // Mostrar u ocultar el mensaje de "no hay resultados"
        if (itemsVisibles === 0) {
            noResultsMessage.classList.remove('hide');
        } else {
            noResultsMessage.classList.add('hide');
        }
    };

    // --- 3. AÑADIR EVENT LISTENERS A LOS BOTONES ---

    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Alternar la clase 'active' en el botón clickeado
            button.classList.toggle('active');
            // Volver a filtrar los items con los nuevos filtros
            filtrarItems();
        });
    });

    limpiarBtn.addEventListener('click', () => {
        tagButtons.forEach(button => {
            button.classList.remove('active');
        });
        filtrarItems();
    });

    // Estado inicial: mostrar todos los items
    filtrarItems();
});

