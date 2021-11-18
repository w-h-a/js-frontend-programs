const MSGS =
    { CLEAR: "CLEAR"
    , CLASS: "CLASS"
    , ANIMA: "ANIMA"
    };


const model =
    { classifications: []
    , animals: []
    };


// a shame we aren't allowed to use virtual-dom npm
function view (model) {
    const classSelect =
        document.getElementById ("animal-classifications");

    empty (classSelect);

    const classOptions =
        model.classifications.map (val => option ([ "value=" + val ]) ([ text (val) ]));

    classOptions.forEach (option => classSelect.appendChild (option));

    const animalSelect =
        document.getElementById ("animals");

    empty (animalSelect);

    const animalOptions =
        model.animals.map (val => option ([ "value=" + val ]) ([ text (val) ]));

    animalOptions.forEach (option => animalSelect.appendChild (option));
}


function update (msg, model) {
    const newModel = JSON.parse (JSON.stringify (model));

    switch (msg.type) {
        case MSGS.CLEAR: {
            msg.payload.preventDefault ();

            newModel.classifications =
                [ "Classifications"
                , "Vertebrate"
                , "Warm-blooded"
                , "Cold-blooded"
                , "Mammal"
                , "Bird"
                ];

            newModel.animals =
                [ "Animals"
                , "Bear"
                , "Turtle"
                , "Whale"
                , "Salmon"
                , "Ostrich"
                ];

            return newModel;
        }

        case MSGS.CLASS: {
            newModel.classifications =
                [ msg.payload.currentTarget.value ];

            switch (newModel.classifications[0]) {
                case "Vertebrate": {
                    newModel.animals =
                        [ "Bear"
                        , "Turtle"
                        , "Whale"
                        , "Salmon"
                        , "Ostrich"
                        ];

                    break;
                }

                case "Warm-blooded": {
                    newModel.animals =
                        [ "Bear"
                        , "Whale"
                        , "Ostrich"
                        ];

                    break;
                }

                case "Cold-blooded": {
                    newModel.animals =
                        [ "Salmon"
                        , "Turtle"
                        ];

                    break;
                }

                case "Mammal": {
                    newModel.animals =
                        [ "Bear"
                        , "Whale"
                        ];

                    break;
                }

                case "Bird": {
                    newModel.animals =
                        [ "Ostrich" ];

                    break;
                }
            }

            return newModel;
        }

        case MSGS.ANIMA: {
            newModel.animals =
                [ msg.payload.currentTarget.value ];

            switch (newModel.animals[0]) {
                case "Bear": {
                    newModel.classifications =
                        [ "Vertebrate"
                        , "Warm-blooded"
                        , "Mammal"
                        ];

                    break;
                }

                case "Turtle": {
                    newModel.classifications =
                        [ "Vertebrate"
                        , "Cold-blooded"
                        ];

                    break;
                }

                case "Whale": {
                    newModel.classifications =
                        [ "Vertebrate"
                        , "Warm-blooded"
                        , "Mammal"
                        ];

                    break;
                }

                case "Salmon": {
                    newModel.classifications =
                        [ "Vertebrate"
                        , "Cold-blooded"
                        ];

                    break;
                }

                case "Ostrich": {
                    newModel.classifications =
                        [ "Vertebrate"
                        , "Warm-blooded"
                        , "Bird"
                        ];

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
    document.addEventListener ("DOMContentLoaded", e => {
        dispatch ({ type: MSGS.CLEAR, payload: e });

        document.getElementById ("clear")
                .addEventListener ("click", e => dispatch ({ type: MSGS.CLEAR, payload: e }));

        document.getElementById ("animal-classifications")
                .addEventListener ("change", e => dispatch ({ type: MSGS.CLASS, payload: e }));

        document.getElementById ("animals")
                .addEventListener ("change", e => dispatch ({ type: MSGS.ANIMA, payload: e }));
    });
}
