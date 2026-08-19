async function typeid(code,input){
    let resp=await fetch('typeid.py');
    var typeid_py_code=await resp.text();
    execute(typeid_py_code,code,input,'typeid',['itanium_demangler']);
}
window.typeid=typeid;