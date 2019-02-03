var id = "";
var host = "";

var init = function () {
    host = `${window.location.hostname}${window.location.port ? ":" + window.location.port : ""}`;
    id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.length);
}

var changeOwner = function (el) {
    const data = { owner: el.getAttribute("data-id"), active: true };
    fetch(`http://${host}/api/v1/locations/${id}`, {
        method: 'put',
        mode: 'same-origin',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(res => res.json)
        .then(json => {
            console.log('Success!')
        });
}