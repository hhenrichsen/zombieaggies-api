exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('locations').del()
        .then(() => knex('teams').del())
        .then(() => knex('teams').insert([
            {
                id: 0,
                name: 'Neutral',
                color: 'white',
                points: -1,
                visible: true
            },
            {
                id: 1,
                name: 'Human',
                color: 'orange',
                points: 0,
                visible: true
            },
            {
                id: 2,
                name: 'Zombies',
                color: 'brown',
                points: 0,
                visible: true
            },
            {
                id: 3,
                name: 'Radiation Zombies',
                color: 'green',
                points: 0,
                visible: false
            }
        ]))
        .then(() => knex('locations').insert([{
            lat: 41.740077,
            long: -111.811577,
            name: "Laboratory",
            location: "FL Bus Stop",
            active: true,
            owner: 0
        },
        {
            lat: 41.740757,
            long: -111.813549,
            name: "Power Station",
            location: "Quad",
            active: true,
            owner: 0
        },
        {
            lat: 41.742506,
            long: -111.812993,
            name: "Sock Cache",
            location: "TSC Patio",
            active: true,
            owner: 0
        },
        {
            lat: 41.741914,
            long: -111.808610,
            name: "Weapons Depot",
            location: "ENGR Quad",
            active: true,
            owner: 0
        },
        {
            lat: 41.743299,
            long: -111.810501,
            name: "Hydroponic Farm",
            location: "BNR Courtyard",
            active: true,
            owner: 0
        },
        {
            lat: 41.742054,
            long: -111.807454,
            name: "Bunker",
            location: "Engineering",
            active: true,
            owner: 0
        }
        ]));
};