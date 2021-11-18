const MSGS =
    { POST: "POST"
    , SUCCESS: "SUCCESS"
    , SET_FORM: "SET_FORM"
    , WHOOPS: "WHOOPS"
    , ENTERING_DATA: "ENTERING_DATA"
    , FOCUS: "FOCUS"
    , FOCUS_DONE: "FOCUS_DONE"
    , OK: "OK"
    , RESET: "RESET"
    };


const init =
    { model: { form: null
             , formData: null
             , input: null
             , ok: false
             , creditCard: null
             , success: false
             }
    , command: null
    };


function view (dispatch, model) {
    const main = document.querySelector ("main");
    const serialized = document.getElementById ("serialized-form");

    if (model.input && model.input.hasOwnProperty ("err")) {
        model.input.e.currentTarget.style.borderColor = "red";
        model.input.e.currentTarget.parentElement.lastElementChild.textContent =
            model.input.err;

        if (main.firstChild.nodeName !== "P") {
            const msg =
                p ([ "id=message" ]) ([ text ("Please correct each form error before submitting") ]);
            main.prepend (msg);
        }
    }

    else if (model.input) {
        model.input.style.borderColor = "green";
        model.input.parentElement.lastElementChild.textContent = "";
    }

    if (model.ok && main.firstChild.nodeName === "P") {
        main.removeChild (main.firstChild);
    }

    if (model.creditCard && model.creditCard.value.length === 4) {
        model.creditCard.nextElementSibling.nextElementSibling.focus ();
        dispatch ({ type: MSGS.FOCUS_DONE });
    }

    if (model.formData) {
        if (serialized.lastChild.nodeName === "P") {
            serialized.removeChild (serialized.lastChild);
        }
        const formText =
            p ([]) ([ text (model.formData) ]);
        serialized.appendChild (formText);
    }

    if (model.success) {
        model.form.reset ();
        dispatch ({ type: MSGS.RESET });
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.SET_FORM: {
            model.form =
                document.querySelector ("form");

            return model;
        }

        case MSGS.WHOOPS: {
            model.input = msg.payload;
            model.ok = false;

            return model;
        }

        case MSGS.ENTERING_DATA: {
            model.input = msg.payload.currentTarget;

            return model;
        }

        case MSGS.OK: {
            model.ok = true;

            return model;
        }

        case MSGS.FOCUS: {
            model.creditCard = msg.payload.currentTarget;

            return model;
        }

        case MSGS.FOCUS_DONE: {
            model.creditCard = null;

            return model;
        }

        case MSGS.POST: {
            msg.payload.preventDefault ();

            model.formData = new FormData (model.form);
            const credit =
                model.formData.getAll ("credit_card");
            model.formData.delete ("credit_card");
            model.formData.set ("credit_card", credit.join (""));
            model.formData = new URLSearchParams ( ...[ model.formData ] );

            const command = postForm (model);

            return [ model, command ];
        }

        case MSGS.SUCCESS: {
            model.success = true;

            return model;
        }

        case MSGS.RESET: {
            model.success = false;
            model.formData = null;
            model.ok = false;
            model.creditCard = null;
            model.input = null;

            return model;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.addEventListener ('DOMContentLoaded', () => dispatch ({ type: MSGS.SET_FORM }));

    document.querySelectorAll ("input")
            .forEach (input => {
                input.addEventListener ("blur", e => {
                    const err = validateInput (e.currentTarget.name, e.currentTarget.value);
                    if (err) {
                        dispatch ({ type: MSGS.WHOOPS, payload: { e, err } });
                    }
                    else {
                        dispatch ({ type: MSGS.OK });
                    }
                });
                input.addEventListener ("focus", e => {
                    dispatch ({ type: MSGS.ENTERING_DATA , payload: e });
                });
            });

    document.getElementById ("first-name")
            .addEventListener ("keypress", preventNums);

    document.getElementById ("last-name")
            .addEventListener ("keypress", preventNums);

    document.getElementById ("phone")
            .addEventListener ("keypress", preventAlpha);

    document.querySelectorAll (".credit-card input")
            .forEach ((input, idx) => {
                input.addEventListener ("keypress", preventAlpha);
                if (idx < 3)
                    input.addEventListener ("keyup", e => dispatch ({ type: MSGS.FOCUS, payload: e }));
            });

    document.querySelector ("form")
            .addEventListener ("submit", e => dispatch ({ type: MSGS.POST, payload: e }));


    function preventNums (e) {
        if (!(/[a-z]/i).test (e.key) && e.key !== "Backspace")
            e.preventDefault ();
    }


    function preventAlpha (e) {
        if (!(/\d/).test (e.key) && e.key !== "Backspace")
            e.preventDefault ();
    }


    function validateInput (name, value) {
        switch (name) {
            case "first_name": {
                if (value.trim ().length === 0) return "First Name is a required field";
                break;
            }
            case "last_name": {
                if (value.trim ().length === 0) return "Last Name is a required field";
                break;
            }
            case "email": {
                if (value.trim ().length === 0) {
                    return "Email is a required field";
                }
                else if (!(/.+@.+/).test (value)) {
                    return "Please enter a correctly formatted email address";
                }
                break;
            }
            case "password": {
                if (value.trim ().length === 0) {
                    return "Password is a required field";
                }
                else if (value.length < 10) {
                    return "Your password is required to be at least 10 characters";
                }
                break;
            }
            case "phone": {
                if (!(/^\d{10}$/).test (value)) return "Please enter a correctly formatted phone number";
                break;
            }
            case "credit_card": {
                if (!(/^\d{4}$/).test (value)) return "Please enter a correctly formatted credit card number";
                break;
            }
        }
    }

}


// http command

function postForm (model) {
    return { request: { url: "/"
                      , method: "POST"
                      , body: model.formData
                      }
           , successsMsg: resp => ({ type: MSGS.POST_SUCCESS, payload: resp })
           };
}
