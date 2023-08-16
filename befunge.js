// Befunge 93 with unrestricted playfield
function pop(s){
    if(s.length==0){
        return 0;
    }else{
        return s.pop();
    }
}
function befunge(program,input){
    var playfield=[],maxw=0;
    for(let i of program.split('\n')){
        playfield.push(i.split(""));
        if(i.length>maxw){
            maxw=i.length;
        }
    }
    for(let i of playfield){
        while(i.length<maxw){
            i.push(" ");
        }
    }
    var ipx=0,ipy=0,ipdx=0,ipdy=1,output='',stack=[];
    while(1){
        var cmd=playfield[ipx][ipy];
        if('1234567890'.includes(cmd)){
            stack.push(cmd.charCodeAt(0)-48);
        }
        switch(cmd){
            case '@':{
                return output;
                break;
            }
            case '+':{
                var a=pop(stack);
                var b=pop(stack);
                stack.push(b+a);
                break;
            }
            case '-':{
                var a=pop(stack);
                var b=pop(stack);
                stack.push(b-a);
                break;
            }
            case '*':{
                var a=pop(stack);
                var b=pop(stack);
                stack.push(b*a);
                break;
            }
            case '/':{
                var a=pop(stack);
                var b=pop(stack);
                if(a==0){
                    stack.push(0);
                    break;
                }
                stack.push(a<0?Math.ceil(b/a):Math.floor(b/a));
                break;
            }
            case '%':{
                var a=pop(stack);
                var b=pop(stack);
                if(a==0){
                    stack.push(0);
                    break;
                }
                stack.push(b%a);
                break;
            }
            case '!':{
                var a=pop(stack);
                if(a){
                    stack.push(0);
                    break;
                }
                stack.push(1);
                break;
            }
            case '`':{
                var a=pop(stack);
                var b=pop(stack);
                if(b>a){
                    stack.push(1);
                    break;
                }
                stack.push(0);
                break;
            }
            case '>':{
                ipdx=0;
                ipdy=1;
                break;
            }
            case '<':{
                ipdx=0;
                ipdy=-1;
                break;
            }
            case 'v':{
                ipdx=1;
                ipdy=0;
                break;
            }
            case '^':{
                ipdx=-1;
                ipdy=0;
                break;
            }
            case '?':{
                var x=Math.floor(Math.random()*4);
                ipdx=[0,0,1,-1][x];
                ipdy=[1,-1,0,0][x];
                break;
            }
            case '_':{
                ipdx=0;
                if(pop(stack)){
                    ipdy=-1;
                }else{
                    ipdy=1;
                }
                break;
            }
            case '|':{
                ipdy=0;
                if(pop(stack)){
                    ipdx=-1;
                }else{
                    ipdx=1;
                }
                break;
            }
            case '\"':{
                do{
                    ipx+=ipdx;
                    ipy+=ipdy;
                    while(ipx>=playfield.length){
                        ipx-=playfield.length;
                    }
                    while(ipx<0){
                        ipx+=playfield.length;
                    }
                    while(ipy>=maxw||ipy==-1){
                        ipy-=maxw;
                    }
                    while(ipy<0){
                        ipy+=maxw;
                    }
                    stack.push(playfield[ipx][ipy].charCodeAt(0));
                }while(playfield[ipx][ipy]!='\"');
                pop(stack);
                break;
            }
            case ':':{
                stack.push(stack.length==0?0:stack[stack.length-1]);
                break;
            }
            case '\\':{
                var a=pop(stack);
                var b=pop(stack);
                stack.push(a);
                stack.push(b);
                break;
            }
            case '$':{
                pop(stack);
                break;
            }
            case '.':{
                output+=pop(stack)+' ';
                break;
            }
            case ',':{
                output+=String.fromCharCode(pop(stack));
                break;
            }
            case '#':{
                ipx+=ipdx;
                ipy+=ipdy;
                break;
            }
            case 'g':{
                var b=pop(stack);
                var a=pop(stack);
                if(b>=playfield.length||a>=maxw){
                    stack.push(0);
                }else{
                    stack.push(playfield[b][a].charCodeAt(0));
                }
                break;
            }
            case 'p':{
                var b=pop(stack);
                var a=pop(stack);
                var v=pop(stack);
                playfield[b][a]=String.fromCharCode(v);
                break;
            }
            case '&':{
                var result=0,flag=1;
                if(input[0]=='-'){
                    flag=-1;
                    input=input.slice(1);
                }
                while(input.length>0&&'1234567890'.includes(input[0])){
                    result*=10;
                    result+=input.charCodeAt(0)-48;
                    input=input.slice(1);
                }
                while(input.length>0&&!'1234567890'.includes(input[0])){
                    input=input.slice(1);
                }
                stack.push(result*flag)
                break;
            }
            case '~':{
                stack.push(input[0]);
                input=input.slice(1);
                break;
            }
        }
        ipx+=ipdx;
        ipy+=ipdy;
        while(ipx>=playfield.length){
            ipx-=playfield.length;
        }
        while(ipx<0){
            ipx+=playfield.length;
        }
        while(ipy>=maxw||ipy==-1){
            ipy-=maxw;
        }
        while(ipy<0){
            ipy+=maxw;
        }
    }
}
console.log(befunge(`<@,+2*48_,#! #:<,_$#-:#*8#4<8"`))