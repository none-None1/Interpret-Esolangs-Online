var stacks = {};
function pushstack(st, v) {
  v &= 4294967295;
  if (st == "@") {
    if (v == 0) {
      stacks[st].push(48);
    } else {
      if (v & 2147483648) {
        for (let i of (v & 2147483647) - 2147483648 + "") {
          stacks[st].push(i.charCodeAt(0));
        }
      } else {
        for (let i of v + "") {
          stacks[st].push(i.charCodeAt(0));
        }
      }
    }
  } else {
    stacks[st].push(v);
  }
}
function topstack(st) {
  if (stacks[st].length) {
    return stacks[st][stacks[st].length - 1];
  }
  return 0;
}
function popstack(st) {
  if (stacks[st].length) {
    return stacks[st].pop();
  }
  return 0;
}
function kipple_helper(program, input, recur) {
  program += " ";
  if (!recur) {
    for (let i of "qwertyuiopasdfghjklzxcvbnm@") {
      stacks[i] = [];
    }
    for (let i of input) {
      stacks["i"].push(i.charCodeAt(0));
    }
  }
  while (program) {
    if (program[0] == "(") {
      program = program.slice(1);
      var p = 1;
      var i = 0;
      var fb = "";
      for (; i < program.length; i++) {
        if (program[i] == "(") {
          p++;
        } else if (program[i] == ")") {
          p--;
        }
        if (!p) {
          break;
        }
        fb += program[i];
      }
      program = program.slice(i + 1);
      while (stacks[fb[0]].length) {
        kipple_helper(fb, "", 1);
      }
    } else if (" \n\t\r\v".includes(program[0])) {
      program = program.slice(1);
    } else {
      var cmds = "";
      while (!"() \n\t\r\v".includes(program[0])) {
        cmds += program[0];
        program = program.slice(1);
      }
      while (cmds) {
        var cmd = "";
        while (cmds.length && !"><+-?".includes(cmds[0])) {
          cmd += cmds[0];
          cmds = cmds.slice(1);
        }
        cmd += cmds[0];
        cmds = cmds.slice(1);
        var tcmds = cmds;
        while (tcmds.length && !"><+-?".includes(tcmds[0])) {
          cmd += tcmds[0];
          tcmds = tcmds.slice(1);
        }
        if (cmd.includes(">")) {
          var lf = cmd.slice(0, cmd.indexOf(">")),
            rg = cmd.slice(cmd.indexOf(">") + 1);
          if ("0123456789".includes(lf[0])) {
            pushstack(rg, parseInt(lf));
          } else {
            pushstack(rg, popstack(lf));
          }
        } else if (cmd.includes("<")) {
          var lf = cmd.slice(0, cmd.indexOf("<")),
            rg = cmd.slice(cmd.indexOf("<") + 1);
          if ("0123456789".includes(rg[0])) {
            pushstack(lf, parseInt(rg));
          } else {
            pushstack(lf, popstack(rg));
          }
        } else if (cmd.includes("+")) {
          var lf = cmd.slice(0, cmd.indexOf("+")),
            rg = cmd.slice(cmd.indexOf("+") + 1);
          if ("0123456789".includes(rg[0])) {
            pushstack(lf, topstack(lf) + parseInt(rg));
          } else {
            pushstack(lf, topstack(lf) + popstack(rg));
          }
        } else if (cmd.includes("-")) {
          var lf = cmd.slice(0, cmd.indexOf("-")),
            rg = cmd.slice(cmd.indexOf("-") + 1);
          if ("0123456789".includes(rg[0])) {
            pushstack(lf, topstack(lf) - parseInt(rg));
          } else {
            pushstack(lf, topstack(lf) - popstack(rg));
          }
        } else if (cmd.includes("?")) {
          if (!topstack(cmd.slice(0, cmd.length - 1)))
            stacks[cmd.slice(0, cmd.length - 1)] = [];
        }
      }
    }
  }
  if (recur) {
    return;
  }
  var output = "";
  while (stacks["o"].length) {
    output += String.fromCharCode(stacks["o"].pop());
  }
  return output;
}
function kipple(program, input) {
  return kipple_helper(program, input, 0);
}
