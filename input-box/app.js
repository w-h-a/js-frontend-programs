const MSGS =
    { CLICKED_FIELD: "CLICKED_FIELD"
    , CLICKED_ELSE: "CLICKED_ELSE"
    , TYPING: "TYPING"
    };


const model =
    { isFocused: false
    , focusTarget: null
    , cursor: null
    , content: ""
    };


function view (model) {
    if (model.isFocused) {
        if (model.focusTarget) {
            model.focusTarget.classList.add ("focused");
        }

        document.querySelectorAll (".content")[0]
                .textContent = model.content;
    }

    else {
        if (model.focusTarget) {
            model.focusTarget.classList.remove ("focused");
            model.focusTarget.classList.remove ("cursor");
        }
    }
}


function update (msg, model) {
    const newModel = JSON.parse (JSON.stringify (model));

    newModel.focusTarget =
        document.querySelectorAll (".text-field")[0];

    switch (msg.type) {
        case MSGS.CLICKED_FIELD: {
            msg.payload.stopPropagation ();

            newModel.isFocused = true;

            newModel.cursor =
                newModel.cursor || setInterval (() => newModel.focusTarget.classList.toggle ("cursor"), 500);

            return newModel;
        }

        case MSGS.CLICKED_ELSE: {
            newModel.isFocused = false;

            clearInterval (newModel.cursor);

            newModel.cursor = null;

            return newModel;
        }

        case MSGS.TYPING: {
            if (newModel.isFocused) {
                if (msg.payload.key === "Backspace") {
                    newModel.content =
                        newModel.content.slice (0, newModel.content.length - 1);
                }

                else if (msg.payload.key.length === 1) {
                    newModel.content =
                        newModel.content + msg.payload.key;
                }
            }

            return newModel;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.addEventListener ("DOMContentLoaded", () => {
        document.querySelectorAll (".text-field")[0]
                .addEventListener ("click", e => dispatch ({ type: MSGS.CLICKED_FIELD, payload: e }));

        document.addEventListener ("click", e => dispatch ({ type: MSGS.CLICKED_ELSE, payload: e }));

        document.addEventListener ("keydown", e => dispatch ({ type: MSGS.TYPING, payload: e }));
    });
}
