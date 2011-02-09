# LavaScript

A lispy language that compiles into JavaScript.

## Examples

Lava on the left, JS on the right:

  [1 2 3]                    [1, 2, 3]
  {a 1 b 2}                  {a: 1, b: 2}

  (cons 1 nil)               [1, nil]
  (cons 1 (cons 2 nil))      [1, [2, nil]]
  (list 1 2)                 [1, [2, nil]]
  '(1 2)                     [1, [2, nil]]

  (ref {a 1 b 2} 'a)         {a: 1, b: 2}['a']

  (fn (x) x)                 (function(x) { return x; })
  (def foo (x) x)            foo = function(x) { return x; }


  

