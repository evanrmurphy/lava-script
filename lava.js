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
*/var each, first, infixOps, isArray, isAtom, isEmpty, isEqual, isList, lc, lcInfix, lcInfix1, lcProc, lcProc1, lcProc2, list, orig, pr, rest, test, _;
var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
_ = require('underscore');
isArray = _.isArray;
isEqual = _.isEqual;
isEmpty = _.isEmpty;
each = _.each;
first = _.first;
rest = _.rest;
pr = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log.apply(console, args);
};
test = function(name, actual, expected) {
  if (!isEqual(actual, expected)) {
    return pr("" + name + " test failed");
  }
};
list = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return args;
};
test('list #1', list(), []);
test('list #2', list(1), [1]);
test('list #3', list(1, 2), [1, 2]);
isList = isArray;
test('isList #1', isList(list()), true);
test('isList #2', isList(list(1)), true);
test('isList #3', isList('foo'), false);
isAtom = function(x) {
  return !isList(x);
};
test('atom #1', isAtom('x'), true);
test('atom #2', isAtom(list('x')), false);
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
    return lc(first(xs)) + lcProc2(rest(xs));
  }
};
lcProc = function(f, args) {
  return lc(f) + '(' + lcProc1(args) + ')';
};
orig = lc;
lc = function(s) {
  if (isList(s)) {
    return lcProc(first(s), rest(s));
  } else {
    return orig(s);
  }
};
test('lc proc #1', lc(list('foo')), 'foo()');
test('lc proc #2', lc(list('foo', 'x')), 'foo(x)');
test('lc proc #3', lc(list('foo', 'x', 'y')), 'foo(x,y)');
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
    return first(xs) + lcInfix1(op, rest(xs));
  }
};
infixOps = ['+', '-', '*', '/', '%', '>=', '<=', '>', '<', '==', '===', '!=', '!==', '=', '+=', '-=', '*=', '/=', '%=', '&&', '||'];
orig = lc;
lc = function(s) {
  var _ref;
  if (isList(s) && (_ref = first(s), __indexOf.call(infixOps, _ref) >= 0)) {
    return lcInfix(first(s), rest(s));
  } else {
    return orig(s);
  }
};
test('lc infix #1', lc(list('+', 'x', 'y')), "x+y");
test('lc infix #2', lc(list('+', 'x', 'y', 'z')), "x+y+z");
test('lc infix #3', lc(list('-', 'x', 'y')), "x-y");
test('lc infix #4', lc(list('*', 'x', 'y')), "x*y");
test('lc infix #5', lc(list('%', 'x', 'y')), "x%y");
test('lc infix #6', lc(list('>=', 'x', 'y')), "x>=y");
test('lc infix #7', lc(list('<=', 'x', 'y')), "x<=y");
test('lc infix #8', lc(list('>', 'x', 'y')), "x>y");
test('lc infix #9', lc(list('<', 'x', 'y')), "x<y");
test('lc infix #10', lc(list('==', 'x', 'y')), "x==y");
test('lc infix #11', lc(list('===', 'x', 'y')), "x===y");
test('lc infix #12', lc(list('!=', 'x', 'y')), "x!=y");
test('lc infix #13', lc(list('!==', 'x', 'y')), "x!==y");
test('lc infix #14', lc(list('=', 'x', 'y')), "x=y");
test('lc infix #15', lc(list('+=', 'x', 'y')), "x+=y");
test('lc infix #16', lc(list('-=', 'x', 'y')), "x-=y");
test('lc infix #17', lc(list('*=', 'x', 'y')), "x*=y");
test('lc infix #18', lc(list('/=', 'x', 'y')), "x/=y");
test('lc infix #19', lc(list('%=', 'x', 'y')), "x%=y");
test('lc infix #20', lc(list('&&', 'x', 'y')), "x&&y");
test('lc infix #21', lc(list('||', 'x', 'y')), "x||y");