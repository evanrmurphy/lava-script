/* About this code:
### - No code depends on code below it (see
###   http://awwx.posterous.com/how-to-future-proof-your-code
###   for a compelling post on the idea)
### - Unit tests are inline, i.e. functions
###   are tested immediately after they're
###   defined
### - It's organized into 4 sections:
###    1) Preliminary,
###    2) Compiler
###    3) Reader
###    4) Interface
*/var atom, each, infixOps, isArray, isAtom, isEmpty, isEqual, isList, lava, lc, lcArray, lcArray1, lcArray2, lcDo, lcDo1, lcFn, lcFn1, lcFn2, lcFn3, lcFn4, lcIf, lcIf1, lcIf2, lcIf3, lcInfix, lcInfix1, lcObj, lcObj1, lcObj2, lcObj3, lcProc, lcProc1, lcProc2, pair, parse, pr, read, readFrom, repl, test, tokenize, without, _;
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
lc = function(s) {
  if (isAtom(s)) {
    return s;
  }
};
test('lc atom #1', lc('x'), 'x');
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
test('lc proc #1', lc(['foo']), 'foo()');
test('lc proc #2', lc(['foo', 'x']), 'foo(x)');
test('lc proc #3', lc(['foo', 'x', 'y']), 'foo(x,y)');
lcInfix1 = function(op, xs) {
  var acc;
  acc = "";
  each(xs, function(x) {
    return acc += op + x;
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
test('lc infix #1', lc(['+', 'x', 'y']), "x+y");
test('lc infix #2', lc(['+', 'x', 'y', 'z']), "x+y+z");
test('lc infix #3', lc(['-', 'x', 'y']), "x-y");
test('lc infix #4', lc(['*', 'x', 'y']), "x*y");
test('lc infix #5', lc(['%', 'x', 'y']), "x%y");
test('lc infix #6', lc(['>=', 'x', 'y']), "x>=y");
test('lc infix #7', lc(['<=', 'x', 'y']), "x<=y");
test('lc infix #8', lc(['>', 'x', 'y']), "x>y");
test('lc infix #9', lc(['<', 'x', 'y']), "x<y");
test('lc infix #10', lc(['==', 'x', 'y']), "x==y");
test('lc infix #11', lc(['===', 'x', 'y']), "x===y");
test('lc infix #12', lc(['!=', 'x', 'y']), "x!=y");
test('lc infix #13', lc(['!==', 'x', 'y']), "x!==y");
test('lc infix #14', lc(['=', 'x', 'y']), "x=y");
test('lc infix #15', lc(['+=', 'x', 'y']), "x+=y");
test('lc infix #16', lc(['-=', 'x', 'y']), "x-=y");
test('lc infix #17', lc(['*=', 'x', 'y']), "x*=y");
test('lc infix #18', lc(['/=', 'x', 'y']), "x/=y");
test('lc infix #19', lc(['%=', 'x', 'y']), "x%=y");
test('lc infix #20', lc(['&&', 'x', 'y']), "x&&y");
test('lc infix #21', lc(['||', 'x', 'y']), "x||y");
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
test('lc obj #1', lc(['obj']), "{}");
test('lc obj #2', lc(['obj', 'x', 'y']), "{x:y}");
test('lc obj #3', lc(['obj', 'x', 'y', 'z', 'a']), "{x:y,z:a}");
test('lc obj #4', lc(['obj', 'x', 'y', 'z', ['+', 'x', 'y']]), "{x:y,z:x+y}");
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
test('lc array #1', lc(['array']), "[]");
test('lc array #2', lc(['array', 'x']), "[x]");
test('lc array #3', lc(['array', 'x', 'y']), "[x,y]");
test('lc array #4', lc(['array', 'x', ['array', 'y']]), "[x,[y]]");
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
test('lc if #1', lc(['if']), "");
test('lc if #2', lc(['if', 'x']), "x");
test('lc if #3', lc(['if', 'x', 'y']), "(x?y:undefined)");
test('lc if #4', lc(['if', 'x', 'y', 'z']), "(x?y:z)");
test('lc if #5', lc(['if', 'x', 'y', 'z', 'a']), "(x?y:z?a:undefined)");
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
test('lc do #1', lc(['do']), "");
test('lc do #2', lc(['do', 'x']), "x");
test('lc do #3', lc(['do', 'x', 'y']), "x,y");
test('lc do #4', lc(['do', 'x', 'y', 'z']), "x,y,z");
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
test('lc fn #1', lc(['fn', []]), "(function(){})");
test('lc fn #2', lc(['fn', ['x']]), "(function(x){})");
test('lc fn #3', lc(['fn', ['x'], 'x']), "(function(x){return x;})");
test('lc fn #4', lc(['fn', ['x', 'y'], 'x']), "(function(x,y){return x;})");
test('lc fn #5', lc(['fn', ['x'], 'x', 'y']), "(function(x){return x,y;})");
test('lc fn #6', lc(['fn', ['x', 'y'], 'x', 'y']), "(function(x,y){return x,y;})");
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
lava = function(s) {
  return lc(parse(s));
};
test('lava #1', lava('x'), 'x');
test('lava #2', lava('(+ x y)'), 'x+y');
test('lava #3', lava('(do x y)'), 'x,y');
test('lava #4', lava('(fn (x y) x y)'), '(function(x,y){return x,y;})');
repl = function() {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdout.write('lava> ');
  return process.stdin.on('data', function(chunk) {
    process.stdout.write(lava(chunk));
    return process.stdout.write('\nlava> ');
  });
};
repl();