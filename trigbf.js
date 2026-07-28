async function trigbf(code,input){
    let resp=await fetch('trigbf.py');
    var trigbf_py_code=await resp.text();
    execute(trigbf_py_code,code,input,'trigbf',['mpmath']);
}
window.trigbf=trigbf;