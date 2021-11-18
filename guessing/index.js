function mount (model, update, view, events) {
    view (model);
    events (dispatch);

    function dispatch (msg) {
        const updates = update (msg, model);
        model = updates;
        view (model);
    }
}
