function mount (init, update, view) {
    let model = init.model;
    let command = init.command;

    httpRequests (dispatch, command);
    view (model);

    function dispatch (msg) {
        const updates = update (msg, model);

        model = updates;

        view (model);
    }
}


function httpRequests (dispatch, command) {
    if (!command) return;
    const request = command.request;
    const init = { method: request.method
                 , body: request.body
                 };
    const xhr = new XMLHttpRequest ();
    xhr.open (init.method, request.url);
    xhr.timeout = 5000;
    xhr.addEventListener ("load", () => dispatch (command.successMsg (JSON.parse (xhr.response))));
    xhr.addEventListener ("timeout", () => dispatch (command.errorMsg ({ message: "The request is taking long; try again later." })));
    xhr.addEventListener ("loadend", () => dispatch (command.finalMsg ({ message: "FIN" })));
    xhr.send (init.body);
}
