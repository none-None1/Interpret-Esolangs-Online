"""
Modified version of the Gofe interpreter from https://github.com/none-None1/Gofe
"""
from pyparsing import *

ds = one_of("s d D t q").set_name("ds")
zero = one_of(
    "+ - > < , ? ! . L R F 0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s t u v w x y z"
).set_name("zero")
one = Group((one_of("& # @ ; A S M G P Q") + ds).set_name("one"))
string = (
    Combine('"' + ZeroOrMore(Regex('[^"]')) + '"')
    | Combine("'" + ZeroOrMore(Regex("[^']")) + "'")
).set_name("string")
base62dict = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
num = Group(("/" + Word(base62dict) + "/").set_name("num"))
prog_f = Forward().set_name("prog_f")
loop = Group("[" + prog_f + "]" | "(" + prog_f + ")" | "{" + prog_f + "}")
conditional = Group(
    "$" + prog_f + "]" | "$" + prog_f + "}" | "$" + prog_f + "|" + prog_f + ")"
)
command = zero | one | string | num | loop | conditional
prog = Group(ZeroOrMore(command).set_name("prog"))
prog_f << prog


from collections import *
from precreal import *


class DS:
    def __init__(self, ds):
        self.ds = ds


class DStack(DS):
    def __init__(self, ds):
        super().__init__(ds)

    def push(self, x):
        self.ds.append(Real(x))

    def pop(self):
        return self.ds.pop()


class DQueue(DS):
    def __init__(self, ds):
        super().__init__(ds)

    def push(self, x):
        self.ds.put(Real(x))

    def pop(self):
        return self.ds.get()


class DDequeFront(DS):
    def __init__(self, ds):
        super().__init__(ds)

    def push(self, x):
        self.ds.appendleft(Real(x))

    def pop(self):
        return self.ds.popleft()


class Tape:
    def __init__(self):
        self.a = [Real(0)] * 1000000
        self.p = 500000

    def get(self):
        return self.a[self.p]

    def put(self, x):
        self.a[self.p] = Real(x)

    def left(self):
        self.p -= 1

    def right(self):
        self.p += 1


DDequeBack = DStack
DTape = DQueue



from collections import *
from queue import *
from precreal import *
from math import *
import sys

sys.setrecursionlimit(2147483647)
st, dq, qu, tp = [], deque(), Queue(), Tape()
s, d, D, t, q, r = (
    DStack(st),
    DDequeFront(dq),
    DDequeBack(dq),
    DTape(tp),
    DQueue(qu),
    Real(0),
)
dss = {"s": s, "d": d, "D": D, "t": t, "q": q}


def zero(x):
    global s, d, D, t, q, r
    if x == "+":
        t.push(t.pop() + 1)
    elif x == "-":
        t.push(t.pop() - 1)
    elif x == "<":
        t.ds.left()
    elif x == ">":
        t.ds.right()
    elif x == ",":
        try:
            r = Real(input())
        except:
            r = 0
    elif x == "?":
        c = sys.stdin.read(1)
        r = Real(ord(c) if c else 0)
    elif x == ".":
        print(r, end=" ")
    elif x == "!":
        print(chr(int(r)), end="")
    elif (
        x == "L"
    ):  # Precreal doesn't support log yet, so it has to be converted to float first
        r = Real(log10(float(r)))
    elif x == "R":
        r = rand()
    elif x == "F":
        r = Real(int(r + Real("0.00000000000000000000000000000000000001")))
    elif len(x) == 1:
        r = base62dict.index(x)
    else:
        if x[0] == '"':
            print(eval(x), end="")
        else:
            print(eval(x))


def one(cmd, val):
    global r
    if cmd == "&":
        dss[val].push(r)
    elif cmd == "#":
        r = dss[val].pop()
    elif cmd == "@":
        dss[val].pop()
    elif cmd == ";":
        r = dss[val].pop()
        dss[val].push(r)
    elif cmd == "A":
        t = dss[val].pop()
        r += t
        dss[val].push(t)
    elif cmd == "S":
        t = dss[val].pop()
        r -= t
        dss[val].push(t)
    elif cmd == "M":
        t = dss[val].pop()
        r *= t
        dss[val].push(t)
    elif cmd == "G":
        t = dss[val].pop()
        r /= t
        dss[val].push(t)
    elif cmd == "P":
        t = dss[val].pop()
        r **= t
        dss[val].push(t)
    elif cmd == "Q":
        t = dss[val].pop()
        r %= t
        dss[val].push(t)


def b62_to_num(x):
    r = 0
    for i in x:
        r = r * 62 + base62dict.index(i)
    return Real(r)


def run_parsed_code(code):
    global r
    if isinstance(code, str):
        zero(code)
    elif isinstance(code[0], str) and code[0] in "&#@;ASMGPQ":
        one(code[0], code[1])
    elif code[0] == "/":
        r = b62_to_num(code[1])
    elif code[0] == "[":
        while r:
            run_parsed_code(code[1])
    elif code[0] == "(":
        while not r:
            run_parsed_code(code[1])
    elif code[0] == "{":
        while 1:
            run_parsed_code(code[1])
    elif code[0] == "$":
        if code[-1] == "}":
            if not r:
                run_parsed_code(code[1])
        elif code[-1] == "]":
            if r:
                run_parsed_code(code[1])
        elif code[-1] == ")":
            if r:
                run_parsed_code(code[1])
            else:
                run_parsed_code(code[3])
    else:
        for i in code:
            run_parsed_code(i)


import io

def gofe(code,inp):
    sys.stdin=io.StringIO(inp) # Redirect stdin and stdout
    sys.stdout=io.StringIO()
    run_parsed_code(prog.parse_string(code, parse_all=True))
    return sys.stdout.getvalue()