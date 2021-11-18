let timer;

function subs (dispatch, model) {
    if (!model.moused) return;
    switch (model.sub) {
        case true: {
            timer = setTimeout (() => dispatch ({ type: MSGS.SHOW }), 1000); // 2 seconds is too slow
            break;
        }
        case false: {
            clearTimeout (timer);
            dispatch ({ type: MSGS.HIDE });
            break;
        }
    }
}
