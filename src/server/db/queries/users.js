const bcrypt = require('bcryptjs');
const knex = require('../connection');
const logger = require('../../logger');

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
            phone: user.phone,
            a_number: user.aNumber,
        })
        .returning('*');

    await knex('permissions')
        .insert({user: _user[0].id,});
    return _user;
}

async function getAllUsers()
{
    return await knex('users')
        .leftJoin('permissions AS perm', 'users.id', 'perm.user')
        // .select('*')
        .select('username AS email', 'firstname', 'lastname',
            'phone', 'a_number', 'bandanna', 'title', 'viewHiddenTeams', 'viewHiddenTabs',
            'accessPointManagement', 'useAdminRoutes', 'accessUserManagement')
        .catch(e => logger.error(e));
}

async function getUser(id)
{
    return await knex('users')
        .where('users.id', '=', id)
        .leftJoin('permissions AS perm', 'users.id', 'perm.user')
        // .select('*')
        .select('username AS email', 'firstname', 'lastname',
            'phone', 'a_number', 'bandanna', 'title', 'viewHiddenTeams', 'viewHiddenTabs',
            'accessPointManagement', 'useAdminRoutes', 'accessUserManagement')
        .catch(e => logger.error(e));
}

async function setTitle(id, title)
{
    return await knex('users')
        .where('users.id', '=', id)
        .update({title: title,})
        .catch(e => logger.error(e));
}

async function makeModerator(id)
{
    setTitle(id, "Moderator");
    updatePerms(id, {accessPointManagement: true,})
}

async function updatePerms(id, perms)
{
    return knex('permissions')
        .update(perms).where('user', '=', id)
        .first()
        .returning('*');
}


module.exports = {
    addUser,
    getAllUsers,
    getUser,
    makeModerator,
    setTitle,
    updatePerms,
};
