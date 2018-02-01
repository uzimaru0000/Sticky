module Main exposing (..)

import Html exposing (..)
import Color exposing (..)


type Msg
    = NoOp


type alias Model =
    { bgColor : Color
    , fontSize : Float
    }


main : Program Never Model Msg
main =
    program
        { init = init ! []
        , update = update
        , view = view
        , subscriptions = always Sub.none
        }


init : Model
init =
    Model (rgb 238 238 238) 24


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    model ! []


view : Model -> Html Msg
view model =
    text ""
