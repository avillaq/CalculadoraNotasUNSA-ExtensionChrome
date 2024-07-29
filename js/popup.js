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

    /*
    let calificacion = null;

    ///////////
    const btnCali = document.querySelector("#btnCali");
    btnCali.addEventListener('click', function (e) {
        e.preventDefault();
        const radio = document.querySelectorAll("input[type='radio'][name='radio']")
        radio.forEach(e => {
            if(e.checked){
                calificacion= e.id;
            }
        })

        if(calificacion != null){
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.scripting.executeScript({
                  target: { tabId: tabs[0].id },
                  function: fill,
                  args : [calificacion]
                });
              });
        }
    });
    
    ///////////
    const btnLimp = document.querySelector("#btnLimp");
    btnLimp.addEventListener('click', function(e){
        e.preventDefault();
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              function: clear
            });
          });
    });

    function fill(id) {
        for(let i = 1; i < 21; i++) {
            const radios = document.querySelectorAll(`#radio${i}`);
            let prob = Math.floor((Math.random())*2); // 0 o 1
            if (prob === 0){
                radios[parseInt(id)].checked = true;
            }else{
                radios[parseInt(id)+1].checked = true;
            }
            //console.log(e.value);    
        }

        // Calificacion
        const inputNumber = document.querySelector("input[type='number'][id='calificacion']");
        if (parseInt(id) === 2){ // 15-19
            inputNumber.value = Math.floor((Math.random()*6)+15);
        }else if (parseInt(id) === 1){ // 10-14
            inputNumber.value = Math.floor((Math.random()*5)+10);
        } else if (parseInt(id) === 0){ // 4-8
            inputNumber.value = Math.floor((Math.random()*5)+4);
        }

    }
    function clear(){
        const radios = document.querySelectorAll("input[type='radio']");
        radios.forEach(e => {
            e.checked = false;
        })
        const inputNumber = document.querySelector("input[type='number'][id='calificacion']");
        inputNumber.value = "";
    }*/
}