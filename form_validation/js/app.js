const MSGS =
    { SET_UP: "SET_UP"
    , USER_NAME: "USER_NAME"
    , EMAIL: "EMAIL"
    , PASSWORD: "PASSWORD"
    , CONFIRM_PASSWORD: "CONFIRM_PASSWORD"
    , POST_FORM: "POST_FORM"
    };


const model =
    { form: null
    , message: null
    , input: null
    , success: false
    , toRender: false
    };


function view (model) {
    if (model.success && model.form && model.toRender) {
        renderSuccess (model);
    }
    else if (model.form && model.toRender) {
        renderError (model);
    }

    function renderError (model) {
        const formField = model.form.elements[model.input].parentElement;
        formField.classList.remove ("success");
        formField.classList.add ("error");
        const error = formField.querySelector ("small");
        error.textContent = model.message;
    }

    function renderSuccess (model) {
        const formField = model.form.elements[model.input].parentElement;
        formField.classList.remove ("error");
        formField.classList.add ("success");
        const error = formField.querySelector ("small");
        error.textContent = "";
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.SET_UP: {
            model.form = document.querySelector ("#signup");
            return model;
        }

        case MSGS.USER_NAME: {
            model.success = msg.payload[0];
            model.input = 0;
            model.message = msg.payload[1];
            model.toRender = true;
            return model;
        }

        case MSGS.EMAIL: {
            model.success = msg.payload[0];
            model.input = 1;
            model.message = msg.payload[1];
            model.toRender = true;
            return model;
        }

        case MSGS.PASSWORD: {
            model.success = msg.payload[0];
            model.input = 2;
            model.message = msg.payload[1];
            model.toRender = true;
            return model;
        }

        case MSGS.CONFIRM_PASSWORD: {
            model.success = msg.payload[0];
            model.input = 3;
            model.message = msg.payload[1];
            model.toRender = true;
            return model;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    const form = document.querySelector ("#signup");

    document.addEventListener ("DOMContentLoaded", () => dispatch ({ type: MSGS.SET_UP }));

    form.addEventListener ("submit", e => {
        e.preventDefault ();
        const usernameResult = checkUsername ();
        dispatch ({ type: MSGS.USER_NAME, payload: usernameResult });
        const emailResult = checkEmail ();
        dispatch ({ type: MSGS.EMAIL, payload: emailResult });
        const passwordResult = checkPassword ();
        dispatch ({ type: MSGS.PASSWORD, payload: passwordResult });
        const confirmPasswordResult = checkConfirmPassword ();
        dispatch ({ type: MSGS.CONFIRM_PASSWORD, payload: confirmPasswordResult });
        if (usernameResult[0] && emailResult[0] && passwordResult[0] && confirmPasswordResult[0])
            dispatch ({ type: MSGS.POST_FORM });
    });

    form.addEventListener ("input", debounce (e => {
        switch (e.target.id) {
            case "username": {
                const usernameResult = checkUsername ();
                dispatch ({ type: MSGS.USER_NAME, payload: usernameResult });
                break;
            }
            case "email": {
                const emailResult = checkEmail ();
                dispatch ({ type: MSGS.EMAIL, payload: emailResult });
                break;
            }
            case "password": {
                const passwordResult = checkPassword ();
                dispatch ({ type: MSGS.PASSWORD, payload: passwordResult });
                break;
            }
            case "confirm-password": {
                const confirmPasswordResult = checkConfirmPassword ();
                dispatch ({ type: MSGS.CONFIRM_PASSWORD, payload: confirmPasswordResult });
                break;
            }
        }
    }));
}
