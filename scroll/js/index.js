function mount (init, update, view, events) {
    let model = init.model;
    let command = init.command;

    view (dispatch, model);
    httpRequests (dispatch, command);

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

        view (dispatch, model);
        setTimeout (() => httpRequests (dispatch, command));
    }
}


function httpRequests (dispatch, command) {
    if (!command) return;
    const request = command.request;
    const xhr = new XMLHttpRequest ();
    xhr.open (request.method, request.url);
    xhr.addEventListener ("load", () => dispatch (command.successMsg (JSON.parse (xhr.response))));
    xhr.addEventListener ("error", () => dispatch (command.failureMsg (new Error (`An error occurred: ${xhr.status}`))));
    xhr.send ();
}
