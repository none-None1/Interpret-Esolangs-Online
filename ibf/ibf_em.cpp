#include<iostream>
#include<sstream>
#include<string>
#include<stack>
#include<map>
#include<list>
#include<stdexcept>
#include<emscripten/bind.h>
#define endl '\n'
using namespace std;
void error(string msg){
	throw runtime_error(msg);
}
string ibf(string program,string inp){
	list<bool>tape;
	stack<int>s;
	map<int,int>match;
	int p=0,ip=0;
	list<bool>::iterator ptr;
	istringstream si(inp);
	ostringstream so;
	tape.push_back(0);
	ptr=tape.begin();
	for(int i=0;i<program.size();i++){
		char c=program[i];
		if(c=='['){
			s.push(i);
		}else if(c==']'){
			if(s.empty()){
				error("Unmatched ].");
			}
			match[i]=s.top();
			match[s.top()]=i;
			s.pop();
		}
	}
	if(s.size())error("Unmatched [.");
	while(ip<program.size()){
		char c=program[ip];
		switch(c){
			case '0':tape.insert(next(ptr),0);break;
			case '1':tape.insert(next(ptr),1);break;
			case '>':{
				++p;
				if(p>=tape.size())tape.push_back(0);
				++ptr;
				break;
			}
			case '<':{
				if(!p)error("Pointer out of bounds");
				--p;
				--ptr;
				break;
			}
			case '.':{
				char z=0;
				list<bool>::iterator it=ptr;
				for(int i=0;i<8;i++){
					if(it==tape.end())z<<=1;
					else z=((z<<1)|(*it)),++it;
				}
				so<<z;
				break;
			}
			case ',':{
				char z=si.get();
				if(si.eof())z=0;
				for(int i=0;i<8;i++)tape.insert(next(ptr),z&1),z>>=1;
				break;
			}
			case '[':
			case ']':{
				if(*ptr)ip=match[ip]; // Yep, the code for [ and ] are the same.
				break;
			}
		}
		++ip;
	}
	return so.str();
}
EMSCRIPTEN_BINDINGS(m){
        emscripten::function("interpret",&ibf);
}
