const MSGS =
    { SHOW: "SHOW"
    , HIDE: "HIDE"
    , SUB: "SUB"
    , UNSUB: "UNSUB"
    };


const model =
    { photos: [ { url: "https://dbdwvr6p7sskw.cloudfront.net/js-exercises/mini_projects/misc_gui_projects/01_exotic_animals_tooltip/images/blackbuck.jpg"
                , id: 0
                , caption: "The blackbuck, also known as the Indian antelope, is an antelope found in Pakistan, India and Nepal. The blackbuck is the sole extant member of the genus Antilope. The species was described and given its binomial name by Swedish zoologist Carl Linnaeus in 1758."
                , visible: false
                }
              , { url: "https://dbdwvr6p7sskw.cloudfront.net/js-exercises/mini_projects/misc_gui_projects/01_exotic_animals_tooltip/images/genet.jpg"
                , id: 1
                , caption: "A genet is a member of the genus Genetta, which consists of 14 to 17 species of small African carnivorans. Genet fossils from the Pliocene have been found in Morocco. The common genet is the only genet present in Europe and occurs in the Iberian Peninsula and France."
                , visible: false
                }
              , { url: "https://dbdwvr6p7sskw.cloudfront.net/js-exercises/mini_projects/misc_gui_projects/01_exotic_animals_tooltip/images/golden_pheasant.jpg"
                , id: 2
                , caption: "The golden pheasant or Chinese pheasant (Chrysolophus pictus) is a gamebird of the order Galliformes (gallinaceous birds) and the family Phasianidae (pheasants). It is native to forests in mountainous areas of western China."
                , visible: false
                }
              ]
    , moused: null
    , sub: false
    };


function update (msg, model) {
    switch (msg.type) {
        case MSGS.SHOW: {
            model.photos[model.moused].visible = true;
            model.moused = null;
            return { model };
        }
        case MSGS.HIDE: {
            model.photos[model.moused].visible = false;
            model.moused = null;
            return { model };
        }
        case MSGS.SUB: {
            model.moused = msg.payload.target.id;
            model.sub = true;
            return { model };
        }
        case MSGS.UNSUB: {
            model.moused = msg.payload.target.id;
            model.sub = false;
            return { model };
        }
    }
}


function viewPhoto ({ url, id, caption, visible }) {
    const fig =
        figure ([])
            ([ img ([ "src=" + url
                    , "id=" + id
                    , { onmouseleave: e => this.dispatch ({ type: MSGS.UNSUB, payload: e })
                      , onmouseenter: e => {
                              if (!model.sub)
                                  this.dispatch ({ type: MSGS.SUB, payload: e })
                          }
                      }
                   ]) ([])
             , !visible ? text ("")
                        : figcaption ([])
                              ([ text (caption) ])
            ]);
    return fig;
}


const viewPhotos =
    (dispatch, model) =>
        div ([])
            (model.photos.map (viewPhoto, { dispatch }));


function view (dispatch, model) {
    const photos = document.querySelector ("#photos");
    empty (photos); // where virtual-dom would be nice
    photos.appendChild (viewPhotos (dispatch, model));
}
