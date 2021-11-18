"use strict";


function addAttributes (attrList, node) {
    if (Array.isArray (attrList) && attrList.length > 0) {
        attrList.forEach (attr => {
            if (typeof attr === "object") {
                Object.assign (node, attr);
                return node;
            }
            const arr = attr.split ('=');
            switch (arr[0]) {
                case "action":
                    node.setAttribute ("action", arr[1]);
                    break;

                case "checked":
                    node.setAttribute ("checked", true);
                    break;

                case "class":
                    node.className = arr[1];
                    break;

                case "data-id":
                    node.setAttribute ("data-id", arr[1]);
                    break;

                case "disabled":
                    node.setAttribute ("disabled", arr[1]);
                    break;

                case "for":
                    node.setAttribute ("for", arr[1]);
                    break;

                case "href":
                    node.setAttribute ("href", arr[1]);
                    break;

                case "id":
                    node.id = arr[1];
                    break;

                case "innerHTML":
                    node.innerHTML = arr[1];
                    break;

                case "name":
                    node.setAttribute ("name", arr[1]);
                    break;

                case "placeholder":
                    node.setAttribute ("placeholder", arr[1]);
                    break;

                case "maxlength":
                    node.setAttribute ("maxlength", arr[1]);
                    break;

                case "method":
                    node.setAttribute ("method", arr[1]);
                    break;

                case "required":
                    node.required = true;
                    break;

                case "selected":
                    node.setAttribute ("selected", true);
                    break;

                case "src":
                    node.src = arr[1];
                    break;

                case "type":
                    node.setAttribute ("type", arr[1]);
                    break;

                case "value":
                    node.value = arr[1];
                    break;

                default:
                    break;
            }
        });
    }
    return node;
}


function appendChildNodes (childNodes, parent) {
    if (Array.isArray (childNodes) && childNodes.length > 0) {
        childNodes.forEach (function (ele) {
            parent.appendChild (ele);
        });
    }
    return parent;
}


// unexposed helper
const createElement = type => attrList => childNodes =>
    appendChildNodes (childNodes, addAttributes (attrList, document.createElement (type)));


// the rest are exposed
const a = attrList => childNodes =>
    createElement ("a") (attrList) (childNodes);


const article = attrList => childNodes =>
    createElement ("article") (attrList) (childNodes);


const br = attrList => childNodes =>
    createElement ("br") (attrList) (childNodes);


const button = attrList => childNodes =>
    createElement ("button") (attrList) (childNodes);


const div = attrList => childNodes =>
    createElement ("div") (attrList) (childNodes);


const em = attrList => childNodes =>
    createElement ("em") (attrList) (childNodes);


const fieldset = attrList => childNodes =>
    createElement ("fieldset") (attrList) (childNodes);


const figure = attrList => childNodes =>
    createElement ("figure") (attrList) (childNodes);


const figcaption = attrList => childNodes =>
    createElement ("figcaption") (attrList) (childNodes);


const footer = attrList => childNodes =>
    createElement ("footer") (attrList) (childNodes);


const form = attrList => childNodes =>
    createElement ("form") (attrList) (childNodes);


const h1 = attrList => childNodes =>
    createElement ("h1") (attrList) (childNodes);


const h2 = attrList => childNodes =>
    createElement ("h2") (attrList) (childNodes);


const header = attrList => childNodes =>
    createElement ("header") (attrList) (childNodes);


const img = attrList => childNodes =>
    createElement ("img") (attrList) (childNodes);


const input = attrList => childNodes =>
    createElement ("input") (attrList) (childNodes);


const label = attrList => childNodes =>
    createElement ("label") (attrList) (childNodes);


const li = attrList => childNodes =>
    createElement ("li") (attrList) (childNodes);


const main = attrList => childNodes =>
    createElement ("main") (attrList) (childNodes);


const option = attrList => childNodes =>
    createElement ("option") (attrList) (childNodes);


const p = attrList => childNodes =>
    createElement ("p") (attrList) (childNodes);


const section = attrList => childNodes =>
    createElement ("section") (attrList) (childNodes);


const select = attrList => childNodes =>
    createElement ("select") (attrList) (childNodes);


const span = attrList => childNodes =>
    createElement ("span") (attrList) (childNodes);


const strong = attrList => childNodes =>
    createElement ("strong") (attrList) (childNodes);


const text = txt =>
    document.createTextNode (txt);


const textarea = attrList => childNodes =>
    createElement ("textarea") (attrList) (childNodes);


const tr = attrList => childNodes =>
    createElement ("tr") (attrList) (childNodes);


const ul = attrList => childNodes =>
    createElement ("ul") (attrList) (childNodes);

/*
Object.assign (module.exports, {
  addAttributes,
  appendChildNodes,
  a,
  article,
  br,
  button,
  div,
  em,
  fieldset,
  figure,
  figcaption,
  footer,
  form,
  h1,
  h2,
  header,
  img,
  input,
  label,
  li,
  main,
  option,
  p,
  section,
  select,
  span,
  strong,
  text,
  textarea,
  tr,
  ul,
});
*/
