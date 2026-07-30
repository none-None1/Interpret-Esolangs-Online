function deadfisht(program,input){
    var x=0;
    var output='';
    var bracket_stack=[];
    var loop_stack=[];
    var matches={};
    for(var i=0;i<program.length;i++){
        if(program[i]=='('||program[i]=='{'){
            bracket_stack.push(i);
        }
        if(program[i]==')'||program[i]=='}'){
            if(bracket_stack.length==0||program[bracket_stack[bracket_stack.length-1]]!=program[i].replace(')','(').replace('}','{')){
                throw new Error('Right bracket does not match left bracket');
            }
            var mt=bracket_stack.pop();
            matches[mt]=i;
            matches[i]=mt;
        }
    }
    if(bracket_stack.length>0){
        throw new Error('Left bracket does not match right bracket');
    }
    var ip=0;
    while(ip<program.length){
        var i=program[ip];
        if(x==256||x<0){
            x=0;
        }
        if(i=='i'){
            x=x+1;
        }
        else if(i=='d'){
            x=x-1;
        }
        else if(i=='s'){
            x=x*x;
        }
        else if(i=='o'){
            output+=x+'\n';
        }
        else if(i=='c'){
            output+=String.fromCharCode(x);
        }
        else if(i=='h'){
            break;
        }
        else if(i=='w'){
            output+="Hello, world!\n";
        }
        else if(i=='('){
            if(x==0){
                ip=matches[ip];
            }
        }
        else if(i=='{'){
            loop_stack.push(10);
        }
        else if(i=='}'){
            --loop_stack[loop_stack.length-1];
            if(loop_stack[loop_stack.length-1]==0){
                loop_stack.pop();
            }else{
                ip=matches[ip];
            }
        }
        ip++;
    }
    return output;
}
