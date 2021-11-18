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
                    : null

        httpRequests (dispatch, command);
        view (dispatch, model);
    }
}


function httpRequests (dispatch, command) {
    if (!command) return;
    const request = command.request;
    const init = { method: request.method
                 , headers: request.headers
                 , body: request.body
                 };
    fetch (request.url, init)
        .then (response => {
            switch (response.status) {
                case 201: {
                    return response.json ();
                }
                case 400: {
                    throw new Error (response.statusText);
                }
            }
        })
        .then (data => dispatch (command.successMsg (data)))
        .catch (error => dispatch (command.errorMsg (error)));
}


/*

*/

/*
const xhr = new XMLHttpRequest ();
xhr.open (init.method, request.url);
xhr.addEventListener ("load", () => {
    switch (xhr.status) {
        case 201: {
            dispatch (command.successMsg (JSON.parse (xhr.response)));
            break;
        }
        case 400: {
            dispatch (command.errorMsg (xhr.responseText));
            break;
        }
    }
});
xhr.send (init.body);
*/
