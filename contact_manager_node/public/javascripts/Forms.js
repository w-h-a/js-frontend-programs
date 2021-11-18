const isRequired =
    value =>
        !(value === "");


const isEmailValid =
    email =>
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test (email);


const isTelValid =
    tel =>
        tel === "" || /^\d{10}$/.test (tel);


function checkForm (form) {
    if (!isRequired (form[0].value)) {
        return [ false, "You may not leave the name field blank." ];
    }
    else if (!isEmailValid (form[1].value)) {
        return [ false, "The email you entered is not correctly formatted." ];
    }
    else if (!isTelValid (form[2].value)) {
        return [ false, "The phone number you entered is not correctly formatted." ];
    }
    else {
        return [ true, null ];
    }
}
