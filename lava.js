/* About this code:
### - No code depends on code below it (see
###   http://awwx.posterous.com/how-to-future-proof-your-code
###   for a compelling post on the idea)
### - Unit tests are inline, i.e. functions
###   are tested immediately after they're
###   defined
### - It's organized into 3 sections:
###    1) Preliminary,
###    2) The Compiler
###    3) The Reader
*/var atom, each, infixOps, isArray, isAtom, isEmpty, isEqual, isList, lc, lcArray, lcArray1, lcArray2, lcDo, lcDo1, lcIf, lcIf1, lcIf2, lcIf3, lcInfix, lcInfix1, lcObj, lcObj1, lcObj2, lcObj3, lcProc, lcProc1, lcProc2, orig, pair, parse, pr, read, readFrom, test, tokenize, without, _;
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
orig = lc;
lc = function(s) {
  if (isList(s)) {
    return lcProc(s[0], s.slice(1));
  } else {
    return orig(s);
  }
};
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
    return xs[0] + lcInfix1(op, xs.slice(1));
  }
};
infixOps = ['+', '-', '*', '/', '%', '>=', '<=', '>', '<', '==', '===', '!=', '!==', '=', '+=', '-=', '*=', '/=', '%=', '&&', '||'];
orig = lc;
lc = function(s) {
  var _ref;
  if (isList(s) && (_ref = s[0], __indexOf.call(infixOps, _ref) >= 0)) {
    return lcInfix(s[0], s.slice(1));
  } else {
    return orig(s);
  }
};
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
    return acc += ',' + k + ':' + v;
  });
  return acc;
};
lcObj2 = function(xs) {
  var k, v, _ref;
  if (isEmpty(xs)) {
    return "";
  } else {
    _ref = xs[0], k = _ref[0], v = _ref[1];
    return k + ':' + v + lcObj3(xs.slice(1));
  }
};
lcObj1 = function(xs) {
  return lcObj2(pair(xs));
};
lcObj = function(xs) {
  return '{' + lcObj1(xs) + '}';
};
orig = lc;
lc = function(s) {
  if (isList(s) && s[0] === 'obj') {
    return lcObj(s.slice(1));
  } else {
    return orig(s);
  }
};
test('lc obj #1', lc(['obj']), "{}");
test('lc obj #2', lc(['obj', 'x', 'y']), "{x:y}");
test('lc obj #3', lc(['obj', 'x', 'y', 'z', 'a']), "{x:y,z:a}");
test('lc obj #4', lc(['obj', 'x', 'y', 'z', ['+', 'x', 'y']]), "{x:y,z:x+y}");
lcArray2 = function(xs) {
  var acc;
  acc = "";
  each(xs, function(x) {
    return acc += ',' + x;
  });
  return acc;
};
lcArray1 = function(xs) {
  if (isEmpty(xs)) {
    return "";
  } else {
    return xs[0] + lcArray2(xs.slice(1));
  }
};
lcArray = function(xs) {
  return '[' + lcArray1(xs) + ']';
};
orig = lc;
lc = function(s) {
  if (isList(s) && s[0] === 'array') {
    return lcArray(s.slice(1));
  } else {
    return orig(s);
  }
};
test('lc array #1', lc(['array']), "[]");
test('lc array #2', lc(['array', 'x']), "[x]");
test('lc array #3', lc(['array', 'x', 'y']), "[x,y]");
test('lc array #4', lc(['array', 'x', ['array', 'y']]), "[x,[y]]");
lcIf3 = function(ps) {
  var acc;
  acc = "";
  each(ps, function(p, i) {
    if (p.length === 1) {
      return acc += p[0];
    } else if (i === ps.length - 1) {
      return acc += p[0] + '?' + p[1] + ':' + 'undefined';
    } else {
      return acc += p[0] + '?' + p[1] + ':';
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
    return xs[0];
  } else {
    return lcIf1(xs);
  }
};
orig = lc;
lc = function(s) {
  if (isList(s) && s[0] === 'if') {
    return lcIf(s.slice(1));
  } else {
    return orig(s);
  }
};
test('lc if #1', lc(['if']), "");
test('lc if #2', lc(['if', 'x']), "x");
test('lc if #3', lc(['if', 'x', 'y']), "(x?y:undefined)");
test('lc if #4', lc(['if', 'x', 'y', 'z']), "(x?y:z)");
test('lc if #5', lc(['if', 'x', 'y', 'z', 'a']), "(x?y:z?a:undefined)");
lcDo1 = function(xs) {
  var acc;
  acc = "";
  each(xs, function(x) {
    return acc += ',' + x;
  });
  return acc;
};
lcDo = function(xs) {
  if (isEmpty(xs)) {
    return "";
  } else {
    return xs[0] + lcDo1(xs.slice(1));
  }
};
orig = lc;
lc = function(s) {
  if (isList(s) && s[0] === 'do') {
    return lcDo(s.slice(1));
  } else {
    return orig(s);
  }
};
test('lc do #1', lc(['do']), "");
test('lc do #2', lc(['do', 'x']), "x");
test('lc do #3', lc(['do', 'x', 'y']), "x,y");
test('lc do #4', lc(['do', 'x', 'y', 'z']), "x,y,z");
atom = function(token) {
  if (token.match(/^\d+\.?$/)) {
    return parseInt(token);
  } else if (token.match(/^\d*\.\d+$/)) {
    return parseFloat(token);
  } else {
    return token;
  }
};
readFrom = function(tokens) {
  var L, token;
  if (tokens.length === 0) {
    alert('unexpected EOF while reading');
  }
  token = tokens.shift();
  if ('(' === token) {
    L = [];
    while (tokens[0] !== ')') {
      L.push(readFrom(tokens));
    }
    tokens.shift();
    return L;
  } else if (')' === token) {
    return alert('unexpected )');
  } else {
    return atom(token);
  }
};
tokenize = function(s) {
  return _(s.replace('(', ' ( ').replace(')', ' ) ').split(' ')).without('');
};
read = function(s) {
  return readFrom(tokenize(s));
};
parse = read;
test('parse #1', parse('x'), 'x');
test('parse #2', parse('(x)'), ['x']);
test('parse #3', parse('(x y)'), ['x', 'y']);