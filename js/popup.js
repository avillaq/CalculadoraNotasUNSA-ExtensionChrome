document.addEventListener('DOMContentLoaded', init);
async function init() {
    const tituloCursos = document.querySelector("#titulo-cursos");
    const listaCursos = document.querySelector("#lista-cursos");
    const { notas, fuente } = await obtenerNotas();
    if (notas.length > 0) {
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

        content += `<div class="separador-calculadora-manual"></div>`;
        content += `<button class="list-item" id="btn-calcular-manual">
                        Calcular Notas Manualmente
                    </button>`;
        tituloCursos.innerHTML = `Elige una opción: `;
        listaCursos.innerHTML = content;

        activarBotonesCursos();
        activarBotonResumenGeneral();
        activarBotonCalcularManual();

    } else if (fuente === 'session') {
        tituloCursos.innerHTML = `No hay cursos disponibles`;
        listaCursos.innerHTML = `
                <div class="no-cursos-container">
                    <div class="no-cursos-message">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                        </svg>
                        <strong>No se encontraron cursos</strong><br>
                        No hay notas disponibles en el sistema académico
                    </div>
                    <div class="separador-calculadora-manual"></div>
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
            let url = tabs[0]?.url || '';
            if (url.search("http://extranet.unsa.edu.pe/sisacad/parciales18") === -1) {
                tituloCursos.innerHTML = `Ingresa a la página de notas`;
                listaCursos.innerHTML = `
                        <div class="no-cursos-container">
                            <div class="no-cursos-message">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M7.364 3.5a.5.5 0 0 1 .5-.5H14.5A1.5 1.5 0 0 1 16 4.5v10a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 14.5V7.864a.5.5 0 1 1 1 0V14.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5H7.864a.5.5 0 0 1-.5-.5"/>
                                <path fill-rule="evenodd" d="M0 .5A.5.5 0 0 1 .5 0h5a.5.5 0 0 1 0 1H1.707l8.147 8.146a.5.5 0 0 1-.708.708L1 1.707V5.5a.5.5 0 0 1-1 0z"/>
                                </svg>
                                <strong>Accede a tus notas</strong><br>
                                Dirígete a la página de notas de la UNSA para cargar automáticamente tus cursos
                            </div>
                            <div class="acciones-container">
                                <button class="list-item" id="btn-irNotas">
                                    Ir a página de notas
                                </button>
                                <div class="separador-calculadora-manual"></div>
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
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103zM2.25 8.184l3.897 1.67a.5.5 0 0 1 .262.263l1.67 3.897L12.743 3.52z"/>
                                </svg>
                                <strong>Carga tus notas</strong><br>
                                Ingresa tu usuario y clave para acceder a tus notas.
                            </div>
                            <div class="separador-calculadora-manual"></div>
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
            chrome.tabs.create({ url: 'http://extranet.unsa.edu.pe/sisacad/parciales18' });
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

async function obtenerNotas() {
    try {
        const session = await chrome.storage.session.get(['notas']);
        const notasSesion = Array.isArray(session.notas) ? session.notas : [];
        if (notasSesion.length > 0) {
            return { notas: notasSesion, fuente: 'session' };
        }

        const local = await chrome.storage.local.get(['notas']);
        const notasLocales = Array.isArray(local.notas) ? local.notas : [];
        if (notasLocales.length > 0) {
            chrome.storage.session.set({ notas: notasLocales });
            return { notas: notasLocales, fuente: 'local' };
        }

        const fuente = Object.prototype.hasOwnProperty.call(session, 'notas') ? 'session' : 'ninguna';
        return { notas: notasSesion, fuente };
    } catch (error) {
        console.error('Error al obtener notas:', error);
        return { notas: [], fuente: 'error' };
    }
}