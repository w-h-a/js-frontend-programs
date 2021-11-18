function mount (init, update, view, events) {
    let model = init.model;
    let command = init.command;

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

        randomRequest (dispatch, command);
        view (dispatch, model);
    }
}


function randomRequest (dispatch, command) {
    if (!command) return;
    const { min, max } = command.request;
    dispatch (command.successMsg (randomIntOfMinMax (min, max)));
}
