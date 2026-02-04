let resp=await fetch('bx.py');
var bx_py_code=await resp.text();
function bx(code,input){
    execute(bx_py_code,code,input,'bx');
}
window.bx=bx;