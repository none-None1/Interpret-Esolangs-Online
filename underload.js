let resp=await fetch('underload.py');
var underload_py_code=await resp.text();
function underload(code,input){
    execute(underload_py_code,code,input,'underload');
}
window.underload=underload;