document.addEventListener('DOMContentLoaded',init);
function init(){
    
    const urlParams = new URLSearchParams(window.location.search);
    const curso = urlParams.get('curso');
    document.querySelector('#curso').innerText = curso;

    if (curso !== 'Curso Manual') {
        chrome.storage.session.get(['notas']).then(function (result) {
            let notas = result.notas?.filter(nota => nota.curso === curso);
            if (notas) {
                let identidicador;
                notas.forEach(curso => {
                    identidicador = getTipoIndentificador(curso);
                    
                    document.querySelector(`#${identidicador}`).value = curso.nota;
                    document.querySelector(`#peso-${identidicador}`).value = curso.peso.replace('%','');
                });
            }
        });
    }

    document.querySelector("#calcular").addEventListener('click', function (e) {
        e.preventDefault();
        // Limpiar animaciones anteriores
        document.querySelector("#nota-final").classList.remove('show');
        document.querySelector("#nota-faltante").classList.remove('show');

        let notaFinal = 0.0;
        for (let i = 1; i <= 3; i++) {
            let notaContinua = document.querySelector(`#continua${i}`).value;
            let pesoContinua = document.querySelector(`#peso-continua${i}`).value;

            let notaExamen = document.querySelector(`#examen${i}`).value;
            let pesoExamen = document.querySelector(`#peso-examen${i}`).value;

            if (notaContinua && pesoContinua) {
                notaFinal += (parseFloat(notaContinua) * parseFloat(pesoContinua)) / 100.0;
            }
            if (notaExamen && pesoExamen) {
                notaFinal += (parseFloat(notaExamen) * parseFloat(pesoExamen)) / 100.0;
            }
        }
        // Redondear el resultado final a dos decimales
        notaFinal = notaFinal.toFixed(2);
        document.querySelector("#nota-final").innerHTML = `NOTA FINAL: ${notaFinal}`;

        getNotaFaltante(notaFinal);

        // Añadir animaciones despues de un pequeño delay
        setTimeout(() => {
            document.querySelector("#nota-final").classList.add('show');
            document.querySelector("#nota-faltante").classList.add('show');
            
            document.querySelector("#nota-final").scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    });

    document.querySelector("#btn-volver").addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'popup.html';
    });

    function getTipoIndentificador(nota) {
        let parcial = nota.parcial;
        let continuaMatch = parcial.match(/EVAL\. CONTINUA (\d)/);
        let examenMatch = parcial.match(/EXAMEN (\d)/);
    
        if (continuaMatch) {
            return "continua"+continuaMatch[1];
        } else if (examenMatch) {
            return "examen"+examenMatch[1];
        }
        return null; // Retornar null si no coincide con ninguno
    }

    function getNotaFaltante(notaFinal) {
        let notaMinima = document.querySelector("#nota-minima").value; 
        let notaFaltante = 0.0;
        if (notaMinima) {
            if ((notaMinima - notaFinal) > 0) {
                notaFaltante = notaMinima - notaFinal;
            }
            document.querySelector("#nota-faltante").innerHTML = `NOTA FALTANTE: ${notaFaltante.toFixed(2)}`;
        }
    }
}