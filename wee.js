// The real name of the language is Weeeeeeeeeeeeeeeeeeeeeeeeeeeeee
function wee(program,input){
    var x=0;
    var ignore=true;
    var output='';
    if(program.split('\n')[0]!='Start epidemic'){
        throw new Error('Program must start with Start epidemic');
    }
    for(let i of program.split('\n')){
        if(ignore){
            ignore=false;
            continue;
        }
        if(i=='Infect person'){
            x=x+1;
            if(x==256){
                throw new Error('accumulator cannt be larger than 255');
            }
        }
        if(i=='Deinfect person'){
            x=x-1;
            if(x==-1){
                throw new Error('accumulator cannt be less than 0');
            }
        }
        if(i=='Bulk infect'){
            if(input==''){
                x=0;
            }else{
                x=input.charCodeAt(0)%256;
                input=input.slice(1);
            }
        }
        if(i=='Bulk deinfect'){
            if(x!=0){
                x=1;
            }
        }
        if(i=='Check number of infections'){
            output+=String.fromCharCode(x);
        }
        if(i=='Skip next if no one infected'){
            ignore=true;
        }
        if(i=='Delevop vaccine'){
            return output;
        }
    }
    while(1){
        
    }
}
