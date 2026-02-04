let resp=await fetch('slet.py');
var slet_py_code=await resp.text();
function slet(code,input){
    execute(slet_py_code,code,input,'slet');
}
window.slet=slet;