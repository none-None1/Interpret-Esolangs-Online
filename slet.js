async function slet(code,input){
    let resp=await fetch('slet.py');
    var slet_py_code=await resp.text();
    execute(slet_py_code,code,input,'slet');
}
window.slet=slet;