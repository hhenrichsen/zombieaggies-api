var host = "";

var manageInit = () =>
{
    host = `${window.location.hostname}${window.location.port ? ":" + window.location.port : ""}`;

    for (let el of document.getElementsByClassName('location-head'))
    {
        if (!el.parentElement.classList.contains('expanded'))
        {
            el.addEventListener('click', () =>
            {
                el.parentElement.classList.toggle('expanded');
            })
        }
    }
};


var changeOwner = function (el)
{
    const data = {owner: el.getAttribute("data-team"),};
    fetch(`/api/v1/locations/${el.getAttribute("data-location")}`, {
        method: 'put',
        mode: 'same-origin',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": el.getAttribute("data-csrf"),
        },
    })
        .then(res => res.json)
        .then(json =>
        {
        }).then(() =>
    {
        if (refetch)
        {
            refetch();
        }
    });
};

var changeActive = function (el)
{
    host = `${window.location.hostname}${window.location.port ? ":" + window.location.port : ""}`;
    let id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.length);
    const data = {active: el.getAttribute("data-activity") === 'true',};
    fetch(`/api/v1/locations/${el.getAttribute("data-location")}`, {
        method: 'put',
        mode: 'same-origin',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": el.getAttribute("data-csrf"),
        },
    })
        .then(res => res.json)
        .then(() =>
        {
            if (refetch)
            {
                refetch();
            }
        });
};