const MSGS =
    { GET_RND_INT: "GET_RND_INT"
    , GET_RND_INT_SUCCESS: "GET_RND_INT_SUCCESS"
    , REPLAY: "REPLAY"
    , INIT_RENDER_DONE: "INIT_RENDER_DONE"
    , GUESS: "GUESS"
    , GUESS_DONE: "GUESS_DONE"
    };


const init =
    { model: { words: [ "squishy"
                      , "jiggly"
                      , "puff"
                      , "discreet"
                      , "charm"
                      , "bourgeoisie"
                      , "mischievous"
                      , "chasm"
                      , "whiskey"
                      , "hotel"
                      , "yankee"
                      , "monosyllabic"
                      , "jazz"
                      , "golf"
                      , "tango"
                      , "uniform"
                      ]
             , selected: null
             , message: null
             , guessCount: 0
             , initialRender: false
             , spaces: null
             , goodBadOrNeither: "neither"
             , guess: null
             }
    , command: null
    };


function view (dispatch, model) {
    const letters = document.querySelector("#spaces");
    const guesses = document.querySelector ("#guesses");
    const apples = document.querySelector ("#apples");
    const message = document.querySelector ("#message");

    if (model.initialRender) {
        message.textContent = "";
        apples.classList.remove (...apples.classList);
        document.body.classList.remove (...document.body.classList);

        const spans =
            letters.querySelectorAll ("span");

        spans.forEach (span => {
            span.parentNode.removeChild (span);
        });

        const spaces =
            (Array.from ({ length: model.selected.length + 1 })).join ("<span></span>");

        letters.insertAdjacentHTML ("beforeend", spaces);

        if (guesses.children.length > 1)
            guesses.removeChild (guesses.lastChild);

        const choices =
            div ([])
                ("abcdefghijklmnopqrstuvwxyz"
                    .split ("")
                    .map (char =>
                              span ([ "id=" + char, { onclick: e => dispatch ({ type: MSGS.GUESS, payload: e }) } ])
                                  ([ text (char) ])));

        guesses.appendChild (choices);

        dispatch ({ type: MSGS.INIT_RENDER_DONE })
    }

    if (model.goodBadOrNeither === "good") {
        guesses.lastChild.removeChild (document.getElementById (model.guess));

        model.selected.split ("").forEach ((char, idx) => {
            if (model.guess === char)
                model.spaces[idx].textContent = char;
        });

        dispatch ({ type: MSGS.GUESS_DONE });
    }

    if (model.goodBadOrNeither === "bad") {
        guesses.lastChild.removeChild (document.getElementById (model.guess));

        apples.classList.add ("guess_" + model.guessCount);

        dispatch ({ type: MSGS.GUESS_DONE });
    }

    if (model.message) {
        message.textContent = model.message;

        while (letters.children.length > 1) {
            letters.removeChild (letters.lastChild);
        }

        if (guesses.children.length > 1)
            guesses.removeChild (guesses.lastChild);

        if (model.message === "You won!") {
            document.body.classList.add ("win");
        }

        else if (model.message === "You lost!") {
            document.body.classList.add ("lose");
        }

        else {
            document.querySelector ("#replay").classList.remove ("visible");
        }
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.GET_RND_INT: {
            const command = getRandomInt (model);
            return [ model, command ];
        }

        case MSGS.GET_RND_INT_SUCCESS: {
            if (model.words[msg.payload]) {
                model.selected = model.words[msg.payload];
                model.words =
                    [ ...model.words.slice (0, msg.payload)
                    , ...model.words.slice (msg.payload + 1)
                    ];
                model.initialRender = true;
            }

            else {
                model.message = "Sorry, I'm out of words";
            }

            return model;
        }

        case MSGS.INIT_RENDER_DONE: {
            model.initialRender = false;
            model.spaces = document.querySelectorAll ("#spaces span");
            return model;
        }

        case MSGS.GUESS: {
            if (model.selected.includes (msg.payload.target.textContent)) {
                model.goodBadOrNeither = "good";
                model.guess = msg.payload.target.textContent;
            }

            else {
                model.goodBadOrNeither = "bad";
                model.guess = msg.payload.target.textContent;
                model.guessCount = model.guessCount + 1;
                model.message =
                    model.guessCount === 6 ? "You lost!"
                                           : null;
            }

            return model;
        }

        case MSGS.GUESS_DONE: {
            if (model.goodBadOrNeither === "good") {
                model.message =
                    model.selected === Array.from (model.spaces, span => span.textContent).join ("") ? "You won!"
                                                                                                     : null;
            }

            model.goodBadOrNeither = "neither";

            return model;
        }

        case MSGS.REPLAY: {
            msg.payload.preventDefault ();
            model.message = null;
            model.selected = null;
            model.guessCount = 0;
            model.goodBadOrNeither = "neither";
            return update ({ type: MSGS.GET_RND_INT }, model);
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.addEventListener ("DOMContentLoaded", e => dispatch ({ type: MSGS.GET_RND_INT, payload: e }));

    document.querySelector ("#replay")
            .addEventListener ("click", e => dispatch ({ type: MSGS.REPLAY, payload: e }));
}


function getRandomInt (model) {
    return { request: { min: 0
                      , max: model.words.length - 1
                      }
           , successMsg: resp => ({ type: MSGS.GET_RND_INT_SUCCESS, payload: resp })
           };
}
