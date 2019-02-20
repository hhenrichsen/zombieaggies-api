const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) =>
{
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync('johnson', salt);
    return knex('users').del()
        .then(() =>
            Promise.join(
                knex('users').insert({
                    username: 'jeremy',
                    password: hash,
                })
            )
        );

};
