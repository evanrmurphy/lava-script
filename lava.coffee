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

isEqual = _.isEqual

test = (name, actual, expected) ->
  unless isEqual(actual, expected)
    pr "#{name} test failed"

isArray = _.isArray
isEmpty = _.isEmpty

each = _.each

pr = (args...) -> console.log args...

isList = isArray

test('isList #1', isList([]), true)
test('isList #2', isList([1]), true)
test('isList #3', isList('foo'), false)

isAtom = (x) ->  not isList(x)

test('isAtom #1', isAtom('x'), true)
test('isAtom #2', isAtom(['x']), false)

pair = (xs) ->
  acc = []
  while(not isEmpty(xs))
    acc.push(xs[0..1])
    xs = xs[2..]
  acc

test('pair #1', pair(['a', '1', 'b', '2']), [['a', '1'], ['b', '2']])

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
  else lc(xs[0]) + lcProc2(xs[1..])

lcProc = (f, args) ->
  lc(f) + '(' + lcProc1(args) + ')'

orig = lc
lc = (s) ->
  if isList(s)
    lcProc(s[0], s[1..])
  else orig(s)

test('lc proc #1', lc(['foo']), 'foo()')
test('lc proc #2', lc(['foo', 'x']), 'foo(x)')
test('lc proc #3', lc(['foo', 'x', 'y']), 'foo(x,y)')

# lc infix

lcInfix1 = (op, xs) ->
  acc = ""
  each xs, (x) ->
    acc += op + x
  acc

lcInfix = (op, xs) ->
  if isEmpty(xs)
    ""
  else xs[0] + lcInfix1(op, xs[1..])

infixOps = ['+','-','*','/','%',
            '>=','<=','>','<','==','===','!=','!==',
            '=','+=','-=','*=','/=','%=',
            '&&','||']

orig = lc
lc = (s) ->
  if isList(s) and (s[0] in infixOps)
      lcInfix(s[0], s[1..])
  else orig(s)

test('lc infix #1', lc(['+', 'x', 'y']), "x+y")
test('lc infix #2', lc(['+', 'x', 'y', 'z']), "x+y+z")
test('lc infix #3', lc(['-', 'x', 'y']), "x-y")
test('lc infix #4', lc(['*', 'x', 'y']), "x*y")
test('lc infix #5', lc(['%', 'x', 'y']), "x%y")

test('lc infix #6', lc(['>=', 'x', 'y']), "x>=y")
test('lc infix #7', lc(['<=', 'x', 'y']), "x<=y")
test('lc infix #8', lc(['>', 'x', 'y']), "x>y")
test('lc infix #9', lc(['<', 'x', 'y']), "x<y")
test('lc infix #10', lc(['==', 'x', 'y']), "x==y")
test('lc infix #11', lc(['===', 'x', 'y']), "x===y")
test('lc infix #12', lc(['!=', 'x', 'y']), "x!=y")
test('lc infix #13', lc(['!==', 'x', 'y']), "x!==y")

test('lc infix #14', lc(['=', 'x', 'y']), "x=y")
test('lc infix #15', lc(['+=', 'x', 'y']), "x+=y")
test('lc infix #16', lc(['-=', 'x', 'y']), "x-=y")
test('lc infix #17', lc(['*=', 'x', 'y']), "x*=y")
test('lc infix #18', lc(['/=', 'x', 'y']), "x/=y")
test('lc infix #19', lc(['%=', 'x', 'y']), "x%=y")

test('lc infix #20', lc(['&&', 'x', 'y']), "x&&y")
test('lc infix #21', lc(['||', 'x', 'y']), "x||y")

# lc obj

lcObj3 = (xs) ->
  acc = ""
  each xs, (x) ->
    [k, v] = x
    acc += ',' + k + ':' + v
  acc

lcObj2 = (xs) ->
  if isEmpty(xs)
    ""
  else
    [k, v] = xs[0]
    k + ':' + v + lcObj3(xs[1..])

lcObj1 = (xs) ->
  lcObj2 pair(xs)

lcObj = (xs) ->
  '{' + lcObj1(xs) + '}'

orig = lc
lc = (s) ->
  if isList(s) and s[0] is 'obj'
    lcObj(s[1..])
  else orig(s)

test('lc obj #1', lc(['obj']), "{}")
test('lc obj #2', lc(['obj', 'x', 'y']), "{x:y}")
test('lc obj #3', lc(['obj', 'x', 'y', 'z', 'a']), "{x:y,z:a}")
test('lc obj #4', lc(['obj', 'x', 'y', 'z', ['+', 'x', 'y']]), "{x:y,z:x+y}")

# lc array

lcArray2 = (xs) ->
  acc = ""
  each xs, (x) ->
    acc += ',' + x
  acc

lcArray1 = (xs) ->
  if isEmpty(xs)
    ""
  else xs[0] + lcArray2(xs[1..])

lcArray = (xs) ->
  '[' + lcArray1(xs) + ']'

orig = lc
lc = (s) ->
  if isList(s) and s[0] is 'array'
    lcArray(s[1..])
  else orig(s)

test('lc array #1', lc(['array']), "[]")
test('lc array #2', lc(['array', 'x']), "[x]")
test('lc array #3', lc(['array', 'x', 'y']), "[x,y]")
test('lc array #4', lc(['array', 'x', ['array', 'y']]), "[x,[y]]")
