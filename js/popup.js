document.addEventListener('DOMContentLoaded', init);
function init() {
    chrome.storage.session.get(['notas']).then(function (result) {
        let listaCursos = document.querySelector("#lista-cursos");
        let notas = result.notas;
        console.log(notas);
        if (notas && notas.length > 0) {
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

            activarBotonesCursos();

        } else {
            listaCursos.innerHTML = `
                    <p>No hay cursos disponibles</p>
                    <button class="list-item" id="btn-refrescar">Refrescar</button>
                `;
        
            activarBotonRefrescar();
        }
    });


    function activarBotonesCursos() {
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
    }

    function activarBotonRefrescar() {
        const btnRefrescar = document.querySelector("#btn-refrescar");
        btnRefrescar.addEventListener('click', function (e) {
            e.preventDefault();
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                let url = tabs[0].url;
                console.log(url);
                if (url.search("http://extranet.unsa.edu.pe/sisacad/parciales18") !== -1) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        files: ['js/content-script.js']
                    }).then(() => {
                        init()
                    });
                } 
            });
        });
    }
}