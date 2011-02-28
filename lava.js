/* Copyright 2011 Evan R. Murphy
*/
/* About this code:
### - No code depends on code below it (see
###   http://awwx.posterous.com/how-to-future-proof-your-code
###   for a compelling post on the idea)
### - Unit tests are inline, i.e. functions
###   are tested immediately after they're
###   defined
### - It's organized into 4 sections:
###    1) Preliminary,
###    2) Reader
###    3) Compiler
###    4) Interface
*/var atom, bind, each, infixOps, isArray, isAtom, isEmpty, isEqual, isList, lava, lc, lcArray, lcArray1, lcArray2, lcDo, lcDo1, lcDot, lcFn, lcFn1, lcFn2, lcFn3, lcFn4, lcIf, lcIf1, lcIf2, lcIf3, lcInfix, lcInfix1, lcMac, lcMac1, lcObj, lcObj1, lcObj2, lcObj3, lcProc, lcProc1, lcProc2, lcRef, macroExpand, macroExpand1, macros, pair, parse, pr, read, readFrom, repl, repl1, repl2, repl3, repl4, repl5, repl6, repl7, repl8, stdin, stdout, test, tokenize, without, _;
var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
_ = require('underscore');
isEqual = _.isEqual;
test = function(name, actual, expected) {
  if (!isEqual(actual, expected)) {
    return pr("" + name + " test failed");
  }
};
isArray = _.isArray;
isEmpty = _.isEmpty;
each = _.each;
without = _.without;
pr = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log.apply(console, args);
};
stdin = process.stdin;
stdout = process.stdout;
isList = isArray;
test('isList #1', isList([]), true);
test('isList #2', isList([1]), true);
test('isList #3', isList('foo'), false);
isAtom = function(x) {
  return !isList(x);
};
test('isAtom #1', isAtom('x'), true);
test('isAtom #2', isAtom(['x']), false);
pair = function(xs) {
  var acc;
  acc = [];
  while (!isEmpty(xs)) {
    acc.push(xs.slice(0, 1 + 1));
    xs = xs.slice(2);
  }
  return acc;
};
test('pair #1', pair(['a', '1']), [['a', '1']]);
test('pair #2', pair(['a', '1', 'b']), [['a', '1'], ['b']]);
test('pair #3', pair(['a', '1', 'b', '2']), [['a', '1'], ['b', '2']]);
atom = function(t) {
  if (t.match(/^\d+\.?$/)) {
    return parseInt(t);
  } else if (t.match(/^\d*\.\d+$/)) {
    return parseFloat(t);
  } else {
    return t;
  }
};
readFrom = function(ts) {
  var acc, t;
  t = ts.shift();
  if (t === '(') {
    acc = [];
    while (ts[0] !== ')') {
      acc.push(readFrom(ts));
    }
    ts.shift();
    return acc;
  } else {
    return atom(t);
  }
};
tokenize = function(s) {
  var spaced;
  spaced = s.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').split(' ');
  return without(spaced, '');
};
read = function(s) {
  return readFrom(tokenize(s));
};
parse = read;
test('parse #1', parse('x'), 'x');
test('parse #2', parse('(x)'), ['x']);
test('parse #3', parse('(x y)'), ['x', 'y']);
test('parse #4', parse('((x) y)'), [['x'], 'y']);
lc = function() {};
lava = function(s) {
  return lc(parse(s));
};
lc = function(s) {
  if (isAtom(s)) {
    return s;
  }
};
test('atom #1', lava('x'), 'x');
lcProc2 = function(xs) {
  var acc;
  acc = "";
  each(xs, function(x) {
    return acc += ',' + lc(x);
  });
  return acc;
};
lcProc1 = function(xs) {
  if (isEmpty(xs)) {
    return "";
  } else {
    return lc(xs[0]) + lcProc2(xs.slice(1));
  }
};
lcProc = function(f, args) {
  return lc(f) + '(' + lcProc1(args) + ')';
};
(function() {
  var orig;
  orig = lc;
  return lc = function(s) {
    if (isList(s)) {
      return lcProc(s[0], s.slice(1));
    } else {
      return orig(s);
    }
  };
})();
test('proc #1', lava('(foo)'), 'foo()');
test('proc #2', lava('(foo x)'), 'foo(x)');
test('proc #3', lava('(foo x y)'), 'foo(x,y)');
lcInfix1 = function(op, xs) {
  var acc;
  acc = "";
  each(xs, function(x) {
    return acc += op + lc(x);
  });
  return acc;
};
lcInfix = function(op, xs) {
  if (isEmpty(xs)) {
    return "";
  } else {
    return lc(xs[0]) + lcInfix1(op, xs.slice(1));
  }
};
infixOps = ['+', '-', '*', '/', '%', '>=', '<=', '>', '<', '==', '===', '!=', '!==', '=', '+=', '-=', '*=', '/=', '%=', '&&', '||'];
(function() {
  var orig;
  orig = lc;
  return lc = function(s) {
    var _ref;
    if (isList(s) && (_ref = s[0], __indexOf.call(infixOps, _ref) >= 0)) {
      return lcInfix(s[0], s.slice(1));
    } else {
      return orig(s);
    }
  };
})();
test('infix #1', lava('(+ x y)'), "x+y");
test('infix #2', lava('(+ x y z)'), "x+y+z");
test('infix #3', lava('(- x y)'), "x-y");
test('infix #4', lava('(* x y)'), "x*y");
test('infix #5', lava('(% x y)'), "x%y");
test('infix #6', lava('(>= x y)'), "x>=y");
test('infix #7', lava('(<= x y)'), "x<=y");
test('infix #8', lava('(> x y)'), "x>y");
test('infix #9', lava('(< x y)'), "x<y");
test('infix #10', lava('(== x y)'), "x==y");
test('infix #11', lava('(=== x y)'), "x===y");
test('infix #12', lava('(!= x y)'), "x!=y");
test('infix #13', lava('(!== x y)'), "x!==y");
test('infix #14', lava('(= x y)'), "x=y");
test('infix #15', lava('(+= x y)'), "x+=y");
test('infix #16', lava('(-= x y)'), "x-=y");
test('infix #17', lava('(*= x y)'), "x*=y");
test('infix #18', lava('(/= x y)'), "x/=y");
test('infix #19', lava('(%= x y)'), "x%=y");
test('infix #20', lava('(&& x y)'), "x&&y");
test('infix #21', lava('(|| x y)'), "x||y");
lcObj3 = function(xs) {
  var acc;
  acc = "";
  each(xs, function(x) {
    var k, v;
    k = x[0], v = x[1];
    return acc += ',' + lc(k) + ':' + lc(v);
  });
  return acc;
};
lcObj2 = function(xs) {
  var k, v, _ref;
  if (isEmpty(xs)) {
    return "";
  } else {
    _ref = xs[0], k = _ref[0], v = _ref[1];
    return lc(k) + ':' + lc(v) + lcObj3(xs.slice(1));
  }
};
lcObj1 = function(xs) {
  return lcObj2(pair(xs));
};
lcObj = function(xs) {
  return '{' + lcObj1(xs) + '}';
};
(function() {
  var orig;
  orig = lc;
  return lc = function(s) {
    if (isList(s) && s[0] === 'obj') {
      return lcObj(s.slice(1));
    } else {
      return orig(s);
    }
  };
})();
test('obj #1', lava('(obj)'), "{}");
test('obj #2', lava('(obj x y)'), "{x:y}");
test('obj #3', lava('(obj x y z a)'), "{x:y,z:a}");
test('obj #4', lava('(obj x y z (+ x y))'), "{x:y,z:x+y}");
lcArray2 = function(xs) {
  var acc;
  acc = "";
  each(xs, function(x) {
    return acc += ',' + lc(x);
  });
  return acc;
};
lcArray1 = function(xs) {
  if (isEmpty(xs)) {
    return "";
  } else {
    return lc(xs[0]) + lcArray2(xs.slice(1));
  }
};
lcArray = function(xs) {
  return '[' + lcArray1(xs) + ']';
};
(function() {
  var orig;
  orig = lc;
  return lc = function(s) {
    if (isList(s) && s[0] === 'array') {
      return lcArray(s.slice(1));
    } else {
      return orig(s);
    }
  };
})();
test('array #1', lava('(array)'), "[]");
test('array #2', lava('(array x)'), "[x]");
test('array #3', lava('(array x y)'), "[x,y]");
test('array #4', lava('(array x (array y))'), "[x,[y]]");
lcRef = function(xs) {
  var h, k;
  h = xs[0], k = xs[1];
  return lc(h) + '[' + lc(k) + ']';
};
(function() {
  var orig;
  orig = lc;
  return lc = function(s) {
    if (isList(s) && s[0] === 'ref') {
      return lcRef(s.slice(1));
    } else {
      return orig(s);
    }
  };
})();
test('ref #1', lava('(ref x y)'), "x[y]");
lcDot = function(xs) {
  var h, k;
  h = xs[0], k = xs[1];
  return lc(h) + '.' + lc(k);
};
(function() {
  var orig;
  orig = lc;
  return lc = function(s) {
    if (isList(s) && s[0] === 'dot') {
      return lcDot(s.slice(1));
    } else {
      return orig(s);
    }
  };
})();
test('dot #1', lava('(dot x y)'), "x.y");
lcIf3 = function(ps) {
  var acc;
  acc = "";
  each(ps, function(p, i) {
    if (p.length === 1) {
      return acc += lc(p[0]);
    } else if (i === ps.length - 1) {
      return acc += lc(p[0]) + '?' + lc(p[1]) + ':' + 'undefined';
    } else {
      return acc += lc(p[0]) + '?' + lc(p[1]) + ':';
    }
  });
  return acc;
};
lcIf2 = function(xs) {
  return lcIf3(pair(xs));
};
lcIf1 = function(xs) {
  return '(' + lcIf2(xs) + ')';
};
lcIf = function(xs) {
  if (isEmpty(xs)) {
    return "";
  } else if (xs.length === 1) {
    return lc(xs[0]);
  } else {
    return lcIf1(xs);
  }
};
(function() {
  var orig;
  orig = lc;
  return lc = function(s) {
    if (isList(s) && s[0] === 'if') {
      return lcIf(s.slice(1));
    } else {
      return orig(s);
    }
  };
})();
test('if #1', lava('(if)'), "");
test('if #2', lava('(if x)'), "x");
test('if #3', lava('(if x y)'), "(x?y:undefined)");
test('if #4', lava('(if x y z)'), "(x?y:z)");
test('if #5', lava('(if x y z a)'), "(x?y:z?a:undefined)");
lcDo1 = function(xs) {
  var acc;
  acc = "";
  each(xs, function(x) {
    return acc += ',' + lc(x);
  });
  return acc;
};
lcDo = function(xs) {
  if (isEmpty(xs)) {
    return "";
  } else {
    return lc(xs[0]) + lcDo1(xs.slice(1));
  }
};
(function() {
  var orig;
  orig = lc;
  return lc = function(s) {
    if (isList(s) && s[0] === 'do') {
      return lcDo(s.slice(1));
    } else {
      return orig(s);
    }
  };
})();
test('do #1', lava('(do)'), "");
test('do #2', lava('(do x)'), "x");
test('do #3', lava('(do x y)'), "x,y");
test('do #4', lava('(do x y z)'), "x,y,z");
lcFn4 = function(xs) {
  if (isEmpty(xs)) {
    return "";
  } else {
    return 'return ' + lcDo(xs) + ';';
  }
};
lcFn3 = function(xs) {
  return lcDo(xs);
};
lcFn2 = function(args, body) {
  return 'function' + '(' + lcFn3(args) + ')' + '{' + lcFn4(body) + '}';
};
lcFn1 = function(xs) {
  return lcFn2(xs[0], xs.slice(1));
};
lcFn = function(xs) {
  return '(' + lcFn1(xs) + ')';
};
(function() {
  var orig;
  orig = lc;
  return lc = function(s) {
    if (isList(s) && s[0] === 'fn') {
      return lcFn(s.slice(1));
    } else {
      return orig(s);
    }
  };
})();
test('fn #1', lava('(fn ())'), "(function(){})");
test('fn #2', lava('(fn (x))'), "(function(x){})");
test('fn #3', lava('(fn (x) x)'), "(function(x){return x;})");
test('fn #4', lava('(fn (x y) x)'), "(function(x,y){return x;})");
test('fn #5', lava('(fn (x) x y)'), "(function(x){return x,y;})");
test('fn #6', lava('(fn (x y) x y)'), "(function(x,y){return x,y;})");
macros = {};
lcMac1 = function(name, definition) {
  return macros[name] = definition;
};
lcMac = function(xs) {
  return lcMac1(xs[0], xs.slice(1));
};
(function() {
  var orig;
  orig = lc;
  return lc = function(s) {
    if (isList(s) && s[0] === 'mac') {
      return lcMac(s.slice(1));
    } else {
      return orig(s);
    }
  };
})();
lc(['mac', 'foo']);
test('mac #1', macros.foo, []);
macros = {};
lc(['mac', 'foo', ['x'], 'x']);
test('mac #2', macros.foo, [['x'], 'x']);
macros = {};
lc(['mac', 'foo', ['x', 'y'], 'x']);
test('mac #3', macros.foo, [['x', 'y'], 'x']);
macros = {};
lc(['mac', 'foo', ['x', 'y'], ['x', 'y']]);
test('mac #4', macros.foo, [['x', 'y'], ['x', 'y']]);
macros = {};
(function() {
  var orig;
  orig = lc;
  return lc = function(s) {
    if (isList(s) && s[0] === 'quote') {
      return s[1];
    } else {
      return orig(s);
    }
  };
})();
test('quote #1', lc(['quote', 'x']), 'x');
test('quote #2', lc(['quote', ['x']]), ['x']);
test('quote #3', lc(['quote', ['x', 'y']]), ['x', 'y']);
bind = function(parms, args, env) {
  if (env == null) {
    env = {};
  }
  each(parms, function(parm, i) {
    return env[parm] = args[i];
  });
  return env;
};
test('bind #1', bind([], []), {});
test('bind #2', bind(['x'], ['y']), {
  'x': 'y'
});
test('bind #3', bind(['x', 'z'], ['y', 'a']), {
  'x': 'y',
  'z': 'a'
});
macroExpand1 = function(x, env) {
  var acc;
  if (isAtom(x)) {
    if (x in env) {
      return env[x];
    } else {
      return x;
    }
  } else {
    acc = [];
    each(x, function(elt) {
      return acc.push(macroExpand1(elt, env));
    });
    return acc;
  }
};
test('macroExpand1 #1', macroExpand1('x', {}), 'x');
test('macroExpand1 #2', macroExpand1('x', {
  'x': 'y'
}), 'y');
test('macroExpand1 #3', macroExpand1('x', {
  'x': ['a', 'b']
}), ['a', 'b']);
test('macroExpand1 #4', macroExpand1(['x', 'y'], {}), ['x', 'y']);
test('macroExpand1 #5', macroExpand1(['x', 'y'], {
  'x': 'y'
}), ['y', 'y']);
test('macroExpand1 #6', macroExpand1(['x', ['y', 'z']], {
  'z': 'a'
}), ['x', ['y', 'a']]);
macroExpand = function(name, args) {
  var body, env, parms, _ref;
  _ref = macros[name], parms = _ref[0], body = _ref[1];
  env = bind(parms, args);
  return macroExpand1(body, env);
};
(function() {
  var orig;
  orig = lc;
  return lc = function(s) {
    if (isList(s) && (s[0] in macros)) {
      return lc(macroExpand(s[0], s.slice(1)));
    } else {
      return orig(s);
    }
  };
})();
lc(['mac', 'foo', ['x'], 'x']);
test('macro-expand #1', lc(['foo', 'y']), 'y');
macros = {};
lava = function(s) {
  return lc(parse(s));
};
test('lava #1', lava('x'), 'x');
test('lava #2', lava('(+ x y)'), 'x+y');
test('lava #3', lava('(do x y)'), 'x,y');
test('lava #4', lava('(fn (x y) x y)'), '(function(x,y){return x,y;})');
lava("(mac let1 (var val body)        ((fn (var) body) val))");
test('lava #5', lava('(let1 x 5 x)'), '(function(x){return x;})(5)');
macros = {};
repl8 = function(x) {
  return '> ';
};
repl7 = function(x) {
  return '=> ' + eval(x) + '\n' + repl8(x);
};
repl6 = function(x) {
  return x + '\n' + repl7(x);
};
repl5 = function(x) {
  return stdout.write(repl6(x));
};
repl4 = function(x) {
  return repl5(lava(x));
};
repl3 = function() {
  return stdin.on('data', repl4);
};
repl2 = function() {
  stdout.write('> ');
  return repl3();
};
repl1 = function() {
  stdin.setEncoding('utf8');
  return repl2();
};
repl = function() {
  stdin.resume();
  return repl1();
};
repl();