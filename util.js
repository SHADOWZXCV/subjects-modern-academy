async function loadSpecificationData(spec) {
    return await fetch(spec).then(val => val.json()).then(data => data)
}


function createElement(tagName) {
    return document.createElement(tagName)
}