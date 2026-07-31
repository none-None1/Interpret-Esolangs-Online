async function gofe(code,input){
    let resp=await fetch('gofe.py');
    var gofe_py_code=await resp.text();
    execute(gofe_py_code,code,input,'gofe',['pyparsing','precreal>=1.0.3']);
}
window.gofe=gofe;