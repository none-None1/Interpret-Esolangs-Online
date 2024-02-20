function chicken(program,input){
    if(input==undefined){
        input='';
    }
    var cmd=[];
    var stack=[];
    for(let i of program.split('\n')){
        cmd.push(i.split(' ').filter(x => x=='chicken').length);
    }
    stack.push(undefined);
    stack.push(input);
    stack=stack.concat(cmd);
    stack.push(0);
    ip=2;
    while(ip<stack.length){
        c=stack[ip];
        switch(c){
            case 0:{

                return stack.pop().replace(/\&\#\d+\;/g,(num)=>{
                    return String.fromCharCode(num.slice(2,num.length-1));
                });
            }
            case 1:{
                stack.push('chicken');break;
            }
            case 2:{
                var a=stack.pop(),b=stack.pop();
                stack.push(b+a);break;
            }
            case 3:{
                var a=stack.pop(),b=stack.pop();
                stack.push(b-a);break;
            }
            case 4:{
                var a=stack.pop(),b=stack.pop();
                stack.push(b*a);break;
            }
            case 5:{
                var a=stack.pop(),b=stack.pop();
                stack.push(b==a);break;
            }
            case 6:{
                var a=stack.pop();
                if(stack[ip+1]==0) stack.push(stack[a]);
                else stack.push(stack[stack[ip+1]][a]);
                ip++;break;
            }
            case 7:{
                var addr=stack.pop(),val=stack.pop();
                stack[addr]=val;
                break;
            }
            case 8:{
                var offset=stack.pop(),con=stack.pop();
                if(con){
                    ip+=offset;
                }
                break;
            }
            case 9:{
                var ch=stack.pop();
                stack.push('&#'+ch+';');break;
            }
            default:{
                stack.push(c-10);break;
            }
        }
        ip++;
    }
}

