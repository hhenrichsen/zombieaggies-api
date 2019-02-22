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
    let bar = document.getElementById("leftbar");
    let main = document.getElementById("main");
    if (bar.classList.contains("leftbar-closed"))
    {
        bar.classList.remove("leftbar-closed");
        bar.classList.add("leftbar-open");
        main.style.setProperty("--size-offset", "200px");
        main.classList.add("unfocused");
    }
    else
    {
        bar.classList.remove("leftbar-open");
        bar.classList.add("leftbar-closed");
        main.style.setProperty("--size-offset", "50px");
        main.classList.remove("unfocused");
    }
}