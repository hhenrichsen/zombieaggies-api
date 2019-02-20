var map;
var info;

var hasInitialized = false;
var hostname = '';
var isMobile;

var data = {
    locations: {},
    teams: {},
};

var init = async function ()
{
    hostname = `${window.location.hostname}${parseInt(window.location.port) !== 80 ? ":" + window.location.port : ""}`;

    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let mapDiv = document.querySelector("#map");
    let corner1 = L.latLng(41.738, -111.80),
        corner2 = L.latLng(41.745, -111.82),
        map = L.map(mapDiv, {
            center: [ 41.741499, -111.809175, ],
            zoom: 16,
            minZoom: 16,
            maxBounds: L.latLngBounds(corner1, corner2),
            maxBoundsViscosity: 1,
        });

    L.tileLayer(' 	https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.',
    }).addTo(map);

    await fetch(`http://${hostname}/api/v1/teams`, {
        method: 'GET',
        async: false,
        headers: {"Content-Type": "application/json",},
    })
        .then(response => response.json())
        .then(json =>
        {
            // console.debug("Loaded owner data: ", json);
            data.teams = json.data;
        });
    await fetch(`http://${hostname}/api/v1/locations`, {
        method: 'GET',
        async: false,
        headers: {"Content-Type": "application/json",},
    })
        .then(response => response.json())
        .then(json =>
        {
            // console.debug("Loaded data: ", json);
            json.data.forEach(i => parseApiLocation(i));

            for (let idx in data.locations)
            {
                if (!data.locations.hasOwnProperty(idx))
                {
                    continue;
                }
                let pos = data.locations[idx];
                data.locations[idx].marker = L.circle(pos.position,
                    {
                        color: pos.online ? getColor(pos) : "dimgray",
                        fillColor: pos.online ? getColor(pos) : "dimgray",
                        fillOpacity: 0.5,
                        radius: 25,
                    })
                    .addTo(map)
                    .bindPopup(`<b>${pos.name}</b><br><i>${pos.building}</i><br>Status: ${pos.online ? "Online" : "Offline"}<br>Owner: ${data.teams[pos.owner].name}`);
            }

            info = L.control();

            info.onAdd = function ()
            {
                this._div = L.DomUtil.create('div', 'info');
                this.update();
                return this._div;
            };

            info.update = function ()
            {
                this._div.innerHTML = `<h4>Points</h4>` + Object.values(data.teams).filter(i => i.name !== "Neutral").reduce((a, i) =>
                    a + `<p style="color: ${i.color};"><b>${i.name}:</b> ${i.points}</p>`, "");
            };

            info.addTo(map);

            hasInitialized = true;
        });

    setInterval(refetch, (isMobile ? 30 : 10) * 1000); //10 seconds on desktop, 30 on mobile.
};

var parseApiLocation = location =>
{
    data.locations[location.id] = {
        name: location.name,
        building: location.location,
        position: [ location.lat, location.long, ],
        online: location.active,
        owner: location.owner,
        lastOwner: 0,
        marker: null,
        text: null,
    };
};

var updateApiLocation = newL =>
{
    data.locations[newL.id] = Object.assign(data.locations[newL.id], {
        online: newL.active,
        owner: newL.owner,
    });
};

var refetch = async () =>
{
    await fetch(`http://${hostname}/api/v1/locations`, {
        method: 'GET',
        async: false,
        headers: {"Content-Type": "application/json",},
    })
        .then(response => response.json())
        .then(json =>
        {
            json.data.forEach(i => updateApiLocation(i));
        });
    update();
};

var update = () =>
{
    if (!hasInitialized)
    {
        return;
    }
    for (let idx in data.locations)
    {
        if (!data.locations.hasOwnProperty(idx))
        {
            continue;
        }
        let pos = data.locations[idx];
        data.locations[idx].marker.setStyle({
            color: pos.online ? getColor(pos) : "dimgray",
            fillColor: pos.online ? getColor(pos) : "dimgray",
        });
        pos.marker.bindPopup(`<b>${pos.name}</b><br><i>${pos.building}</i><br>Status: ${pos.online ? "Online" : "Offline"}<br>Owner: ${data.teams[pos.owner].name}`);
    }
    info.update();
};

var getColor = pos =>
    data.teams[pos.owner].color;