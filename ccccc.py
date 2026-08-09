"""
Modified version of the Chicken chicken chicken: chicken chicken interpreter from https://github.com/none-None1/ccccc
"""
from pyparsing import *

chicken = CaselessKeyword("chicken")
chickens = Group(OneOrMore(chicken))
chicken_char = Group(Literal('"') + chickens + Literal('"'))
expr = Forward()
chicken_call = Group(chickens + Group("(" + Optional(DelimitedList(expr, ",")) + ")"))
expr <<= chicken_call | chicken_char | chickens
chicken_assignment = Group(
    chickens + ":" + (Group(chicken_call | chickens | chicken_char))
)
chicken_sentence = Group(Optional(chicken_assignment | chicken_call))
chicken_code = DelimitedList(chicken_sentence, ".", allow_trailing_delim=True)
__all__ = ["chicken_code"]
"""
ccc:cc VM: Manages variables and built-in functions
"""
from random import randint


class Variable:
    """
    Variables in ccc:cc
    """

    def __init__(self, obj=None, getter=None, setter=None):
        self.obj = obj
        self.getter = getter
        self.setter = setter

    def get(self):
        if self.obj is not None:
            return self.obj
        return self.getter()

    def set(self, x):
        if self.obj is not None:
            self.obj = x
        else:
            self.setter(x)


class Char(int):
    pass


stdin_variable = Variable(getter=input, setter=lambda x: None)
stdout_variable = Variable(
    getter=lambda: None,
    setter=lambda x: print(chr(int(x)), end="") if isinstance(x, Char) else print(x),
)
adder, multiplier = 0, 1


def adder_get():
    global adder
    t = adder
    adder = 0
    return t


def adder_set(x):
    global adder
    adder += int(x)


def multiplier_get():
    global multiplier
    t = multiplier
    multiplier = 1
    return t


def multiplier_set(x):
    global multiplier
    multiplier *= int(x)


adder_variable = Variable(getter=adder_get, setter=adder_set)
multiplier_variable = Variable(getter=multiplier_get, setter=multiplier_set)


class VM:
    """
    Main VM class
    """

    def __init__(self):
        self.mem = {
            1: Variable(1),
            2: stdin_variable,
            3: stdout_variable,
            4: adder_variable,
            5: multiplier_variable,
            6: Variable(1),
        }
        self.funcs = {
            1: (lambda x: -int(x)),
            2: (lambda a, b, c: b if a else c),
            3: (lambda: randint(0, 1)),
            4: lambda x: Char(x),
        }

    def getvar(self, x):
        return self.mem[x].get()

    def setvar(self, x, y):
        if x in self.mem:
            self.mem[x].set(y)
        else:
            self.mem[x] = Variable(y)

    def call_func(self, f, *args):
        return self.funcs[f](*args)

class VMWrapper:
    def __init__(self):
        self.vm = VM()
vm = VMWrapper()

def runfunct(x):
    if x[0][0] == "chicken":
        return vm.vm.getvar(len(x[0]))
    elif x[0][0] == '"':
        return Char(len(x[0][1]))
    funcid, args = len(x[0][0]), x[0][1][1:-1]
    realargs = list(map(runfunct, args))
    return vm.vm.call_func(funcid, *realargs)


def runline(x):
    if x:
        x = x[0]
    if len(x) < 2 or x[1] != ":":
        return
    vm.vm.setvar(len(x[0]), runfunct(x[2]))


def interpret_program(code):
    parsed = chicken_code.parse_string(code, parse_all=True)
    while 1:
        ln = vm.vm.getvar(1) - 1
        if ln >= len(parsed):
            return
        runline(parsed[ln])
        vm.vm.setvar(1, vm.vm.getvar(1) + 1)

import sys,io
def ccccc(code, inp):
    sys.stdin=io.StringIO(inp) # Redirect stdin and stdout
    sys.stdout=io.StringIO()
    if code and code[0]=='v':
        code=code[1:]
        interpret_program(code)
        return sys.stdout.getvalue()
    try:
        interpret_program(code)
    except:
        print("chicken!")
    return sys.stdout.getvalue()

