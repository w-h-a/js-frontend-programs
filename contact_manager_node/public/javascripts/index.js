function mount (init, update, view, events) {
    let model = init.model;
    let command = init.command;

    httpRequests (dispatch, command);

    view (dispatch, model);

    events (dispatch);

    function dispatch (msg) {
        const updates = update (msg, model);
        const isArray = Array.isArray (updates);

        model = isArray ? updates[0] : updates;
        command = isArray ? updates[1] : null;

        httpRequests (dispatch, command);

        view (dispatch, model); 
    }
}


mount (init, update, view, events);
