#include<emscripten/bind.h>
#include <iostream>
#include <sstream>
#include <set>
#include <cstdio>
#include <fstream>
#include "parse.h"
#include "run.h"
vector<node> tree;
std::set<string> args;
string interpret(string program, bool upside_down, bool ascii, bool debug,string input) {
    vector<node> tree;
    parse(preprocess(program), tree);
    stack<long long> left, right;
    bool cur = 0;
    std::istringstream is(input);
    if (!ascii) {
        long long x;
        while (is >> x) {
            left.push(x);
        }
    }
    else {
        char x;
        while (is.get(x)) {
            left.push(x);
        }
    }
    run<long long>(tree, 0, NONE, left, right, cur, debug);
    std::ostringstream res;
    if (upside_down) {
        while ((cur ? right : left).size()) {
            if(!ascii) res << (cur ? right : left).top() << std::endl;
            else res << char((cur ? right : left).top());
            (cur ? right : left).pop();
        }
    }
    else {
        stack<long long> reverser;
        while ((cur ? right : left).size()) {
            reverser.push((cur ? right : left).top());
            (cur ? right : left).pop();
        }
        while (reverser.size()) {
            if (!ascii) res << reverser.top() << std::endl;
            else res << char(reverser.top());
            reverser.pop();
        }
    }
    return res.str();
}
EMSCRIPTEN_BINDINGS(m){
        emscripten::function("interpret_brainflak",&interpret);
}
