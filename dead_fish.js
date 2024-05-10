function dead_fish(code,input){
    var max_size=0;
    var code_split=code.split('\n');
    for(let i of code_split){
        max_size=Math.max(max_size,i.length);
    }
    for(let i=0;i<code_split.length;i++){
        var k=code_split[i].length;
        for(let j=0;j<max_size-k;j++){
            code_split[i]+=' ';
        }
    }
    var ipx=0,ipy=0,ipdx=0,ipdy=1,p=0,output='',x=0;
    while(ipx<code_split.length&&ipx>=0&&ipy<max_size&&ipy>=0){
        var cmd=code_split[ipx][ipy];
        switch(cmd){
            case 'i':{
                x=(x+1)&255;
                break;
            }
            case 'd':{
                x=(x-1)&255;
                break;
            }
            case 's':{
                x=(x*x)&255;
                break;
            }
            case 'o':{
                output+=String.fromCharCode(x);
                break;
            }
            case 'n':{
                output+=x+'\n';
                break;
            }
            case 'l':{
                if(p<input.length){
                    x=input.charCodeAt(p);
                    p++;
                }else{
                    x=0;
                }
                break;
            }
            case '^':{
                ipdx=-1;
                ipdy=0;
                break;
            }
            case 'v':{
                ipdx=1;
                ipdy=0;
                break;
            }
            case '<':{
                ipdx=0;
                ipdy=-1;
                break;
            }
            case '>':{
                ipdx=0;
                ipdy=1;
                break;
            }
            case '?':{
                if(!x){
                    ipx+=ipdx;
                    ipy+=ipdy;
                }
                break;
            }
            case ';':{
                return output;
            }
            case ' ':{
                break;
            }
            default:{
                output+='Nope.';
                return output;
            }
        }
        ipx+=ipdx;
        ipy+=ipdy;
    }
    return output;
}
