module Main exposing (..)

import Html exposing (..)
import Material
import Material.Scheme
import Material.Button as Button
import Material.Color as Color
import Material.Options as Options


type Msg
    = NoOp
    | ChangeColor Color.Hue
    | Mdl (Material.Msg Msg)


type alias Model =
    { bgColor : Color.Hue
    , fontSize : Float
    , mdl : Material.Model
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
    Model Color.Teal 24 Material.model


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeColor col ->
            { model | bgColor = col } ! []

        Mdl msg_ ->
            Material.update Mdl msg_ model

        _ ->
            model ! []


view : Model -> Html Msg
view model =
    div []
        (List.indexedMap (,) [ Color.Red, Color.Teal, Color.Blue ]
            |> List.map (buttons model)
        )
        |> Material.Scheme.topWithScheme model.bgColor Color.Pink


buttons : Model -> ( Int, Color.Hue ) -> Html Msg
buttons model ( index, color ) =
    Button.render
        Mdl
        [ index ]
        model.mdl
        [ Button.ripple
        , Button.colored
        , Button.raised
        , Options.onClick <| ChangeColor color
        ]
        [ text <| toString color ]
