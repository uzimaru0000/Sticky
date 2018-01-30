port module Port exposing (focus, createNewWindow)


port focus_ : () -> Cmd msg


port createNewWindow_ : () -> Cmd msg


focus : Cmd msg
focus =
    focus_ ()


createNewWindow : Cmd msg
createNewWindow =
    createNewWindow_ ()
