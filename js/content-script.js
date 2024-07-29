// content-script.js
const notas = [];
document.querySelectorAll('tr').forEach(fila => {
    let datos = fila.querySelectorAll('td');
    if (datos.length === 7) {
        notas.push({
            curso: datos[1].innerText,
            parcial: datos[2].innerText,
            nota: datos[4].innerText,
            peso: datos[5].innerText,
            ausente: datos[6].innerText,
        });
    }
});

chrome.storage.local.set({ notas: notas });