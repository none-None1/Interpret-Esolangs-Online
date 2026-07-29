import sys,io
from mpmath import *
mp.dps=100 # 100 digits should be enough
def trigbf_improved(code,inp):
    sys.stdin=io.StringIO(inp) # Redirect stdin and stdout
    sys.stdout=io.StringIO()
    s=[]
    matches={}
    tape=[mpf(0)]*2000000
    for i,j in enumerate(code):
        if j=='[':
            s.append(i)
        if j==']':
            m=s.pop()
            matches[m]=i
            matches[i]=m
    cp=0
    p=1000000
    while cp<len(code):
        if code[cp]=='s':
            tape[p]=sin(tape[p])
        if code[cp]=='c':
            tape[p]=cos(tape[p])
        if code[cp]=='t':
            tape[p]=tan(tape[p])
        if code[cp]==',':
            c=sys.stdin.read(1)
            tape[p]=(ord(c) if c else 0)%256
        if code[cp]=='.':
            print(chr(int(round(tape[p],0))),end='')
        if code[cp]=='<':
            p-=1
        if code[cp]=='>':
            p+=1
        if code[cp]=='[':
            if tape[p]<=0:
                cp=matches[cp]
        if code[cp]==']':
            if tape[p]>0:
                cp=matches[cp]
        cp+=1
    return sys.stdout.getvalue()
