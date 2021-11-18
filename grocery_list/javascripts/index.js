function mount (model, update, view, events) {
    view (dispatch, model);

    events (dispatch);

    function dispatch (msg) {
        const updates = update (msg, model);

        model = updates;

        view (dispatch, model);
    }
}
