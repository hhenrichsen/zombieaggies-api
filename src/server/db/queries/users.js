const bcrypt = require('bcryptjs');
const knex = require('../connection');

async function addUser(user)
{
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);
    const _user = await knex('users')
        .insert({
            username: user.username,
            password: hash,
            firstname: user.firstname || '',
            lastname: user.lastname || '',
        }).returning('*');
    await knex('permissions').insert({user: _user[0].id,});
    return _user;
}

module.exports = {
    addUser,
};
