document.addEventListener('DOMContentLoaded', init);
function init() {
    chrome.storage.session.get(['notas']).then(function (result) {
        let tituloCursos = document.querySelector("#titulo-cursos");
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
            tituloCursos.innerHTML = `Elige un curso para empezar: `;
            listaCursos.innerHTML = content;

            activarBotonesCursos();
        
        } else if (notas && notas.length === 0) {
            tituloCursos.innerHTML = `No hay cursos disponibles`;
            listaCursos.innerHTML = `
                <button class="list-item" id="btn-calcular-manual">Calcular Notas Manualmente</button>
            `;
            activarBotonCalcularManual();
        } else {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                let url = tabs[0].url;
                console.log(url);
                if (url.search("http://extranet.unsa.edu.pe/sisacad/parciales18") === -1) {
                    tituloCursos.innerHTML = `Ingresa a la página de notas`;
                    listaCursos.innerHTML = `
                        <button class="list-item" id="btn-irNotas">Ir a notas</button>
                        <button class="list-item" id="btn-calcular-manual">Calcular Notas Manualmente</button>
                    `;
        
                    activarBotonIrNotas();
                    activarBotonCalcularManual();
                } else {
                    tituloCursos.innerHTML = `<p>Ingresa a tus notas</p>`;
                    listaCursos.innerHTML = `
                        <button class="list-item" id="btn-calcular-manual">Calcular Notas Manualmente</button>
                    `;
                    activarBotonCalcularManual();
                }
            });
        }
    });

    function activarBotonesCursos() {
        const btnCursos = document.querySelectorAll("#curso");
        btnCursos.forEach(btnCurso => {
            btnCurso.addEventListener('click', function (e) {
                e.preventDefault();
                let curso = btnCurso.textContent;
                window.location.href = 'calculadora.html?curso=' + encodeURIComponent(curso);
            });
        });
    }

    function activarBotonIrNotas() {
        const btnIrNotas = document.querySelector("#btn-irNotas");
        btnIrNotas.addEventListener('click', function (e) {
            e.preventDefault();
            chrome.tabs.create({ url: 'http://extranet.unsa.edu.pe/sisacad/parciales18'});
        });
    }

    function activarBotonCalcularManual() {
        const btnCalcularManual = document.querySelector("#btn-calcular-manual");
        btnCalcularManual.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'calculadora.html?curso=' + encodeURIComponent('Curso Manual');
        });
    }
}