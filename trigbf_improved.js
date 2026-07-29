async function trigbf_improved(code,input){
    let resp=await fetch('trigbf_improved.py');
    var trigbf_improved_py_code=await resp.text();
    execute(trigbf_improved_py_code,code,input,'trigbf_improved',['mpmath']);
}
window.trigbf_improved=trigbf_improved;