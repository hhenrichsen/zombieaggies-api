const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) =>
{
    if(process.env.NODE_ENV !== 'test')
    {
        return;
    }

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
