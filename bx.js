async function bx(code,input){
    let resp=await fetch('bx.py');
    var bx_py_code=await resp.text();
    execute(bx_py_code,code,input,'bx');
}
window.bx=bx;