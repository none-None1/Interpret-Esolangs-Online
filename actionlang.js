// This is a public domain yet unofficial interpreter for ActionLang. Please refer to the esolang page for more information.
// Modified by User:None1
function actionlang(code,input){
	tmp=code.split('\n');
	code=[[]];
	output='';
	for(let i of tmp){code.push(i.split(','))}
	h=1;l=0;stack=[];ip=0;R=q=>BigInt(Math.floor(Math.random()*q))
	next=_=>ip>=input.length?-1n:BigInt(input.codePointAt(ip++));
	q=function(){let c=0n,u=1n,z=next();while(z<48n||z>57n){if(z==45n)u=-u;z=next();}
	while(z>=48n&&z<=57n){c=10n*c+z-48n;z=next();}ip--;return c*u;}
	code=code.map(b=>b.map(c=>[c,null]));
	while(h<code.length){switch(code[h][l][0]){
	case'input':stack.push(code[h][l][1]=q());break;
	case'output':output+=(''+stack.pop());code[h][l][1]=null;break;
	case'read':
	case'getchar':stack.push(code[h][l][1]=next());break;
	case'write':
	case'putchar':output+=(String.fromCodePoint(+(""+stack.pop())));code[h][l][1]=null;break;
	case'jump':
	case'jmp':C=stack.pop();L=stack.pop();if(C)h=L,l=-1;break;
	case'nop':
	case'APLWSI':break;
	case'duplicate':
	case'dup':stack.push(stack[stack.length-1]);code[h][l][1]=null;break;
	case'halt':return output;
	case'discard':stack.pop();code[h][l][1]=null;break; //I assume that discard don't store the value
	case'discard-store':
	case'dst':code[h][l][1]=stack.pop();break;          //so I made up a command that stores it
	case'add':C=stack.pop();stack.push(stack.pop()+C);break;
	case'substract':
	case'sub':C=stack.pop();stack.push(stack.pop()-C);break;
	case'multiply':
	case'mul':C=stack.pop();stack.push(stack.pop()*C);break;
	case'divide':
	case'div':C=stack.pop();stack.push(stack.pop()/C);break;
	case'modulus':
	case'modulo':
	case'mod':C=stack.pop();stack.push(stack.pop()%C);break;
	case'up':C=null;for(let j=h-1;j;j--)if(C===null)C=code[j][l][1];if(C!==null)stack.push(C);code[h][l][1]=C;break;
	case'down':C=null;for(let j=h+1;j<code.length;j++)if(C===null)C=code[j][l][1];if(C!==null)stack.push(C);code[h][l][1]=C;break;
	case'left':C=null;for(let j=l-1;j;j--)if(C===null)C=code[h][j][1];if(C!==null)stack.push(C);code[h][l][1]=C;break;
	case'right':C=null;for(let j=l+1;j<code[h].length;j--)if(C===null)C=code[h][j][1];if(C!==null)stack.push(C);code[h][l][1]=C;break;
	case'random':
	case'rand':stack.push(code[h][l][1]=R(1e10)*10n**90n+R(1e15)*10n**75n+R(1e15)*10n**45n+R(1e15)*10n**60n+R(1e15)*10n**30n+R(1e15)*10n**15n+R(1e15));break;
	default:stack.push(code[h][l][1]=+code[h][l][0]||(_=>{throw"invalid number"})())
	}if(++l>=code[h].length)l=0,h++;}
	return output;
}
