async function methemetics(program, input){
    let resp=await fetch('methemetics.py');
    var methemetics_py_code=await resp.text();
    execute(methemetics_py_code,code,input,'methemetics',['re']);
}
window.methemetics=methemetics;
