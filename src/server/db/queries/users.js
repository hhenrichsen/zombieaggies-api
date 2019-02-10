const bcrypt = require('bcryptjs');
const knex = require('../connection');

function addUser(user) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);
    return knex('users')
        .insert({
            username: user.username,
            password: hash,
            firstname: user.firstname || '',
            lastname: user.lastname || '',
        })
        .returning('*');
}

module.exports = {
    addUser,
};
