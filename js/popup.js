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
            
            content += `<button class="list-item btn-resumen-general" id="btn-resumen-general">
                            Ver Resumen General
                        </button>`;
            
            content += `<div class="separador-cursos"></div>`;
            
            cursos.forEach(curso => {
                content += `<button class="list-item" id="curso">${curso}</button>`;
            });
            tituloCursos.innerHTML = `Elige una opción: `;
            listaCursos.innerHTML = content;

            activarBotonesCursos();
            activarBotonResumenGeneral();
        
        } else if (notas && notas.length === 0) {
            tituloCursos.innerHTML = `No hay cursos disponibles`;
            listaCursos.innerHTML = `
                <div class="no-cursos-container">
                    <div class="no-cursos-message">
                        <i class="fas fa-info-circle"></i>
                        <strong>No se encontraron cursos</strong><br>
                        No hay notas disponibles en el sistema académico
                    </div>
                    <div class="acciones-container">
                        <button class="list-item" id="btn-calcular-manual">
                            Calcular Notas Manualmente
                        </button>
                    </div>
                </div>
            `;
            activarBotonCalcularManual();
        } else {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                let url = tabs[0].url;
                console.log(url);
                if (url.search("http://extranet.unsa.edu.pe/sisacad/parciales18") === -1) {
                    tituloCursos.innerHTML = `Ingresa a la página de notas`;
                    listaCursos.innerHTML = `
                        <div class="no-cursos-container">
                            <div class="no-cursos-message">
                                <i class="fas fa-external-link-alt"></i>
                                <strong>Accede a tus notas</strong><br>
                                Dirígete a la página de notas de la UNSA para cargar automáticamente tus cursos
                            </div>
                            <div class="acciones-container">
                                <button class="list-item" id="btn-irNotas">
                                    Ir a página de notas
                                </button>
                                <button class="list-item" id="btn-calcular-manual">
                                    Calcular Notas Manualmente
                                </button>
                            </div>
                        </div>
                    `;
        
                    activarBotonIrNotas();
                    activarBotonCalcularManual();
                } else {
                    tituloCursos.innerHTML = `<p>Ingresa a tus notas</p>`;
                    listaCursos.innerHTML = `
                        <div class="no-cursos-container">
                            <div class="no-cursos-message">
                                <i class="fas fa-mouse-pointer"></i>
                                <strong>Carga tus notas</strong><br>
                                Ingresa tu usuario y clave para acceder a tus notas.
                            </div>
                            <div class="acciones-container">
                                <button class="list-item" id="btn-calcular-manual">
                                    Calcular Notas Manualmente
                                </button>
                            </div>
                        </div>
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

    function activarBotonResumenGeneral() {
        const btnResumenGeneral = document.querySelector("#btn-resumen-general");
        btnResumenGeneral.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'resumen.html';
        });
    }
}