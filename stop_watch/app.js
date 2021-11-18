// ht to Julia Martin

const MSGS =
    { HOURS: "HOURS"
    , MINS: "MINS"
    , SECS: "SECS"
    , CENTS: "CENTS"
    , STOP: "STOP"
    , RESET: "RESET"
    };


const model =
    { counters: [ 0, 0, 0, 0 ]
    , render: ""
    , id: null
    , idx: null
    };


function view (model) {
    const startStopBtn = document.getElementById ("start-stop");

    switch (model.render) {
        case "Start": {
            startStopBtn.textContent =
                startStopBtn.textContent === "Stop" ? startStopBtn.textContent
                                                    : "Stop";

            document.getElementById (model.id).textContent =
                model.counters[model.idx].toString ()
                                         .padStart (2, "0");

            break;
        }

        case "Stop": {
            startStopBtn.textContent = "Start";

            break;
        }

        case "Reset": {
            startStopBtn.textContent = "Start";

            document.querySelectorAll (".counter")
                    .forEach (ele => ele.textContent = "00");

            break;
        }
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.HOURS: {
            model.id = "hours";

            model.idx = 0;

            model.counters[model.idx] =
                model.counters[model.idx] + 1;

            model.counters[model.idx] =
                model.counters[model.idx] === 100 ? 0
                                                  : model.counters[model.idx];

            return model;
        }

        case MSGS.MINS: {
            model.id = "minutes";

            model.idx = 1;

            model.counters[model.idx] =
                model.counters[model.idx] + 1;

            model.counters[model.idx] =
                model.counters[model.idx] === 60 ? 0
                                                 : model.counters[model.idx];

            return model;
        }

        case MSGS.SECS: {
            model.id = "seconds";

            model.idx = 2;

            model.counters[model.idx] =
                model.counters[model.idx] + 1;

            model.counters[model.idx] =
                model.counters[model.idx] === 60 ? 0
                                                 : model.counters[model.idx];

            return model;
        }

        case MSGS.CENTS: {
            model.render = "Start";

            model.id = "centiseconds";

            model.idx = 3;

            model.counters[model.idx] =
                model.counters[model.idx] + 1;

            model.counters[model.idx] =
                model.counters[model.idx] === 100 ? 0
                                                  : model.counters[model.idx];

            return model;
        }

        case MSGS.STOP: {
            model.render = "Stop";

            return model;
        }

        case MSGS.RESET: {
            model.render = "Reset";

            model.counters =
                [ 0, 0, 0, 0 ];

            return model;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    let hourTimer;
    let minuteTimer;
    let secondsTimer;
    let centisecTimer;
    const startStopBtn = document.getElementById ("start-stop");
    const reset = document.getElementById ("reset");

    startStopBtn.addEventListener ("click", e => {
        switch (e.target.textContent) {
            case "Start": {
                hourTimer = setInterval (() => dispatch ({ type: MSGS.HOURS }), 1000 * 60 * 60);

                minuteTimer = setInterval (() => dispatch ({ type: MSGS.MINS }), 1000 * 60);

                secondsTimer = setInterval (() => dispatch ({ type: MSGS.SECS }), 1000);

                centisecTimer = setInterval (() => dispatch ({ type: MSGS.CENTS }), 10);

                break;
            }

            default: {
                stop ();

                dispatch ({ type: MSGS.STOP });

                break;
            }
        }
    });

    reset.addEventListener ("click", e => {
        stop ();

        dispatch ({ type: MSGS.RESET });
    });


    function stop () {
        [ hourTimer, minuteTimer, secondsTimer, centisecTimer ].forEach (timer => clearInterval (timer));
    }
}
