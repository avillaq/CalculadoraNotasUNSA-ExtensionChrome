document.addEventListener('DOMContentLoaded', init);
function init() {
    chrome.storage.session.get(['notas']).then(function (result) {
        let listaCursos = document.querySelector("#lista-cursos");
        let notas = result.notas;
        if (notas) {
            let setCursos = new Set();
            notas.forEach(nota => {
                setCursos.add(nota.curso);
            });
            let cursos = Array.from(setCursos);
            let content = "";
            cursos.forEach(curso => {
                content += `<button class="list-item" id="curso">${curso}</button>`;
            });
            listaCursos.innerHTML = content;
        }

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
}