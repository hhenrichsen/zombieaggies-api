const bcrypt = require('bcryptjs');
const User = require("../models/User");
const Permission = require("../models/Permission");
const logger = require('../../logger');

const VISIBLE_USER_FIELDS = ['users.id AS id', 'username AS email', 'firstname', 'lastname',
    'phone', 'a_number AS aNumber', 'bandanna', 'title', 'team', 'tags', 'code',];
const PERMISSION_HIDDEN_FIELDS = ['id', 'user',];

async function addUser(user)
{
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);

    const _user = await User
        .query()
        .insert({
            username: user.username,
            password: hash,
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            phone: user.phone,
            aNumber: user.aNumber,
            title: 'Player',
        })
        .returning('*');


    await Permission
        .query()
        .insert({user: _user.id,});
    return _user;

}

async function getAllUsers()
{
    return await User.query()
        .select(VISIBLE_USER_FIELDS)
        .orderBy('title')
        .orderBy('lastname')
        .eager('permissions')
        .omit(Permission, PERMISSION_HIDDEN_FIELDS);
}

async function getUser(id)
{
    return await User.query()
        .select(VISIBLE_USER_FIELDS)
        .findById(id)
        .eager('permissions')
        .omit(Permission, PERMISSION_HIDDEN_FIELDS);
}

async function deleteUser(id)
{
    return await User.query()
        .deleteById(id);
}

async function setTitle(id, title)
{
    return await User.query()
        .patchAndFetchById(id, {title: title,});
}

async function makeModerator(id)
{
    return await Promise.all([
        setTitle(id, "Moderator"),
        updatePerms(id, {accessPointManagement: true,}),
    ]);
}

async function demote(id)
{
    return await Promise.all([
        setTitle(id, ""),
        updatePerms(id, {accessPointManagement: false,}),
    ]);
}

async function updatePerms(id, perms)
{
    return await Permission
        .query()
        .patchAndFetchById(id, perms);
}

async function toggleBandanna(id)
{
    const bandanna = (User
        .query()
        .findById(id)).bandanna;

    return await User
        .query()
        .patchAndFetchById(id, {bandanna: !bandanna});
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
