
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('locations').del()
    .then(function () {
      // Inserts seed entries
      return knex('locations').insert([
        {
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
            location: "Old Main",
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
]);
    });
};
