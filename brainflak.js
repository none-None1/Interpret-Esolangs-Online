function brainflak(code,input){
    if(!code) return "";
    ascii_mode=false;
    if(code[0]=='a') code=code.slice(1),ascii_mode=true;
    return BrainFlakModule.interpret_brainflak(code,false,ascii_mode,false,input);
}