function lstackg(code,input){
    var stack=[0],par=[];
    var match={},cp=0,output='';
    for(let i=0;i<code.length;i++){
        if(code[i]=='<'){
            par.push(i);
        }
        if(code[i]=='>'){
            if(par.length==0){
                return 'Unmatched >';
            }
            var b=par.pop();
            match[b]=i;
            match[i]=b;
        }
    }
    if(par.length!=0){
        return 'Unmatched <';
    }
    while(cp<code.length){
        if('<stack>'.includes(code[cp])==false){
            cp=cp+1;
        }
        if(code[cp]=='<'){
            if(stack[stack.length-1]==0){
                cp=match[cp];
            }else{
                cp=cp+1;
            }
            continue;
        }
        if(code[cp]=='>'){
            if(stack[stack.length-1]!=0){
                cp=match[cp];
            }else{
                cp=cp+1;
            }
            continue;
        }
        if(code[cp]=='a'){
            stack[stack.length-1]+=1;
            stack[stack.length-1]%=256;
            cp=cp+1;
            continue;
        }
        if(code[cp]=='s'){
            stack.push(0);
            cp=cp+1;
            continue;
        }
        if(code[cp]=='t'){
            if(input.length==0){
                stack.push(255);
            }else{
                var inch=input.charCodeAt(0);
                input=input.slice(1);
                stack.push(inch);
            }
            cp=cp+1;
            continue;
        }
        if(code[cp]=='c'){
            if(stack.length>=2){
                output+=String.fromCharCode(stack.pop());
            }
            cp=cp+1;
            continue;
        }
        if(code[cp]=='k'){
            if(stack.length>=2){
                stack.pop();
            }
            cp=cp+1;
            continue;
        }
    }
    return output
}
