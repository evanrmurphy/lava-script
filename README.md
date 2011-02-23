# LavaScript

A lispy language that compiles into JavaScript.

## Try LavaScript

You can now [try LavaScript in your web-browser](http://rocketnia.kodingen.com/af/try-lava-script/). Many thanks to [Ross Angle](http://www.rocketnia.com/) (a.k.a. rocketnia) for implementing this!! He has also [made the source code available](https://gist.github.com/840809).


## Todo

LavaScript is incomplete. It still needs:

- rest parameters and unquote-splicing
- better reader (support strings!)
- npm packaging
- syntactic conveniences (like the dot operator)
- more sophisticated macros, quasiquote or
  compile-time evaluation? see [arc forum
  thread](http://arclanguage.org/item?id=13740)
- pretty-printed output
- idiomatic output (semi-colon instead of comma)

## LavaScript Challenge

We're not there yet, but this is LavaScript's hypothetical entry into the [Arc Challenge](http://arclanguage.org/item?id=722).

    ($ (fn ()
      (.html ($ 'body)
        (+ (<input>)
           (<button> "submit")))
      (.click ($ 'button) (fn ()
        (= said (. ($ 'input) (val)))
        (.html ($ 'body)
          (<a> href '#))
        (.click ($ 'a) (fn ()
          (.html ($ 'body)
            (+ "you said: " said))))))))

It depends on jQuery and a hypthetical HTML library that can generate the string '<tag attr1="val1">body</tag>' from (<tag> attr1 'val1 "body"). The JavaScript output would be:

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
