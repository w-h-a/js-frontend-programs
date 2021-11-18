const MSGS =
    { SET_UP_MODEL: "SET_UP_MODEL"
    , COMPLETE_SET_UP: "COMPLETE_SET_UP"
    , TEXT_INPUT: "TEXT_INPUT"
    , GET_MATCHES_SUCCESS: "GET_MATCHES_SUCCESS"
    , GET_MATCHES_ERROR: "GET_MATCHES_ERROR"
    , SELECTING: "SELECTING"
    , MOUSE_HIT: "MOUSE_HIT"
    , RESET: "RESET"
    };


const init =
    { model: { input: null
             , listUI: null
             , overlay: null
             , value: null
             , visible: false
             , matches: []
             , bestMatchIndex: null
             , selectedIndex: null
             , tabbed: false
             , previousValue: null
             , escaped: false
             , mouseTarget: null
             }
    , command: null
    };


function view (dispatch, model) {
    if (model.input && !model.listUI && !model.overlay) {
        model.input
             .parentNode.appendChild (div ([ "class=autocomplete-wrapper" ]) ([ model.input ]));

        const listUI = ul ([ "class=autocomplete-ui" ]) ([]);
        model.input
             .parentNode.appendChild (listUI);

        const overlay = div ([ "class=autocomplete-overlay" ]) ([]);
        overlay.style.width = `${model.input.clientWidth}px`;
        model.input
             .parentNode.appendChild (overlay);

        dispatch ({ type: MSGS.COMPLETE_SET_UP, payload: { listUI, overlay } });
    }

    if (model.listUI) {
        empty (model.listUI);

        if (!model.visible) {
            model.overlay.textContent = "";
        }

        else {
            model.overlay.textContent =
                renderOverlayContent (model);

            model.matches.forEach ((match, idx) => {
                if (idx === model.selectedIndex) {
                    model.listUI.appendChild (li ([ "class=autocomplete-ui-choice selected" ]) ([ text (match.name) ]));
                    model.input.value = match.name;
                }

                else {
                    model.listUI.appendChild (li ([ "class=autocomplete-ui-choice" ]) ([ text (match.name) ]));
                }
            });
        }
    }

    if (model.tabbed) {
        model.input.value =
            model.matches[model.bestMatchIndex].name;

        dispatch ({ type: MSGS.RESET });
    }

    if (model.escaped) {
        model.input.value =
            model.previousValue;

        dispatch ({ type: MSGS.RESET });
    }

    if (model.mouseTarget) {
        model.input.value =
            model.mouseTarget.textContent;

        dispatch ({ type: MSGS.RESET });
    }

    function renderOverlayContent (model) {
        return model.bestMatchIndex !== null && model.matches.length !== 0 ? model.value + model.matches[model.bestMatchIndex].name.slice (model.value.length)
                                                                           : "";
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.SET_UP_MODEL: {
            model.input = document.querySelector ("input");
            return model;
        }

        case MSGS.COMPLETE_SET_UP: {
            Object.assign (model, msg.payload);
            return model;
        }

        case MSGS.TEXT_INPUT: {
            model.value = msg.payload.target.value;
            model.previousValue = model.value;

            if (model.value.length > 0) {
                const command = getMatches (model);
                return [ model, command ];
            }

            else {
                return update ({ type: MSGS.RESET }, model);
            }
        }

        case MSGS.GET_MATCHES_SUCCESS: {
            model.visible = true;
            model.matches = msg.payload;
            model.bestMatchIndex = 0;
            model.selectedIndex = null;
            return model;
        }

        case MSGS.GET_MATCHES_ERROR: {
            console.log (msg.payload.message);
            return model;
        }

        case MSGS.SELECTING: {
            switch (msg.payload.key) {
                case "ArrowDown": {
                    msg.payload.preventDefault ();
                    model.selectedIndex =
                        model.selectedIndex === null || model.selectedIndex === model.matches.length - 1 ? 0
                                                                                                         : model.selectedIndex + 1;
                    model.bestMatchIndex = null;
                    break;
                }

                case "ArrowUp": {
                    msg.payload.preventDefault ();
                    model.selectedIndex =
                        model.selectedIndex === null || model.selectedIndex === 0 ? model.matches.length - 1
                                                                                  : model.selectedIndex - 1;
                    model.bestMatchIndex = null;
                    break;
                }

                case "Tab": {
                    msg.payload.preventDefault ();
                    if (model.bestMatchIndex !== null && model.matches.length !== 0) {
                        model.tabbed = true;
                    }
                    break;
                }

                case "Enter": {
                    model = update ({ type: MSGS.RESET }, model);
                    break;
                }

                case "Escape": {
                    model.escaped = true;
                    break;
                }
            }

            return model;
        }

        case MSGS.MOUSE_HIT: {
            model.mouseTarget = msg.payload.target;
            return model;
        }

        case MSGS.RESET: {
            model.visible = false;
            model.matched = [];
            model.bestMatchIndex = null;
            model.selectedIndex = null;
            model.tabbed = false;
            model.previousValue = null;
            model.escaped = false;
            model.mouseTarget = null;
            return model;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.addEventListener ("DOMContentLoaded", e => {
        dispatch ({ type: MSGS.SET_UP_MODEL, payload: e });

        const input = document.querySelector ("input");

        input.addEventListener ("input", e => dispatch ({ type: MSGS.TEXT_INPUT, payload: e }));

        input.addEventListener ("keydown", e => dispatch ({ type: MSGS.SELECTING, payload: e }));

        document.querySelector ("ul")
                .addEventListener ("mousedown", e => dispatch ({ type: MSGS.MOUSE_HIT, payload: e }));
    });
}


// HTTP COMMANDS

function getMatches (model) {
    return { request: { url: "/countries?matching=" + encodeURIComponent (model.value)
                      , method: "GET"
                      }
           , successMsg: response => ({ type: MSGS.GET_MATCHES_SUCCESS, payload: response })
           , errorMsg: response => ({ type: MSGS.GET_MATCHES_ERROR, payload: response })
           };
}
