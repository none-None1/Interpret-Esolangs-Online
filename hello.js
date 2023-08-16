function hello(code,input){
    output='';
    for(let i of code){
        if(i=='h'){
            output+='Hello World\n';
        }
    }
    return output;
}