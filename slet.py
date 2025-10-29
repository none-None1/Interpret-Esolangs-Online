# SLet.py
# which interprets SLet.
# The main function "slet" accepts code and input and returns output

import sys
from math import gcd
from random import randint
import io

# Environment
LAST_MODIFIED = "Feb 27 2025, 13:30"
VERSION = "4.1.5"
# by islptng, modified by None1

class Number:
	def simplify(self):
		if self.denominator == 0:
			if self.numerator != 0: self.numerator = 1
		else:
			gcdn = gcd(self.numerator, self.denominator)
			self.numerator //= gcdn
			self.denominator //= gcdn
	def __init__(self, val, denominator = 1):
		if isinstance(val, str):
			if val == "nan": val = "0/0"
			if val == "infinity": val = "1/0"
			val = val.split("/")
			self.numerator = int(val[0])
			try: self.denominator = int(val[1])
			except: self.denominator = 1
		else:
			self.numerator = val
			self.denominator = denominator
		self.simplify()
	def __str__(self):
		if self.denominator == 0:
			if self.numerator == 0: return "nan"
			else: return "infinity"
		if self.denominator == 1:
			return str(self.numerator)
		return str(self.numerator) + "/" + str(self.denominator)
	def __add__(self, other):
		if not isinstance(other, Number):
			other = Number(other)
		denominator = self.denominator * other.denominator
		numerator = self.numerator * other.denominator + other.numerator * self.denominator
		res = Number(numerator, denominator)
		res.simplify()
		return res
	def __sub__(self, other):
		if not isinstance(other, Number):
			other = Number(other)
		denominator = self.denominator * other.denominator
		numerator = self.numerator * other.denominator - other.numerator * self.denominator
		res = Number(numerator, denominator)
		res.simplify()
		return res
	def __mul__(self, other):
		if not isinstance(other, Number):
			other = Number(other)
		numerator = self.numerator * other.numerator
		denominator = self.denominator * other.denominator
		res = Number(numerator, denominator)
		res.simplify()
		return res
	def __truediv__(self, other):
		if not isinstance(other, Number):
			other = Number(other)
		numerator = self.numerator * other.denominator
		denominator = self.denominator * other.numerator
		res = Number(numerator, denominator)
		res.simplify()
		return res
	def __mod__(self, other):
		if not isinstance(other, Number):
			other = Number(other)
		intn = int(self / other)
		modn = self - other * intn
		return modn
	def __floordiv__(self, other):
		if not isinstance(other, Number):
			other = Number(other)
		return Number(int(self / other))
	def __eq__(self, other):
		if not isinstance(other, Number):
			other = Number(other)
		return self.numerator == other.numerator and self.denominator == other.denominator
	def __lt__(self, other):
		if not isinstance(other, Number):
			other = Number(other)
		return self.numerator * other.denominator < other.numerator * self.denominator
	def __gt__(self, other):
		if not isinstance(other, Number):
			other = Number(other)
		return self.numerator * other.denominator > other.numerator * self.denominator
	def __le__(self, other):
		if not isinstance(other, Number):
			other = Number(other)
		return self.numerator * other.denominator <= other.numerator * self.denominator
	def __ge__(self, other):
		if not isinstance(other, Number):
			other = Number(other)
		return self.numerator * other.denominator >= other.numerator * self.denominator
	def __int__(self): return self.numerator // self.denominator
	def __bool__(self): return self.numerator != 0
	def __float__(self): return float(self.numerator) / float(self.denominator)
Boolean = bool

class Pair:
	def __init__(self, former, latter):
		self.former = former
		self.latter = latter
	def __str__(self):
		return "(%s,%s)" % (str(self.former), str(self.latter))

class Set:
	def sort(self):
		self.objects.sort(key=cmp_array)
	def __init__(self, objects):
		self.objects = list(objects)
		self.sort()
	def __str__(self):
		return "{%s}" % (",".join(str(obj) for obj in self.objects))
	def append(self, obj):
		if obj not in self.objects:
			# Insertion sort!
			selfarray = cmp_array(obj)
			for i in range(len(self.objects)):
				if cmp_array(self.objects[i]) > selfarray:
					self.objects.insert(i,obj)
					return
			self.objects.append(obj)
	def __contains__(self, obj):
		return obj in self.objects
	def __len__(self):
		return len(self.objects)
	def issubset(self, other):
		flag = True
		for obj in self.objects:
			if obj not in other:
				flag = False
				break
		return flag
	def intersect(self, other):
		res = Set([])
		for obj in self.objects:
			if obj in other:
				res.append(obj)
		return res

