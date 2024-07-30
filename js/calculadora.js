document.addEventListener('DOMContentLoaded',init);
function init(){
    
    const urlParams = new URLSearchParams(window.location.search);
    const curso = urlParams.get('curso');
    document.getElementById('curso').innerText = curso;

    chrome.storage.session.get(['notas']).then(function (result) {
        let notas = result.notas.filter(nota => nota.curso === curso);
        if (notas) {
            let identidicador;
            notas.forEach(curso => {
                identidicador = getTipoIndentificador(curso);
                
                document.querySelector(`#${identidicador}`).value = curso.nota;
                document.querySelector(`#peso-${identidicador}`).value = curso.peso.replace('%','');
            });
        }
        return;
        const btnCursos = document.querySelectorAll("#curso");
        btnCursos.forEach(btnCurso => {
            btnCurso.addEventListener('click', function (e) {
                e.preventDefault();
                let curso = btnCurso.textContent;
                window.location.href = 'popup2.html?curso=' + encodeURIComponent(curso);
            }
            );
        }
        );
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

}