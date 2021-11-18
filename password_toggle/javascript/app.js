const MSGS =
    { SET_UP: "SET_UP"
    , TOGGLE: "TOGGLE"
    };


const model =
    { togglePassword: null
    , password: null
    , type: null
    };


function view (dispatch, model) {
    if (model.type) renderPassword (model);

    function renderPassword (model) {
        model.password.setAttribute ("type", model.type);
        model.togglePassword.classList.toggle ("bi-eye");
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.SET_UP: {
            model.togglePassword = document.querySelector ("#togglePassword");
            model.password = document.querySelector ("#password");
            return model;
        }

        case MSGS.TOGGLE: {
            model.type =
                model.password.getAttribute ("type") === "password" ? "text"
                                                                    : "password";
            return model;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.addEventListener ("DOMContentLoaded", () => dispatch ({ type: MSGS.SET_UP }));
    document.querySelector ("#togglePassword")
            .addEventListener ("click", e => {
                dispatch ({ type: MSGS.TOGGLE });
            });
    document.querySelector ("form")
            .addEventListener ("submit", e => {
                e.preventDefault ();
            });
}
