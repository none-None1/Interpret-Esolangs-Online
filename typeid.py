from itanium_demangler import *
import sys,io
from random import *
from time import *
from math import prod

sys.setrecursionlimit(2147483647)
stack = []
pop = lambda: stack.pop() if stack else 0
get = lambda: stack[-1] if stack else 0


def interpret(code):
    if code.kind == "builtin":  # built-in types, Sx types are in 'qualname'
        match code.value:
            case "signed char":  # a
                c = sys.stdin.read(1)
                return ord(c) if c else 0
            case "bool":  # b
                try:
                    z = int(input())
                except:
                    z = 0
                return z
            case "char":  # c
                print(chr(pop()), end="", flush=True)
                return 0
            case "double":  # d
                print(pop())
                return 0
            case "__float80":  # e
                _ = pop()
                print(chr(_), end="", flush=True)
                return _
            case "float":  # f
                _ = pop()
                print(_)
                return _
            case "__float128":
                return 0
            case "unsigned char":
                return 1
            case "int":
                a, b = pop(), pop()
                return b + a
            case "unsigned int":
                a, b = pop(), pop()
                return b - a
            case "long":
                a, b = pop(), pop()
                return b * a
            case "unsigned long":
                a, b = pop(), pop()
                return b // a
            case "__int128":
                a, b = pop(), pop()
                return b % a
            case "unsigned __int128":
                a, b = pop(), pop()
                return b**a
            case "short":
                a, b = pop(), pop()
                stack.append(a)
                stack.append(b)
                return 0
            case "unsigned short":
                c, b, a = pop(), pop(), pop()
                stack.append(b)
                stack.append(c)
                stack.append(a)
                return 0
            case "void":
                a, b = pop(), pop()
                return b & a
            case "wchar_t":
                a, b = pop(), pop()
                return b | a
            case "long long":
                a, b = pop(), pop()
                return b ^ a
            case "unsigned long long":
                a = pop()
                return ~a
            case "...":
                a = pop()
                return -a
            case _:
                return 0
    elif code.kind == "pointer":
        _ = interpret(code.value)
        stack.append(_)
        return _
    elif code.kind == "lvalue":
        _ = interpret(code.value)
        print(_)
        return _
    elif code.kind == "cv_qual" and "const" in code.qual:
        _ = interpret(code.value)
        print(chr(_), end="", flush=True)
        return _
    elif code.kind == "name":
        print(code.value, end="", flush=True)
        return 0
    elif code.kind == "qual_name":
        if code.value[0] == "std":
            if len(code) == 2 or len(code) == 3 and code[2].kind == "tpl_args":
                match code.value[1]:
                    case "allocator":
                        return randint(0, 1)
                    case "basic_string":
                        return randint(1, pop())
                    case "iostream":
                        return int(time())
                    case "istream":
                        return len(stack)
                    case "ostream":
                        x = pop()
                        if x < 0:
                            return -1
                        elif x > 0:
                            return 1
                        return 0
                    case "string":
                        while get():
                            z = pop()
                            if not z:
                                break
                            print(chr(z), end="", flush=True)
                    case _:
                        return 0
            else:
                return 0
        else:
            has_tpl = False
            for i in code.value:
                if i.kind == "tpl_args":
                    has_tpl = True
                    break
            if not has_tpl:
                for i in code.value:
                    print(i.value, end="", flush=True)
            else:
                for i in range(len(code.value) - 2):
                    print(code.value[i].value,end='', flush=True)
                args = code.value[-1].value
                match len(code.value[-2].value):
                    case 1:
                        return sum(interpret(i) for i in args)
                    case 2:
                        return prod(interpret(i) for i in args)
                    case 3:
                        result = 0
                        while get():
                            result += sum(interpret(i) for i in args)
                        return result
                    case 4:
                        result = 0
                        while not get():
                            result += sum(interpret(i) for i in args)
                        return result
                    case 5:
                        result = 0
                        while len(stack):
                            result += sum(interpret(i) for i in args)
                        return result
                    case 6:
                        result = 0
                        while not len(stack):
                            result += sum(interpret(i) for i in args)
                        return result
                    case 7:
                        result = 0
                        if get():
                            result += sum(interpret(i) for i in args)
                        return result
                    case 8:
                        result = 0
                        if not get():
                            result += sum(interpret(i) for i in args)
                        return result
                    case 9:
                        result = 0
                        if len(stack):
                            result += sum(interpret(i) for i in args)
                        return result
                    case 10:
                        result = 0
                        if not len(stack):
                            result += sum(interpret(i) for i in args)
                        return result
                    case 11:
                        while 1:
                            for i in args:
                                interpret(i)
                    case _:
                        for i in args:
                            interpret(i)
                        return len(code.value[-2]) - 12
    else:
        return 0


def typeid(code,inp):
    sys.stdin=io.StringIO(inp) # Redirect stdin and stdout
    sys.stdout=io.StringIO()
    code = parse("_Z1_" + code)
    if not code:
        raise SyntaxError("Invalid code")
    code = code.arg_tys[0]
    interpret(code)
    return sys.stdout.getvalue()