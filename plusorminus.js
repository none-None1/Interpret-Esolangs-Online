function plusorminus(program,input){
    var output='',x=0;
    for(let i of program){
        if(i=='+'){
            x++;if(x==256){x=0}
        }else if(i=='-'){
            output+=String.fromCharCode(x);x--;if(x==-1){x=255}
        }
    }
    return output
}