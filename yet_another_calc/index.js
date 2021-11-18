function mount (model, update, view) {
    view (dispatch, model);

    function dispatch (msg) {
        const updates = update (msg, model);

        model = updates;

        view (dispatch, model);
    }
}
