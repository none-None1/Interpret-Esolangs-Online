function plusintminus(program){
    var x=0,output='';
    while(program.length){
        if(program[0]=='+'){
            var a=0;
            program=program.slice(1);
            if(!'0123456789'.includes(program[0])){
                x=(x+1)%256;
            }else{
                while('0123456789'.includes(program[0])){
                    a=a*10+program.charCodeAt(0)-48;
                    program=program.slice(1);
                }
                x=(x+a)%256;
            }
        }else if(program[0]=='-'){
            output+=String.fromCharCode(x);
            x=(x+255)%256;
            program=program.slice(1);
        }else{
            program=program.slice(1);
        }
    }
    return output;
}