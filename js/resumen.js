document.addEventListener('DOMContentLoaded', init);

function init() {
    chrome.storage.session.get(['notas']).then(function (result) {
        let notas = result.notas;
        if (notas && notas.length > 0) {
            mostrarResumenCursos(notas);
        } else {
            document.querySelector('#resumen-cursos').innerHTML = '<p>No hay datos de notas disponibles</p>';
        }
    });

    document.querySelector("#btn-volver").addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'popup.html';
    });

    document.querySelector("#btn-imprimir").addEventListener('click', function (e) {
        e.preventDefault();
        generarPDF();
    });
}

function mostrarResumenCursos(notas) {
    let setCursos = new Set();
    notas.forEach(nota => {
        setCursos.add(nota.curso);
    });
    let cursos = Array.from(setCursos);

    let resumenHTML = '';

    cursos.forEach(curso => {
        let notasCurso = notas.filter(nota => nota.curso === curso);
        let resultados = calcularNotasCurso(notasCurso);

        resumenHTML += `
            <div class="curso-card">
                <h3 class="curso-titulo">${curso}</h3>
                <div class="notas-detalle">
                    <div class="nota-item">
                        <span class="nota-label">Nota Final:</span>
                        <span class="nota-valor ${getClaseNota(resultados.notaFinal, 10.5)}">${resultados.notaFinal}</span>
                    </div>
                    <div class="nota-item">
                        <span class="nota-label">Falta para 10.5:</span>
                        <span class="nota-valor">${resultados.faltante105}</span>
                    </div>
                    <div class="nota-item">
                        <span class="nota-label">Falta para 11.0:</span>
                        <span class="nota-valor">${resultados.faltante110}</span>
                    </div>
                </div>
                <div class="notas-parciales">
                    ${resultados.detalles.map(detalle =>
            `<small>${detalle.parcial}: ${detalle.nota} (${detalle.peso})</small>`
        ).join('<br>')}
                </div>
            </div>
        `;
    });

    document.querySelector('#resumen-cursos').innerHTML = resumenHTML;
}

function calcularNotasCurso(notasCurso) {
    let notaFinal = 0.0;
    let detalles = [];

    notasCurso.forEach(nota => {
        if (nota.nota && nota.peso) {
            let notaNum = parseFloat(nota.nota);
            let pesoNum = parseFloat(nota.peso.replace('%', ''));
            notaFinal += (notaNum * pesoNum) / 100.0;

            detalles.push({
                parcial: nota.parcial,
                nota: nota.nota,
                peso: nota.peso
            });
        }
    });

    notaFinal = notaFinal.toFixed(2);

    let faltante105 = Math.max(0, 10.5 - parseFloat(notaFinal)).toFixed(2);
    let faltante110 = Math.max(0, 11.0 - parseFloat(notaFinal)).toFixed(2);

    return {
        notaFinal: notaFinal,
        faltante105: faltante105,
        faltante110: faltante110,
        detalles: detalles
    };
}

function getClaseNota(nota, minima) {
    return parseFloat(nota) >= minima ? 'nota-aprobada' : 'nota-desaprobada';
}

async function getInfoEstudiante() {
    const local = await chrome.storage.local.get(['info']);
    return local.info || {};
}

async function generarPDF() {
    const original = document.querySelector('#resumen-cursos');

    // clon temporal
    const clon = original.cloneNode(true);
    clon.id = 'resumen-pdf-temp';
    clon.classList.add('pdf-grid');

    // contenedor del pdf
    const contenedorPDF = document.createElement('div');

    const infoEstudiante = await getInfoEstudiante();

    // encabezado
    const encabezado = document.createElement('div');
    encabezado.className = 'pdf-header';
    encabezado.innerHTML = `
            <h2>Resumen de Notas - UNSA</h2>
            <div class="info-estudiante">
                <p><strong>Estudiante:</strong> ${infoEstudiante.nombreEstudiante || 'No disponible'}</p>
                <p><strong>Carrera:</strong> ${infoEstudiante.carrera || 'No disponible'}</p>
                <p><strong>Periodo:</strong> ${infoEstudiante.periodo || 'No disponible'}</p>
            </div>
            <p class="fecha-generacion">${new Date().toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}</p>
        `;

    contenedorPDF.appendChild(encabezado);
    contenedorPDF.appendChild(clon);
    document.body.appendChild(contenedorPDF);

    const opciones = {
        margin: [8, 8, 8, 8],
        filename: `resumen-notas-${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const limpiar = () => {
        document.body.removeChild(contenedorPDF);
    };

    html2pdf().set(opciones).from(contenedorPDF).save()
        .then(limpiar)
        .catch(limpiar);
}