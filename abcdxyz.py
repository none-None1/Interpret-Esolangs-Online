# First real interpreter for ABCDXYZ, in Python, by User:None1
import sys
call_stack=[]
objects=[]
result=''
class ABCDXYZ:
    data=0
    def __init__(self,event,num):
        self.event,self.num=event,num
    def x(self,num):
        t=objects[num].data
        objects[num].data=[1,2,3,0][objects[num].data]
        if t==1:
            objects[num].fire()
    def y(self,num):
        t=objects[num].data
        objects[num].data=[1,2,3,0][objects[num].data]
        if t==2:
            objects[num].fire()
    def z(self,num):
        if objects[num].data:
            objects[num].data=[0,3,1,2][objects[num].data]
    def fire(self):
        global call_stack,result
        if self.num in call_stack:
            raise RecursionError('Recursion is forbidden')
        call_stack.append(self.num)
        for i in self.event:
            if i[0]=='"':
                if len(i)!=2 or i[1] not in '0123456789N':
                    raise SyntaxError('" must be followed by digits or N')
                else:
                    result+=('\n' if i[1]=='N' else i[1])
            elif i[0]=='X':
                try:
                    num=int(i[1])
                except:
                    raise SyntaxError('X must be followed by a number')
                else:
                    self.x(num)
            elif i[0]=='Y':
                try:
                    num=int(i[1])
                except:
                    raise SyntaxError('Y must be followed by a number')
                else:
                    self.y(num)
            elif i[0]=='Z':
                try:
                    num=int(i[1])
                except:
                    raise SyntaxError('Z must be followed by a number')
                else:
                    self.z(num)
            else:
                raise SyntaxError('Unknown command: {}'.format(i))
        call_stack.pop()
n=0
e=[]
result=''
def abcdxyz(c,inp):
    c=c.split()
    global n,e,result
    n=0
    e=[]
    result=''
    if c[0]!=str(n)+':':
        raise SyntaxError('Cannot find object 0')
    del c[0]
    while c:
        n+=1
        while c and c[0]!=str(n)+':':
            e.append(c[0])
            del c[0]
        if c:
            del c[0]
        objects.append(ABCDXYZ(e,n-1))
        e=[]
    objects[0].fire()
    return result