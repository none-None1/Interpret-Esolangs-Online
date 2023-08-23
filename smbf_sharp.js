// The real name of the language is Self-modifying Brainfuck#
function smbf_sharp(program,input){
    var loop=0;
    var matches={};
    var ip=0;
    var tape=[];
    var p=0;
    var output='';
    for(let i of program){
        tape.push(i.charCodeAt(0));
    }
    for(let i=0;i<1000000;i++){
        tape.push(0);
    }
    while(ip<program.length){
        console.log(ip);
        console.log(String.fromCharCode(tape[ip]));
        console.log(tape.slice(0,40));
        if(String.fromCharCode(tape[ip])=='+'){
            tape[p]=tape[p]+1;
            if(tape[p]==256) tape[p]=0;
            ip=ip+1;
        }
        if(String.fromCharCode(tape[ip])=='-'){
            tape[p]=tape[p]-1;
            if(tape[p]==-1) tape[p]=255;
            ip=ip+1;
        }
        if(String.fromCharCode(tape[ip])=='>'){
            p=p+1;
            if(p>=1000000){
                throw new Error('Pointer overflow');
            }
            ip=ip+1;
        }
        if(String.fromCharCode(tape[ip])=='<'){
            p=p-1;
            if(p<0){
                throw new Error('Pointer underflow');
            }
            ip=ip+1;
        }
        if(String.fromCharCode(tape[ip])==','){
            if(input==''){
                tape[p]=0;
            }else{
                tape[p]=input.charCodeAt(0)%256;
                input=input.slice(1);
            }
            ip=ip+1;
        }
        if(String.fromCharCode(tape[ip])=='.'){
            output+=String.fromCharCode(tape[p]);
            ip=ip+1;
        }
        if(String.fromCharCode(tape[ip])=='['){
            if(tape[p]==0){
                loop=1;
                while(loop>0){
                    ip++;
                    if(String.fromCharCode(tape[ip])=='['){
                        loop++;
                    }
                    if(String.fromCharCode(tape[ip])==']'){
                        loop--;
                    }
                }
            }
            ip++;
        }
        if(String.fromCharCode(tape[ip])==']'){
            loop=1;
            while(loop>0){
                ip--;
                if(String.fromCharCode(tape[ip])=='['){
                    loop--;
                }
                if(String.fromCharCode(tape[ip])==']'){
                    loop++;
                }
                console.log(loop,ip,tape[ip]);
            }
        }
        if(!('+-,.[]<>'.includes(String.fromCharCode(tape[ip])))){
            ip=ip+1;
        }
    }
    return output;
}
