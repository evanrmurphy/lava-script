_ = require('underscore');

pr = (args...) -> console.log args...

test = (name, x, expected) ->
  unless _(x).isEqual(expected)
    pr "#{name} test failed"

t = 't'
nil = 'nil'

cons = (a, d) -> [a, d]

test('cons #1', cons(1, nil), [1, nil])

car = (xs) -> xs[0]

test('car #1', car(cons(1, nil)), 1)

cdr = (xs) -> xs[1]

test('cdr #1', cdr(cons(1, nil)), nil)

caar = (xs) -> car(car(xs))
cadr = (xs) -> car(cdr(xs))
cdar = (xs) -> cdr(car(xs))
cddr = (xs) -> cdr(cdr(xs))

caaar = (xs) -> car(car(car(xs)))
caadr = (xs) -> car(car(cdr(xs)))
cadar = (xs) -> car(cdr(car(xs)))
caddr = (xs) -> car(cdr(cdr(xs)))
cdaar = (xs) -> cdr(car(car(xs)))
cdadr = (xs) -> cdr(car(cdr(xs)))
cddar = (xs) -> cdr(cdr(car(xs)))
cdddr = (xs) -> cdr(cdr(cdr(xs)))

acons = (x) -> if _.isArray(x) then t else nil

test('acons #1', acons(nil), nil)
test('acons #2', acons(cons(1, nil)), t)

atom = (x) ->  if acons(x) is nil then t else nil

test('atom #1', atom(nil), t)
test('atom #2', atom(cons(1, nil)), nil)

len = (xs) ->
  if xs is nil then 0 else 1 + len(cdr(xs))

test('len #1', len(nil), 0)
test('len #2', len(cons(1, nil)), 1)
test('len #3', len(cons(1, cons(2, nil))), 2)

arraylist = (a) ->
  if a.length == 0
    nil
  else if a.length > 2 and a[1] is '.'
    cons a[0], a[2]
  else
    cons a[0], arraylist(a[1..])

test('arraylist #1', arraylist([]), nil)
test('arraylist #2', arraylist([1]), cons(1, nil))
test('arraylist #3', arraylist([1, 2]), cons(1, cons(2, nil)))
test('arraylist #4', arraylist([1, '.', 2]), cons(1, 2))

list = (args...) -> arraylist(args)

test('list #1', list(), nil)
test('list #2', list(1), cons(1, nil))
test('list #3', list(1, 2), cons(1, cons(2, nil)))

# the compiler

lc = (s) -> if atom(s) isnt nil then s

test('lc #1', lc(nil), nil)
test('lc #2', lc(5), 5)
test('lc #3', lc("abc"), "abc")

lcInfix1 = (op, xs) ->
  if xs is nil
    ""
  else "#{ op }#{ car(xs) }#{ lcInfix1 op, cdr(xs) }"

lcInfix = (op, xs) ->
  if xs is nil
    ""
  else "#{ car(xs) }#{ lcInfix1 op, cdr(xs) }"

orig = lc
lc = (s) ->
  if car(s) in ['+', '-', '*', '/']
    lcInfix(car(s), cdr(s))
  else orig(s)

test('lc #4', lc(list('+', 1, 2)), "1+2")
test('lc #5', lc(list('+', 1, 2, 3)), "1+2+3")
test('lc #6', lc(list('-', 1, 2)), "1-2")
test('lc #7', lc(list('*', 1, 2)), "1*2")
test('lc #8', lc(list('/', 1, 2)), "1/2")

