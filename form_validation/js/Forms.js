const usernameEl = document.querySelector ("#username");
const emailEl = document.querySelector ("#email");
const passwordEl = document.querySelector ("#password");
const confirmPasswordEl = document.querySelector("#confirm-password");


const isRequired =
    value =>
        !(value === "");


const isBetween =
    (length, min, max) =>
        !(length < min || length > max)


const isEmailValid =
    email =>
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test (email);


const isPasswordSecure =
    password =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test (password);


const checkUsername =
    (min = 3, max = 25) =>
        (username =>
            !isRequired (username) ? [ false, "You may not leave the username blank." ]
                                   : !isBetween (username.length, min, max) ? [ false, `Your username must be between ${min} and ${max} characters.` ]
                                                                            : [ true, null ]
        ) (usernameEl.value.trim ());


const checkEmail =
    () =>
        (email =>
            !isRequired (email) ? [ false, "You may not leave the email blank." ]
                                : !isEmailValid (email) ? [ false, "The email you entered is not correctly formatted." ]
                                                        : [ true, null ]
        ) (emailEl.value.trim ());


const checkPassword =
    () =>
        (password =>
            !isRequired (password) ? [ false, "You may not leave the password blank." ]
                                   : !isPasswordSecure (password) ? [ false, "Your password must have at least 8 characters that include at least 1 lowercase character, 1 uppercase character, 1 number, and 1 special character" ]
                                                                  : [ true, null ]
        ) (passwordEl.value.trim ());


const checkConfirmPassword =
    () =>
        (confirmPassword => password =>
            !isRequired (confirmPassword) ? [ false, "Please enter your password again." ]
                                          : password !== confirmPassword ? [ false, "The password does not match the confirmed password" ]
                                                                         : [ true, null ]
        ) (confirmPasswordEl.value.trim ()) (passwordEl.value.trim ());
