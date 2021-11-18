const MSGS =
    { GET_SCHEDULES_SUCCESS: "GET_SCHEDULES_SUCCESS"
    , GET_SCHEDULES_ERROR: "GET_SCHEDULES_ERROR"
    , GET_SCHEDULES_FIN: "GET_SCHEDULES_FIN"
    };


const init =
    { model: { result: null
             , timedout: false
             , alert: null
             }
    , command: getSchedules ()
    };


function view (model) {
    const app = document.querySelector ("#app");

    if (model.result && !model.alert) {
        if (!model.timedout && Object.keys (model.result).length > 0) {
            app.appendChild ( ul ([]) ( Object.keys (model.result)
                                              .map (key =>
                                                       li ([])
                                                           ([ text (`staff ${key}: ${model.result[key]}`) ])) ) );
        }

        else {
            document.querySelector ("#none").textContent =
                model.result.message || "Thar be no schedules available.";
        }
    }

    if (model.alert) alert (model.alert);
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.GET_SCHEDULES_SUCCESS: {
            model.result =
                msg.payload.filter (sch =>
                                       sch.student_email === null)
                           .reduce ((acc, sch) =>
                                       ({ ...acc, [sch.staff_id]: ( acc[sch.staff_id] ? acc[sch.staff_id] + 1
                                                                                      : 1 ) }), {});

            return model;
        }

        case MSGS.GET_SCHEDULES_ERROR: {
            model.timedout = true;
            model.result = msg.payload;

            return model;
        }

        case MSGS.GET_SCHEDULES_FIN: {
            model.alert = msg.payload.message;

            return model;
        }

        default: {
            return model;
        }
    }
}


// HTTP COMMANDS

function getSchedules () {
    return { request: { url: "/api/schedules"
                      , method: "GET"
                      }
           , successMsg: response => ({ type: MSGS.GET_SCHEDULES_SUCCESS, payload: response })
           , errorMsg: err => ({ type: MSGS.GET_SCHEDULES_ERROR, payload: err })
           , finalMsg: obj => ({ type: MSGS.GET_SCHEDULES_FIN, payload: obj })
           };
}
