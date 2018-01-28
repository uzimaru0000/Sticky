port module Port exposing (focus)


port focus_ : () -> Cmd msg


focus : Cmd msg
focus =
    focus_ ()
