function mount (init, update, view, events) {
    let model = init.model;
    let command = init.command;

    httpRequests (dispatch, command);
    view (dispatch, model);

    events (dispatch);

    function dispatch (msg) {
        const updates = update (msg, model);
        const isArray = Array.isArray (updates);

        model =
            isArray ? updates[0]
                    : updates;
        command =
            isArray ? updates[1]
                    : null;

        httpRequests (dispatch, command);
        view (dispatch, model);
    }
}


function httpRequests (dispatch, command) {
    if (!command) return;
    const request = command.request;
    const xhr = new XMLHttpRequest ();
    xhr.open (request.method, request.url);
    xhr.addEventListener ("load", () => {
        switch (xhr.status) {
            case 204: {
                dispatch (command.successMsg ("Success!"));
                break;
            }

            case 403: {
                dispatch (command.failureMsg (xhr.responseText));
                break;
            }

            case 404: {
                dispatch (command.failureMsg (xhr.responseText));
                break;
            }

            default: {
                dispatch (command.successMsg (JSON.parse (xhr.response)));
                break;
            }
        }
    });
    xhr.send ();
}
