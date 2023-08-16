function alphuck(program,input){
    var stack=[];
    var matches={};
    var ip=0;
    var tape=[];
    var p=0;
    var output='';
    for(let i=0;i<1000000;i++){
        tape.push(0);
    }
    for(var i=0;i<program.length;i++){
        if(program[i]=='p'){
            stack.push(i);
        }
        if(program[i]=='s'){
            if(stack.length==0){
                throw new Error('s does not match p');
            }
            var mt=stack.pop();
            matches[mt]=i;
            matches[i]=mt;
        }
    }
    if(stack.length!=0){
        throw new Error('p does not match s');
    }
    while(ip<program.length){
        if(program[ip]=='e'){
            tape[p]=tape[p]+1;
            if(tape[p]==256) tape[p]=0;
            ip=ip+1;
        }
        if(program[ip]=='i'){
            tape[p]=tape[p]-1;
            if(tape[p]==-1) tape[p]=255;
            ip=ip+1;
        }
        if(program[ip]=='a'){
            p=p+1;
            if(p>=1000000){
                throw new Error('Pointer overflow');
            }
            ip=ip+1;
        }
        if(program[ip]=='c'){
            p=p-1;
            if(p<0){
                throw new Error('Pointer underflow');
            }
            ip=ip+1;
        }
        if(program[ip]=='o'){
            if(input==''){
                tape[p]=0;
            }else{
                tape[p]=input.charCodeAt(0)%256;
                input=input.slice(1);
            }
            ip=ip+1;
        }
        if(program[ip]=='j'){
            output+=String.fromCharCode(tape[p]);
            ip=ip+1;
        }
        if(program[ip]=='p'){
            if(tape[p]==0){
                ip=matches[ip];
            }else{
                ip=ip+1;
            }
        }
        if(program[ip]=='s'){
            if(tape[p]!=0){
                ip=matches[ip];
            }else{
                ip=ip+1;
            }
        }
        if(!('aiojspec'.includes(program[ip]))){
            ip=ip+1;
        }
    }
    return output;
}
