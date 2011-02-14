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
*/var each, first, isArray, isAtom, isEmpty, isEqual, isList, lc, lcProc, lcProc1, lcProc2, list, orig, pr, rest, test, _;
var __slice = Array.prototype.slice;
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