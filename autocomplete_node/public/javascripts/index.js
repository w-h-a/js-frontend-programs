const httpRequests = debounce (httpEffects, 300);


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


function httpEffects (dispatch, command) {
    if (!command) return;
    const request = command.request;
    const init = { method: request.method
                 , headers: request.headers
                 , body: request.body
                 };
    fetch (request.url, init)
        .then (response => response.json ())
        .then (data => dispatch (command.successMsg (data)))
        .catch (error => dispatch (command.errorMsg (error)));
}

/*
const xhr = new XMLHttpRequest ();
xhr.open (init.method, request.url);
xhr.addEventListener ("load", () => dispatch (command.successMsg (JSON.parse (xhr.response))));
xhr.addEventListener ("error", () => dispatch (command.errorMsg ({ message: "Whoops!" })));
xhr.send ();
*/


function debounce (func, delay) {
    let timeout;
    return (...args) => {
        if (timeout) clearTimeout (timeout);
        timeout = setTimeout (() => func (...args), delay);
    };
}
