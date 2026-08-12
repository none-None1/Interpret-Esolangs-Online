/*
  This program has been written by Pedro Gimeno
  http://www.formauri.es/personal/pgimeno/
  and is donated to the public domain.

  From http://www.formauri.es/personal/pgimeno/temp/esoteric/ork/OrkInterpreter.js
  Original online interpreter page: http://www.formauri.es/personal/pgimeno/temp/esoteric/ork/orkinterpreter.php
  Modified by User:None1
*/

/* The main problem with ORK is the extreme underspecification of the specs.
   Most of the syntax has to be deduced by examining the code and other
   programs.
 */

var // Language elements:
    REcomment = /^[ \t]*#/
    , REtrim = /^[ \t]+|[ \t.:!]+$/g
    , REmain = /^When this program starts$/

    // Declaration of a class
    , REnewclass = /^There is such a thing as an? (.+)$/
    , REflagdecl = /^An? (.+) can say (.+)$/
    , REpropertydecl = /^An? (.+) has(?: an?)? (.+) which is an? (.+)$/
    , REpointerdecl = /^An? (.+) can have(?: an?)? (.+) which is an? (.+)$/
    , REmethoddecl = /^An? (.+) can ([^ ]+)(?: an? (.+))?$/
    // Method definition
    , REmethoddef = /^When an? (.+) is to ([^ ]+)(?: an? (.+))?$/
    // Actions
    , REinstantiate = /^(?:I have|[Tt]here is) an? (.+) called (.+)$/
    , REsetflag = /^I am( not)? to say(?: it's)? (.+)$/
    , REmethodcall_asgn = /^(?:I am|(?:[Mm]y )?(.+?) is)(?: to ([^ ]+))?(?: (?:my )?(.+))?$/
    , REanyarg = /^(?:the (.+)|"((?:[^\\]|\\.)*?)"|([-+]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][-+]?[0-9]+)?)|(?:my )?(.+))$/
    , REconditional = /^[Ii]f (.+?) then (.+)$/
    , REcondition = /^(?:my )?(.+?) says(?: it's)?(?: (not))? (.+)$/

    // Class inheritance. Not in the specs but seen in reference compiler. Used by orkipple.ork.
    , REevery = /^Every (.+?) is an? (.+)$/
    ;
/*
  Comments on REmethodcall_asgn:
    Processing both at once eliminates problems when a statement
    is an assignment containing certain strings. Consider this case:
      b is "c is to blah".
    If processed separately, the method call matcher would find this:
      {b is "c} is to {blah"}
    and take it as a method call, unless it's made too complex (finding
    pairs of quotes and so on).

    With this strategy, putting both in one statement, the non-greediness
    of "(.+?) is" makes it match correctly like this:
      {b} is {"c is to blah"}

  Comments on REconditional:
    The upper-lower case version of "if" is because the reference
    compiler allows nested if's, so we need to support them as well.
    But we want to support this syntax:
      If {cond} then if {cond} then ...
    The reference compiler doesn't, forcing it to be:
      If {cond} then If {cond} then ...
 */

function Empty() {}

function UnescapeString(str)
{
  /* This expression can split the contents of a C string, but it's not very useful:
     /"((?:[^\\]|\\[^0-9]|\\0[xX][0-9a-fA-F]+|\\[1-9][0-9]*|\\0[0-7]*)*)"/
   */

//  res = str.replace(/\\n/,"\n").replace(/\\r/,"\r").replace(/\\t/,"\t")
  var res;
  eval('res="' + str + '";');
  return res;
}

function ProgramParse(txt)
{
  var undefined; // Don't define this!

  this.out = "";
  this.inpptr = 0;
  this.parsestatus = 0;
  this.classes = new Empty();
  this.classes[""] = new Empty();
  // builtin indicates whether the methods in the class are system-defined
  // thus it doesn't apply to the main class:
  this.classes[""].builtin = false;
  this.classes[""].methods = new Empty();
  //this.classes[""].properties = new Empty();

  // System library
  this.classes.mathematician = new Empty();
  this.classes.mathematician.builtin = true;
  this.classes.mathematician.vars = new Empty();
  this.classes.mathematician.vars["first operand"] = 3;
  this.classes.mathematician.vars["second operand"] = 3;
  this.classes.mathematician.vars["result"] = 3;
  this.classes.linguist = new Empty();
  this.classes.linguist.builtin = true;
  this.classes.linguist.vars = new Empty();
  this.classes.linguist.vars["first operand"] = 2;
  this.classes.linguist.vars["second operand"] = 2;
  this.classes.linguist.vars["result"] = 2;
  this.classes.scribe = new Empty();
  this.classes.scribe.builtin = true; // scribe has no properties or flags
  this.classes.inputter = new Empty();
  this.classes.inputter.builtin = true; // inputter has flags but no properties
  this.classes["word array"] = new Empty();
  this.classes["word array"].builtin = true;
  this.classes["word array"].vars = new Empty();
  this.classes["word array"].vars["elems"] = 5; // number array
  this.classes["word array"].vars["current"] = 3;
  this.classes["word array"].vars["length"] = 3;
  this.classes["wordArray"] = this.classes["word array"]; // backwards compatibility
  this.classes["number array"] = new Empty();
  this.classes["number array"].builtin = true;
  this.classes["number array"].vars = new Empty();
  this.classes["number array"].vars["elems"] = 6; // string array
  this.classes["number array"].vars["current"] = 3;
  this.classes["number array"].vars["length"] = 3;
  this.classes["numberArray"] = this.classes["number array"]; // backwards compatibility

  var funcname = null, classname = null;

  var lines = txt.split("\n");
  for (this.lineno = 0; this.lineno < lines.length; this.lineno++)
  {
    var line = lines[this.lineno];
    var mtch;
    var cnt;
    var stmt;
    var meth;
    if (funcname != null)
    {
      meth = this.classes[classname].methods[funcname];
      if (meth === undefined) {
        meth = new Array();
        this.classes[classname].methods[funcname] = meth;
      }
    }

    if (REcomment.test(line)) continue;
    line = line.replace(REtrim, "");
    if (line == '') continue;

    // Check for IF statement
    while ((mtch = REconditional.exec(line)) != null) {
      if (funcname == null) {
        this.parsestatus = 2; // Error: action outside function
        break;
      }
      cnt = meth.length;
      meth[cnt] = new Empty();
      meth[cnt].cond = null;
      stmt = meth[cnt];

      line = mtch[2];
      var condition = mtch[1];
      if ((mtch = REcondition.exec(condition)) != null) {
        stmt.obj = mtch[1].split("'s ");
        stmt.neg = (mtch[2] !== undefined);
        stmt.flg = mtch[3]; // equal/less/greater/done/(custom)
        stmt.act = "if";
        stmt.lineno = this.lineno;
      } else {
        this.parsestatus = 3; // Error: Invalid condition
        break;
      }
    }

    // Check for the rest.
    if (REmain.test(line)) {

      // Main function
      funcname = ""; // Empty name means main
      classname = ""; // Empty name means main class

    } else if ((mtch = REnewclass.exec(line)) != null) {

      // Class definition.
      classname = mtch[1];
      funcname = null; // Not defining a function, just a class.
      if (this.classes[classname] !== undefined) {
        this.parsestatus = 8; // Class already defined.
        break;
      }
      this.classes[classname] = new Empty();
      this.classes[classname].builtin = false;
      this.classes[classname].methods = new Empty();
      this.classes[classname].vars = new Empty();

    } else if ((mtch = REevery.exec(line)) != null) {

      // Inheritance
      if (classname == null || funcname != null) {
        this.parsestatus = 4;
        break;
      }
      if (mtch[1] != classname) {
        this.parsestatus = 9;
        break;
      }
      this.classes[classname].prnt = mtch[2];

    } else if ((mtch = REpropertydecl.exec(line)) != null) {

      // Property declaration
      if (classname == null || funcname != null) {
        this.parsestatus = 4;
        break;
      }
      if (mtch[1] != classname) {
        this.parsestatus = 9;
        break;
      }
      if (mtch[3] == "number") {
        this.classes[classname].vars[mtch[2]] = 3;
      } else if (mtch[3] == "word" || mtch[3] == "sentence" || mtch[3] == "phrase") {
        this.classes[classname].vars[mtch[2]] = 2;
      } else {
        this.classes[classname].vars[mtch[2]] = mtch[3];
      }


    } else if (REflagdecl.test(line) || REpointerdecl.test(line) || REmethoddecl.test(line)) {

      // So far these declarations are just ignored, but we check we're inside a class definition.
      // Class definitions have a null funcname.
      if (classname == null || funcname != null) {
        this.parsestatus = 4;
        break;
      }

    } else if ((mtch = REmethoddef.exec(line)) != null) {

      // Method definition
      var arg, typ;

      classname = mtch[1];
      funcname = mtch[2];
      if (mtch[3] === undefined) {
        arg = null;
      } else {
        arg = mtch[3];
      }
      if (this.classes[classname] === undefined) {
        this.parsestatus = 6; // Class not defined.
        // That's per Ork's philosophy. I'd prefer to create the class at this point instead.
        break;
      }
      if (this.classes[classname].methods[funcname] !== undefined) {
        this.parsestatus = 7; // Function already defined.
        break;
      }
      this.classes[classname].methods[funcname] = new Array();
      this.classes[classname].methods[funcname].arg = arg;

    } else if ((mtch = REinstantiate.exec(line)) != null) {

      // Create an object's instance.
      if (funcname == null) {
        this.parsestatus = 2; // Error: action outside function
        break;
      }
      cnt = meth.length;
      meth[cnt] = new Empty();
      meth[cnt].cond = null;
      stmt = meth[cnt];
      stmt.act = "inst";
      stmt.lineno = this.lineno; // For each action we remember the line number as runtime debug info
      stmt.cls = mtch[1];
      stmt.obj = mtch[2];

    } else if ((mtch = REsetflag.exec(line)) != null) {

      // Set or reset a flag.
      if (funcname == null) {
        this.parsestatus = 2;
        break;
      }
      cnt = meth.length;
      meth[cnt] = new Empty();
      meth[cnt].cond = null;
      stmt = meth[cnt];
      stmt.act = "setf";
      stmt.lineno = this.lineno;
      stmt.set = (mtch[1] === undefined); // true if there's no "not"
      stmt.obj = null; // self
      stmt.nam = mtch[2];

    } else if ((mtch = REmethodcall_asgn.exec(line)) != null) {

      // Method call or assignment
      if (funcname == null) {
        this.parsestatus = 2; // Error: action outside function
        break;
      }
      cnt = meth.length;
      meth[cnt] = new Empty();
      meth[cnt].cond = null;
      stmt = meth[cnt];

      if (mtch[2] !== undefined) {

        // Method call
        stmt.act = "call";
        stmt.lineno = this.lineno;
        if (mtch[1] === undefined) {
          stmt.objtyp = 2;
        } else {
          stmt.obj = mtch[1].split("'s ");
          if (/^[Tt]he /.test(stmt.obj[0])) {
            stmt.objtyp = 1;
            stmt.obj.shift();
          } else {
            stmt.objtyp = 0;
          }
        }
        stmt.fn = mtch[2];
        if (mtch[3] !== undefined) {
          // Function has args - decode them
          var arg = mtch[3];
          mtch = REanyarg.exec(arg);
          if (mtch[1] !== undefined) {
            // This function's argument
            stmt.typ = 1;
            stmt.arg = mtch[1].split("'s ").slice(1);
          } else if (mtch[2] !== undefined) {
            // String
            stmt.typ = 2;
            stmt.arg = UnescapeString(mtch[2]);
          } else if (mtch[3] !== undefined) {
            // Number
            stmt.typ = 3;
            stmt.arg = parseFloat(mtch[3]);
          } else {
            // Property within object
            stmt.typ = 4;
            stmt.argobj = mtch[4].split("'s ");
          }
        } else {
          stmt.typ = 0; // no args
        }

      } else {

        // Assignment
        if (mtch[1] === undefined || mtch[3] === undefined) {
          // Syntax error: 'I am {arg}' or '{lhs} is'.
          // Only '{lhs} is {arg}' syntax is accepted here.
          // The 'I am to...' or '{x} is to...' syntax is already discarded.
          this.parsestatus = 2;
          break;
        }
        stmt.act = "asgn";
        stmt.lineno = this.lineno;
        stmt.dst = mtch[1].split("'s ");
        if (/^[Tt]he /.test(stmt.dst[0])) {
          stmt.dsttyp = 1;
          stmt.dst.shift();
        } else {
          stmt.dsttyp = 0;
        }
        var expr = mtch[3];
        mtch = REanyarg.exec(expr);
        if (mtch[1] !== undefined) {
          // This function's argument
          stmt.typ = 1;
          stmt.arg = mtch[1].split("'s ").slice(1);
        } else if (mtch[2] !== undefined) {
          // String
          stmt.typ = 2;
          stmt.arg = UnescapeString(mtch[2]);
        } else if (mtch[3] !== undefined) {
          // Number
          stmt.typ = 3;
          stmt.arg = parseFloat(mtch[3]);
        } else {
          // Property within object
          stmt.typ = 4;
          stmt.argobj = mtch[4].split("'s ");
        }

      }

    } else if ((mtch = REassignment.exec(line)) != null) {

      // Assignment
      if (funcname == null) {
        this.parsestatus = 2; // Error: action outside function
        break;
      }

    } else {

      // Unknown statement - syntax error
      this.parsestatus = 1;
      break;

    }
  }

  if (this.parsestatus == 0 && this.classes[""].methods[""] === undefined) {
    this.parsestatus = 5;
  }
}

ProgramParse.prototype.ExecLib = function(obj, fn, arg, cls)
{
  var err = 0;
  var f = obj.flgs;
  switch (cls) {
    case "mathematician":
      var p1 = obj.vars["first operand"];
      var p2 = obj.vars["second operand"];
      var r = obj.vars.result;
      switch (fn) {
        case "compare":
          f.equal = (p1.val == p2.val);
          f.less = (p1.val < p2.val);
          f.greater = (p1.val > p2.val);
          break;
        case "add":
          r.val = p1.val + p2.val;
          break;
        case "subtract":
          r.val = p1.val - p2.val;
          break;
        case "multiply":
          r.val = p1.val * p2.val;
          break;
        case "divide":
          r.val = p1.val / p2.val;
          break;
        case "modulo":
          r.val = p1.val % p2.val;
          break;
        case "floor": // takes 1 arg
          arg.val = Math.floor(arg.val);
          break;
        default:
          err = 101; // Unknown function
      }
      break;

    case "linguist":
      var p1 = obj.vars["first operand"];
      var p2 = obj.vars["second operand"];
      var r = obj.vars.result;
      switch (fn) {
        case "compare":
          f.equal = (p1.val == p2.val);
          f.less = (p1.val < p2.val);
          f.greater = (p1.val > p2.val);
          break;
        case "concatenate":
          r.val = p1.val + p2.val;
          break;
        default:
          err = 101; // Unknown function
      }
      break;

    case "scribe":
      switch (fn) {
        case "write":
          this.out += arg.val.toString();
          break;
        case "asciiWrite":
          this.out += String.fromCharCode(arg.val);
          break;
        default:
          err = 101; // Unknown function
      }
      break;

    case "inputter":
      switch (fn) {
        case "readOne":
          f.done = (this.inpptr >= this.inp.length);
          if (! f.done) {
            arg.val = this.inp.charAt(this.inpptr++);
            if (arg.typ == 3) arg.val = arg.val.charCodeAt(0);
          } else {
            if (arg.typ == 3) arg.val = 0; else arg.val = "";
          }
          break;
        case "read":
          // FIXME: Needs to recognize/parse numbers etc.
          f.done = (this.inpptr >= this.inp.length);
          var mark = this.inpptr;
          if (! f.done) {
            while (!this.inp.charAt(this.inpptr).match(/\s/))
              if (++this.inpptr >= this.inp.length) break;
            arg.val = this.inp.substring(mark, this.inpptr);
            while (this.inp.charAt(this.inpptr).match(/\s/))
              if (++this.inpptr >= this.inp.length) break;
          }
          break;
        default:
          err = 101; // Unknown function
      }

      break;

    case "word array":
    case "wordArray":
      switch (fn) {
        case "instantiate":
        case "instanciate": // compensate for a spelling error in original
          var arr =  new Array(arg.val);
          obj.vars["elems"].val = arr;
          obj.vars["length"].val = arr.length;
          obj.vars["current"].val = 0;
          break;
        case "get":
          arg.val = obj.vars.elems.val[obj.vars.current.val];
          break;
        case "set":
          obj.vars.elems.val[obj.vars.current.val] = arg.val;
          break;
        default:
          err = 101; // Unknown function
      }
      break;

    case "number array":
    case "numberArray":
      switch (fn) {
        case "instantiate":
        case "instanciate": // compensate for a spelling error in original
          var arr = new Array(arg.val);
          obj.vars["elems"].val = arr;
          obj.vars["length"].val = arr.length;
          obj.vars["current"].val = 0;
          break;
        case "import":
          obj.vars["elems"].val = new Array(arg.val.length);
          obj.vars["length"].val = arg.val.length;
          obj.vars["current"].val = 0;
          for (var i = 0; i < arg.val.length; i++) obj.vars.elems.val[i] = arg.val.charCodeAt(i);
          break;
        case "get":
          // arg.val = obj.vars.elems.val[obj.vars.current.val];
          /* Hack to make orkipple.ork work.
             It sometimes uses negative indices and expects to be
             able to store values in them.
           */
          if (obj.vars.elems.val[obj.vars.current.val] === r) {
            arg.val=0;
          } else {
            arg.val = obj.vars.elems.val[obj.vars.current.val];
          }
          break;
        case "set":
          obj.vars.elems.val[obj.vars.current.val] = arg.val;
          break;
        default:
          err = 101; // Unknown function
      }
      break;

    default:
      err = 102; // Unknown class (should never happen)
  }
  return err;
}

ProgramParse.prototype.findobj = function (chain, scop)
{
  var unassigned;

  res = scop.vars[chain[0]];
  if (res === unassigned) res = scop.obj.vars[chain[0]];
  for (var i = 1; i < chain.length; i++)
  {
    if (res === unassigned) break;
    res = res.val.vars[chain[i]];
  }
  return res;
}

ProgramParse.prototype.findarg = function (chain, arg)
{
  var unassigned;

  for (var i = 0; i < chain.length; i++)
  {
    if (arg === unassigned) break;
    arg = arg.val.vars[chain[i]];
  }
  return arg;
}

ProgramParse.prototype.createinstance = function (obj, cls, nam)
{
  var unassigned;
  obj.val = new Empty();
  obj.val.vars = new Empty();
  obj.val.flgs = new Empty();
  obj.val.cls = cls;
  obj.val.nam = nam;
  // Create properties
  var myclass = cls;
  while (myclass !== unassigned) {
    for (var i in this.classes[myclass].vars) {
      if (obj.val.vars[i] === unassigned) {
        obj.val.vars[i] = new Empty();
        obj.val.vars[i].typ = this.classes[myclass].vars[i];
        if (typeof obj.val.vars[i].typ == "string")
          this.createinstance(obj.val.vars[i], obj.val.vars[i].typ, i);
      }
    }
    myclass = this.classes[myclass].prnt;
  }
  obj.typ = 4;
}

ProgramParse.prototype.execute = function ()
{
  var unassigned;
  var fnstack = new Array();
  var fnstkptr = 0;
  var slf = "";
  var runerr = 0;
  var stmt;

  this.inpptr = 0;

  fnstack[fnstkptr] = new Empty();
  var scop = fnstack[fnstkptr];

  // Create an instance of the main class with empty name
  scop.vars = new Empty();
  scop.obj = new Empty();
  scop.obj.cls = "";
  scop.obj.nam = "";
  scop.obj.vars = new Empty();

  // Prepare the function
  scop.fn = this.classes[""].methods[""];
  scop.fnline = 0;

  while (true) {

    if (runerr != 0) break;

    while (scop.fnline >= scop.fn.length) {
      if (fnstkptr == 0) {
        break;
      }
      // Return from function - retrieve previous context
      var x = fnstack.splice(fnstkptr, fnstkptr);
      delete x;
      scop = fnstack[--fnstkptr];
    }
    if (fnstkptr == 0 && scop.fnline >= scop.fn.length) break;

    stmt = scop.fn[scop.fnline++];

    // Not using switch to allow using "break" for quitting and "continue" to loop again
    if (stmt.act == "call") {

      var obj, arg;

      // Check for special functions
      if (stmt.objtyp == 2) { // No owner specified
        // Special functions must have no owner specifier
        if (stmt.typ == 0) { // special functions must have no args, otherwise they're treated as regular functions
          if (stmt.fn == "loop" || stmt.fn == "repeat" /* for compatibility with cat.ork */) {
            scop.fnline = 0;
            continue;
          } else if (stmt.fn == "quit") {
            break;
          }
        }
        // Not a builtin - assumed 'self'
        obj = scop.obj;
      } else if (stmt.objtyp == 1) { // This functoin's arg ("The"-like reference)
        obj = this.findarg(stmt.obj, scop.arg);
      } else { // An object reference, possibly with nested possessives
        obj = this.findobj(stmt.obj, scop);
      }
      if (obj === unassigned) {
        runerr = 104;
        this.lineno = stmt.lineno;
        break;
      }
      if (obj !== scop.obj)
        obj = obj.val;

      // Check args
      if (stmt.typ != 0) {
        // Evaluate argument
        if (stmt.typ == 4) { // local or this or another object's variable
          arg = this.findobj(stmt.argobj, scop);
        } else if (stmt.typ == 1) { // this function's argument
          arg = this.findarg(stmt.arg, scop.arg);
        } else { // constant
          arg = new Empty;
          arg.val = stmt.arg;
          arg.typ = stmt.typ;
        }
      }

      // Call the function
      var methodclass = obj.cls;
      // Builtin classes don't have method definitions, but they don't inherit either.
      while (methodclass !== undefined && !this.classes[methodclass].builtin) {
        if (this.classes[methodclass].methods[stmt.fn] !== undefined) break;
        methodclass = this.classes[methodclass].prnt;
      }
      if (methodclass === undefined) {
        runerr = 101;
        this.lineno = stmt.lineno;
        break;
      }
      if (this.classes[methodclass].builtin) {
        runerr = this.ExecLib(obj, stmt.fn, arg, methodclass);
        if (runerr != 0) this.lineno = stmt.lineno;
      } else {
        // Create a new execution context
        var tmp = new Empty;
        tmp.vars = new Empty;
        tmp.obj = obj;
        tmp.fn = this.classes[methodclass].methods[stmt.fn];
        tmp.fnline = 0;
        tmp.arg = arg;
        fnstack[++fnstkptr] = tmp;
        scop = tmp;
      }

    } else switch (stmt.act) {

      case "if":
        var obj = this.findobj(stmt.obj, scop);
        if (obj === unassigned) {
          doexec = false;
          runerr = 104;
          this.lineno = stmt.lineno;
          break;
        } else {
          if (obj.val.flgs[stmt.flg] == stmt.neg) {
            while (scop.fn[scop.fnline++].act == "if")
              ;
          }
        }
        break;

      case "inst":
        // Instantiate an object or declare a local variable
        var tmp = new Empty();
        if (stmt.cls == "phrase" || stmt.cls == "word" || stmt.cls == "sentence") {
          tmp.typ = 2;
        } else if (stmt.cls == "number") {
          tmp.typ = 3;
        } else {
          // Object - create instance
          this.createinstance(tmp, stmt.cls, stmt.obj);
        }
        scop.vars[stmt.obj] = tmp;
        break;

      case "setf":
        // Set a flag
        if (scop.vars[stmt.nam] === unassigned)
          scop.obj.flgs[stmt.nam] = stmt.set;
        else
          scop.vars[stmt.nam].val = stmt.set ? 1 : 0;
        break;

      case "asgn":
        // Assignment
        var lhs;
        if (stmt.dsttyp == 1) {
          lhs = this.findarg(stmt.dst, scop.arg);
        } else {
          lhs = this.findobj(stmt.dst, scop);
        }
        if (lhs === unassigned) {
          runerr = 106;
          this.lineno = stmt.lineno;
          break;
        }
        var arg;
        // Evaluate argument
        if (stmt.typ == 4) { // local or this or another object's variable
          arg = this.findobj(stmt.argobj, scop);
        } else if (stmt.typ == 1) { // this function's argument
          arg = this.findarg(stmt.arg, scop.arg);
        } else { // constant
          arg = new Empty;
          arg.val = stmt.arg;
          arg.typ = stmt.typ;
        }
        if (lhs.typ !== arg.typ) {
          runerr = 105;
          this.lineno = stmt.lineno;
          break;
        }

        // TODO: an assignment of an object to another should do a copyobj
        if (lhs.typ==4) {runerr=100;this.lineno=stmt.lineno;throw new Error("Can't copyobj - exiting");break;}

        lhs.val = arg.val;
        break;

      default:
        runerr = 103; // Unknown action
        this.lineno = stmt.lineno;
    }
  }
  return runerr;
}

ProgramParse.prototype.ErrToStr = function (err)
{
  var res;
  switch (err) {
    case 0:
      return "All OK";
    case 5:
      return "No main function defined";

    case 1:
      res = "Syntax error";
      break;
    case 2:
      res = "Action outside function";
      break;
    case 3:
      res = "Invalid condition";
      break;
    case 4:
      res = "Declaration outside class definition";
      break;
    case 6:
      res = "Undefined class";
      break;
    case 7:
      res = "Function already defined";
      break;
    case 8:
      res = "Class already defined";
      break;
    case 9:
      res = "Declaration's class name does not match current class";
      break;

    // Run-time errors
    case 101:
      res = "Method not defined";
      break;
    case 102:
      res = "Internal error: Builtin class not found";
      break;
    case 103:
      res = "Internal error: Action not defined";
      break;
    case 104:
      res = "Invalid object reference";
      break;
    case 105:
      res = "Types do not match in assignment";
      break;
    case 106:
      res = "Unknown object in assignment";
      break;
    default:
      res = "Unknown error code: " + err;
    }
  res += " in line " + (this.lineno+1);
  return res;
}

function syntax_check(txt)
{
  var prog = new ProgramParse(txt);
  throw new Error(prog.ErrToStr(prog.parsestatus));
  delete prog;
}

function ork(txt,inp)
{
  var prog = new ProgramParse(txt);
  var out;
  prog.inp = inp;
  if (prog.parsestatus == 0) {
    err = prog.execute();
    out = prog.out;
    if (err != 0)
      throw new Error(prog.ErrToStr(err));
  } else {
    throw new Error(prog.ErrToStr(prog.parsestatus));
    out = null;
  }

  delete prog;
  return out;
}
