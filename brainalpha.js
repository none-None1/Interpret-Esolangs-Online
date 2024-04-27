function brainalpha(program,input){
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
        if(program[i]=='G'){
            stack.push(i);
        }
        if(program[i]=='H'){
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
        if(program[ip]=='C'){
            tape[p]=tape[p]+1;
            if(tape[p]==26) tape[p]=0;
            ip=ip+1;
        }
        if(program[ip]=='D'){
            tape[p]=tape[p]-1;
            if(tape[p]==-1) tape[p]=25;
            ip=ip+1;
        }
        if(program[ip]=='A'){
            p=p+1;
            if(p>=1000000){
                throw new Error('Pointer overflow');
            }
            ip=ip+1;
        }
        if(program[ip]=='B'){
            p=p-1;
            if(p<0){
                throw new Error('Pointer underflow');
            }
            ip=ip+1;
        }
        if(program[ip]=='F'){
            if(input!=''&&'QWERTYUIOPASDFGHJKLZXCVBNM'.includes(input[0])){
                tape[p]=input.charCodeAt(0)-65;
            }
            if(input!=''){
                input=input.slice(1);
            }
            ip=ip+1;
        }
        if(program[ip]=='E'){
            output+=String.fromCharCode(65+tape[p]);
            ip=ip+1;
        }
        if(program[ip]=='G'){
            if(tape[p]==0){
                ip=matches[ip];
            }else{
                ip=ip+1;
            }
        }
        if(program[ip]=='H'){
            if(tape[p]!=0){
                ip=matches[ip];
            }else{
                ip=ip+1;
            }
        }
        if(!('ABCDEFGH'.includes(program[ip]))){
            ip=ip+1;
        }
    }
    return output;
}
