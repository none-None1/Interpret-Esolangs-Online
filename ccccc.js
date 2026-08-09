async function ccccc(code,input){
    let resp=await fetch('ccccc.py');
    var cccc_py_code=await resp.text();
    execute(cccc_py_code,code,input,'ccccc',['pyparsing']);
}
window.cccc=ccccc;