const MSGS =
    { POST_STAFF: "POST_STAFF"
    , POST_STAFF_SUCCESS: "POST_STAFF_SUCCESS"
    , POST_STAFF_ERROR: "POST_STAFF_ERROR"
    , DOM_LOAD: "DOM_LOAD"
    , RESET: "RESET"
    };


const init =
    { model: { alert: null
             , form: null
             , reset: false
             }
    , command: null
    };


function view (dispatch, model) {
    if (model.alert) alert (model.alert);

    if (model.reset) {
        model.form.reset ();
        dispatch ({ type: MSGS.RESET });
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.POST_STAFF: {
            msg.payload.preventDefault ();
            model.alert = "Sending...";
            const command = postStaff (model);
            return [ model, command ];
        }

        case MSGS.POST_STAFF_SUCCESS: {
            model.alert = "Successfully created staff with id: " + msg.payload.id;
            model.reset = true;
            return model;
        }

        case MSGS.POST_STAFF_ERROR: {
            model.alert = msg.payload;
            return model;
        }

        case MSGS.DOM_LOAD: {
            model.form = document.querySelector ("form");
            return model;
        }

        case MSGS.RESET: {
            model.alert = null;
            model.reset = false;
            return model;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.addEventListener ("DOMContentLoaded", e => dispatch ({ type: MSGS.DOM_LOAD, payload: e }));

    document.querySelector ("form")
            .addEventListener ("submit", e => dispatch ({ type: MSGS.POST_STAFF, payload: e }));
}


// HTTP COMMANDS

function postStaff (model) {
    return { request: { url: model.form.action
                      , method: "POST"
                      , headers: {}
                      , body: new FormData (model.form)
                      }
           , successMsg: response => ({ type: MSGS.POST_STAFF_SUCCESS, payload: response })
           , errorMsg: err => ({ type: MSGS.POST_STAFF_ERROR, payload: err })
           };
}