def cmp_array(obj):
	ndict = {Boolean: 0, Number: 1, Pair: 2, Set: 3, Lambda: 4}
	typen = ndict[type(obj)]
	res = [typen]
	if typen == 0: res.append(obj)
	if typen == 1: res.append(obj)
	if typen == 2:
		res.append(cmp_array(obj.former))
		res.append(cmp_array(obj.latter))
	if typen == 3: res.append(len(obj.objects))
	if typen == 4: res.append(0) # Lambdas are not comparable
	return res

variables = {}

inbuffer = ""
def get_char():
	global inbuffer
	if not inbuffer: inbuffer = input() + "\n"
	returnv = inbuffer[0]
	inbuffer = inbuffer[1:]
	return returnv
put_char = lambda x: print(ord(x), end="")
print_obj = lambda x: print("" if x is None else str(x), end="")
def printdec(n, digits):
	# print integer part
	print(int(n),end="")
	# print decimal part
	digits = int(digits)
	if digits > 0: print(end=".")
	for i in range(digits):
		n *= 10
		print(int(n % 10),end="")

def analyze(code):
	def tokenize(code):
		# Remove comments
		commentdepth = 0
		newcode = ""
		tokens = []
		for i in range(len(code)):
			if code[i] in " \r\n\t":
				if newcode:
					tokens.append(newcode)
					newcode = ""
				continue
			if code[i] == "(":
				commentdepth += 1
			if commentdepth == 0:
				if code[i] in "~[\\@;:,.`'|-$<>^=+*/]%#!":
					if newcode:
						tokens.append(newcode)
						newcode = ""
					tokens.append(code[i])
				else: newcode += code[i]
			if code[i] == ")":
				commentdepth -= 1
		if newcode: tokens.append(newcode)
		for i in range(len(tokens)):
			flag = True
			for j in range(len(tokens[i])):
				if tokens[i][j] not in "0123456789":
					flag = False
					break
			if flag: tokens[i] = Number(tokens[i])
		return tokens
	tokens = tokenize(code)
	# add left and right bracklets to the tokens
	# and remove the "all" keyword
	argdict = {'~':3,'[':2,'\\':-1,'@':1,';':0,
':':1,',':0,'.':1,"`":2,"'":2,'|':-1,'-':1,'$':1,'<':1,
'>':1,'^':1,'=':2,'+':2,'*':2,'/':2,']':3,'%':2,'#':2}
	class Cursor: pass # we need a "Cursor" keyword and not a class, just does nothing
	class Tree:
		content = [Cursor]
		depth = 0
		def dig(self):
			res = self.content
			for i in range(self.depth): res = res[-1]
			res.pop()
			res.append([Cursor])
			self.depth += 1
		def push(self,val):
			res = self.content
			for i in range(self.depth): res = res[-1]
			res.pop()
			res.append(val)
			res.append(Cursor)
		def pop(self):
			res = self.content
			for i in range(self.depth-1): res = res[-1]
			res.append(Cursor)
			res = res[-2]
			res.pop()
			self.depth -= 1
		def finish(self):
			res = self.content
			for i in range(self.depth): res = res[-1]
			res.pop()
			return self.content
	tablist = [-1]
	res = Tree()
	for token in tokens:
		if isinstance(token, str) and token in argdict:
			tablist[-1] -= 1
			tablist.append(argdict[token] + 1 if argdict[token] >= 0 else -1)
			res.dig()
		if isinstance(token, str) and token == "!":
			res.pop()
			if tablist[-1] < 0: tablist.pop()
			else: raise SyntaxError("Unexpected exclamation mark")
		else:
			if not isinstance(token, str) or token not in argdict: tablist[-1] -= 1
			res.push(token)
		while tablist[-1] == 1:
			tablist.pop()
			res.pop()
	return res.finish()

class Lambda:
	code = ""
	def __init__(self, code):
		if isinstance(code, str): self.code = analyze(code)
		else: self.code = code
	def __str__(self):
		return "<code>"
	def call(self):
		try:
			for i in self.code:
				exec1(i)
		except IndexError:
			raise SyntaxError("No enough arguments")

