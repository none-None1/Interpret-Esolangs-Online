// The real name of the language is Welcome to Esolang, the esoteric programming languages wiki!
function wte_teplw(program,input){
    var output='';
    var rev=program.split("").reverse().join('');
    for(let i of program.split(' ')){
        if(i=='Welcome'){
            output+='Hello, World!\n';
        }
        if(i=='to'){
            output+='https://esolangs.org/wiki/Main_Page\n';
        }
        if(i=='Esolang'){
            output+='Esolang Wiki\n';
        }
        if(i=='the'){
            output+=program+'\n';
        }
        if(i=='esoteric'){
            output+=program.split(' ').length+'\n';
        }
        if(i=='programming'){
            output+=String.fromCharCode(program.split(' ').length)+'\n'
        }
        if(i=='languages'){
            output+=rev+'\n';
        }
    }
    return output;
}
