// The real name of the language is !!brainfeed
function brainfeed(program,input){
    var comment=false,p=0,mem=0,tape=[],output='';
    for(let i=0;i<18;i++){
        tape.push(0);
    }
    for(let i of program){
        if(comment){
            if(i==']'){
                comment=false;
            }
            continue;
        }
        if(i=='<'){
            p--;
            if(p<0){
                throw new Error('Pointer underflow');
            }
        }
        if(i=='>'){
            p++;
            if(p>=18){
                throw new Error('Pointer overflow');
            }
        }
        if(i=='+'){
            tape[p]++;
        }
        if(i=='-'){
            tape[p]--;
        }
        if(i=='.'){
            output+=tape[p];
        }
        if(i==','){
            output+='abcdefghijklmnopqrstuvwxyz'[tape[p]];
        }
        if(i=='?'){
            output+='ABCDEFGHIJKLMNOPQRSTUVWXYZ'[tape[p]];
        }
        if(i=='!'){
            output+='!? .,><()/+-:;÷*\'"'[tape[p]];
        }
        if(i=='#'){
            tape[p]=0;
        }
        if(i=='@'){
            var cnt=0;
            for(let i of tape){
                if(i==0){
                    cnt++;
                }
            }
            output+=cnt;
        }
        if(i=='^'){
            tape[p]=input.charCodeAt(0)-48;
            if(tape[p]<0||tape[p]>9){
                throw new Error('Unacceptable input');
            }
            input=input.slice(0);
        }
        if(i=='/'){
            mem=tape[p];
        }
        if(i=='~'){
            tape[p]=mem;
        }
        if(i==':'){
            p=0;
        }
        if(i==';'){
            p=17;
        }
        if(i=='$'){
            mem=p;
        }
        if(i=='%'){
            output+=p;
        }
        if(i=='&'){
            p=Math.floor(Math.random()*18);
        }
        if(i=='['){
            comment=true;
        }
    }
    return output
}
