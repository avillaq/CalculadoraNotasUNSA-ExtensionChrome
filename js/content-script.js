// content-script.js
const notas = [];
document.querySelectorAll('tr').forEach(fila => {
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