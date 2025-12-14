// Se extraen las notas de la tabla
const notas = [];
const tablaNotas = document.querySelector('#resul_tab');
if (tablaNotas) {
    tablaNotas.querySelectorAll('tr').forEach(fila => {
        let datos = fila.querySelectorAll('td');
        if (datos.length === 7) {
            notas.push({
                curso: datos[1].innerText.trim(),
                parcial: datos[2].innerText.trim(),
                nota: datos[4].innerText.trim(),
                peso: datos[5].innerText.trim(),
                ausente: datos[6].innerText.trim(),
            });
        }
    });
    chrome.storage.session.remove('notas');
    chrome.storage.session.set({ notas });

    if (notas.length > 0) {
        chrome.storage.local.set({
            notas,
            notasActualizadas: Date.now()
        });
    }
}


// Se extrae informacion adicional

String.prototype.capitalize = function () { // capitaliza la primera letra
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.prototype.formatNombre = function () { // formateamos el nombre completo
    let partes = this.split(',').map(part => part.trim());
    if (partes.length !== 2) return this.capitalize();
    let nombres = partes[1].toLowerCase().split(' ').map(n => n.capitalize());
    let apellidos = partes[0].toLowerCase().split('/').map(a => a.capitalize());
    return nombres.concat(apellidos).join(' ');
}

const info = {};
const infoElementos = document.querySelectorAll('#resultados');
if (infoElementos && infoElementos.length > 0) {

    // se extrae CUI, Nombre
    const cuiMatch = infoElementos[0].innerText.match(/CUI:\s*(\d+)\s*\[([^\]]+)\]/);
    const cui = cuiMatch?.[1] || '';
    const nombreEstudiante = cuiMatch?.[2]?.trim().formatNombre() || '';

    // se extrae Carrera, Periodo
    const periodoMatch = infoElementos[1].innerText.match(/^(.+?)\s*Periodo:\s*(.+)$/);
    const carrera = periodoMatch?.[1]?.trim().capitalize() || '';
    const periodo = periodoMatch?.[2]?.trim() || '';

    info.cui = cui;
    info.nombreEstudiante = nombreEstudiante;
    info.carrera = carrera;
    info.periodo = periodo;

    chrome.storage.local.remove('info');
    chrome.storage.local.set({ info });
}