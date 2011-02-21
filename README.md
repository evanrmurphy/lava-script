# LavaScript

A lispy language that compiles into JavaScript.

## Todo

LavaScript is still incomplete. It needs:

- macros
- better reader (support strings!)
- npm packaging
- syntactic conveniences (like the dot operator)
- pretty-printed output
- idiomatic output (semi-colon instead of comma)

## The language

LS on the left, JS on the right in the examples below.

### Numbers

    1                          1
    42                         42
    3.14159265                 3.14159265

### Strings

    "a"                        "a"
    "do re mi"                 "do re mi"

(Strings are always double-quoted, because single-quotes are reserved for `quote`ed symbols.)

### Assignment

    (= meaning 42)             meaning = 42;

### Arrays

    (= a [1 2 3])              a = [1, 2, 3];

    ([0] a)                    a[0]
    (ref a 0)                  a[0]

### Objects

    (= o {a 1 b 2})            o = {a: 1, b: 2};
  
    o.a                        o.a
    (.a o)                     o.a
    (['a] o)                   o['a']
    (ref o 'a)                 o['a']

    (. foo bar)                foo.bar
    (. foo (bar))              foo.bar()
    ((. foo bar))              foo.bar()
    (. foo bar 1 2)            foo.bar(1, 2)
    (. foo (bar 1 2))          foo.bar(1, 2)

    (.bar foo)                 foo.bar
    (.bar (foo))               foo.bar()
    ((.bar foo))               foo.bar()
    (.bar foo 1 2)             foo.bar(1, 2)
    (.bar (foo 1 2))           foo.bar(1, 2)

    (.click ($ "a")            $("a").click(function() {
      (fn ()                     return alert("clicked");
        (alert "clicked")))    })();

### Functions
  
    (= add1 (fn (x) (+ x 1)))  add1 = function(x) { return x + 1; };

    (add1 5)                   add1(5);

    (def add2 (x) (+ x 2))     add2 = function(x) { return x + 2; };

### Chaining

    (.. ($ "a") click       $("a").click(function() {
      (fn ()                     return alert("clicked");
        (alert "clicked")))    })();

    (chain ($ "a") click       $("a").click(function() {
      (fn ()                     return alert("clicked");
        (alert "clicked")))    })();

### Macros

    (mac $ (selector . args)
      `(.. (jQuery ,selector) ,@args))

    ($ "a" click (fn ()        jQuery("a").click(function() {
      (alert "clicked"))         return alert("clicked");
                               })();



  

