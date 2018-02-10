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
        , subscriptions = always <| Sub.batch [ resizes Resize, Port.saveHook SaveHook ]
        }


type Msg
    = Input String
    | Focus
    | Blur
    | Resize Size
    | SaveHook String
    | Close


type alias Model =
    { planeText : String
    , title : Maybe String
    , isFocus : Bool
    , size : Size
    }


init : Model
init =
    { planeText = ""
    , title = Nothing
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
                [ div [ class "btn ", onClick Close ] []
                , div
                    [ id "title"
                    , class <|
                        if model.isFocus then
                            "focused"
                        else
                            ""
                    ]
                    [ text <| Maybe.withDefault "" model.title ]
                ]
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
            { model | planeText = str, title = getTitle str } ! []

        Resize size ->
            { model | size = size } ! []

        SaveHook path ->
            model ! [ Port.save { path = path, content = model.planeText } ]

        Close ->
            model ! [ Port.close ]


getTitle : String -> Maybe String
getTitle str =
    String.split "\n" str
        |> List.head
