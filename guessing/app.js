const MSGS =
    { GUESS: "GUESS"
    , RESTART: "RESTART"
    };


const model =
    { para: null
    , compChoice: null
    , playerChoice: null
    , submit: null
    , counter: null
    , reset: null
    };


function view (model) {
    document.querySelector ("p").textContent = model.para;

    if (!model.submit) {
        document.querySelector ("fieldset")
                .children[1].setAttribute ("disabled", "disabled");
    }

    else {
        document.querySelector ("fieldset")
                .children[1].removeAttribute ("disabled");
    }

    if (model.reset) document.querySelector ("form").reset ();
}


function update (msg, model) {
    const newModel = JSON.parse (JSON.stringify (model));

    switch (msg.type) {
        case MSGS.GUESS: {
            msg.payload.preventDefault ();

            newModel.reset = false;

            newModel.playerChoice =
                parseInt (document.getElementById ("guess").value, 10) || 0;

            if (newModel.compChoice > newModel.playerChoice) {
                newModel.counter = newModel.counter + 1;

                newModel.para =
                    "My integer is greater than " + newModel.playerChoice;
            }

            else if (newModel.compChoice < newModel.playerChoice) {
                newModel.counter = newModel.counter + 1;

                newModel.para =
                    "My integer is less than " + newModel.playerChoice;
            }

            else {
                newModel.counter = newModel.counter + 1;

                newModel.para =
                    "You guessed it in " + newModel.counter + " attempts!";

                newModel.submit = false;
            }

            return newModel;
        }

        case MSGS.RESTART: {
            msg.payload.preventDefault ();

            newModel.reset = true;
            newModel.para = "Guess an integer between 1 and 100.";
            newModel.compChoice = randomIntOfMinMax (1, 100);
            newModel.playerChoice = null;
            newModel.submit = true;
            newModel.counter = 0;

            return newModel;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.addEventListener ("DOMContentLoaded", e => {
        dispatch ({ type: MSGS.RESTART, payload: e });

        document.querySelector ("form")
                .addEventListener ("submit", e => dispatch ({ type: MSGS.GUESS, payload: e }));

        document.querySelector ("a")
                .addEventListener ("click", e => dispatch ({ type: MSGS.RESTART, payload: e }));
    });
}
