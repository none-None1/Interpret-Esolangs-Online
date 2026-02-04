"""
Brainfuck extended (a.k.a Bx) - An extension to BF
See https://esolangs.org/wiki/Brainfuck_extended for details of this esoteric programming language
By None1
"""
import sys,io
try:
    from secrets import randbelow
    rndgen=lambda x:randbelow(x+1)
except:
    from random import randint
    rndgen=lambda x:randint(0,x)
def bx(code,inp):
    sys.stdin=io.StringIO(inp) # Redirect stdin and stdout
    sys.stdout=io.StringIO()
    s=[]
    matches={}
    ifs=[]
    ifm={}
    tape=[0]*1000000
    r=0
    for i,j in enumerate(code):
        if j=='[':
            s.append(i)
        if j==']':
            m=s.pop()
            matches[m]=i
            matches[i]=m
        if j=='?':
            ifs.append(i)
        if j==':':
            ifm[ifs[-1]]=i
        if j=='\'':
            k=ifs.pop()
            ifm[ifm[k]]=k
            ifm[k]=(ifm[k],i)
    cp=0
    p=0
    while cp<len(code):
        cmd=code[cp]
        if cmd=='/':
            tape[p]=(tape[p]+1)%256
        if cmd=='\\':
            tape[p]=(tape[p]-1)%256
        if cmd==',':
            c=sys.stdin.read(1)
            tape[p]=(ord(c) if c else 0)%256
        if cmd=='.':
            print(chr(tape[p]),end='')
        if cmd=='<':
            p-=1
        if cmd=='>':
            p+=1
        if cmd=='[':
            if not tape[p]:
                cp=matches[cp]
        if cmd==']':
            if tape[p]:
                cp=matches[cp]
        if cmd=='@':
            r=tape[p]
        if cmd=='%':
            tape[p]=r
        if cmd=='~':
            r,tape[p]=tape[p],r
        if cmd=='+':
            r=(r+tape[p])%256
        if cmd=='-':
            r=(r-tape[p])%256
        if cmd=='*':
            r=(r*tape[p])%256
        if cmd=='|':
            r=int(r>tape[p])
        if cmd=='&':
            r&=tape[p]
        if cmd=='^':
            r|=tape[p]
        if cmd=='!':
            r=(~r)&255
        if cmd==';':
            r=rndgen(r)
        if cmd=='(':
            tape[p]=int(input().strip())%256
        if cmd==')':
            print(tape[p])
        if cmd=='{':
            tape[p] = int(input().strip(),16) % 256
        if cmd=='}':
            print('{:2F}'.format(tape[p]))
        if cmd=='_':
            tape[p]=int(code[cp+1]+code[cp+2],16)
            cp+=2
        if cmd=='$':
            cp+=1
            tp=p
            while code[cp]!='$':
                tape[tp]=ord(code[cp])&255
                tp+=1
                cp+=1
            tape[tp]=0
        if cmd=='#':
            cp+=1
            while code[cp]!='#':
                cp+=1
        if cmd=='?':
            x,y=ifm[cp]
            if not tape[p]:
                cp=x
        if cmd==':':
            x,y=ifm[ifm[cp]]
            cp=y
        cp+=1
    return sys.stdout.getvalue()