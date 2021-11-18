const MSGS =
    { CLICK: "CLICK" };


const model =
    { highlightedElement: null };


function view (model) {
    Array.from (document.querySelectorAll (".highlight"))
         .forEach (ele => ele.classList.remove ("highlight"));

    if (model.highlightedElement) model.highlightedElement.classList.add ("highlight");
}


function update (msg, model) {
    const newModel = JSON.parse (JSON.stringify (model));

    switch (msg.type) {
        case MSGS.CLICK: {
            msg.payload.stopPropagation ();
            switch (msg.payload.target.nodeName) {
                case "A": {
                    newModel.highlightedElement =
                        document.getElementById (`article-${msg.payload.target.textContent.replace ("Article ", "")}`);
                    break;
                }
                case "ARTICLE": {
                    newModel.highlightedElement =
                        document.getElementById (`${msg.payload.target.id}`);
                    break;
                }
                default: {
                    newModel.highlightedElement =
                        document.querySelector ("main");
                    break;
                }
            }

            return newModel;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.addEventListener ("click", e => dispatch ({ type: MSGS.CLICK, payload: e }));
}
