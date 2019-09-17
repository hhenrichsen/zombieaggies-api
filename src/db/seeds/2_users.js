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
                    firstname: 'Jeremy',
                    lastname: 'Johnson',
                    a_number: 'A00000000',
                    username: 'jjohnson@gmail.com',
                    title: 'Player',
                    phone: '1234567890',
                    active: true,
                    password: hash,
                }),
                knex('users').insert({
                    firstname: 'James',
                    lastname: 'Johnson',
                    a_number: 'A00000001',
                    username: 'jjohnson2@gmail.com',
                    title: 'Player',
                    phone: '1234567891',
                    active: false,
                    password: hash,
                })
            )
        );

};
