const MSGS =
    { GET_QUOTES: "GET_QUOTES"
    , GET_QUOTES_SUCCESS: "GET_QUOTES_SUCCESS"
    , GET_QUOTES_FAILURE: "GET_QUOTES_FAILURE"
    , DONE: "DONE"
    };


const init =
    { model: { data: null
             , currentPage: 1
             , limit: 10
             , total: 0
             , loader: true
             }
    , command: getQuotes (1, 10)
    }


function view (dispatch, model) {
    const quotesElement = document.querySelector (".quotes");
    const loader = document.querySelector (".loader");
    if (model.loader) showLoader (dispatch, model);
    if (!model.loader) hideLoader (dispatch, model);
    if (model.data) renderQuotes (dispatch, model);

    function showLoader (dispatch, model) {
        loader.classList.add ("show");
    }

    function hideLoader (dispatch, model) {
        loader.classList.remove ("show");
    }

    function renderQuotes (dispatch, model) {
        model.data.forEach (quote => {
            const quoteElement =
                blockquote ([ "class=quote" ])
                    ([ span ([]) ([ text (` ${quote.id}) `) ])
                     , text (` ${quote.quote} `)
                     , footer ([]) ([ text (` ${quote.author} `) ])
                    ]);
            quotesElement.appendChild (quoteElement);
        });
        dispatch ({ type: MSGS.DONE });
    }
}


function update (msg, model) {
    const hasMoreQuotes =
        model =>
            model.total === 0 || ((model.currentPage - 1) * model.limit + 1) < model.total;

    switch (msg.type) {
        case MSGS.GET_QUOTES: {
            if (hasMoreQuotes (model)) {
                model.currentPage = model.currentPage + 1;
                model.loader = true;
                const command = getQuotes (model.currentPage, model.limit);
                return [ model, command ];
            }
            else {
                return model;
            }
        }

        case MSGS.GET_QUOTES_SUCCESS: {
            model.data = msg.payload.data;
            model.total = msg.payload.total;
            return model;
        }

        case MSGS.DONE: {
            model.data = null;
            model.loader = false;
            return model;
        }
    }
}


function events (dispatch) {
    window.addEventListener ("scroll", () => {
        const { scrollTop
              , scrollHeight
              , clientHeight
              } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5)
            dispatch ({ type: MSGS.GET_QUOTES });
    }, { passive: true });
}



// http commands

function getQuotes (page, limit) {
    return { request: { url: `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`
                      , method: "GET"
                      }
           , successMsg: resp => ({ type: MSGS.GET_QUOTES_SUCCESS, payload: resp })
           , failureMsg: resp => ({ type: MSGS.GET_QUOTES_FAILURE, payload: resp })
           };
}
