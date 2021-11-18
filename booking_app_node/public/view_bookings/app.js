const MSGS =
    { GET_BOOKINGS_SUCCESS: "GET_BOOKINGS_SUCCESS"
    , GET_BOOKING_DETAILS: "GET_BOOKING_DETAILS"
    , GET_BOOKING_DETAILS_SUCCESS: "GET_BOOKING_DETAILS_SUCCESS"
    , BOOKINGS_RENDERED: "BOOKINGS_RENDERED"
    , DETAILS_RENDERED: "DETAILS_RENDERED"
    };


const init =
    { model: { bookings: null
             , isBookingsRendered: false
             , target: null
             , details: null
             }
    , command: getBookings ()
    };


function view (dispatch, model) {
    const bookingsList = document.getElementById ("bookings-list");

    if (model.bookings && !model.isBookingsRendered) {
        model.bookings.forEach (booking => {
            bookingsList.appendChild (li ([]) ([ text (booking) ]));
        });

        dispatch ({ type: MSGS.BOOKINGS_RENDERED });
    }

    if (model.details) {
        const children =
           model.details.map (ele => li ([]) ([ text (`${ele[0]} | ${ele[1]} | ${ele[2]}`) ]));
        model.target.appendChild (ul ([]) (children));

        dispatch ({ type: MSGS.DETAILS_RENDERED });
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.GET_BOOKINGS_SUCCESS: {
            model.bookings = msg.payload;
            console.log (model);
            return model;
        }

        case MSGS.BOOKINGS_RENDERED: {
            model.isBookingsRendered = true;
            return model;
        }

        case MSGS.GET_BOOKING_DETAILS: {
            model.target = msg.payload.target;
            const command = getBookingDetails (model);
            return [ model, command ];
        }

        case MSGS.GET_BOOKING_DETAILS_SUCCESS: {
            model.details = msg.payload;
            return model;
        }

        case MSGS.DETAILS_RENDERED: {
            model.target = null;
            model.details = null;
            return model;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.getElementById ("bookings-list")
            .addEventListener ("click", e => {
                if (e.target.nodeName === "LI" && e.target.childElementCount === 0) {
                    dispatch ({ type: MSGS.GET_BOOKING_DETAILS, payload: e });
                }
            });
}


// HTTP commands

function getBookings () {
    return { request: { url: "/api/bookings"
                      , method: "GET"
                      }
           , successMsg: resp => ({ type: MSGS.GET_BOOKINGS_SUCCESS, payload: resp })
           };
}


function getBookingDetails (model) {
    return { request: { url: "/api/bookings/" + model.target.textContent
                      , method: "GET"
                      }
           , successMsg: resp => ({ type: MSGS.GET_BOOKING_DETAILS_SUCCESS, payload: resp })
           };
}
