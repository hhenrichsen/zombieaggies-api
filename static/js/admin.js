var errTimeout = 0;

function adminInit()
{
    addUsers();
}

let addUsers = function ()
{
    fetch(`/api/v1/users`)
        .then(res => res.json())
        .then(json =>
        {
            Object.values(json).forEach(i => addPlayer(i));
        });
};

let dayTwo = function (element)
{
    fetch(`/admin/dayTwo`);
};

let undoDayTwo = function (element)
{
    fetch(`/admin/undoDayTwo`);
};

let resetPoints = function (element)
{
    fetch(`/admin/resetPoints`);
};

let newGame = function (element)
{
    fetch(`/admin/newGame`);
    fetch(`/admin/resetPoints`);
}

let toggleBandanna = function (id)
{
    fetch(`/api/v1/users/${id}/toggleBandanna`,
        {})
        .then(handleFetch)
        .then(json =>
        {
            fetch(`/api/v1/users/${id}`)
                .then(res => res.json())
                .then(json =>
                {
                    let oldElement = document.querySelector(`#player-${id}`);
                    let newElement = buildPlayerElement(json);
                    let parent = oldElement.parentElement;
                    parent.replaceChild(newElement, oldElement);
                });
        })
        .catch(err => displayError(err));
};

let addPlayer = function (p)
{
    let root = document.querySelector('#player-container');
    root.appendChild(buildPlayerElement(p));
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

function manage(id)
{
    window.location.href = `/admin/users/${id}`;
}

let buildPlayerElement = function (p)
{

    let playerInfo = document.createElement('tr');
    playerInfo.classList.add('player-info');
    playerInfo.id = `player-${p.id}`;
    playerInfo.dataset.id = p.id;

    //PlayerData
    [ 'firstname',
        'lastname',
        'title',
        'email',
        'phone',
        'aNumber', ].forEach(i => createPlayerData(i, playerInfo, p));

    //Bandanna Special Case
    let bandanna = document.createElement('td');
    bandanna.classList.add('player-data', 'bandanna');
    bandanna.appendChild(createPermissionIcon(p['bandanna']));
    playerInfo.appendChild(bandanna);

    let permissions = document.createElement('td');
    permissions.classList.add('player-data', 'permissions');
    permlist = document.createElement('div');
    permlist.classList.add('permission-list');
    //Permissions
    [ 'viewHiddenTabs',
        'viewHiddenTeams',
        'accessPointManagement',
        'useAdminRoutes',
        'accessUserManagement',
        'viewOZ', ].forEach(i => createPermissionData(i, permlist, p));
    permissions.appendChild(permlist);
    playerInfo.appendChild(permissions);

    let quickActions = document.createElement('td');
    quickActions.classList.add('player-data', 'quickActions');
    let manageBtn = document.createElement('button');
    manageBtn.addEventListener('click', () => manage(p.id));
    manageBtn.innerText = "Manage";
    let toggleBandannaBtn = document.createElement('button');
    toggleBandannaBtn.addEventListener('click', () => toggleBandanna(p.id));
    toggleBandannaBtn.innerText = "Bandanna";
    quickActions.appendChild(toggleBandannaBtn);
    quickActions.appendChild(manageBtn);
    playerInfo.appendChild(quickActions);
    return playerInfo;
};

let createPermissionData = function (field, permissions, p)
{
    let x = createDivClass('player-permission', field);
    x.title = field;
    x.appendChild(createPermissionIcon(p.permissions[field]));
    permissions.appendChild(x);
};

let createPlayerData = function (field, playerInfo, p)
{
    let x = document.createElement('td');
    x.classList.add('player-data', field);
    x.innerText = p[field];
    playerInfo.appendChild(x);
};

let createDivClass = function (...cl)
{
    let div = document.createElement('div');
    cl.forEach(c => div.classList.add(c));
    return div;
};

let createPermissionIcon = function (bool)
{
    if (bool)
    {
        let i = document.createElement('i');
        i.classList.add('fas', 'fa-fa', 'fa-check-square', 'box-active');
        return i;
    }
    else
    {
        let i = document.createElement('i');
        i.classList.add('fas', 'fa-fa', 'fa-minus-square', 'box-inactive');
        return i;
    }
};