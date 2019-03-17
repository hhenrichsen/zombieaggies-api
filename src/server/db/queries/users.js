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
    return knex('users')
        .leftJoin('permissions AS perm', 'users.id', 'perm.user')
        // .select('*')
        .select('users.id AS id', 'username AS email', 'firstname', 'lastname',
            'phone', 'a_number AS aNumber', 'bandanna', 'title', 'viewHiddenTeams', 'viewHiddenTabs',
            'accessPointManagement', 'useAdminRoutes', 'accessUserManagement')
        .catch(e => logger.error(e));
}

async function getUser(id)
{
    return knex('users')
        .where('users.id', '=', id)
        .leftJoin('permissions AS perm', 'users.id', 'perm.user')
        .select('users.id AS id', 'username AS email', 'firstname', 'lastname',
            'phone', 'a_number AS aNumber', 'bandanna', 'title', 'viewHiddenTeams', 'viewHiddenTabs',
            'accessPointManagement', 'useAdminRoutes', 'accessUserManagement')
        .first();
}

async function deleteUser(id)
{
    return knex('users')
        .where('users.id', '=', id)
        .delete()
        .catch(e => logger.error(e));
}

async function setTitle(id, title)
{
    return knex('users')
        .where('users.id', id)
        .update({title: title,})
        .catch(e => logger.error(e));
}

async function makeModerator(id)
{
    return Promise.all([setTitle(id, "Moderator"), updatePerms(id, {accessPointManagement: true,}),]);
}

async function demote(id)
{
    return Promise.all([setTitle(id, ""), updatePerms(id, {accessPointManagement: false,}),]);
}

async function updatePerms(id, perms)
{
    return knex('permissions')
        .update(perms).where('user', id)
        .returning('*');
}

async function toggleBandanna(id)
{
    const bandanna = (await knex('users').select('bandanna').where('id', id).first()).bandanna;
    return knex('users')
        .update('bandanna', !bandanna).where('id', id);
}


module.exports = {
    addUser,
    getAllUsers,
    getUser,
    makeModerator,
    setTitle,
    updatePerms,
    toggleBandanna,
    deleteUser,
    demote,
};
