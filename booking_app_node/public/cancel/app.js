const MSGS =
    { SET_UP: "SET_UP"
    , GET_SCHEDULES_SUCCESS: "GET_SCHEDULES_SUCCESS"
    , GET_STAFF_SUCCESS: "GET_STAFF_SUCCESS"
    , RENDER_COMPLETE: "RENDER_COMPLETE"
    , DELETE_SCHEDULE: "DELETE_SCHEDULE"
    , DELETE_SCHEDULE_SUCCESS: "DELETE_SCHEDULE_SUCCESS"
    , DELETE_SCHEDULE_FAILURE: "DELETE_SCHEDULE_FAILURE"
    , PUT_BOOKING: "PUT_BOOKING"
    , PUT_BOOKING_SUCCESS: "PUT_BOOKING_SUCCESS"
    , RESET: "RESET"
    };


const init =
    { model: { scheduleForm: null
             , bookingForm: null
             , scheduleHeaderElement: null
             , bookingHeaderElement: null
             , schedules: null
             , staff: null
             , isRenderDone: false
             , id: null
             , alert: null
             }
    , command: getStaff ()
    };


function view (dispatch, model) {
    if (model.schedules && model.staff && !model.isRenderDone) {
        renderSelectOptions (model);
        dispatch ({ type: MSGS.RENDER_COMPLETE });
    }

    if (model.alert) {
        alert (model.alert);
        dispatch ({ type: MSGS.RESET });
    }

    function renderSelectOptions (model) {
        const appointSelect =
            select ([ "id=appoint-select" ])
                ( model.schedules.map ( sch =>
                                            option ([ "value=" + sch.id ])
                                                ([ text (`${model.staff.find (staff => staff.id === sch.staff_id).name} | ${sch.date} | ${sch.time}`) ]) ) );

        if (document.getElementById ("appoint-select")) {
            model.scheduleForm.removeChild (document.getElementById ("appoint-select"));
        }

        model.scheduleHeaderElement.insertAdjacentElement ("afterend", appointSelect);

        const bookSelect =
            select ([ "id=book-select" ])
                ( model.schedules.filter ( sch => sch.student_email !== null )
                                 .map ( sch =>
                                           option ([ "value=" + sch.id ])
                                               ([ text (`${model.staff.find (staff => staff.id === sch.staff_id).name} | ${sch.date} | ${sch.time}`) ]) ) );

        if (document.getElementById ("book-select")) {
            model.bookingForm.removeChild (document.getElementById ("book-select"));
        }

        model.bookingHeaderElement.insertAdjacentElement ("afterend", bookSelect);
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.SET_UP: {
            model.scheduleForm = document.getElementById ("schedule-form");
            model.bookingForm = document.getElementById ("booking-form");
            model.scheduleHeaderElement = Array.from (model.scheduleForm.children)[0];
            model.bookingHeaderElement = Array.from (model.bookingForm.children)[0];
            return model;
        }

        case MSGS.GET_SCHEDULES_SUCCESS: {
            model.schedules = msg.payload;
            return model;
        }

        case MSGS.GET_STAFF_SUCCESS: {
            model.staff = msg.payload;
            const command = getSchedules ();
            return [ model, command ];
        }

        case MSGS.RENDER_COMPLETE: {
            model.isRenderDone = true;
            return model;
        }

        case MSGS.DELETE_SCHEDULE: {
            msg.payload.preventDefault ();
            model.id = Array.from (model.scheduleForm.children)[1].value;
            const command = deleteSchedule (model);
            return [ model, command ];
        }

        case MSGS.DELETE_SCHEDULE_SUCCESS: {
            model.alert = msg.payload;
            return model;
        }

        case MSGS.DELETE_SCHEDULE_FAILURE: {
            model.alert = msg.payload;
            return model;
        }

        case MSGS.PUT_BOOKING: {
            msg.payload.preventDefault ();
            model.id = Array.from (model.bookingForm.children)[1].value;
            const command = putBooking (model);
            return [ model, command ];
        }

        case MSGS.PUT_BOOKING_SUCCESS: {
            model.alert = msg.payload;
            return model;
        }

        case MSGS.RESET: {
            model.alert = null;
            model.schedules = null;
            model.isRenderDone = false;
            const command = getSchedules ();
            return [ model, command ];
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.addEventListener ("DOMContentLoaded", e => dispatch ({ type: MSGS.SET_UP, payload: e }));
    document.getElementById ("schedule-form")
            .addEventListener ("submit", e => dispatch ({ type: MSGS.DELETE_SCHEDULE, payload: e }));
    document.getElementById ("booking-form")
            .addEventListener ("submit", e => dispatch ({ type: MSGS.PUT_BOOKING, payload: e }));
}


// http commands

function getSchedules () {
    return { request: { url: "/api/schedules"
                      , method: "GET"
                      }
           , successMsg: resp => ({ type: MSGS.GET_SCHEDULES_SUCCESS, payload: resp })
           };
}


function getStaff () {
    return { request: { url: "/api/staff_members"
                      , method: "GET"
                      }
           , successMsg: resp => ({ type: MSGS.GET_STAFF_SUCCESS, payload: resp })
           };
}


function deleteSchedule (model) {
    return { request: { url: model.scheduleForm.action + model.id
                      , method: "DELETE"
                      }
           , successMsg: resp => ({ type: MSGS.DELETE_SCHEDULE_SUCCESS, payload: resp })
           , failureMsg: resp => ({ type: MSGS.DELETE_SCHEDULE_FAILURE, payload: resp })
           };
}


function putBooking (model) {
    return { request: { url: model.bookingForm.action + model.id
                      , method: "PUT"
                      }
           , successMsg: resp => ({ type: MSGS.PUT_BOOKING_SUCCESS, payload: resp })
           };
}
