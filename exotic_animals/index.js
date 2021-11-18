((model, update, view, subs) => {
    subs (dispatch, model);
    view (dispatch, model);

    function dispatch (msg) {
        const updates = update (msg, model);
        model = updates.model; // just playing
        subs (dispatch, model);
        view (dispatch, model);
    }
}) (model, update, view, subs);
