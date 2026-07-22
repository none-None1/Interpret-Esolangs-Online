async function slet_get_code() {
    let resp=await fetch('slet.py');
    var slet_py_code=await resp.text();
    return slet_py_code;
}
slet_py_code=slet_get_code();
function slet(code,input){
    execute(slet_py_code,code,input,'slet');
}
window.slet=slet;