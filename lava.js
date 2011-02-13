/* About this code:
### - No code depends on code below it (see
###   http://awwx.posterous.com/how-to-future-proof-your-code
###   for a compelling post on the idea)
### - Unit tests are inline, i.e. functions
###   are tested immediately after they're
###   defined
### - It's organized into 3 sections: 1) Preliminary,
###   2) Lisp primitives, 3) The Compiler
*/var list, nil, pr, t, test, _;
var __slice = Array.prototype.slice;
_ = require('underscore');
pr = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log.apply(console, args);
};
test = function(name, actual, expected) {
  if (!_(actual).isEqual(expected)) {
    return pr("" + name + " test failed");
  }
};
t = 't';
nil = 'nil';
list = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return args;
};
test('list #1', list(), []);
test('list #2', list(1), [1]);
test('list #3', list(1, 2), [1, 2]);