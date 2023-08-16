function hq9p(program,input){
    output='';
    x=0;
    for(let i of program){
        if(i=='H'){
            output+='hello, world\n';
        }
        if(i=='Q'){
            output+=program+'\n';
        }
        if(i=='9'){
            for(let i=99;i>1;i--){
                output+=`${i} bottles of beer on the wall, ${i} bottles of beer.\nTake one down, pass it around. ${i-1} bottles of beer on the wall.\n\n`;
            }
            output+='1 bottle of beer on the wall, 1 bottle of beer.\nTake one down, pass it around. No bottles of beer on the wall.\n\nNo bottles of beer on the wall, no bottles of beer.\nGo to the store, buy some more, 99 bottles of beer on the wall.\n';
        }
        if(i=='+'){
            x++;
        }
    }
    return output;
}
