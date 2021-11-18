const MSGS =
    { SET_UP: "SET_UP"
    , INPUT: "INPUT"
    };


const model =
    { inputText: null
    , statElem: null
    , rawInput: null
    , matches: null
    , wordStats: {}
    };


function view (model) {
    if (model.statElem) renderStatElem (model);

    function renderStatElem (model) {
        const stats =
            p ([])
                ([ text ("You have written ")
                 , span ([ "class=highlight" ]) ([ text ((model.wordStats.words || 0) + " words") ])
                 , text (" and ")
                 , span ([ "class=highlight" ]) ([ text ((model.wordStats.characters || 0) + " characters") ])
                ]);
        empty (model.statElem);
        model.statElem.appendChild (stats);
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.SET_UP: {
            model.inputText = document.querySelector ("textarea");
            model.statElem = document.querySelector ("#stat");
            return model;
        }
        case MSGS.INPUT: {
            model.rawInput = model.inputText.value;
            model.matches = model.rawInput.match (/\S+/g);
            Object.assign (model.wordStats, wordStatsOfString (model));
            return model;
        }
        default: {
            return model;
        }
    }

    function wordStatsOfString (model) {
        return { characters: model.rawInput.length
               , words: model.matches ? model.matches.length : 0
               };
    }
}


function events (dispatch) {
    document.addEventListener ("DOMContentLoaded", () => dispatch ({ type: MSGS.SET_UP }));
    document.querySelector ("textarea")
            .addEventListener ("input", () => dispatch ({ type: MSGS.INPUT }));
}
