const MSGS =
    { COUNTDOWN: "COUNTDOWN" };


const model =
    { time: {} };


function view (model) {
    const format =
        t =>
            t < 10 ? "0" + t
                   : t;
    const timer = document.querySelector (".countdown-timer");
    const countdown =
        div ([ "class=count-down" ])
            ([ div ([ "class=timer" ])
                   ([ h2 ([ "class=days" ]) ([ text (`${format (model.time.days)}`) ])
                    , small ([]) ([ text ("Days") ])
                   ])
             , div ([ "class=timer" ])
                    ([ h2 ([ "class=hours" ]) ([ text (`${format (model.time.hours)}`) ])
                     , small ([]) ([ text ("Hours") ])
                    ])
             , div ([ "class=timer" ])
                    ([ h2 ([ "class=minutes" ]) ([ text (`${format (model.time.minutes)}`) ])
                     , small ([]) ([ text ("Minutes") ])
                    ])
             , div ([ "class=timer" ])
                    ([ h2 ([ "class=seconds" ]) ([ text (`${format (model.time.seconds)}`) ])
                     , small ([]) ([ text ("Seconds") ])
                    ])
            ]);
    empty (timer)
    timer.appendChild (countdown);
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.COUNTDOWN: {
            model.time = { days: Math.floor (msg.payload / 1000 / 60 / 60 / 24)
                         , hours: Math.floor (msg.payload / 1000 / 60 / 60) % 24
                         , minutes: Math.floor (msg.payload / 1000 / 60) % 60
                         , seconds: Math.floor (msg.payload / 1000) % 60
                         };
            return model;
        }
        default: {
            return model;
        }
    }
}


function events (dispatch) {
    let currentTime = new Date ().getTime ();
    let timeRemaining = new Date ("May 13 2022 00:00:00").getTime () - currentTime;

    if (timeRemaining > 0) {
        start ();
    }
    else {
        complete ();
    }

    function start () {
        setTimeout (function go () {
            timeRemaining -= 1000;
            if (timeRemaining <= 0) {
                complete ();
            }
            else {
                dispatch ({ type: MSGS.COUNTDOWN, payload: timeRemaining });
                setTimeout (go, 1000);
            }
        }, 1000);
    }

    function complete () {

    }
}
