function init()
{
    if (typeof mapInit !== 'undefined')
    {
        mapInit();
    }
    if (typeof manageInit !== 'undefined')
    {
        manageInit()
    }
    if (typeof adminInit !== 'undefined')
    {
        adminInit();
    }

    let register = document.querySelector("#register");
    let login = document.querySelector("#login");

    setupForm(register);
    setupForm(login);
}

function setupForm(query)
{
    if (query === null)
    {
        return;
    }
    query.addEventListener('submit', e =>
    {
        e.preventDefault();
        let action = query.action;
        let method = query.method;
        let csrf = query.querySelector("input[type=hidden]").value;
        fetch(action, {
            method: method,
            body: JSON.stringify(formToJSON(query)),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res =>
            {
                if (res.url && res.redirected)
                {
                    window.location.href = res.url;
                    return {};
                }
                return res.json()
            })
            .then(json =>
            {
                if (json.message)
                {
                    let error = document.querySelector(".auth-error>p");
                    error.parentElement.style.display = "block";
                    error.textContent = json.message;
                }
            });
    })
}

const formToJSON = elements => [].reduce.call(elements, (data, element) =>
{
    data[element.name] = element.value;
    return data;
}, {});