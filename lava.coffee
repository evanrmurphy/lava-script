### Copyright 2011 Evan R. Murphy
###
### About this code:
### - No code depends on code below it (see
###   http://awwx.posterous.com/how-to-future-proof-your-code
###   for a compelling post on the idea)
### - Unit tests are inline, i.e. functions
###   are tested immediately after they're
###   defined
### - It's organized into 4 sections:
###    1) Preliminary,
###    2) Reader
###    3) Compiler
###    4) Interface
###


## Preliminary

_ = require 'underscore'

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
  spaced = s.replace( /\(/g , ' ( ')
            .replace( /\)/g , ' ) ')
            .split ' '
  without spaced, ''  # purge of empty string tokens

read = (s) ->
  readFrom tokenize(s)

parse = read

test('parse #1', parse('x'), 'x')
test('parse #2', parse('(x)'), ['x'])
test('parse #3', parse('(x y)'), ['x', 'y'])
test('parse #4', parse('((x) y)'), [['x'], 'y'])

## Compiler (lc)

# lc is built up iteratively here, one
# conditional at a time. lc is defined
# with a single conditional, tested, and
# then redefined with a second conditional.
# Each redefinition extends upon the previous
# definition, essentially by hand-generating
# the macro-expansion of the arc macro,
# extend (http://awwx.ws/extend).


lc = ->

lava = (s) -> lc parse(s)

# atom

lc = (s) ->
  if isAtom(s) then s

test('atom #1', lava('x'), 'x')

# proc

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

test('proc #1', lava('(foo)'), 'foo()')
test('proc #2', lava('(foo x)'), 'foo(x)')
test('proc #3', lava('(foo x y)'), 'foo(x,y)')

# infix

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

test('infix #1', lava('(+ x y)'), "x+y")
test('infix #2', lava('(+ x y z)'), "x+y+z")
test('infix #3', lava('(- x y)'), "x-y")
test('infix #4', lava('(* x y)'), "x*y")
test('infix #5', lava('(% x y)'), "x%y")

test('infix #6', lava('(>= x y)'), "x>=y")
test('infix #7', lava('(<= x y)'), "x<=y")
test('infix #8', lava('(> x y)'), "x>y")
test('infix #9', lava('(< x y)'), "x<y")
test('infix #10', lava('(== x y)'), "x==y")
test('infix #11', lava('(=== x y)'), "x===y")
test('infix #12', lava('(!= x y)'), "x!=y")
test('infix #13', lava('(!== x y)'), "x!==y")

test('infix #14', lava('(= x y)'), "x=y")
test('infix #15', lava('(+= x y)'), "x+=y")
test('infix #16', lava('(-= x y)'), "x-=y")
test('infix #17', lava('(*= x y)'), "x*=y")
test('infix #18', lava('(/= x y)'), "x/=y")
test('infix #19', lava('(%= x y)'), "x%=y")

test('infix #20', lava('(&& x y)'), "x&&y")
test('infix #21', lava('(|| x y)'), "x||y")

# obj

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

test('obj #1', lava('(obj)'), "{}")
test('obj #2', lava('(obj x y)'), "{x:y}")
test('obj #3', lava('(obj x y z a)'), "{x:y,z:a}")
test('obj #4', lava('(obj x y z (+ x y))'), "{x:y,z:x+y}")

# array

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

test('array #1', lava('(array)'), "[]")
test('array #2', lava('(array x)'), "[x]")
test('array #3', lava('(array x y)'), "[x,y]")
test('array #4', lava('(array x (array y))'), "[x,[y]]")

# ref

lcRef = (xs) ->
  [h, k] = xs
  lc(h) + '[' + lc(k) + ']'

(->
  orig = lc
  lc = (s) ->
    if isList(s) and s[0] is 'ref'
      lcRef(s[1..])
    else orig(s)
)()

test('ref #1', lava('(ref x y)'), "x[y]")

# dot

lcDot = (xs) ->
  [h, k] = xs
  lc(h) + '.' + lc(k)

(->
  orig = lc
  lc = (s) ->
    if isList(s) and s[0] is 'dot'
      lcDot(s[1..])
    else orig(s)
)()

test('dot #1', lava('(dot x y)'), "x.y")

# if

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

