'''
Underload interpreter in Python. The interpreter comes from the public domain page of https://esolangs.org/wiki/Underload/an_interpreter_in_python by User:Jan jelo.
I could have used the JavaScript interpreter instead, but I wanted to use the Python interpreter for it's more compatible with the function format required by the website.
Modified by User:None1.
'''
def underload(p,input):
    r=''
    stack=[]
    program=p
    while program:
        x,program=program[0],program[1:]
        if x=='*':b,a=stack.pop(),stack.pop();stack.append(a+b)
        if x=='^':program=stack.pop()+program
        if x=='~':a,b=stack.pop(),stack.pop();stack.append(a);stack.append(b)
        if x==':':stack.append(stack[-1])
        if x=='!':stack.pop()
        if x=='a':stack.append(f'({stack.pop()})')
        if x=='S':r+=str(stack.pop()) # no need to redirect stdin/stdout for the I/O operations, just append to the result string
        if x=='(':
            i=1;tmp=''
            while True:
                x,program=program[0],program[1:]
                if x=='(':i+=1
                if x==')':i-=1
                if i==0:break
                tmp+=x
            stack.append(tmp)
    return r