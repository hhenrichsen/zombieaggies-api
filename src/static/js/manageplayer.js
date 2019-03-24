let player;

let adminInit = function ()
{
    let id = document.querySelector('.user-manage').dataset.id;
    fetch(`/api/v1/users/${id}`).then(res => res.json()).then(json =>
    {
        player = json;
    });
};

let handleFetch = function (res)
{
    return res.json().then(json =>
    {
        if (res.ok)
        {
            return json;
        }
        else
        {
            let error = {
                ...json, ...{
                    status: res.status,
                    statusText: res.statusText,
                },
            };
            return Promise.reject(error);
        }
    });
};

let clearAccount = function ()
{
    if (!confirm("Delete this user?"))
    {
        return;
    }
    fetch(`/api/v1/users/${player.id}`,
        {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": document.body.getAttribute("data-csrf"),
            },
        })
        .then(handleFetch)
        .then(json =>
        {
            let oldElement = document.querySelector(`#player-${id}`);
            oldElement.parentElement.removeChild(oldElement);
        })
        .catch(err => displayError(err));
};

let togglePerm = function (el)
{
    let perm = el.id;
    console.log("Perm: " + perm);
    player.permissions[perm] = !player.permissions[perm];
    if (player.permissions[perm])
    {
        el.firstChild.classList.remove('fa-minus-square', 'box-inactive');
        el.firstChild.classList.add('fa-check-square', 'box-active');
    }
    else
    {
        el.firstChild.classList.remove('fa-check-square', 'box-active');
        el.firstChild.classList.add('fa-minus-square', 'box-inactive');
    }
};

let regenCode = function ()
{

    fetch(`/api/v1/users/${player.id}/regenCode`,
        {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": document.body.getAttribute("data-csrf"),
            },
        })
        .then(handleFetch)
        .then(json =>
        {
            let oldElement = document.querySelector(`#code`).children[1];
            oldElement.textContent = json.code;
        })
        .catch(err => displayError(err));
};

let toggleBandanna = function (el)
{
    player.bandanna = !player.bandanna;
    if (player.bandanna)
    {
        el.classList.remove('fa-minus-square', 'box-inactive');
        el.classList.add('fa-check-square', 'box-active');
    }
    else
    {
        el.classList.remove('fa-check-square', 'box-active');
        el.classList.add('fa-minus-square', 'box-inactive');
    }
};

let saveChanges = async function ()
{
    [ 'firstname',
        'lastname',
        'title',
        'email',
        'phone',
        'aNumber', ].forEach(i =>
    {
        player[i] = document.querySelector(`#${i}`).children[1].value;
    });

    player['username'] = player.email;
    delete player.email;

    [ 'tags',
        'team', ].forEach(i =>
    {
        player[i] = parseInt(document.querySelector(`#${i}`).children[1].value);
    });
    await Promise.all([
        fetch(`/api/v1/users/${player.id}`,
            {
                method: 'PATCH',
                body: JSON.stringify(player),
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": document.body.getAttribute("data-csrf"),
                },
            }),
        fetch(`/api/v1/users/${player.id}/permissions`,
            {
                method: 'PATCH',
                body: JSON.stringify(player.permissions),
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": document.body.getAttribute("data-csrf"),
                },
            }),
    ]);
    window.location.href = "/admin";
};