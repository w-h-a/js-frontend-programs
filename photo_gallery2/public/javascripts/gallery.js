const MSGS =
    { POST_OPINION: "POST_OPINION"
    , POST_OPINION_SUCCESS: "POST_OPINION_SUCCESS"
    , POST_COMMENT: "SAVE_COMMENT"
    , POST_COMMENT_SUCCESS: "POST_COMMENT_SUCCESS"
    , GET_PHOTOS_SUCCESS: "GET_PHOTOS_SUCCESS"
    , GET_COMMENTS_SUCCESS: "GET_COMMENTS_SUCCESS"
    , LEFT: "LEFT"
    , RIGHT: "RIGHT"
    };


const init =
    { model: { photos: null
             , currentPhoto: 0
             , currentComments: null
             , newComment: null
             , newCommentData: null
             , newOpinionData: null
             }
    , command: getPhotos ()
    };


function view (dispatch, model) {
    const main = document.querySelector ("#app");

    if (model.photos && model.currentComments) {
        const root =
            div ([])
                ([ div ([ "class=header" ])
                       ([ div ([ "class=header-nav" ])
                              ([ a ([ "href=#", { onclick: e => dispatch ({ type: MSGS.LEFT, payload: e }) } ]) ([ i ([ "class=fa fa-2x fa-arrow-left" ]) ([]) ])
                               , h1 ([]) ([ text ("Picshare") ])
                               , a ([ "href=#", { onclick: e => dispatch ({ type: MSGS.RIGHT, payload: e }) } ]) ([ i ([ "class=fa fa-2x fa-arrow-right" ]) ([]) ])
                              ])
                       ])
                 , div ([ "class=content-flow" ])
                       ([ viewDetailedPhoto (model.photos[model.currentPhoto], model.currentComments) ])
                ]);

        empty (main);

        main.appendChild (root);
    }


    function viewComment (comment) {
        return li ([])
                   ([ strong ([]) ([ text (comment.name + ":") ])
                    , text (" " + comment.body)
                   ]);
    }

    function viewCommentList (comments) {
        switch (comments.length) {
            case 0: {
                return text ("");
            }

            default: {
                return div ([ "class=comments" ])
                           ([ ul ([])
                                  (comments.map (viewComment)) ]);
            }
        }
    }

    function viewComments (comments) {
        return div ([])
                   ([ viewCommentList (comments)
                    , form ([ "action=/comments/new", "method=POST", "class=new-comment", { onsubmit: e => dispatch ({ type: MSGS.POST_COMMENT, payload: e }) } ])
                          ([ input ([ "name=name", "type=text", "placeholder=Enter your name..." ]) ([])
                           , input ([ "name=body", "type=text", "placeholder=Add a comment..." ]) ([])
                           , button ([]) ([ text ("Save") ])
                          ])
                   ]);
    }

    function viewDetailedPhoto ({ url, caption, liked }, comments) {
        return div ([ "class=detailed-photo" ])
                   ([ img ([ "src=" + url ]) ([])
                    , div ([ "class=photo-info" ])
                          ([ div ([ "class=like-button" ])
                                 ([ i ([ "class=fa fa-2x " + (liked ? "fa-heart" : "fa-heart-o"), { onclick: e => dispatch ({ type: MSGS.POST_OPINION, payload: e }) } ]) ([]) ])
                           , h2 ([ "class=caption" ]) ([ text (caption) ])
                           , viewComments (comments)
                          ])
                   ]);
    }
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.POST_OPINION: {
            model.newOpinionData =
                new URLSearchParams ("photo_id=" + model.photos[model.currentPhoto].id.toString ());

            const command = postOpinion (model);

            return [ model, command ];
        }

        case MSGS.POST_OPINION_SUCCESS: {
            const command = getPhotos ();

            return [ model, command ];
        }

        case MSGS.POST_COMMENT: {
            msg.payload.preventDefault ();

            model.newComment =
               msg.payload.target;

            if (model.newComment["name"].value !== "" && model.newComment["body"].value !== "") {
                model.newCommentData = new FormData (model.newComment);
                model.newCommentData.set ("photo_id", model.photos[model.currentPhoto].id);
                model.newCommentData =
                    new URLSearchParams ([ ...model.newCommentData ]);
                const command = postComment (model);
                return [ model, command ]
            }

            else {
                return model;
            }
        }

        case MSGS.POST_COMMENT_SUCCESS: {
            const command =
                getComments (model);

            return [ model, command ];
        }

        case MSGS.GET_PHOTOS_SUCCESS: {
            model.photos =
                msg.payload;

            const command =
                getComments (model);

            return [ model, command ];
        }

        case MSGS.GET_COMMENTS_SUCCESS: {
            model.currentComments =
                msg.payload;

            return model;
        }

        case MSGS.LEFT: {
            msg.payload.preventDefault ();

            switch (model.currentPhoto - 1) {
                case (-1): {
                    model.currentPhoto =
                        model.photos.length - 1;
                    break;
                }

                default: {
                    model.currentPhoto =
                        model.currentPhoto - 1;
                    break;
                }
            }

            const command = getComments (model);

            return [ model, command ];
        }

        case MSGS.RIGHT: {
            msg.payload.preventDefault ();

            switch (model.currentPhoto + 1) {
                case (model.photos.length): {
                    model.currentPhoto =
                        0;
                    break;
                }

                default: {
                    model.currentPhoto =
                        model.currentPhoto + 1;
                    break;
                }
            }

            const command = getComments (model);

            return [ model, command ];
        }

        default: {
            return model;
        }
    }
}


function events (dispatch) {

}


// http commands

function getPhotos () {
    return { request: { url: "/photos"
                      , method: "GET"
                      }
           , successMsg: resp => ({ type: MSGS.GET_PHOTOS_SUCCESS, payload: resp })
           };
}


function getComments (model) {
    return { request: { url: "/comments?photo_id=" + model.photos[model.currentPhoto].id
                      , method: "GET"
                      }
           , successMsg: resp => ({ type: MSGS.GET_COMMENTS_SUCCESS, payload: resp })
           };
}


function postComment (model) {
    return { request: { url: model.newComment.action
                      , method: model.newComment.method
                      , body: model.newCommentData
                      }
           , successMsg: resp => ({ type: MSGS.POST_COMMENT_SUCCESS, payload: resp })
           };
}


function postOpinion (model) {
    return { request: { url: "/photos/like"
                      , method: "POST"
                      , body: model.newOpinionData
                      }
           , successMsg: resp => ({ type: MSGS.POST_OPINION_SUCCESS, payload: resp })
           };
}
