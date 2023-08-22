// The real name of the language is Self-modifying Brainfuck
function smbf(program,input){
    var stack=[];
    var matches={};
    var ip=0;
    var tape=[];
    var p=program.length+100;
    var output='';
    for(let i=0;i<100;i++){
        tape.push(0); // Some programs may not run correctly without this
    }
    for(let i of program){
        tape.push(i.charCodeAt(0));
    }
    for(let i=0;i<1000000;i++){
        tape.push(0);
    }
    for(var i=0;i<program.length;i++){
        if(program[i]=='['){
            stack.push(i);
        }
        if(program[i]==']'){
            if(stack.length==0){
                throw new Error('Right bracket does not match left bracket');
            }
            var mt=stack.pop();
            matches[mt]=i;
            matches[i]=mt;
        }
    }
    if(stack.length!=0){
        throw new Error('Left bracket does not match right bracket');
    }
    while(ip<program.length){
        if(program[ip]=='+'){
            tape[p]=tape[p]+1;
            if(tape[p]==256) tape[p]=0;
            ip=ip+1;
        }
        if(program[ip]=='-'){
            tape[p]=tape[p]-1;
            if(tape[p]==-1) tape[p]=255;
            ip=ip+1;
        }
        if(program[ip]=='>'){
            p=p+1;
            if(p>=1000000){
                throw new Error('Pointer overflow');
            }
            ip=ip+1;
        }
        if(program[ip]=='<'){
            p=p-1;
            if(p<0){
                throw new Error('Pointer underflow');
            }
            ip=ip+1;
        }
        if(program[ip]==','){
            if(input==''){
                tape[p]=0;
            }else{
                tape[p]=input.charCodeAt(0)%256;
                input=input.slice(1);
            }
            ip=ip+1;
        }
        if(program[ip]=='.'){
            output+=String.fromCharCode(tape[p]);
            ip=ip+1;
        }
        if(program[ip]=='['){
            if(tape[p]==0){
                ip=matches[ip];
            }else{
                ip=ip+1;
            }
        }
        if(program[ip]==']'){
            if(tape[p]!=0){
                ip=matches[ip];
            }else{
                ip=ip+1;
            }
        }
        if(!('+-,.[]<>'.includes(program[ip]))){
            ip=ip+1;
        }
    }
    return output;
}
