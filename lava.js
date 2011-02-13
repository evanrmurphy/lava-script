/* About this code:
### - No code depends on code below it (see
###   http://awwx.posterous.com/how-to-future-proof-your-code
###   for a compelling post on the idea)
### - Unit tests are inline, i.e. functions
###   are tested immediately after they're
###   defined
### - It's organized into 3 sections: 1) Preliminary,
###   2) Lisp primitives, 3) The Compiler
*/var acons, atom, caaar, caadr, caar, cadar, caddr, cadr, car, cdaar, cdadr, cdar, cddar, cdddr, cddr, cdr, cons, lc, lcProc, lcProc1, lcProc2, len, list, nil, orig, pr, t, test, _;
var __slice = Array.prototype.slice;
_ = require('underscore');
pr = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log.apply(console, args);
};
test = function(name, x, expected) {
  if (!_(x).isEqual(expected)) {
    return pr("" + name + " test failed");
  }
};
t = 't';
nil = 'nil';
cons = function(a, d) {
  if (_.isEqual(d, nil)) {
    return [a];
  } else {
    return [a].concat(d);
  }
};
test('cons #1', cons(1, nil), [1]);
test('cons #2', cons(1, 2), [1, 2]);
test('cons #3', cons(1, cons(2, nil)), [1, 2]);
car = function(xs) {
  return _.first(xs);
};
test('car #1', car(cons(1, nil)), 1);
cdr = function(xs) {
  if (_.isEqual(_.rest(xs), [])) {
    return nil;
  } else {
    return _.rest(xs);
  }
};
test('cdr #1', cdr(cons(1, nil)), nil);
test('cdr #2', cdr(cons(1, 2)), cons(2, nil));
test('cdr #3', cdr(cons(1, cons(2, nil))), cons(2, nil));
caar = function(xs) {
  return car(car(xs));
};
cadr = function(xs) {
  return car(cdr(xs));
};
cdar = function(xs) {
  return cdr(car(xs));
};
cddr = function(xs) {
  return cdr(cdr(xs));
};
caaar = function(xs) {
  return car(car(car(xs)));
};
caadr = function(xs) {
  return car(car(cdr(xs)));
};
cadar = function(xs) {
  return car(cdr(car(xs)));
};
caddr = function(xs) {
  return car(cdr(cdr(xs)));
};
cdaar = function(xs) {
  return cdr(car(car(xs)));
};
cdadr = function(xs) {
  return cdr(car(cdr(xs)));
};
cddar = function(xs) {
  return cdr(cdr(car(xs)));
};
cdddr = function(xs) {
  return cdr(cdr(cdr(xs)));
};
acons = function(x) {
  if (_.isArray(x)) {
    return t;
  } else {
    return nil;
  }
};
test('acons #1', acons(nil), nil);
test('acons #2', acons(cons(1, nil)), t);
atom = function(x) {
  if (acons(x) === nil) {
    return t;
  } else {
    return nil;
  }
};
test('atom #1', atom(nil), t);
test('atom #2', atom(cons(1, nil)), nil);
len = function(xs) {
  return xs.length;
};
test('len #1', len(cons(1, nil)), 1);
test('len #2', len(cons(1, cons(2, nil))), 2);
list = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return args;
};
test('list #1', list(), []);
test('list #2', list(1), cons(1, nil));
test('list #3', list(1, 2), cons(1, cons(2, nil)));
lc = function(s) {
  if (atom(s) !== nil) {
    return s;
  }
};
test('lc atom #1', lc(nil), nil);
test('lc atom #2', lc(5), 5);
test('lc atom #3', lc("abc"), "abc");
lcProc2 = function(xs) {
  if (xs === nil) {
    return "";
  } else {
    return ',' + lc(car(xs)) + lcProc2(cdr(xs));
  }
};
lcProc1 = function(xs) {
  if (xs === nil) {
    return "";
  } else {
    return lc(car(xs)) + lcProc2(cdr(xs));
  }
};
lcProc = function(f, args) {
  return lc(f) + '(' + lcProc1(args) + ')';
};
orig = lc;
lc = function(s) {
  if (acons(s) !== nil) {
    return lcProc(car(s), cdr(s));
  } else {
    return orig(s);
  }
};
test('lc proc #1', lc(list('foo')), 'foo()');
test('lc proc #2', lc(list('foo', 'x')), 'foo(x)');
test('lc proc #3', lc(list('foo', 'x', 'y')), 'foo(x,y)');