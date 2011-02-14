/* About this code:
### - No code depends on code below it (see
###   http://awwx.posterous.com/how-to-future-proof-your-code
###   for a compelling post on the idea)
### - Unit tests are inline, i.e. functions
###   are tested immediately after they're
###   defined
### - It's organized into 2 sections:
###    1) Preliminary,
###    2) The Compiler
*/var each, infixOps, isArray, isAtom, isEmpty, isEqual, isList, lc, lcArray, lcArray1, lcArray2, lcInfix, lcInfix1, lcObj, lcObj1, lcObj2, lcObj3, lcProc, lcProc1, lcProc2, orig, pair, pr, test, _;
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
test('pair #1', pair(['a', '1', 'b', '2']), [['a', '1'], ['b', '2']]);
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