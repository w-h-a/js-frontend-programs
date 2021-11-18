const MSGS =
    { ALTER: "ALTER"
    , DONE: "DONE"
    };


const model =
    { parent: null
    , url: null
    , command: null
    };


function view (dispatch, model) {
    if (model.parent) {
        model.parent.classList.toggle ("active");

        if (model.url && model.url.length > 0) {
            document.execCommand (model.command, false, model.url);
        }

        else {
            document.execCommand (model.command);
        }

        dispatch ({ type: MSGS.DONE });
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.ALTER: {
            model.parent =
                msg.payload.target.parentElement;

            model.command =
                msg.payload.target.dataset.command;

            if (model.command === "createLink")
                model.url = prompt ("Enter the URL link to:");

            return model;
        }

        case MSGS.DONE: {
            model.url = null;

            model.parent = null;

            model.command = null;

            return model;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.querySelectorAll ("i")
            .forEach (icon => icon.addEventListener ("click", e => {
                dispatch ({ type: MSGS.ALTER, payload: e });
            }));
}
