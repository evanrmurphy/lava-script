### About this code:
### - No code depends on code below it (see
###   http://awwx.posterous.com/how-to-future-proof-your-code
###   for a compelling post on the idea)
### - Unit tests are inline, i.e. functions
###   are tested immediately after they're
###   defined
### - It's organized into 2 sections:
###    1) Preliminary,
###    2) The Compiler
###

## Preliminary

_ = require('underscore');

isArray = _.isArray
isEqual = _.isEqual
isEmpty = _.isEmpty

each = _.each

first = _.first
rest = _.rest

pr = (args...) -> console.log args...

test = (name, actual, expected) ->
  unless isEqual(actual, expected)
    pr "#{name} test failed"

list = (args...) -> args

test('list #1', list(), [])
test('list #2', list(1), [1])
test('list #3', list(1, 2), [1, 2])

isList = isArray

test('isList #1', isList(list()), true)
test('isList #2', isList(list(1)), true)
test('isList #3', isList('foo'), false)

isAtom = (x) ->  not isList(x)

test('atom #1', isAtom('x'), true)
test('atom #2', isAtom(list('x')), false)

## The Compiler (lc)

# lc is built up iteratively here, one
# conditional at a time. lc is defined
# with a single conditional, tested, and
# then redefined with a second conditional.
# Each redefinition extends upon the previous
# definition, essentially by hand-generating
# the macro-expansion of the arc macro,
# extend (http://awwx.ws/extend).

# lc atom

lc = (s) ->
  if isAtom(s) then s

test('lc atom #1', lc('x'), 'x')

# lc proc

lcProc2 = (xs) ->
  acc = ""
  each xs, (x) ->
    acc += ',' + lc(x)
  acc

lcProc1 = (xs) ->
  if isEmpty(xs)
    ""
  else lc(first(xs)) + lcProc2(rest(xs))

lcProc = (f, args) ->
  lc(f) + '(' + lcProc1(args) + ')'

orig = lc
lc = (s) ->
  if isList(s)
    lcProc(first(s), rest(s))
  else orig(s)

test('lc proc #1', lc(list('foo')), 'foo()')
test('lc proc #2', lc(list('foo', 'x')), 'foo(x)')
test('lc proc #3', lc(list('foo', 'x', 'y')), 'foo(x,y)')

# lc infix

lcInfix1 = (op, xs) ->
  acc = ""
  each xs, (x) ->
    acc += op + x
  acc

lcInfix = (op, xs) ->
  if isEmpty(xs)
    ""
  else first(xs) + lcInfix1(op, rest(xs))

infixOps = ['+','-','*','/','%',
            '>=','<=','>','<','==','===','!=','!==',
            '=','+=','-=','*=','/=','%=',
            '&&','||']

orig = lc
lc = (s) ->
  if isList(s) and (first(s) in infixOps)
      lcInfix(first(s), rest(s))
  else orig(s)

test('lc infix #1', lc(list('+', 'x', 'y')), "x+y")
test('lc infix #2', lc(list('+', 'x', 'y', 'z')), "x+y+z")
test('lc infix #3', lc(list('-', 'x', 'y')), "x-y")
test('lc infix #4', lc(list('*', 'x', 'y')), "x*y")
test('lc infix #5', lc(list('%', 'x', 'y')), "x%y")

test('lc infix #6', lc(list('>=', 'x', 'y')), "x>=y")
test('lc infix #7', lc(list('<=', 'x', 'y')), "x<=y")
test('lc infix #8', lc(list('>', 'x', 'y')), "x>y")
test('lc infix #9', lc(list('<', 'x', 'y')), "x<y")
test('lc infix #10', lc(list('==', 'x', 'y')), "x==y")
test('lc infix #11', lc(list('===', 'x', 'y')), "x===y")
test('lc infix #12', lc(list('!=', 'x', 'y')), "x!=y")
test('lc infix #13', lc(list('!==', 'x', 'y')), "x!==y")

test('lc infix #14', lc(list('=', 'x', 'y')), "x=y")
test('lc infix #15', lc(list('+=', 'x', 'y')), "x+=y")
test('lc infix #16', lc(list('-=', 'x', 'y')), "x-=y")
test('lc infix #17', lc(list('*=', 'x', 'y')), "x*=y")
test('lc infix #18', lc(list('/=', 'x', 'y')), "x/=y")
test('lc infix #19', lc(list('%=', 'x', 'y')), "x%=y")

test('lc infix #20', lc(list('&&', 'x', 'y')), "x&&y")
test('lc infix #21', lc(list('||', 'x', 'y')), "x||y")

# # lc obj
# #
# # lcObj2 = (xs) ->
# #   if xs is nil
# #     ""
# #   else ',' + car(xs) + ':' + cadr(xs) + lcObj2(cddr(xs))
# #
# # lcObj1 = (xs) ->
# #   if xs is nil
# #     ""
# #   else car(xs) + ':' + cadr(xs) + lcObj2(cddr(xs))
# #
# # lcObj = (xs) ->
# #   '{' + lcObj1(xs) + '}'
# #
# # orig = lc
# # lc = (s) ->
# #   if acons(s) isnt nil
# #     if car(s) is 'obj'
# #       lcObj(cdr(s))
# #   else orig(s)
# #
# # test('lc obj #1', lc(list('obj')), "{}")
# # test('lc obj #2', lc(list('obj', 'x', 'y')), "{x:y}")
# # test('lc obj #3', lc(list('obj', 'x', 'y', 'z', 'a')), "{x:y,z:a}")
# # test('lc obj #4', lc(list('obj', 'x', 'y', 'z', list('+', 'x', 'y'))), "{x:y,z:x+y}")
# #
# # # # lc array
# # #
# # # lcArray2 = (xs) ->
# # #   if xs is nil
# # #     ""
# # #   else ',' + car(xs) + lcArray2(cdr(xs))
# # #
# # # lcArray1 = (xs) ->
# # #   if xs is nil
# # #     ""
# # #   else car(xs) + lcArray2(cdr(xs))
# # #
# # # lcArray = (xs) ->
# # #   '[' + lcArray1(xs) + ']'
# # #
# # # orig = lc
# # # lc = (s) ->
# # #   if (acons(s) isnt nil) and (car(s) is 'array')
# # #     lcArray(cdr(s))
# # #   else orig(s)
# # #
# # # test('lc array #1', lc(list('array')), "[]")
# # # test('lc array #2', lc(list('array', 'x')), "[x]")
# # # test('lc array #3', lc(list('array', 'x', 'y')), "[x,y]")
# # # test('lc array #4', lc(list('array', 'x', list('array', 'y'))), "[x,[y]]")
