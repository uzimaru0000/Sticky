module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Markdown as MD
import Window exposing (..)
import Task
import Port


main : Program Never Model Msg
main =
    program
        { init = init ! [ Task.perform Resize Window.size ]
        , update = update
        , view = view
        , subscriptions = always <| Sub.batch [ resizes Resize ]
        }


type Msg
    = Input String
    | Focus
    | Blur
    | Resize Size
    | CreateNewWindow


type alias Model =
    { planeText : String
    , isFocus : Bool
    , size : Size
    }


init : Model
init =
    { planeText = ""
    , isFocus = False
    , size = Size 0 0
    }


view : Model -> Html Msg
view model =
    let
        windowHeight =
            model.size.height - 24
    in
        div []
            [ div
                [ id "titleBar"
                , style
                    [ ( "background-color"
                      , if model.isFocus then
                            "#3e3e3e"
                        else
                            "#eee"
                      )
                    ]
                ]
                [ div [ class "btn", onClick CreateNewWindow ] [] ]
            , textarea
                [ id "inputArea"
                , class <|
                    if not model.isFocus then
                        "hide"
                    else
                        ""
                , style [ ( "height", (toString windowHeight) ++ "px" ) ]
                , onBlur Blur
                , onInput Input
                ]
                []
            , MD.toHtml
                [ id "md"
                , class <|
                    if model.isFocus then
                        "hide"
                    else
                        ""
                , onClick Focus
                , style [ ( "height", (toString windowHeight) ++ "px" ) ]
                ]
                model.planeText
            ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Focus ->
            { model | isFocus = True } ! [ Port.focus ]

        Blur ->
            { model | isFocus = False } ! []

        Input str ->
            { model | planeText = str } ! []

        Resize size ->
            { model | size = size } ! []

        CreateNewWindow ->
            model ! [ Port.createNewWindow ]
