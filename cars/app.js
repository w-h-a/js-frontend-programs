const MSGS =
    { CHANGE: "CHANGE"
    , SUBMIT: "SUBMIT"
    , MAIN_COMPLETE: "MAIN_COMPLETE"
    };


const model =
    { cars: [ { make: "Honda"
              , image: "car_filtering_images/honda-accord-2005.jpg"
              , model: "Accord"
              , year: 2005
              , price: 7000
              }
            , { make: "Honda"
              , image: "car_filtering_images/honda-accord-2008.jpg"
              , model: "Accord"
              , year: 2008
              , price: 11000
              }
            , { make: "Toyota"
              , image: "car_filtering_images/toyota-camry-2009.jpg"
              , model: "Camry"
              , year: 2009
              , price: 12500
              }
            , { make: "Toyota"
              , image: "car_filtering_images/toyota-corrolla-2016.jpg"
              , model: "Corolla"
              , year: 2016
              , price: 15000
              }
            , { make: "Suzuki"
              , image: "car_filtering_images/suzuki-swift-2014.jpg"
              , model: "Swift"
              , year: 2014
              , price: 9000
              }
            , { make: "Audi"
              , image: "car_filtering_images/audi-a4-2013.jpg"
              , model: "A4"
              , year: 2013
              , price: 25000
              }
            , { make: "Audi"
              , image: "car_filtering_images/audi-a4-2013.jpg"
              , model: "A4"
              , year: 2013
              , price: 26000
              }
            ]
    , keys: [ "make", "model", "year", "price" ]
    , selected: [ "all", "all", "any", "any" ]
    , renderMain: true
    };


function view (dispatch, model) {
    renderOptions (dispatch, model);
    if (model.renderMain) renderMain (dispatch, model);

    function renderOptions (dispatch, model) {
        model.keys.forEach (key => {
            const valueOfCar =
                car =>
                    car[key];

            const firstUnique =
                (value, idx, cars) =>
                    cars.indexOf (value) === idx;

            let values =
                model.cars.map (valueOfCar)
                          .filter (firstUnique);

            values =
                model.selected[0] === "all" || key !== "model" ? values
                                                               : values.filter (v => {
                                                                       switch (model.selected[0]) {
                                                                           case "Honda": {
                                                                               return v === "Accord";
                                                                           }
                                                                           case "Toyota": {
                                                                               return v === "Camry" || v === "Corolla";
                                                                           }
                                                                           case "Suzuki": {
                                                                               return v === "Swift";
                                                                           }
                                                                           case "Audi": {
                                                                               return v === "A4";
                                                                           }
                                                                       }
                                                                   });

            const select =
                document.getElementById (key);

            while (select.children.length > 1)
                select.removeChild (select.lastChild);

            values.forEach (value => {
                const opt =
                    option ([ "value=" + value, (model.selected.includes (value.toString ()) ? "selected" : "" ) ])
                        ([ text (value.toString ()) ]);

                select.appendChild (opt);
            });
        });
    }


    function renderMain (dispatch, model) {
        const main =
            document.querySelector ("main");

        empty (main);

        const def =
            ele =>
                ele === "all" || ele === "any";

        const make =
            car => model.selected[0] === "all" || car.make === model.selected[0];

        const mod =
            car => model.selected[1] === "all" || car.model === model.selected[1];

        const year =
            car => model.selected[2] === "any" || car.year.toString () === model.selected[2];

        const price =
            car => model.selected[3] === "any" || car.price.toString () === model.selected[3];

        const cars =
            model.selected.every (def) ? model.cars
                                       : model.cars.filter (make)
                                                   .filter (mod)
                                                   .filter (year)
                                                   .filter (price);

        cars.forEach (car => {
            const d =
                div ([ "class=car" ])
                    ([ img ([ "src=" + car.image ]) ([])
                     , p ([]) ([ strong ([]) ([ text (`${car.make} ${car.model}`) ]) ])
                     , p ([]) ([ text ("Year: " + car.year) ])
                     , p ([]) ([ text ("Price: " + "$" + car.price) ])
                     , button ([ "class=buy" ]) ([ text ("Buy") ])
                    ]);

            main.appendChild (d);
        });

        dispatch ({ type: MSGS.MAIN_COMPLETE });
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.CHANGE: {
            switch (msg.payload.currentTarget) {
                case document.getElementById ("make"): {
                    model.selected[0] =
                        msg.payload.currentTarget.value;
                    break;
                }
                case document.getElementById ("model"): {
                    model.selected[1] =
                        msg.payload.currentTarget.value;
                    break;
                }
                case document.getElementById ("year"): {
                    model.selected[2] =
                        msg.payload.currentTarget.value;
                    break;
                }
                case document.getElementById ("price"): {
                    model.selected[3] =
                        msg.payload.currentTarget.value;
                    break;
                }
            }

            return model;
        }

        case MSGS.SUBMIT: {
            msg.payload.preventDefault ();

            model.renderMain = true;

            model.selected =
                [ msg.payload.currentTarget["make"].value
                , msg.payload.currentTarget["model"].value
                , msg.payload.currentTarget["year"].value
                , msg.payload.currentTarget["price"].value
                ];

            return model;
        }

        case MSGS.MAIN_COMPLETE: {
            model.renderMain = false;

            return model;
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {
    document.querySelectorAll ("select")
            .forEach ( select => select.addEventListener ( "change", e => dispatch ({ type: MSGS.CHANGE, payload: e }) ) );

    document.querySelector ("form")
            .addEventListener ("submit", e => dispatch ({ type: MSGS.SUBMIT, payload: e }));
}
