// The real name of the language is Hello++
function hellopp(code,input){
    output='';
    for(let i of code){
        if('hH'.includes(i)){
            output+='Hello World\n';
        }
    }
    return output;
}