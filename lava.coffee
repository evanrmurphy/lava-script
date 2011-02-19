### About this code:
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
###

## Preliminary

_ = require('underscore');

isEqual = _.isEqual

test = (name, actual, expected) ->
  unless isEqual(actual, expected)
    pr "#{name} test failed"

isArray = _.isArray
isEmpty = _.isEmpty
each    = _.each
without = _.without

pr = (args...) -> console.log args...

stdin = process.stdin
stdout = process.stdout

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

test('pair #1', pair(['a', '1']), [['a', '1']])
test('pair #2', pair(['a', '1', 'b']), [['a', '1'], ['b']])
test('pair #3', pair(['a', '1', 'b', '2']), [['a', '1'], ['b', '2']])

## Compiler (lc)

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

(->
  orig = lc
  lc = (s) ->
    if isList(s)
      lcProc(s[0], s[1..])
    else orig(s)
)()

test('lc proc #1', lc(['foo']), 'foo()')
test('lc proc #2', lc(['foo', 'x']), 'foo(x)')
test('lc proc #3', lc(['foo', 'x', 'y']), 'foo(x,y)')

# lc infix

lcInfix1 = (op, xs) ->
  acc = ""
  each xs, (x) ->
    acc += op + lc(x)
  acc

lcInfix = (op, xs) ->
  if isEmpty(xs)
    ""
  else lc(xs[0]) + lcInfix1(op, xs[1..])

infixOps = ['+','-','*','/','%',
            '>=','<=','>','<','==','===','!=','!==',
            '=','+=','-=','*=','/=','%=',
            '&&','||']

(->
  orig = lc
  lc = (s) ->
    if isList(s) and (s[0] in infixOps)
      lcInfix(s[0], s[1..])
    else orig(s)
)()

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
    acc += ',' + lc(k) + ':' + lc(v)
  acc

lcObj2 = (xs) ->
  if isEmpty(xs)
    ""
  else
    [k, v] = xs[0]
    lc(k) + ':' + lc(v) + lcObj3(xs[1..])

lcObj1 = (xs) ->
  lcObj2 pair(xs)

lcObj = (xs) ->
  '{' + lcObj1(xs) + '}'

(->
  orig = lc
  lc = (s) ->
    if isList(s) and s[0] is 'obj'
      lcObj(s[1..])
    else orig(s)
)()

test('lc obj #1', lc(['obj']), "{}")
test('lc obj #2', lc(['obj', 'x', 'y']), "{x:y}")
test('lc obj #3', lc(['obj', 'x', 'y', 'z', 'a']), "{x:y,z:a}")
test('lc obj #4', lc(['obj', 'x', 'y', 'z', ['+', 'x', 'y']]), "{x:y,z:x+y}")

# lc array

lcArray2 = (xs) ->
  acc = ""
  each xs, (x) ->
    acc += ',' + lc(x)
  acc

lcArray1 = (xs) ->
  if isEmpty(xs)
    ""
  else lc(xs[0]) + lcArray2(xs[1..])

lcArray = (xs) ->
  '[' + lcArray1(xs) + ']'

(->
  orig = lc
  lc = (s) ->
    if isList(s) and s[0] is 'array'
      lcArray(s[1..])
    else orig(s)
)()

test('lc array #1', lc(['array']), "[]")
test('lc array #2', lc(['array', 'x']), "[x]")
test('lc array #3', lc(['array', 'x', 'y']), "[x,y]")
test('lc array #4', lc(['array', 'x', ['array', 'y']]), "[x,[y]]")

# lc if

lcIf3 = (ps) ->
  acc = ""
  each ps, (p, i) ->
    if p.length == 1
      acc += lc(p[0])
    else if i == ps.length-1
      acc += lc(p[0]) + '?' + lc(p[1]) + ':' + 'undefined'
    else
      acc += lc(p[0]) + '?' + lc(p[1]) + ':'
  acc

lcIf2 = (xs) ->
  lcIf3 pair(xs)

lcIf1 = (xs) ->
  '(' + lcIf2(xs) + ')'

lcIf = (xs) ->
  if isEmpty(xs)
    ""
  else if xs.length == 1
    lc(xs[0])
  else
    lcIf1(xs)

(->
  orig = lc
  lc = (s) ->
    if isList(s) and s[0] is 'if'
      lcIf(s[1..])
    else orig(s)
)()

