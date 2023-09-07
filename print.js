function print(program,input){
    var output='';
    for(let i of program){
        if(i=='p'){
            output+='\nprint';
        }
        if(i=='w'){
            output+='write';
        }
    }
    return output
}