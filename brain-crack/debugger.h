#pragma once
#include <iostream>
#include <stack>
using std::stack;
template<typename t> void debug_stack(stack<t> left, stack<t> right, bool cur) {
	if (cur) std::cout << " ";
	else std::cout << ">";
	std::cout << "left: ";
	stack<t> temp;
	while (left.size()) {
		temp.push(left.top());
		left.pop();
	}
	while (temp.size()) {
		std::cout << temp.top() << " ";
		temp.pop();
	}
	std::cout << std::endl;
	if (!cur) std::cout << " ";
	else std::cout << ">";
	std::cout << "right: ";
	while (right.size()) {
		temp.push(right.top());
		right.pop();
	}
	while (temp.size()) {
		std::cout << temp.top() << " ";
		temp.pop();
	}
	std::cout << std::endl << std::endl;
}