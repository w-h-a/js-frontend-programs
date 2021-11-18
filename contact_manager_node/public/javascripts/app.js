const MSGS =
    { ROUTE: "ROUTE"
    , SEARCH: "SEARCH"
    , MODAL: "MODAL"
    , CANCEL_DELETE: "CANCEL_DELETE"
    , GET_CONTACTS_SUCCESS: "GET_CONTACTS_SUCCESS"
    , POST_CONTACT: "POST_CONTACT"
    , POST_CONTACT_SUCCESS: "POST_CONTACT_SUCCESS"
    , POST_CONTACT_FAILURE: "POST_CONTACT_FAILURE"
    , PUT_CONTACT: "PUT_CONTACT"
    , PUT_CONTACT_SUCCESS: "PUT_CONTACT_SUCCESS"
    , PUT_CONTACT_FAILURE: "PUT_CONTACT_FAILURE"
    , DELETE_CONTACT: "DELETE_CONTACT"
    , DELETE_CONTACT_SUCCESS: "DELETE_CONTACT_SUCCESS"
    , DELETE_CONTACT_FAILURE: "DELETE_CONTACT_FAILURE"
    };


const init =
    { model: { hash: window.location.hash
             , contacts: []
             , tags: []
             , contact: {}
             , toConfirm: false
             , toDelete: null
             , searchTerm: ""
             }
    , command: getContacts ()
    };


function view (dispatch, model) {
    const app = document.querySelector ("#app");
    const content = document.querySelector ("#content");
    if (model.hash === "#/contacts/new") {
        empty (content);
        content.append (renderNewForm (dispatch, model));
    }
    else if (/^#\/contacts\/edit\/\d+$/.test (model.hash) && model.contacts.length > 0) {
        empty (content);
        content.append (renderEditForm (dispatch, model));
    }
    else {
        empty (content);
        content.append (renderContacts (dispatch, model));
        if (model.toConfirm) {
            app.append (div ([ "id=overlay" ]) ([]));
            app.append (renderModal (dispatch, model));
        }
        else {
            while (app.lastElementChild.nodeName === "DIV") {
                app.removeChild (app.lastElementChild);
            }
        }
    }
}


function renderContacts (dispatch, model) {
    const isKeeper =
        contact => {
            const tag =
                model.hash.split ('/')
                          .slice ()
                          .reverse ()[0]
                          .replace (/%20/g, ' ');
            const len = model.searchTerm.length;
            const [ first, last ] = contact.full_name.split (' ');
            if (/^#\/.+$/.test (model.hash) && model.searchTerm) {
                return contact.tags?.split (',').includes (tag)
                    && (  first.toLowerCase ().slice (0, len) === model.searchTerm.toLowerCase ()
                       || last?.toLowerCase ().slice (0, len) === model.searchTerm.toLowerCase ()
                       );
            }
            else if (/^#\/.+$/.test (model.hash)) {
                return contact.tags?.split (',')
                                    .includes (tag);
            }
            else if (model.searchTerm) {
                return first.toLowerCase ().slice (0, len) === model.searchTerm.toLowerCase ()
                    || last?.toLowerCase ().slice (0, len) === model.searchTerm.toLowerCase ();
            }
            else {
                return true;
            }
        };
    const htmlOfContact =
        contact =>
            div ([])
                ([ h2 ([]) ([ text (contact.full_name) ])
                 , ul ([])
                       ([ li ([]) ([ text ("Email: " + contact.email) ])
                        , li ([]) ([ text ("Phone: " + contact.phone_number) ])
                        , li ([]) ([ text ("Tags: " + (!contact.tags ? "" : contact.tags.split (',').join (', '))) ])
                       ])
                 , a ([ "id=edit-" + contact.id, "href=#/contacts/edit/" + contact.id ]) ([ text ("Edit") ])
                 , text (" ")
                 , button ([ "id=delete-" + contact.id
                           , { onclick: e => dispatch ({ type: MSGS.MODAL, payload: contact.id }) }
                          ])
                       ([ text ("Delete") ])
                ]);
    return div ([])
               ([ input ([ "id=search"
                         , "placeholder=search"
                         , "value=" + model.searchTerm
                         , { onchange: e => dispatch ({ type: MSGS.SEARCH, payload: e }) }
                         ]) ([])
                , text (" ")
                , a ([ "id=add-new", "href=#/contacts/new" ]) ([ text ("Add Contact") ])
                , text (" ")
                , text ("Remove tags: ")
                , a ([ "id=all", "href=#/" ]) ([ text ("all") ])
                , text (" ")
                , text ("Filter by tags: ")
                ]
                .concat ( !model.tags ? []
                                      : model.tags.map ( tag =>
                                                             span ([])
                                                                 ([ a ([ "id=" + tag, "href=#/" + tag ]) ([ text (tag) ])
                                                                  , text (" ")
                                                                 ])
                                                       )
                        )
                .concat ( !model.contacts ? []
                                          : model.contacts.filter (isKeeper)
                                                          .map (htmlOfContact)
                        )
               );
}


