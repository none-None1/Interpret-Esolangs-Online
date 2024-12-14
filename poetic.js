function p2pf(code) {
    let res = '';
    while (code) {
        let p = 0;
        let q = 0;
        // Count letters in current sequence
        while (p < code.length && /[a-zA-Z']/.test(code[p])) {
            q += /[a-zA-Z]/.test(code[p]) ? 1 : 0;
            p++;
        }
        
        // Convert letter count to digit
        if (q) {
            res += q === 10 ? '0' : q.toString();
        }
        
        // Skip non-letter characters
        while (p < code.length && !/[a-zA-Z']/.test(code[p])) {
            p++;
        }
        code = code.slice(p);
    }
    
    let r = '';
    const commands = ';[]+-><.,?';
    
    while (res) {
        if ('3456'.includes(res[0])) {
            try {
                const repeatCount = parseInt(res[1]) || 10;
                r += commands[parseInt(res[0])].repeat(repeatCount);
                res = res.slice(2);
            } catch {
                break;
            }
        } else {
            r += commands[parseInt(res[0])];
            res = res.slice(1);
        }
    }
    
    return r;
}

function pf(program,input){
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
        if(program[ip]=='?'){
            tape[p]=Math.floor(Math.random()*256);
        }
        if(program[ip]==';'){
            break;
        }
        if(!('+-,.[]<>;?'.includes(program[ip]))){
            ip=ip+1;
        }
    }
    return output;
}
function poetic(program,input){
    return pf(p2pf(program),input);
}
