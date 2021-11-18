const MSGS =
    { SET_UP: "SET_UP"
    , ADD: "ADD"
    , RESET: "RESET"
    };


const model =
    { form: null
    , addTo: false
    , item: null
    , quant: null
    };


function view (dispatch, model) {
    const list = document.querySelector ("#grocery-list");

    if (model.addTo) {
        list.appendChild (li ([]) ([ text (`${model.quant} ${model.item}`) ]));

        model.form.reset ();

        dispatch ({ type: MSGS.RESET })
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.SET_UP: {
            model.form =
                document.querySelector ("form");

            return model;
        }

        case MSGS.ADD: {
            msg.payload.preventDefault ();

            model.addTo = true;

            model.item =
                model.form["name"].value;

            model.quant =
                model.form["quantity"].value || 1;

            return model;
        }

        case MSGS.RESET: {
            model.addTo = false;

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
            .addEventListener ("submit", e => dispatch ({ type: MSGS.ADD, payload: e }));
}
