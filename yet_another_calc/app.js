const MSGS =
    { SET_UP_COMPLETE: "SET_UP_COMPLETE"
    , CE: "CE"
    , C: "C"
    , NEG: "NEG"
    , DIVIDE: "DIVIDE"
    , SEVEN: "SEVEN"
    , EIGHT: "EIGHT"
    , NINE: "NINE"
    , MULT: "MULT"
    , FOUR: "FOUR"
    , FIVE: "FIVE"
    , SIX: "SIX"
    , SUB: "SUB"
    , ONE: "ONE"
    , TWO: "TWO"
    , THREE: "THREE"
    , ADD: "ADD"
    , ZERO: "ZERO"
    , DOT: "DOT"
    , REM: "REM"
    , RESULT: "RESULT"
    };


const model =
    { setUpButtons: true
    , calculation: ""
    , current: "0"
    , result: null
    };


function view (dispatch, model) {
    const calculator = document.querySelector ("#calculator");

    if (model.setUpButtons) {
        const buttons =
            div ([ "id=buttons" ])
                ([ a ([ "href=#", "id=ce", "class=control", { onclick: e => dispatch ({ type: MSGS.CE, payload: e }) } ]) ([ text ("CE") ])
                 , text (" ")
                 , a ([ "href=#", "id=c", "class=control", { onclick: e => dispatch ({ type: MSGS.C, payload: e }) } ]) ([ text ("C") ])
                 , text (" ")
                 , a ([ "href=#", "id=neg", "class=control", { onclick: e => dispatch ({ type: MSGS.NEG, payload: e }) } ]) ([ text ("NEG") ])
                 , text (" ")
                 , a ([ "href=#", "class=op", { onclick: e => dispatch ({ type: MSGS.DIVIDE, payload: e }) } ]) ([ text ("/") ])
                 , text (" ")
                 , a ([ "href=#", "class=digit", { onclick: e => dispatch ({ type: MSGS.SEVEN, payload: e }) } ]) ([ text ("7") ])
                 , text (" ")
                 , a ([ "href=#", "class=digit", { onclick: e => dispatch ({ type: MSGS.EIGHT, payload: e }) } ]) ([ text ("8") ])
                 , text (" ")
                 , a ([ "href=#", "class=digit", { onclick: e => dispatch ({ type: MSGS.NINE, payload: e }) } ]) ([ text ("9") ])
                 , text (" ")
                 , a ([ "href=#", "class=op", { onclick: e => dispatch ({ type: MSGS.MULT, payload: e }) } ]) ([ text ("*") ])
                 , text (" ")
                 , a ([ "href=#", "class=digit", { onclick: e => dispatch ({ type: MSGS.FOUR, payload: e }) } ]) ([ text ("4") ])
                 , text (" ")
                 , a ([ "href=#", "class=digit", { onclick: e => dispatch ({ type: MSGS.FIVE, payload: e }) } ]) ([ text ("5") ])
                 , text (" ")
                 , a ([ "href=#", "class=digit", { onclick: e => dispatch ({ type: MSGS.SIX, payload: e }) } ]) ([ text ("6") ])
                 , text (" ")
                 , a ([ "href=#", "class=op", { onclick: e => dispatch ({ type: MSGS.SUB, payload: e }) } ]) ([ text ("-") ])
                 , text (" ")
                 , a ([ "href=#", "class=digit", { onclick: e => dispatch ({ type: MSGS.ONE, payload: e }) } ]) ([ text ("1") ])
                 , text (" ")
                 , a ([ "href=#", "class=digit", { onclick: e => dispatch ({ type: MSGS.TWO, payload: e }) } ]) ([ text ("2") ])
                 , text (" ")
                 , a ([ "href=#", "class=digit", { onclick: e => dispatch ({ type: MSGS.THREE, payload: e }) } ]) ([ text ("3") ])
                 , text (" ")
                 , a ([ "href=#", "class=op", { onclick: e => dispatch ({ type: MSGS.ADD, payload: e }) } ]) ([ text ("+") ])
                 , text (" ")
                 , a ([ "href=#", "class=digit", { onclick: e => dispatch ({ type: MSGS.ZERO, payload: e }) } ]) ([ text ("0") ])
                 , text (" ")
                 , a ([ "href=#", "class=dot", { onclick: e => dispatch ({ type: MSGS.DOT, payload: e }) } ]) ([ text (".") ])
                 , text (" ")
                 , a ([ "href=#", "class=op", { onclick: e => dispatch ({ type: MSGS.REM, payload: e }) } ]) ([ text ("%") ])
                 , text (" ")
                 , a ([ "href=#", "class=result_button", { onclick: e => dispatch ({ type: MSGS.RESULT, payload: e }) } ]) ([ text ("=") ])
                ]);

        calculator.append (buttons);

        dispatch ({ type: MSGS.SET_UP_COMPLETE });
    }

    else {
        const screen =
            div ([ "id=screen" ])
                ([ p ([ "class=calculation" ]) ([ text (model.calculation) ])
                 , p ([ "class=current_num" ]) ([ text (model.current) ])
                ]);

        if (calculator.children.length > 1)
            calculator.removeChild (document.querySelector ("#screen"));

        calculator.prepend (screen);
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.SET_UP_COMPLETE: {
            model.setUpButtons = false;
            return model;
        }

        case MSGS.CE: {
            msg.payload.preventDefault ();
            model.current = "0";
            return model;
        }

        case MSGS.C: {
            msg.payload.preventDefault ();
            model.current = "0";
            model.calculation = "";
            return model;
        }

        case MSGS.NEG: {
            msg.payload.preventDefault ();
            model.current =
                model.current[0] === "-" ? model.current.slice (1)
                                         : "-" + model.current;
            return model;
        }

        case MSGS.DIVIDE: {
            msg.payload.preventDefault ();
            model.calculation = model.current + " / ";
            model.current = "0";
            return model;
        }

        case MSGS.SEVEN: {
            msg.payload.preventDefault ();
            model.current =
                model.current === "0" || model.current === "Infinity" || model.current === "NaN" ? "7"
                                                                                                 : model.current + "7";
            return model;
        }

        case MSGS.EIGHT: {
            msg.payload.preventDefault ();
            model.current =
                model.current === "0" || model.current === "Infinity" || model.current === "NaN" ? "8"
                                                                                                 : model.current + "8";
            return model;
        }

        case MSGS.NINE: {
            msg.payload.preventDefault ();
            model.current =
                model.current === "0" || model.current === "Infinity" || model.current === "NaN" ? "9"
                                                                                                 : model.current + "9";
            return model;
        }

        case MSGS.MULT: {
            msg.payload.preventDefault ();
            model.calculation = model.current + " * ";
            model.current = "0";
            return model;
        }

        case MSGS.FOUR: {
            msg.payload.preventDefault ();
            model.current =
                model.current === "0" || model.current === "Infinity" || model.current === "NaN" ? "4"
                                                                                                 : model.current + "4";
            return model;
        }

        case MSGS.FIVE: {
            msg.payload.preventDefault ();
            model.current =
                model.current === "0" || model.current === "Infinity" || model.current === "NaN" ? "5"
                                                                                                 : model.current + "5";
            return model;
        }

        case MSGS.SIX: {
            msg.payload.preventDefault ();
            model.current =
                model.current === "0" || model.current === "Infinity" || model.current === "NaN" ? "6"
                                                                                                 : model.current + "6";
            return model;
        }

        case MSGS.SUB: {
            msg.payload.preventDefault ();
            model.calculation = model.current + " - ";
            model.current = "0";
            return model;
        }

        case MSGS.ONE: {
            msg.payload.preventDefault ();
            model.current =
                model.current === "0" || model.current === "Infinity" || model.current === "NaN" ? "1"
                                                                                                 : model.current + "1";
            return model;
        }

        case MSGS.TWO: {
            msg.payload.preventDefault ();
            model.current =
                model.current === "0" || model.current === "Infinity" || model.current === "NaN" ? "2"
                                                                                                 : model.current + "2";
            return model;
        }

        case MSGS.THREE: {
            msg.payload.preventDefault ();
            model.current =
                model.current === "0" || model.current === "Infinity" || model.current === "NaN" ? "3"
                                                                                                 : model.current + "3";
            return model;
        }

        case MSGS.ADD: {
            msg.payload.preventDefault ();
            model.calculation = model.current + " + ";
            model.current = "0";
            return model;
        }

        case MSGS.ZERO: {
            msg.payload.preventDefault ();
            model.current =
                model.current === "0" || model.current "-0" || model.current === "Infinity" || model.current === "NaN" ? "0"
                                                                                                                       : model.current + "0";
            return model;
        }

        case MSGS.DOT: {
            msg.payload.preventDefault ();
            if (!model.current.includes (".")) {
                model.current =
                    model.current === "Infinity" || model.current === "NaN" ? "0."
                                                                            : model.current + ".";
            }
            return model;
        }

        case MSGS.REM: {
            msg.payload.preventDefault ();
            model.calculation = model.current + " % ";
            model.current = "0";
            return model;
        }

        case MSGS.RESULT: {
            msg.payload.preventDefault ();
            model.result =
                eval (`${model.calculation} ${model.current}`);
            model.calculation = "";
            model.current =
                model.result.toString ();
            return model;
        }

        default: {
            return model;
        }
    }
}
