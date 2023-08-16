function deadfish(program,input){
    var x=0;
    output='';
    for(let i of program){
        if(x==256||x<0){
            x=0;
        }
        if(i=='i'){
            x=x+1;
        }
        if(i=='d'){
            x=x-1;
        }
        if(i=='s'){
            x=x*x;
        }
        if(i=='o'){
            output+=x+'\n';
        }
    }
    return output;
}