def exec1(command):
	try:
		if not isinstance(command, type([])):
			if isinstance(command, str):
				if command in variables: return variables[command]
				else: raise SyntaxError("%s is undefined" % (command))
			return command
		args = command[1:]
		if   command[0] == "#": variables[command[1]] = exec1(args[1])
		elif command[0] == "~":
			res = Set([])
			isfor = 0
			argres = None
			for i in exec1(args[0]).objects:
				variables[args[1]] = i
				if isfor == 0:
					argres = exec1(args[2])
					if isinstance(argres, Lambda): isfor = 1
					else: isfor = -1
				if isfor == 1: argres.call()
				if isfor == -1:
					if argres == None: argres = exec1(args[2])
					if argres: res.append(i)
					argres = None
			if isfor != 1: return res
		elif command[0] == "[":
			while exec1(args[0]): exec1(args[1]).call()
		elif command[0] == "\\": return Lambda(args)
		elif command[0] == "@": exec1(args[0]).call()
		elif command[0] == ";": return Number(ord(get_char()))
		elif command[0] == ":": print(end=chr(int(exec1(args[0]))))
		elif command[0] == ",": return Number(input())
		elif command[0] == ".": print_obj(exec1(args[0]))
		elif command[0] == "`": printdec(exec1(args[0]), exec1(args[1]))
		elif command[0] == "'": return Pair(exec1(args[0]), exec1(args[1]))
		elif command[0] == "|":
			res = Set([])
			for i in args:
				x = exec1(i)
				if isinstance(x, Set):
					for j in x.objects: res.append(j)
				else: res.append(x)
			return res
		elif command[0] == "-":
			a = exec1(args[0])
			if isinstance(a, Boolean): return not a
			if isinstance(a, Number): return a * Number(-1)
			if isinstance(a, Set): return a.objects[randint(0,len(a.objects)-1)]
			if isinstance(a, Pair): Number(randint(int(a.former),int(a.latter)))
		elif command[0] == "$":
			a = exec1(args[0])
			if isinstance(a, Number): return Number(1) / a
			if isinstance(a, Set): return Number(len(a.objects))
			if isinstance(a, Pair): return Pair(a.latter, a.former)
		elif command[0] == "<":
			a = exec1(args[0])
			if isinstance(a, Number): return a.numerator
			if isinstance(a, Set): return a.objects[0]
			if isinstance(a, Pair): return a.former
		elif command[0] == ">":
			a = exec1(args[0])
			if isinstance(a, Number): return a.denominator
			if isinstance(a, Set): return a.objects[-1]
			if isinstance(a, Pair): return a.latter
		elif command[0] == "^": return Set([exec1(args[0])])
		elif command[0] == "=":
			a,b = exec1(args[0]), exec1(args[1])
			if not isinstance(b, Set): return a == b
			if not isinstance(a, Set): return a in b.objects
			return a.issubset(b)
		elif command[0] == "+":
			a,b = exec1(args[0]), exec1(args[1])
			if isinstance(a, Number): return a + b
			if isinstance(a, Boolean): return a or b
		elif command[0] == "*":
			a,b = exec1(args[0]), exec1(args[1])
			if isinstance(a, Number): return a * b
			if isinstance(a, Boolean): return a and b
			if isinstance(a, Set): return a.intersect(b)
		elif command[0] == "/": return exec1(args[0]) // exec1(args[1])
		elif command[0] == "]":
			fromn = exec1(args[0])
			ton = exec1(args[1])
			step = exec1(args[2])
			i = fromn
			res = Set([])
			if step > 0:
				while i < ton:
					res.append(i)
					i += step
			else:
				while i > ton:
					res.append(i)
					i += step
			return res
		elif command[0] == "%": return exec1(args[0]) % exec1(args[1])

		else: raise NameError("'%s' is not defined" % (str(command[0])))
	except RecursionError:
		print("\n\n\nSorry, but it's Python's fault.\n\
You have exceeded the maximum recursion depth.")

def slet(code,input):
	sys.stdin=io.StringIO(input) # Redirect stdin and stdout
	sys.stdout=io.StringIO()
	lamb = Lambda(code)
	lamb.call()
	return sys.stdout.getvalue()


