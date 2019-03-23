var errTimeout = 0;

function adminInit()
{
    addUsers();
}

let addUsers = function ()
{
    fetch(`/admin/users`)
        .then(res => res.json())
        .then(json =>
        {
            Object.values(json).forEach(i => addPlayer(i));
        });
};

let dayTwo = function (element)
{
    fetch(`/admin/dayTwo`)
};

let undoDayTwo = function (element)
{
    fetch(`/admin/undoDayTwo`)
};

let resetPoints = function (element)
{
    fetch(`/admin/resetPoints`)
};

let promote = function (id)
{
    fetch(`/admin/users/${id}/moderator`)
        .then(handleFetch)
        .then(json =>
        {
            fetch(`/admin/users/${id}`)
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

let toggleBandanna = function (id)
{
    fetch(`/admin/users/${id}/toggleBandanna`)
        .then(handleFetch)
        .then(json =>
        {
            fetch(`/admin/users/${id}`)
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
    let root = document.querySelector('.player-container');
    root.firstChild.appendChild(buildPlayerElement(p));
};

let handleFetch = function (res)
{
    return res.json().then(json =>
    {
        if (res.ok)
        {
            return json
        }
        else
        {
            let error = {...json, ...{
                    status: res.status,
                    statusText: res.statusText,
                }, };
            return Promise.reject(error);
        }
    });
};

let displayError = function (err)
{
    if(errTimeout)
    {
        clearTimeout(errTimeout)
    }
    if(err)
    {
        let errorElement = document.querySelector("#error");
        errorElement.style.display = "block";
        errorElement.firstChild.textContent = err.message;
        errTimeout = setTimeout(() =>
        {
            let errorElement = document.querySelector("#error");
            errorElement.style.display = "none";
        }, 10000); //10 seconds
    }
};

let clearAccount = function (id)
{
    if(!confirm("Delete this user?"))
    {
        return;
    }

    fetch(`/admin/users/${id}/delete`)
        .then(handleFetch)
        .then(json =>
        {
            let oldElement = document.querySelector(`#player-${id}`);
            oldElement.parentElement.removeChild(oldElement);
        })
        .catch(err => displayError(err))
};

let demote = function (id)
{
    fetch(`/admin/users/${id}/demote`)
        .then(handleFetch)
        .then(json =>
        {
            fetch(`/admin/users/${id}`)
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

let buildPlayerElement = function (p)
{

    let playerInfo = document.createElement('tr');
    playerInfo.classList.add('player-info');
    playerInfo.id = `player-${p.id}`;
    playerInfo.dataset.id = p.id;

    //PlayerData
    ['firstname',
        'lastname',
        'title',
        'email',
        'phone',
        'aNumber',].forEach(i => createPlayerData(i, playerInfo, p));

    //Bandanna Special Case
    let bandanna = document.createElement('td');
    bandanna.classList.add('player-data', 'bandanna');
    bandanna.appendChild(createPermissionIcon(p['bandanna']));
    playerInfo.appendChild(bandanna);

    let permissions = document.createElement('td');
    permissions.classList.add('player-data', 'permissions');
    //Permissions
    ['viewHiddenTabs',
        'viewHiddenTeams',
        'accessPointManagement',
        'useAdminRoutes',
        'accessUserManagement',].forEach(i => createPermissionData(i, permissions, p));
    playerInfo.appendChild(permissions);

    let quickActions = document.createElement('td');
    quickActions.classList.add('player-data', 'quickActions');
    let promoteBtn = document.createElement('button');
    promoteBtn.addEventListener('click', () => promote(p.id));
    promoteBtn.innerText = "Mod";
    let unmodBtn = document.createElement('button');
    unmodBtn.addEventListener('click', () => demote(p.id));
    unmodBtn.innerText = "Unmod";
    let deleteBtn = document.createElement('button');
    deleteBtn.addEventListener('click', () => clearAccount(p.id));
    deleteBtn.innerText = "X";
    quickActions.appendChild(promoteBtn);
    let toggleBandannaBtn = document.createElement('button');
    toggleBandannaBtn.addEventListener('click', () => toggleBandanna(p.id));
    toggleBandannaBtn.innerText = "Bandanna";
    quickActions.appendChild(promoteBtn);
    quickActions.appendChild(toggleBandannaBtn);
    quickActions.appendChild(unmodBtn);
    quickActions.appendChild(deleteBtn);
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