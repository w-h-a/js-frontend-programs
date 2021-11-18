const MSGS =
    { MORE: "MORE"
    , LESS: "LESS"
    };


const model =
    { languages: [ { name: "Ruby"
                   , description: "Ruby is a dynamic, reflective, object-oriented, general-purpose programming language. It was designed and developed in the mid-1990s by Yukihiro Matsumoto in Japan. According to its creator, Ruby was influenced by Perl, Smalltalk, Eiffel, Ada, and Lisp. It supports multiple programming paradigms, including functional, object-oriented, and imperative. It also has a dynamic type system and automatic memory management."
                   , toShowAll: false
                   , id: 0
                   }
                 , { name: "JavaScript"
                   , description: "JavaScript is a high-level, dynamic, untyped, and interpreted programming language. It has been standardized in the ECMAScript language specification. Alongside HTML and CSS, JavaScript is one of the three core technologies of World Wide Web content production; the majority of websites employ it, and all modern Web browsers support it without the need for plug-ins. JavaScript is prototype-based with first-class functions, making it a multi-paradigm language, supporting object-oriented, imperative, and functional programming styles."
                   , toShowAll: false
                   , id: 1
                   }
                 ]
    };


function view (dispatch, model) {
    const more = e =>
        dispatch ({ type: MSGS.MORE, payload: e });

    const less = e =>
        dispatch ({ type: MSGS.LESS, payload: e });

    const app = document.querySelector ("#app");

    const root =
        div ([])
            ([ header ([])
               ([ h1 ([]) ([ text ("Programming Languages") ]) ])
             , div ([ "class=content" ])
                   (model.languages.map (renderLanguages))
            ]);

    empty (app);

    app.appendChild (root);


    function renderDescriptionAndButton (description, len, toShowAll, id) {
        return [ toShowAll || len <= 120 ? p ([]) ([ text (description) ])
                                         : p ([]) ([ text (description.slice (0, 120) + " ...") ])
               , len <= 120 ? text ("")
                            : toShowAll ? button ([ "id=" + id, "type=button", { onclick: less } ])
                                              ([ text ("Show Less") ])
                                        : button ([ "id=" + id, "type=button", { onclick: more } ])
                                              ([ text ("Show More") ])
               ];
    }


    function renderLanguages ({ name, description, toShowAll, id }) {
        return div ([])
                   ([ h2 ([]) ([ text (name) ])
                    , ...renderDescriptionAndButton (description, description.length, toShowAll, id, )
                   ]);
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.MORE: {
            model.languages[msg.payload.target.id].toShowAll = true;

            return model;
        }

        case MSGS.LESS: {
            model.languages[msg.payload.target.id].toShowAll = false;

            return model;
        }
    }
}
