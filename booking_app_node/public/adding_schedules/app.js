const MSGS =
    { SET_UP: "SET_UP"
    , RESET: "RESET"
    , ADD_SCHEDULE: "ADD_SCHEDULE"
    , FINISHED_ADDITION: "FINISHED_ADDITION"
    , POST_SCHEDULE: "POST_SCHEDULE"
    , POST_SCHEDULE_SUCCESS: "POST_SCHEDULE_SUCCESS"
    , POST_SCHEDULE_FAILURE: "POST_SCHEDULE_FAILURE"
    , GET_STAFF_SUCCESS: "GET_STAFF_SUCCESS"
    };


const init =
    { model: { form: null
             , reset: false
             , addSchedule: true
             , schedCount: 1
             , staff: null
             , alert: ""
             , formData: null
             }
    , command: getStaff ()
    };


function view (dispatch, model) {
    const schedules = document.getElementById ("schedules");

    if (model.staff && model.addSchedule) {
        const schedule =
            div ([ "class=schedule"])
                ([ div ([ "class=item" ])
                       ([ p ([]) ([ text ("Date") ])
                        , input ([ "type=date", "name=bdate_" + model.schedCount ]) ([])
                       ])
                 , div ([ "class=item" ])
                       ([ p ([]) ([ text ("Time") ])
                        , input ([ "type=time", "name=btime_" + model.schedCount ]) ([])
                       ])
                 , div ([ "class=item" ])
                       ([ p ([]) ([ text ("Select Staff") ])
                        , select ([ "name=bstaff_" + model.schedCount ])
                              ( model.staff.map ( ele =>
                                                      option ([ "value=" + ele.id ])
                                                          ([ text (ele.name) ]) ) )
                       ])
                ]);
        schedules.appendChild (schedule);
        dispatch ({ type: MSGS.FINISHED_ADDITION });
    }

    if (model.alert) alert (model.alert);

    if (model.reset) {
        empty (schedules);
        model.form.reset ();
        dispatch ({ type: MSGS.RESET });
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.SET_UP: {
            model.form = document.querySelector ("form");
            return model;
        }

        case MSGS.RESET: {
            model.reset = false;
            model.addSchedule = true;
            model.schedCount = 1;
            model.alert = "";
            model.formData = null;
            return model;
        }

        case MSGS.ADD_SCHEDULE: {
            model.addSchedule = true;
            model.schedCount = model.schedCount + 1;
            return model;
        }

        case MSGS.FINISHED_ADDITION: {
            model.addSchedule = false;
            return model;
        }

        case MSGS.POST_SCHEDULE: {
            msg.payload.preventDefault ();
            model.formData =
                { schedules: jsonOfForm (model, 1) };
            const command = postSchedule (model);
            return [ model, command ];
        }

        case MSGS.POST_SCHEDULE_SUCCESS: {
            model.alert = msg.payload;
            model.reset = true;
            return model;
        }

        case MSGS.POST_SCHEDULE_FAILURE: {
            model.alert = msg.payload;
            model.reset = true;
            return model;
        }

        case MSGS.GET_STAFF_SUCCESS: {
            model.staff = msg.payload;
            return model;
        }

        default: {
            return model;
        }
    }

}


function events (dispatch) {
    document.addEventListener ("DOMContentLoaded", e => {
        dispatch ({ type: MSGS.SET_UP, payload: e })

        document.getElementById ("addMoreBtn")
                .addEventListener ("click", e => dispatch ({ type: MSGS.ADD_SCHEDULE, payload: e }));

        document.querySelector ("form")
                .addEventListener ("submit", e => dispatch ({ type: MSGS.POST_SCHEDULE, payload: e }));
    });
}


// HTTP COMMANDS

function getStaff () {
    return { request: { url: "/api/staff_members"
                      , method: "GET"
                      }
           , successMsg: response => ({ type: MSGS.GET_STAFF_SUCCESS, payload: response })
           };
}


function postSchedule (model) {
    return { request: { url: model.form.action
                      , method: "POST"
                      , body: JSON.stringify (model.formData)
                      }
           , successMsg: response => ({ type: MSGS.POST_SCHEDULE_SUCCESS, payload: response })
           , failureMsg: response => ({ type: MSGS.POST_SCHEDULE_FAILURE, payload: response })
           };
}
