const MSGS =
    { THUMB_CLICK: "THUMB_CLICK"
    , FINISHED_SELECTED: "FINISHED_SELECTED"
    };


const model =
    { selectedUrl: null
    };


function view (dispatch, model) {
    const content =
       document.querySelectorAll (".content")[0];

    const thumbnails =
        document.querySelectorAll ("#thumbnails img");

    if (model.selectedUrl) {
        content.removeChild (content.lastChild);

        thumbnails.forEach (thumbnail => {
            if (thumbnail.src === model.selectedUrl) {
                thumbnail.classList.add ("selected");
            }

            else {
                thumbnail.classList.remove ("selected");
            }
        });

        const image =
            img ([ "class=large", "src=" + model.selectedUrl ]) ([]);

        content.appendChild (image);

        dispatch ({ type: MSGS.FINISHED_SELECTED });
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.THUMB_CLICK: {
            model.selectedUrl = msg.payload.target.src;
            return model;
        }

        case MSGS.FINISHED_SELECTED: {
            model.selectedUrl = null;
            return model;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.querySelector ("#thumbnails")
            .addEventListener ("click", e => {
                if (e.target.nodeName === "IMG")
                    dispatch ({ type: MSGS.THUMB_CLICK, payload: e });
            });
}