test('if #1', lava('(if)'), "")
test('if #2', lava('(if x)'), "x")
test('if #3', lava('(if x y)'), "(x?y:undefined)")
test('if #4', lava('(if x y z)'), "(x?y:z)")
test('if #5', lava('(if x y z a)'), "(x?y:z?a:undefined)")

# do

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

test('do #1', lava('(do)'), "")
test('do #2', lava('(do x)'), "x")
test('do #3', lava('(do x y)'), "x,y")
test('do #4', lava('(do x y z)'), "x,y,z")

# fn

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

test('fn #1', lava('(fn ())'), "(function(){})")
test('fn #2', lava('(fn (x))'), "(function(x){})")
test('fn #3', lava('(fn (x) x)'), "(function(x){return x;})")
test('fn #4', lava('(fn (x y) x)'), "(function(x,y){return x;})")
test('fn #5', lava('(fn (x) x y)'), "(function(x){return x,y;})")
test('fn #6', lava('(fn (x y) x y)'), "(function(x,y){return x,y;})")

# mac

macros = {}

lcMac1 = (name, definition) ->
  macros[name] = definition

lcMac = (xs) ->
  lcMac1 xs[0], xs[1..] # xs[1..]

(->
  orig = lc
  lc = (s) ->
    if isList(s) and s[0] is 'mac'
      lcMac(s[1..])
    else orig(s)
)()

lc(['mac', 'foo'])
test('mac #1', macros.foo, [])
macros = {}

lc(['mac', 'foo', ['x'], 'x'])
test('mac #2', macros.foo, [['x'], 'x'])
macros = {}

lc(['mac', 'foo', ['x', 'y'], 'x'])
test('mac #3', macros.foo, [['x', 'y'], 'x'])
macros = {}

lc(['mac', 'foo', ['x', 'y'], ['x', 'y']])
test('mac #4', macros.foo, [['x', 'y'], ['x', 'y']])
macros = {}

# quote

(->
  orig = lc
  lc = (s) ->
    if isList(s) and s[0] is 'quote'
      s[1]
    else orig(s)
)()

test('quote #1', lc(['quote', 'x']), 'x')
test('quote #2', lc(['quote', ['x']]), ['x'])
test('quote #3', lc(['quote', ['x', 'y']]), ['x', 'y'])

# macro-expand

bind = (parms, args, env={}) ->
  each parms, (parm, i) ->
    env[parm] = args[i]
  env

test('bind #1', bind([], []), {})
test('bind #2', bind(['x'], ['y']), {'x':'y'})
test('bind #3', bind(['x', 'z'], ['y', 'a']), {'x':'y', 'z':'a'})

macroExpand1 = (x, env) ->
  if isAtom x
    if (x of env) then env[x] else x
  else
    acc = []
    each x, (elt) ->
      acc.push macroExpand1(elt, env)
    acc

test('macroExpand1 #1', macroExpand1('x', {}), 'x')
test('macroExpand1 #2', macroExpand1('x', {'x':'y'}), 'y')
test('macroExpand1 #3', macroExpand1('x', {'x': ['a','b'] }), ['a','b'])
test('macroExpand1 #4', macroExpand1(['x', 'y'], {}), ['x','y'])
test('macroExpand1 #5', macroExpand1(['x', 'y'], {'x':'y'}), ['y','y'])
test('macroExpand1 #6', macroExpand1(['x', ['y', 'z']], {'z':'a'}), ['x', ['y', 'a']])

macroExpand = (name, args) ->
  [parms, body] = macros[name]
  env = bind(parms, args)
  macroExpand1 body, env

(->
  orig = lc
  lc = (s) ->
    if isList(s) and (s[0] of macros)
      lc macroExpand(s[0], s[1..])
    else orig(s)
)()

lc(['mac', 'foo', ['x'], 'x'])
test('macro-expand #1', lc(['foo', 'y']), 'y')
macros = {}

## Interface

lava = (s) -> lc parse(s)

test('lava #1', lava('x'), 'x')
test('lava #2', lava('(+ x y)'), 'x+y')
test('lava #3', lava('(do x y)'), 'x,y')
test('lava #4', lava('(fn (x y) x y)'), '(function(x,y){return x,y;})')

lava("(mac let1 (var val body)
        ((fn (var) body) val))")
test('lava #5', lava('(let1 x 5 x)'), '(function(x){return x;})(5)')
macros = {}

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
