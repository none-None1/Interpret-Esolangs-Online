var outredirect=`
from pyscript import window, document
import sys
try:
 res=@mainfunct(window.pys_ccode,window.pys_input);
except BaseException as e:
 window.finish(e.__class__.__name__+': '+str(e))
else:
 window.stdout(res)
 window.finish()
`
function stdout(s){
    document.getElementById("output").value+=s;
}
function stderr(s){
    document.getElementById("log").value+=s;
}
function finish(err){
    if(err){
        stderr(err+'\n'+`Program terminates in ${new Date().getTime() - window.pys_exec_start} ms and raises an error.`);
    }else{
        stderr(`Program terminates in ${new Date().getTime() - window.pys_exec_start} ms successfully.`);
    }
}
function execute(code,ccode,input,mainfunct){
    window.pys_ccode=ccode;
    window.pys_input=input;
    code+=outredirect.replaceAll('@mainfunct',mainfunct);
    document.getElementById("output").value='';
    document.getElementById("log").value='';
    window.pys_exec_start=new Date().getTime();
    document.getElementById('pyscss')['href']=document.getElementById('pyscss').getAttribute('href_');
    document.getElementById('pysjs')['src']=document.getElementById('pysjs').getAttribute('src_');
    z=document.createElement('script');
    z['type']='py';
    z.textContent=code;
    document.body.appendChild(z);
}