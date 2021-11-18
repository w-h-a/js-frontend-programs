function httpRequests (dispatch, command) {
    if (!command) return;
    const request = command.request;
    const xhr = new XMLHttpRequest ();
    xhr.open (request.method, request.url);
    xhr.setRequestHeader ("Content-Type", "application/json");
    xhr.responseType = "json";
    xhr.send (request.body);
    xhr.addEventListener ("load", () => {
        switch (xhr.status) {
            case 200: {
                dispatch (command.successMsg ( xhr.response ));
                break;
            }

            case 201: {
                dispatch (command.successMsg ( { status: xhr.status, message: `${request.method} was a success` } ));
                break;
            }

            case 204: {
                dispatch (command.successMsg ( { status: xhr.status, message: `${request.method} was a success` } ));
                break;
            }

            case 400: {
                dispatch (command.failureMsg ( { status: xhr.status, message: xhr.statusText } ));
                break;
            }
        }
    });
}


function getContacts () {
    return { request: { url: "/api/contacts"
                      , method: "GET"
                      }
           , successMsg: response => ({ type: MSGS.GET_CONTACTS_SUCCESS, payload: response })
           };
}


function postContact (model) {
    return { request: { url: "/api/contacts"
                      , method: "POST"
                      , body: JSON.stringify (model.contact)
                      }
           , successMsg: response => ({ type: MSGS.POST_CONTACT_SUCCESS, payload: response })
           , failureMsg: response => ({ type: MSGS.POST_CONTACT_FAILURE, payload: response })
           };
}


function putContact (model) {
    return { request: { url: "api/contacts/" + model.contact.id
                      , method: "PUT"
                      , body: JSON.stringify (model.contact)
                      }
           , successMsg: response => ({ type: MSGS.PUT_CONTACT_SUCCESS, payload: response })
           , failureMsg: response => ({ type: MSGS.PUT_CONTACT_FAILURE, payload: response })
           };
}


function deleteContact (model) {
    return { request: { url: "api/contacts/" + model.toDelete
                      , method: "DELETE"
                      }
           , successMsg: response => ({ type: MSGS.DELETE_CONTACT_SUCCESS, payload: response })
           , failureMsg: response => ({ type: MSGS.DELETE_CONTACT_FAILURE, payload: response })
           };
}
