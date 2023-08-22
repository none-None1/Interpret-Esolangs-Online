function chicken(program,input){
    if(input==undefined){
        input='';
    }
    var cmd=[];
    var stack=[];
    for(let i of program.split('\n')){
        cmd.push(i.split(' ').filter(x => x=='chicken').length);
    }
    stack.push(stack);
    stack.push(input);
    stack=stack.concat(cmd);
    stack.push(0);
    ip=2;
    while(ip<stack.length){
        c=stack[ip];
        switch(c){
            case 0:{
                return stack.pop();
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
                stack.push(stack[stack[ip+1],a]);
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
                stack.push(String.fromCharCode(ch));break;
            }
            default:{
                stack.push(c-10);break;
            }
        }
        ip++;
    }
}

console.log(chicken('chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken\nchicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken\n\nchicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken\n\nchicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken\nchicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken\n\nchicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken\n\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken\n\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken chicken chicken chicken chicken chicken\nchicken chicken chicken chicken chicken chicken\n\n'));