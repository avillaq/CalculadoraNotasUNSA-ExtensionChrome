document.addEventListener('DOMContentLoaded',init);
function init(){
    
    const urlParams = new URLSearchParams(window.location.search);
    const curso = urlParams.get('curso');
    document.getElementById('curso').innerText = curso;

    chrome.storage.session.get(['notas']).then(function (result) {
        let notas = result.notas.filter(nota => nota.curso === curso);
        if (notas) {
            let parcial;
            let titulo;
            let identidicador;
            let content = "";
            notas.forEach(curso => {
                parcial = getTipoParcial(curso);
                titulo = parcial.tipo + " " + parcial.numero;
                identidicador = parcial.tipo.toLowerCase() + parcial.numero;

                content += `
                    <div class="nota-row">
                        <label for="${identidicador}">${titulo}</label>
                        <div class="input-group">
                            <input type="number" id="${identidicador}" name="${identidicador}" min="0" max="20" placeholder="nota">
                            <input type="number" id="peso-${identidicador}" name="peso-${identidicador}" min="0" max="100" placeholder="peso">
                        </div>
                    </div>
                `;
            });
            document.querySelector("#nota-container").innerHTML = content;

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


    function getTipoParcial(nota) {
        let parcial = nota.parcial;
        let continuaMatch = parcial.match(/EVAL\. CONTINUA (\d)/);
        let examenMatch = parcial.match(/EXAMEN (\d)/);
    
        if (continuaMatch) {
            return { tipo: "Continua", numero: continuaMatch[1] };
        } else if (examenMatch) {
            return { tipo: "Examen", numero: examenMatch[1] };
        }
        return null; // Retornar null si no coincide con ninguno
    }

}