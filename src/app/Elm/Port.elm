port module Port exposing (focus, createNewWindow, saveHook, save, PortData, close, changeWindowSize)

import Window exposing (..)


type alias PortData =
    { path : String
    , content : String
    }


port focus_ : () -> Cmd msg


port createNewWindow_ : () -> Cmd msg


port close_ : () -> Cmd msg


port save : PortData -> Cmd msg


port changeWindowSize : Size -> Cmd msg


port saveHook : (String -> msg) -> Sub msg


focus : Cmd msg
focus =
    focus_ ()


createNewWindow : Cmd msg
createNewWindow =
    createNewWindow_ ()


close : Cmd msg
close =
    close_ ()
