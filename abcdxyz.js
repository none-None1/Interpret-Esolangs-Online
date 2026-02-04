let resp=await fetch('abcdxyz.py');
var abcdxyz_py_code=await resp.text();
function abcdxyz(code,input){
    execute(abcdxyz_py_code,code,input,'abcdxyz');
}
window.abcdxyz=abcdxyz;