function renderNewForm (dispatch, model) {
    return form ([ "id=new-contact-form" ])
                ([ input ([ "id=full-name", "type=text", "placeholder=full name" ]) ([])
                 , br ([]) ([])
                 , input ([ "id=email", "type=email", "placeholder=email" ]) ([])
                 , br ([]) ([])
                 , input ([ "id=phone", "type=tel", "placeholder=phone #: 0000000000" ]) ([])
                 , br ([]) ([])
                 , input ([ "id=tags", "type=text", "placeholder=comma separated tags" ]) ([])
                 , br ([]) ([])
                 , a ([ "id=submit"
                      , "href=#/"
                      , { onclick: e => {
                                const resultOfCheck = checkForm (e.target.parentElement);
                                if (!resultOfCheck[0]) {
                                    alert (resultOfCheck[1]);
                                    return resultOfCheck[0];
                                }
                                dispatch ({ type: MSGS.POST_CONTACT, payload: e });
                            }
                        }
                     ]) ([ text ("Submit") ])
                 , text (" ")
                 , a ([ "id=cancel", "href=#/" ]) ([ text ("Cancel") ])
                ]);
}

function renderEditForm (dispatch, model) {
    const id = Number (model.hash.split ('/').slice ().reverse ()[0]);
    const contact = model.contacts.find (contact => contact.id === id);
    return form ([ "id=edit-contact-form" ])
                ([ input ([ "id=full-name", "type=text", "placeholder=full name", "value=" + contact.full_name ]) ([])
                 , br ([]) ([])
                 , input ([ "id=email", "type=email", "placeholder=email", "value=" + contact.email ]) ([])
                 , br ([]) ([])
                 , input ([ "id=phone", "type=tel", "placeholder=phone #: 0000000000", "value=" + contact.phone_number ]) ([])
                 , br ([]) ([])
                 , input ([ "id=tags", "type=text", "placeholder=comma separated tags", "value=" + (!contact.tags ? "" : contact.tags) ]) ([])
                 , br ([]) ([])
                 , a ([ "id=submit"
                      , "href=#/"
                      , { onclick: e => {
                                const resultOfCheck = checkForm (e.target.parentElement);
                                if (!resultOfCheck[0]) {
                                    alert (resultOfCheck[1]);
                                    return resultOfCheck[0];
                                }
                                dispatch ({ type: MSGS.PUT_CONTACT, payload: contact });
                            }
                        }
                     ]) ([ text ("Submit") ])
                 , text (" ")
                 , a ([ "id=cancel", "href=#/" ]) ([ text ("Cancel") ])
                ]);
}

function renderModal (dispatch, model) {
    return div ([ "id=modal" ])
               ([ p ([]) ([ text ("Are you sure you want to delete this contact?") ])
                , button ([ "class=confirm"
                          , "id=yes", "type=button"
                          , { onclick: e => dispatch ({ type: MSGS.DELETE_CONTACT }) }
                         ]) ([ text ("Yes") ])
                , text (" ")
                , button ([ "class=confirm"
                          , "id=no"
                          , "type=button"
                          , { onclick: e => dispatch ({ type: MSGS.CANCEL_DELETE }) }
                         ]) ([ text ("No") ])
               ]);
}


function update (msg, model) {
    switch (msg.type) {
        case MSGS.ROUTE: {
            model.hash = window.location.hash;
            return model;
        }
        case MSGS.SEARCH: {
            model.searchTerm = msg.payload.target.value;
            return model;
        }
        case MSGS.MODAL: {
            model.toConfirm = true;
            model.toDelete = msg.payload;
            return model;
        }
        case MSGS.CANCEL_DELETE: {
            model.toConfirm = false;
            model.toDelete = null;
            return model;
        }
        case MSGS.DELETE_CONTACT: {
            model.toConfirm = false;
            const command = deleteContact (model);
            return [ model, command ];
        }
        case MSGS.DELETE_CONTACT_SUCCESS: {
            model.toDelete = null;
            const command = getContacts ();
            return [ model, command ];
        }
        case MSGS.DELETE_CONTACT_FAILURE: {
            model.toDelete = null;
            alert (msg.payload.message);
            return model;
        }
        case MSGS.GET_CONTACTS_SUCCESS: {
            model.contacts =
                msg.payload.slice ()
                           .sort ((x, y) => {
                               if (x.full_name <= y.full_name) {
                                   return -1;
                               }
                               else {
                                   return +1;
                               }
                           });
            model.tags =
                model.contacts
                    .flatMap (contact => !contact.tags ? [] : contact.tags.split (','))
                    .filter ((tag, idx, src) => idx === src.indexOf (tag));
            return model;
        }
        case MSGS.POST_CONTACT: {
            Object.assign (model.contact, json (msg.payload.target.parentElement));
            const command = postContact (model);
            return [ model, command ];
        }
        case MSGS.POST_CONTACT_SUCCESS: {
            const command = getContacts ();
            return [ model, command ];
        }
        case MSGS.POST_CONTACT_FAILURE: {
            alert (msg.payload.message);
            return model;
        }
        case MSGS.PUT_CONTACT: {
            model.contact = msg.payload;
            Object.assign (model.contact, json (document.querySelector ("#edit-contact-form")));
            const command = putContact (model);
            return [ model, command ];
        }
        case MSGS.PUT_CONTACT_SUCCESS: {
            const command = getContacts ();
            return [ model, command ];
        }
        case MSGS.PUT_CONTACT_FAILURE: {
            alert (msg.payload.message);
            return model;
        }
        default: {
            return model;
        }
    }
}


function events (dispatch) {
    window.onhashchange = () => dispatch ({ type: MSGS.ROUTE });
}
