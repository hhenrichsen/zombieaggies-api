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
            json.data.forEach(i => addPlayer(i));
        });
};

let promote = function (id)
{
    fetch(`/admin/users/${id}/moderator`)
        .then(res => res.json())
        .then(json =>
        {
            fetch(`/admin/users/${id}`)
                .then(res => res.json())
                .then(json =>
                {
                    let oldElement = document.querySelector(`#player-${id}`);
                    let newElement = buildPlayerElement(json.data);
                    let parent = oldElement.parentElement;
                    parent.replaceChild(newElement, oldElement);
                });
        });
};

let toggleBandanna = function (id)
{
    fetch(`/admin/users/${id}/toggleBandanna`)
        .then(res => res.json())
        .then(json =>
        {
            fetch(`/admin/users/${id}`)
                .then(res => res.json())
                .then(json =>
                {
                    let oldElement = document.querySelector(`#player-${id}`);
                    let newElement = buildPlayerElement(json.data);
                    let parent = oldElement.parentElement;
                    parent.replaceChild(newElement, oldElement);
                });
        });
};

let addPlayer = function (p)
{
    let root = document.querySelector('#players');
    root.appendChild(buildPlayerElement(p));
};

let clearAccount = function (id)
{
    fetch(`/admin/users/${id}/delete`)
        .then(res => res.json())
        .then(json =>
        {
            let oldElement = document.querySelector(`#player-${id}`);
            oldElement.parentElement.removeChild(oldElement);
        });
};

let demote = function (id)
{
    fetch(`/admin/users/${id}/demote`)
        .then(res => res.json())
        .then(json =>
        {
            fetch(`/admin/users/${id}`)
                .then(res => res.json())
                .then(json =>
                {
                    let oldElement = document.querySelector(`#player-${id}`);
                    let newElement = buildPlayerElement(json.data);
                    let parent = oldElement.parentElement;
                    parent.replaceChild(newElement, oldElement);
                });
        });
};

let buildPlayerElement = function (p)
{

    let playerInfo = createDivClass('player-info');
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
    let bandanna = createDivClass('player-data', 'bandanna');
    bandanna.appendChild(createPermissionIcon(p['bandanna']));
    playerInfo.appendChild(bandanna);

    let permissions = createDivClass('player-data', 'permissions');
    //Permissions
    ['viewHiddenTabs',
        'viewHiddenTeams',
        'accessPointManagement',
        'useAdminRoutes',
        'accessUserManagement',].forEach(i => createPermissionData(i, permissions, p));
    playerInfo.appendChild(permissions);

    let quickActions = createDivClass('player-data', 'quickActions');
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
    x.appendChild(createPermissionIcon(p[field]));
    permissions.appendChild(x);
};

let createPlayerData = function (field, playerInfo, p)
{
    let x = createDivClass('player-data', field);
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