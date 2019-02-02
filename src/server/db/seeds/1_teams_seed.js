
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('teams').del()
    .then(function () {
      // Inserts seed entries
      return knex('teams').insert([
        {id: 0, name: 'Neutral', color: 'white', points: -1, visible: true},
        {id: 1, name: 'Human', color: 'orange', points: 0, visible: true},
        {id: 2, name: 'Zombies', color: 'brown', points: 0, visible: true},
        {id: 3, name: 'Radiation Zombies', color: 'green', points: 0, visible: false}
      ]);
    });
};
