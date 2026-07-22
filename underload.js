async function underload_get_code() {
    let resp=await fetch('underload.py');
    var underload_py_code=await resp.text();
    return underload_py_code;
}
underload_py_code=underload_get_code();
function underload(code,input){
    execute(underload_py_code,code,input,'underload');
}
window.underload=underload;