#pragma once
#include <iostream>
#include <string>
#include <vector>
#include <cstdlib>
#include <stack>
#define NONE 0 // Bracket types
#define SQUARE_BRACKET 1
#define PARENTHESIS 2
#define CURLY_BRACKET 3
#define TRIANGULAR_BRACKET 4
using std::string;
using std::vector;
using std::stack;
struct child {
	int type, id;
	child(int type, int id) {
		this->type = type; this->id = id;
	}
};
struct node { // A Brain-Flak tree node
	vector<child> childs;
};
char match(char brac) {
	if (brac == '[') return ']';
	if (brac == '(') return ')';
	if (brac == '<') return '>';
	if (brac == '{') return '}';
	if (brac == ']') return '[';
	if (brac == ')') return '(';
	if (brac == '>') return '<';
	if (brac == '}') return '{';
	return 0;
}
int bractype(char brac) {
	string s = "[({<])}>";
	return s.find(brac)%4+1;
}
string preprocess(string program) { // Preprocess program
	int it = 0;
	string result="";
	while (it < program.size()) {
		if (program[it] == '#') {
			do {
				it++;
			} while (it<program.size()&&program[it] != '#');
		}
		else {
			if (program[it] == '<' || program[it] == '>' || program[it] == '[' || program[it] == ']' || program[it] == '(' || program[it] == ')' || program[it] == '{' || program[it] == '}') result += program[it];
		}
		it++;
	}
	stack<char> brackets;
	for (int i = 0; i < result.size(); i++) { // Verify that the brackets are well matched
		if (result[i] == '[' || result[i] == '(' || result[i] == '<' || result[i] == '{') brackets.push(result[i]);
		else {
			if (brackets.empty()) {
				std::cerr << "Unmatched bracket" << std::endl;
				exit(EXIT_FAILURE);
			}
			if (match(brackets.top())==result[i]);
			else {
				std::cerr << "Unmatched bracket" << std::endl;
				exit(EXIT_FAILURE);
			}
			brackets.pop();
		}
	}
	if (!brackets.empty()) {
		std::cerr << "Unmatched bracket" << std::endl;
		exit(EXIT_FAILURE);
	}
	return result;
}
int parse(string program, vector<node>& tree) { // Parse preprocessed program as tree via DFS and return root
	if (program.empty()) return -1;
	int ptr = 0;
	tree.push_back(node());
	int root = tree.size() - 1;
	while (ptr < program.size()) {
		int ptr2 = ptr, layer = 1;
		ptr2++;
		while (layer >= 1) {
			if (program[ptr2] == program[ptr]) layer++;
			if (program[ptr2] == match(program[ptr])) layer--;
			ptr2++;
		}
		int achild = parse(program.substr(ptr+1, ptr2 - ptr-2),tree);
		tree[root].childs.push_back(child(bractype(program[ptr]), achild));
		ptr = ptr2;
	}
	return root;
}
