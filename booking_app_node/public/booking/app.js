const MSGS =
    { GET_SCHEDULES_SUCCESS: "GET_SCHEDULES_SUCCESS"
    , GET_STAFF_SUCCESS: "GET_STAFF_SUCCESS"
    , FINISHED_SCHEDULES: "FINISHED_SCHEDULES"
    , POST_BOOKING: "POST_BOOKING"
    , POST_BOOKING_SUCCESS: "POST_BOOKING_SUCCESS"
    , POST_BOOKING_FAILURE: "POST_BOOKING_FAILURE"
    , POST_STUDENT: "POST_STUDENT"
    , POST_STUDENT_SUCCESS: "POST_STUDENT_SUCCESS"
    , POST_STUDENT_FAILURE: "POST_STUDENT_FAILURE"
    , FINISHED_STUDENT: "FINISHED_STUDENT"
    , SET_UP: "SET_UP"
    , RESET: "RESET"
    , ALERT: "ALERT"
    };


const init =
    { model: { schedules: null
             , staff: null
             , isScheduleSet: false
             , bookingSequence: null
             , isStudentSet: false
             , bookingForm: null
             , bookingData: null
             , studentForm: null
             , studentData: null
             , toReset: false
             , alert: null
             , success: null
             }
    , command: getStaff ()
    };


function view (dispatch, model) {
    const app = document.getElementById ("app");
    const scheds = document.getElementById ("schedules");

    if (model.schedules && model.staff && !model.isScheduleSet) {
        scheds.appendChild (schedules (model));
        dispatch ({ type: MSGS.FINISHED_SCHEDULES });
    }

    if (model.bookingSequence && !model.isStudentSet) {
        app.appendChild (studentForm (model));
        dispatch ({ type: MSGS.FINISHED_STUDENT })
    }

    if (model.alert) {
        alert (model.alert);
        dispatch ({ type: MSGS.ALERT });
    }

    if (model.success) {
        alert (model.success);
        dispatch ({ type: MSGS.POST_BOOKING });
    }

    if (model.toReset) {
        model.bookingForm.reset ();
        if (app.children.length > 1) app.removeChild (app.lastChild);
        empty (scheds);
        dispatch ({ type: MSGS.RESET });
    }

    function nameOfId (staffList, idNum) {
        return staffList[0].id === idNum ? staffList[0].name
                                         : nameOfId (staffList.slice (1), idNum);
    }

    function schedules (model) {
        return select ([ "id=schedule" ])
                   ( model.schedules.map ( ele =>
                                               option ([ "value=" + ele.id ])
                                                   ([ text (`${nameOfId (model.staff.slice (), ele.staff_id)} | ${ele.date} | ${ele.time}`) ]) ) );
    }

    function studentForm (model) {
        return form ([ "id=studentForm", "method=POST", "action=/api/students" ])
                   ([ div ([ "class=banner" ])
                          ([ h1 ([]) ([ text ("Add A Student") ]) ])
                    , div ([ "class=item" ])
                          ([ label ([ "for=name" ])
                                 ([ text ("Name")
                                  , span ([]) ([ text ('*') ])
                                 ])
                           , input ([ "id=name", "name=name", "type=text", "required" ]) ([])
                          ])
                    , div ([ "class=item" ])
                          ([ label ([ "for=email" ])
                                 ([ text ("Student Email")
                                  , span ([]) ([ text ('*') ])
                                 ])
                           , input ([ "id=email", "name=email", "type=email", "required", "value=" + model.bookingForm["studentEmail"].value ]) ([])
                          ])
                    , div ([ "class=item" ])
                          ([ label ([ "for=seq" ])
                                 ([ text ("Booking Sequence")
                                  , span ([]) ([ text ('*') ])
                                 ])
                           , input ([ "id=seq", "name=seq", "type=text", "required", "value=" + model.bookingSequence ]) ([])
                          ])
                    , div ([ "class=btn-block" ])
                          ([ button ([ "id=addStudentBtn", "type=submit" ]) ([ text ("SUBMIT") ]) ])
                   ]);
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.GET_STAFF_SUCCESS: {
            model.staff = msg.payload;
            const command = getSchedules ();
            return [ model, command ];
        }

        case MSGS.GET_SCHEDULES_SUCCESS: {
            model.schedules =
                msg.payload.filter (sch => sch.student_email === null);
            return model;
        }

        case MSGS.FINISHED_SCHEDULES: {
            model.isScheduleSet = true;
            return model;
        }

        case MSGS.POST_BOOKING: {
            model.success = null;
            model.bookingData = jsonOfBooking (model);
            const command = postBooking (model);
            return [ model, command ];
        }

        case MSGS.POST_BOOKING_SUCCESS: {
            console.log (msg.payload);
            model.toReset = true;
            model.alert = "Booked";
            return model;
        }

        case MSGS.POST_BOOKING_FAILURE: {
            model.alert = msg.payload;
            model.bookingSequence = msg.payload.split (":")[1].trim ();
            return model;
        }

        case MSGS.POST_STUDENT: {
            model.studentData = jsonOfStudent (model);
            const command = postStudent (model);
            return [ model, command ];
        }

        case MSGS.POST_STUDENT_SUCCESS: {
            model.success = msg.payload;
            return model;
        }

        case MSGS.POST_STUDENT_FAILURE: {
            model.alert = msg.payload;
            return model;
        }

        case MSGS.FINISHED_STUDENT: {
            model.isStudentSet = true;
            model.studentForm = document.getElementById ("studentForm");
            return model;
        }

        case MSGS.SET_UP: {
            model.bookingForm = document.getElementById ("bookingForm");
            return model;
        }

        case MSGS.RESET: {
            model.schedules = null;
            model.bookingData = null;
            model.isScheduleSet = false;
            model.bookingSequence = null;
            model.isStudentSet = false;
            model.studentForm = null;
            model.studentData = null;
            model.toReset = false;
            model.alert = null;
            model.success = null;
            const command = getSchedules ();
            return [ model, command ];
        }

        case MSGS.ALERT: {
            model.alert = null;
            return model;
        }

        default: {
            return model;
        }
    }

}


function events (dispatch) {
    document.addEventListener ("DOMContentLoaded", e => dispatch ({ type: MSGS.SET_UP, payload: e }));

    document.addEventListener ("submit", e => {
        e.preventDefault ();
        switch (e.target.id) {
            case "studentForm": {
                dispatch ({ type: MSGS.POST_STUDENT, payload: e });
                break;
            }

            case "bookingForm": {
                dispatch ({ type: MSGS.POST_BOOKING, payload: e });
                break;
            }
        }
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


function getSchedules () {
    return { request: { url: "/api/schedules"
                      , method: "GET"
                      }
           , successMsg: response => ({ type: MSGS.GET_SCHEDULES_SUCCESS, payload: response })
           };
}


function postBooking (model) {
    return { request: { url: model.bookingForm.action
                      , method: model.bookingForm.method
                      , body: JSON.stringify (model.bookingData)
                      }
           , successMsg: response => ({ type: MSGS.POST_BOOKING_SUCCESS, payload: response })
           , failureMsg: response => ({ type: MSGS.POST_BOOKING_FAILURE, payload: response })
           };
}


function postStudent (model) {
    return { request: { url: model.studentForm.action
                      , method: model.studentForm.method
                      , body: JSON.stringify (model.studentData)
                      }
           , successMsg: response => ({ type: MSGS.POST_STUDENT_SUCCESS, payload: response })
           , failureMsg: response => ({ type: MSGS.POST_STUDENT_FAILURE, payload: response })
           };
}
