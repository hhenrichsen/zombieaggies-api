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
}


function toggleNav()
{
    let nav = document.getElementById("nav");
    let main = document.getElementById("main");
    if (nav.classList.contains("nav-closed"))
    {
        nav.classList.remove("nav-closed");
        nav.classList.add("nav-open");
        main.style.setProperty("--size-offset", "200px");
        main.classList.add("unfocused");
    }
    else
    {
        nav.classList.remove("nav-open");
        nav.classList.add("nav-closed");
        main.style.setProperty("--size-offset", "50px");
        main.classList.remove("unfocused");
    }
}