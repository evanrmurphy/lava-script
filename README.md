Copyright 2011 Evan R. Murphy

# LavaScript

A lispy language that compiles into JavaScript.

## Try LavaScript

You can now [try LavaScript in your web-browser](http://evanrmurphy.github.io/lava-script/). Many thanks to [Ross Angle](http://www.rocketnia.com/) (a.k.a. rocketnia) for implementing this!! He has also [made the source code available](https://gist.github.com/840809).

## Todo

LavaScript is incomplete. It still needs:

- rest parameters and unquote-splicing
- better reader (support strings!)
- npm packaging
- syntactic conveniences

        [1 2 3]             [1,2,3]
        {a 1 b 2}           {a:1,b:2}
        h.k  and (.k h)     h.k
        h[k] and ([k] h)    h[k]

- access to other features of javascript,
  like loops and try/catch
- more sophisticated macros, quasiquote or
  compile-time evaluation? see [arc forum
  thread](http://arclanguage.org/item?id=13740)
- pretty-printed output
- idiomatic output (semi-colon instead of comma)
- file extension: `.lava`, `.ls`, `.lavascript`?

## LavaScript Challenge

We're not there yet, but this could be LavaScript's entry into the [Arc Challenge](http://arclanguage.org/item?id=722), once the language gets sufficiently developed:

    ($ (fn ()
      (.html ($ 'body)
        (+ (<input>)
           (<button> "submit")))
      (.click ($ 'button) (fn ()
        (= said (.val ($ 'input) ()))
        (.html ($ 'body)
          (<a> href '#))
        (.click ($ 'a) (fn ()
          (.html ($ 'body)
            (+ "you said: " said))))))))

And the JavaScript output would be:

    $(function() {
      $('body').html(
        '<input></input>' +
        '<button>submit</button>');
      $('button').click(function() {
        said = $('input').val();
        $('body').html(
          '<a href="#">click here</a>');
        $('a').click(function() {
          $('body').html("you said: " + said);
        });
      });
    });

It depends on jQuery and a hypothetical HTML library that can generate strings like `'<tag attr1="val1">body</tag>'` from calls like `(<tag> attr1 'val1 "body")`.

Now, with a few macros to abstract away common jQuery patterns and a softer HTML lib, you could rewrite this more concisely. The macros:

    (mac ready body
      `($ (fn () ,@body)))
    
    (mac trigger (selector event args...)
      `(. ($ ,selector) (,event ,@args)))
    
    (mac draw body
      `(trigger 'body html 
        (+ ,@body)))
    
    (mac handler (selector event body...)
      `(trigger ,selector ,event (fn ()
        ,@body)))

And the rewrite:

    (ready
      (draw (input)
            (button "submit"))
      (handler 'button click
        (= said (trigger 'input val))
        (draw (a href '# "click here"))
        (handler 'a click
          (draw "you said: " said)))))))
