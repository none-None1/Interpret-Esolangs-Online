#include <iostream>
#include <set>
#include <cstdio>
#include <fstream>
#include "parse.h"
#include "run.h"
vector<node> tree;
std::set<string> args;
void interpret(string program, bool upside_down, bool ascii, bool debug) {
    vector<node> tree;
    parse(preprocess(program), tree);
    stack<long long> left, right;
    bool cur = 0;
    if (!ascii) {
        long long x;
        while (std::cin >> x) {
            left.push(x);
        }
    }
    else {
        char x;
        while (std::cin.get(x)) {
            left.push(x);
        }
    }
    run<long long>(tree, 0, NONE, left, right, cur, debug);
    if (upside_down) {
        while ((cur ? right : left).size()) {
            if(!ascii) std::cout << (cur ? right : left).top() << std::endl;
            else std::cout << char((cur ? right : left).top());
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
            if (!ascii) std::cout << reverser.top() << std::endl;
            else std::cout << char(reverser.top());
            reverser.pop();
        }
    }
}
int main(int argc, char *argv[])
{
    if (argc<2) {
        printf("Brain-Crack - cross-platform Brain-Flak interpreter in C++\nUsage: %s <filename> [arguments]\nfilename: The Brain-Flak source\narguments:\n\t-u: The resulting stack is traversed from top to bottom when output if this argument is passed, otherwise it is traversed from bottom to top\n\t-c: ASCII mode\n\t-d: Debug mode",argv[0]);
        return EXIT_FAILURE;
    }
    std::ifstream f(argv[1]);
    if (!f) {
        std::cout << "Failed to open file!\n" << std::endl;
        return EXIT_FAILURE;
    }
    string prog = "";
    char c;
    while (f.get(c)) prog += c;
    for (int i = 2; i < argc; i++) {
        args.insert(string(argv[i]));
    }
    bool upside_down = args.count(string("-u")), ascii = args.count(string("-c")), debug=args.count(string("-d"));
    interpret(prog, upside_down, ascii,debug);
    return 0;
}
