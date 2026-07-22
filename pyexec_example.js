/*
If you want to add a new esolang interpreter using Python code,
you can follow this template. Just replace 'yourlang' and 'yourlang.py'
with the appropriate names for your esolang.
*/
async function yourlang(code,input){
    let resp=await fetch('yourlang.py');
    var yourlang_py_code=await resp.text();
    execute(yourlang_py_code,code,input,'yourlang');
}
window.yourlang=yourlang;