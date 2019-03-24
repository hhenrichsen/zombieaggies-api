const bcrypt = require('bcryptjs');
const User = require("../models/User");
const Permission = require("../models/Permission");
const Code = require("../models/Code");
const logger = require('../../logger');

const VISIBLE_USER_FIELDS = ['users.id AS id', 'username AS email', 'firstname', 'lastname',
    'phone', 'a_number AS aNumber', 'bandanna', 'title', 'team', 'tags',];
const CONNECTED_BLACKLIST = ['id', 'user',];

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

    await generateCode(_user.id);
    return _user;

}

async function generateCode(id)
{
    // Validate user.
    let user = await User.query().findById(id);
    if (user === undefined)
    {
        return undefined;
    }

    //Delete existing code.
    await Code.query().where('user', id).delete();
    logger.verbose('Regenerating user ' + id + '\'s code.');

    //Retry until one works.
    while (true)
    {
        try
        {
            let code = Math.random()
                .toString(36)
                .substr(2, process.env.CODE_LENGTH || 5)
                .toUpperCase();


            let data = {
                user: id,
                code: code,
            };
            logger.silly("Trying data " + JSON.stringify(data));

            let result = await Code
                .query()
                .insert(Code.fromJson(data));
            logger.silly("Data " + JSON.stringify(data) + " worked.");

            return result;
        } catch (err)
        {
            logger.silly("Failed. Trying again.");
            logger.error(JSON.stringify(err));
        }
    }

}

async function getAllUsers()
{
    return await User.query()
        .select(VISIBLE_USER_FIELDS)
        .orderBy('title')
        .orderBy('lastname')
        .eager('[permissions, code]')
        .omit(Permission, CONNECTED_BLACKLIST)
        .omit(Code, CONNECTED_BLACKLIST);
}

async function getUser(id)
{
    return await User.query()
        .select(VISIBLE_USER_FIELDS)
        .findById(id)
        .eager('[permissions, code]')
        .omit(Permission, CONNECTED_BLACKLIST)
        .omit(Code, CONNECTED_BLACKLIST);
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
    generateCode
};
