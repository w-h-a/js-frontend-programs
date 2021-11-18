const MSGS =
    { SET_UP: "SET_UP"
    , LET_US_CALCULATE: "LET_US_CALCULATE"
    };


const model =
    { form: null
    , leftOperand: null
    , rightOperand: null
    , result: null
    };


function view (dispatch, model) {
    if (model.result) {
        document.querySelector ("#result").textContent = model.result;
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.SET_UP: {
            model.form = document.querySelector ("form");
            return model;
        }

        case MSGS.LET_US_CALCULATE: {
            msg.payload.preventDefault ();
            model.leftOperand = Number (model.form["first-number"].value);
            model.rightOperand = Number (model.form["second-number"].value);
            switch (model.form["operator"].value) {
                case "+": {
                    model.result = model.leftOperand + model.rightOperand;
                    break;
                }
                case "-": {
                    model.result = model.leftOperand - model.rightOperand;
                    break;
                }
                case "*": {
                    model.result = model.leftOperand * model.rightOperand;
                    break;
                }
                case "/": {
                    model.result = (model.leftOperand / model.rightOperand).toFixed (2);
                    break;
                }
            }
            return model;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.addEventListener ("DOMContentLoaded", e => dispatch ({ type: MSGS.SET_UP, payload: e }));
    document.querySelector ("form")
            .addEventListener ("submit", e => dispatch ({ type: MSGS.LET_US_CALCULATE, payload: e }));
}
