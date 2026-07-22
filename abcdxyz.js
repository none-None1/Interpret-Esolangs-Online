async function abcdxyz_get_code() {
    let resp=await fetch('abcdxyz.py');
    var abcdxyz_py_code=await resp.text();
    return abcdxyz_py_code;
}
abcdxyz_py_code=abcdxyz_get_code();
function abcdxyz(code,input){
    execute(abcdxyz_py_code,code,input,'abcdxyz');
}
window.abcdxyz=abcdxyz;