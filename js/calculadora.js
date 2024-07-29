document.addEventListener('DOMContentLoaded',init);
function init(){
    
    const urlParams = new URLSearchParams(window.location.search);
    const curso = urlParams.get('curso');
    document.getElementById('curso').innerText = curso;



}