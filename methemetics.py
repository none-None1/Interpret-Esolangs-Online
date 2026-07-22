import re

def methemetics(program,input):

    output=''
    
    matchregex=r"(_?\w|[a-zA-Z][a-zA-Z0-9]+) ?= ?(-?\d+|_?\w|[a-zA-Z][a-zA-Z0-9]+)( ?(!=|>|<|={1,2}|-|\+|\*|\/|%|^|mod|\||&|xor|and|or) ?(-?\d+|_?\w|[a-zA-Z][a-zA-Z0-9]+))?;";
    
    _i = '_i'
    v = {'_i':0,'_z':0}
    x = re.findall(matchregex, program)
    
    symbols = {
    "+": "+",
    "-": "-",
    "*": "*",
    "/": "/",
    "%": "%",
    "mod": "%",
    "^": "**",
    "xor": "^",
    "==": "==",
    "=": "==",
    "!=": "!=",
    ">": ">",
    "<": "<",
    "|": "|",
    "&": "&",
    "or": "|",
    "and": "&"
    }
    
    for i in range(len(x)):
        if x[i][2] == '':
            x[i] = (x[i][0],x[i][1],'')
        else:
            x[i] = (x[i][0],x[i][1],symbols[x[i][3]],x[i][4])

    while v[_i] < len(x):
        try:
            v["_p"] = ord(input[v["_z"]])
        except IndexError:
            v["_p"] = -1
        if x[v[_i]][2] == '':
            match x[v[_i]][0]:
                case '_o':
                    try:
                        output+=chr(v[x[v[_i]][1]])
                    except ValueError:
                        output+=chr(0)
                    except KeyError:
                        try:
                            output+=chr(int(x[v[_i]][1]))
                        except ValueError:
                            output+=chr(0)
                case _:
                    match x[v[_i]][1]:
                        case "_p":
                            v[x[v[_i]][0]] = v["_p"]
                        case _:
                            try:
                                v[x[v[_i]][0]] = int(x[v[_i]][1])
                            except ValueError:
                                v[x[v[_i]][0]] = v[x[v[_i]][1]]
        else:
            try:
                try:
                    exec(f'v[x[v[_i]][0]] = int(x[v[_i]][1]){x[v[_i]][2]}int(x[v[_i]][3])') # this
                except ValueError:
                    exec(f'v[x[v[_i]][0]] = int(x[v[_i]][1]){x[v[_i]][2]}v[x[v[_i]][3]]') # is
            except:
                try:
                    exec(f'v[x[v[_i]][0]] = int(x[v[_i]][3]){x[v[_i]][2]}v[x[v[_i]][1]]') # extremely
                except ValueError:
                    exec(f'v[x[v[_i]][0]] = v[x[v[_i]][1]]{x[v[_i]][2]}v[x[v[_i]][3]]') # cursed
        if v[_i] < -1:
            return output
        v[_i] += 1
    return output