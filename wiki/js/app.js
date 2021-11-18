const MSGS =
    { GET_SEARCH_RESULTS: "GET_SEARCH_RESULTS"
    , GET_SEARCH_RESULTS_SUCCESS: "GET_SEARCH_RESULTS_SUCCESS"
    , GET_SEARCH_RESULTS_FAILURE: "GET_SEARCH_RESULTS_FAILURE"
    };


const init =
    { model: { url: "https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch="
             , base: "https://en.wikipedia.org/?curid="
             , input: null
             , results: null
             }
    , command: null
    };


function update (msg, model) {
    switch (msg.type) {
        case MSGS.GET_SEARCH_RESULTS: {
            model.input = msg.payload.target.value.trim ();
            const command = getSearchResults (model);
            return [ model, command ];
        }
        case MSGS.GET_SEARCH_RESULTS_SUCCESS: {
            const stripHtml =
                html =>
                    (div => {
                        div.innerHTML = html;
                        return div.textContent;
                    }) (document.createElement ("div"));
            const objOfRes =
                result =>
                    ({ title: stripHtml (result.title)
                     , snippet: stripHtml (result.snippet)
                     , pageid: result.pageid
                    });
            const cleanUp =
                results =>
                    results.map (objOfRes);
            model.results =
                !msg.payload.query ? []
                                   : cleanUp (msg.payload.query.search);
            return model;
        }
        case MSGS.GET_SEARCH_RESULTS_FAILURE: {
            console.log (msg.payload.message);
            return model;
        }
        default: {
            return model;
        }
    }
}


const link =
    result =>
        model =>
            (link =>
                child => {
                    link.setAttribute ("href", model.base + result.pageid);
                    link.append (child);
                    return link;
                }
            ) (document.createElement ("a")) (h2 ([]) ([ text (result.title) ]));


function articleOfResult (result) {
    const art =
        article ([])
            ([ link (result) (this)
             , div ([ "class=summary" ]) ([ text (result.snippet + "...") ])
            ]);
    return art;
}


const viewSearchResults =
    (dispatch, model) =>
        main ([ "id=searchResult" ])
            (model.results.map (articleOfResult), { model });


function view (dispatch, model) {
    if (model.results) {
        const app = document.querySelector ("#app");
        if (app.lastChild.nodeName === "MAIN")
            app.removeChild (app.lastChild);
        app.append (viewSearchResults (dispatch, model));
    }
}
