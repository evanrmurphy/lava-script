/* About this code:
### - No code depends on code below it (see
###   http://awwx.posterous.com/how-to-future-proof-your-code
###   for a compelling post on the idea)
### - Unit tests are inline, i.e. functions
###   are tested immediately after they're
###   defined
### - It's organized into 3 sections: 1) Preliminary,
###   2) Lisp primitives, 3) The Compiler
*/var acons, arraylist, atom, caaar, caadr, caar, cadar, caddr, cadr, car, cdaar, cdadr, cdar, cddar, cdddr, cddr, cdr, cons, infixOps, lc, lcInfix, lcInfix1, lcObj, lcObj1, lcObj2, len, list, nil, orig, pr, t, test, _;
var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
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
  return [a, d];
};
test('cons #1', cons(1, nil), [1, nil]);
car = function(xs) {
  return xs[0];
};
test('car #1', car(cons(1, nil)), 1);
cdr = function(xs) {
  return xs[1];
};
test('cdr #1', cdr(cons(1, nil)), nil);
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
  if (xs === nil) {
    return 0;
  } else {
    return 1 + len(cdr(xs));
  }
};
test('len #1', len(nil), 0);
test('len #2', len(cons(1, nil)), 1);
test('len #3', len(cons(1, cons(2, nil))), 2);
arraylist = function(a) {
  if (a.length === 0) {
    return nil;
  } else if (a.length > 2 && a[1] === '.') {
    return cons(a[0], a[2]);
  } else {
    return cons(a[0], arraylist(a.slice(1)));
  }
};
test('arraylist #1', arraylist([]), nil);
test('arraylist #2', arraylist([1]), cons(1, nil));
test('arraylist #3', arraylist([1, 2]), cons(1, cons(2, nil)));
test('arraylist #4', arraylist([1, '.', 2]), cons(1, 2));
list = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return arraylist(args);
};
test('list #1', list(), nil);
test('list #2', list(1), cons(1, nil));
test('list #3', list(1, 2), cons(1, cons(2, nil)));
lc = function(s) {
  if (atom(s) !== nil) {
    return s;
  }
};
test('lc #1', lc(nil), nil);
test('lc #2', lc(5), 5);
test('lc #3', lc("abc"), "abc");
lcInfix1 = function(op, xs) {
  if (xs === nil) {
    return "";
  } else {
    return "" + op + (car(xs)) + (lcInfix1(op, cdr(xs)));
  }
};
lcInfix = function(op, xs) {
  if (xs === nil) {
    return "";
  } else {
    return "" + (car(xs)) + (lcInfix1(op, cdr(xs)));
  }
};
infixOps = ['+', '-', '*', '/', '%', '>=', '<=', '>', '<', '==', '===', '!=', '!==', '=', '+=', '-=', '*=', '/=', '%=', '&&', '||'];
orig = lc;
lc = function(s) {
  var _ref;
  if (acons(s) && (_ref = car(s), __indexOf.call(infixOps, _ref) >= 0)) {
    return lcInfix(car(s), cdr(s));
  } else {
    return orig(s);
  }
};
test('lc #4', lc(list('+', 'x', 'y')), "x+y");
test('lc #5', lc(list('+', 'x', 'y', 'z')), "x+y+z");
test('lc #6', lc(list('-', 'x', 'y')), "x-y");
test('lc #7', lc(list('*', 'x', 'y')), "x*y");
test('lc #8', lc(list('%', 'x', 'y')), "x%y");
test('lc #9', lc(list('>=', 'x', 'y')), "x>=y");
test('lc #10', lc(list('<=', 'x', 'y')), "x<=y");
test('lc #11', lc(list('>', 'x', 'y')), "x>y");
test('lc #12', lc(list('<', 'x', 'y')), "x<y");
test('lc #13', lc(list('==', 'x', 'y')), "x==y");
test('lc #14', lc(list('===', 'x', 'y')), "x===y");
test('lc #15', lc(list('!=', 'x', 'y')), "x!=y");
test('lc #16', lc(list('!==', 'x', 'y')), "x!==y");
test('lc #17', lc(list('=', 'x', 'y')), "x=y");
test('lc #18', lc(list('+=', 'x', 'y')), "x+=y");
test('lc #19', lc(list('-=', 'x', 'y')), "x-=y");
test('lc #20', lc(list('*=', 'x', 'y')), "x*=y");
test('lc #21', lc(list('/=', 'x', 'y')), "x/=y");
test('lc #22', lc(list('%=', 'x', 'y')), "x%=y");
test('lc #23', lc(list('&&', 'x', 'y')), "x&&y");
test('lc #24', lc(list('||', 'x', 'y')), "x||y");
lcObj2 = function(xs) {
  if (xs === nil) {
    return "";
  } else {
    return ',' + car(xs) + ':' + cadr(xs) + lcObj2(cddr(xs));
  }
};
lcObj1 = function(xs) {
  if (xs === nil) {
    return "";
  } else {
    return car(xs) + ':' + cadr(xs) + lcObj2(cddr(xs));
  }
};
lcObj = function(xs) {
  return '{' + lcObj1(xs) + '}';
};
orig = lc;
lc = function(s) {
  if (acons(s) && (car(s) === 'obj')) {
    return lcObj(cdr(s));
  } else {
    return orig(s);
  }
};
test('lc obj #1', lc(list('obj')), "{}");
test('lc obj #2', lc(list('obj', 'x', 'y')), "{x:y}");
test('lc obj #3', lc(list('obj', 'x', 'y', 'z', 'a')), "{x:y,z:a}");