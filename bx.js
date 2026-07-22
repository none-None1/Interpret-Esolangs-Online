async function bx_get_code() {
    let resp=await fetch('bx.py');
    var bx_py_code=await resp.text();
    return bx_py_code;
}
bx_py_code=bx_get_code();
function bx(code,input){
    execute(bx_py_code,code,input,'bx');
}
window.bx=bx;