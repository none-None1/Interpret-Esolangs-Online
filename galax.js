//›*&«&^ is a esolang created by User:Ractangle with only three commands which are
//>* Adds one and multiples by 2
//<< decrements the value by two
//^ outputs the ASCII character of the value
function galax(program,input){
    var output='';var acum=0;
  for(var p=0;p<program.length;p++){
    if (program[p]==">",program[p+1]=="*"){acum++;acum=acum*2;p++;}
    if (program[p]=="<",program[p+1]=="<"){acum-=2;p++;}
    if (program[p]=="^"){output+=String.fromCharCode(acum);}
  };
};
