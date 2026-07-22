async function abcdxyz(code,input){
    let resp=await fetch('abcdxyz.py');
    var abcdxyz_py_code=await resp.text();
    execute(abcdxyz_py_code,code,input,'abcdxyz');
}
window.abcdxyz=abcdxyz;