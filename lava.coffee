_ = require('underscore');

test = (name, x, expected) ->
  unless _(x).isEqual(expected)
    console.log "#{name} test failed"

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