test('lc if #1', lc(['if']), "")
test('lc if #2', lc(['if', 'x']), "x")
test('lc if #3', lc(['if', 'x', 'y']), "(x?y:undefined)")
test('lc if #4', lc(['if', 'x', 'y', 'z']), "(x?y:z)")
test('lc if #5', lc(['if', 'x', 'y', 'z', 'a']), "(x?y:z?a:undefined)")

# lc do

lcDo1 = (xs) ->
  acc = ""
  each xs, (x) ->
    acc += ',' + lc(x)
  acc

lcDo = (xs) ->
  if isEmpty(xs)
    ""
  else lc(xs[0]) + lcDo1(xs[1..])

(->
  orig = lc
  lc = (s) ->
    if isList(s) and s[0] is 'do'
      lcDo(s[1..])
    else orig(s)
)()

test('lc do #1', lc(['do']), "")
test('lc do #2', lc(['do', 'x']), "x")
test('lc do #3', lc(['do', 'x', 'y']), "x,y")
test('lc do #4', lc(['do', 'x', 'y', 'z']), "x,y,z")

# lc fn

lcFn4 = (xs) ->
  if isEmpty(xs)
    ""
  else 'return ' + lcDo(xs) + ';'

lcFn3 = (xs) -> lcDo(xs)

lcFn2 = (args, body) ->
  'function' + '(' + lcFn3(args) + ')' + '{' + lcFn4(body) + '}'

lcFn1 = (xs) ->
  lcFn2(xs[0], xs[1..])

lcFn = (xs) ->
  '(' + lcFn1(xs) + ')'

(->
  orig = lc
  lc = (s) ->
    if isList(s) and s[0] is 'fn'
      lcFn(s[1..])
    else orig(s)
)()

test('lc fn #1', lc(['fn', []]), "(function(){})")
test('lc fn #2', lc(['fn', ['x']]), "(function(x){})")
test('lc fn #3', lc(['fn', ['x'], 'x']), "(function(x){return x;})")
test('lc fn #4', lc(['fn', ['x', 'y'], 'x']), "(function(x,y){return x;})")
test('lc fn #5', lc(['fn', ['x'], 'x', 'y']), "(function(x){return x,y;})")
test('lc fn #6', lc(['fn', ['x', 'y'], 'x', 'y']), "(function(x,y){return x,y;})")

## Reader

# t stands for token
atom = (t) ->
  if t.match /^\d+\.?$/
    parseInt t
  else if t.match /^\d*\.\d+$/
    parseFloat t
  else
    t

readFrom = (ts) ->
  t = ts.shift()
  if t == '('
    acc = []
    while ts[0] != ')'
      acc.push readFrom(ts)
    ts.shift() # pop off ')'
    acc
  else
    atom t

tokenize = (s) ->
  spaced = s.replace(/\(/g,' ( ').replace(/\)/g,' ) ').split(' ')
  without spaced, ''  # purge of empty string tokens

read = (s) ->
  readFrom tokenize(s)

parse = read

test('parse #1', parse('x'), 'x')
test('parse #2', parse('(x)'), ['x'])
test('parse #3', parse('(x y)'), ['x', 'y'])
test('parse #4', parse('((x) y)'), [['x'], 'y'])

## Interface

lava = (s) -> lc parse(s)

test('lava #1', lava('x'), 'x')
test('lava #2', lava('(+ x y)'), 'x+y')
test('lava #3', lava('(do x y)'), 'x,y')
test('lava #4', lava('(fn (x y) x y)'), '(function(x,y){return x,y;})')

repl8 = (x) -> '> '

repl7 = (x) ->
  '=> ' + eval(x) + '\n' + repl8(x)

repl6 = (x) ->
  x + '\n' + repl7(x)

repl5 = (x) ->
  stdout.write repl6(x)

repl4 = (x) ->
  repl5 lava(x)

repl3 = ->
  stdin.on 'data', repl4

repl2 = ->
  stdout.write '> '
  repl3()

repl1 = ->
  # makes return a string instead of a stream (?)
  stdin.setEncoding('utf8')
  repl2()

# used as a guide to write this:
# http://nodejs.org/docs/v0.4.0/api/process.html#process.stdin
repl = ->
  # stdin is paused by default, so this resumes it
  stdin.resume()
  repl1()

repl()
