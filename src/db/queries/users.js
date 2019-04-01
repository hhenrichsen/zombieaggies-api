const bcrypt = require('bcryptjs');
const User = require("../models/User");
const Permission = require("../models/Permission");
const Code = require("../models/Code");
const logger = require('../../server/logger');

const VISIBLE_USER_FIELDS = [ 'users.id AS id', 'username AS email', 'firstname', 'lastname',
    'phone', 'a_number AS aNumber', 'bandanna', 'title', 'team', 'tags', 'discord', 'dead', 'nickname', ];
const CONNECTED_BLACKLIST = [ 'id', 'user', ];

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
        .insert({ user: _user.id, });

    await generateCode(_user.id);
    return _user;

}

async function setNickname(id, nickname)
{
    return User.query().patchAndFetchById(id, { nickname: nickname, });
}

async function linkDiscord(id, discord)
{
    return User.query().patchAndFetchById(id, { discord: discord, });
}

async function generateCode(id)
{
    // Validate user.
    let user = await User
        .query()
        .findById(id);
    if (user === undefined)
    {
        return undefined;
    }

    //Delete existing code.
    await Code
        .query()
        .where('user', id)
        .delete();
    logger.verbose('Regenerating user ' + id + '\'s code.');

    //Retry until one works.
    while (true)
    {
        try
        {
            let code =
                Math.random()
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
        }
        catch (err)
        {
            logger.silly("Failed. Trying again.");
            logger.error(JSON.stringify(err));
        }
    }
}

async function getAllUsers()
{
    return User.query()
               .select(VISIBLE_USER_FIELDS)
                     // .orderBy('title')
               .orderBy('lastname')
               .eager('[permissions, code]')
               .omit(Permission, CONNECTED_BLACKLIST)
               .omit(Code, CONNECTED_BLACKLIST);
}

async function getUser(id)
{
    return User.query()
               .select(VISIBLE_USER_FIELDS)
               .findById(id)
               .eager('[permissions, code]')
               .omit(Permission, CONNECTED_BLACKLIST)
               .omit(Code, CONNECTED_BLACKLIST);
}

async function deleteUser(id)
{
    return User.query()
               .deleteById(id);
}

async function updateUser(id, data)
{
    return User
        .query()
        .patchAndFetchById(id, data);
}

async function updatePerms(id, perms)
{
    return Permission
        .query()
        .where('user', id)
        .first()
        .patch(perms);
}

async function toggleBandanna(id)
{
    const bandanna = (await User
        .query()
        .findById(id)).bandanna;

    return User
        .query()
        .patchAndFetchById(id, { bandanna: !bandanna });
}

async function findUserFromDiscord(discord)
{
    return User
        .query()
        .where('discord', discord)
        .first();
}

module.exports = {
    addUser,
    getAllUsers,
    getUser,
    updatePerms,
    deleteUser,
    updateUser,
    generateCode,
    toggleBandanna,
    setNickname,
    linkDiscord,
    findUserFromDiscord
};