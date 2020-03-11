const bcrypt = require('bcryptjs');
const User = require("../models/User");
const Permission = require("../models/Permission");
const Code = require("../models/Code");
const OZ = require("../models/OZ");
const logger = require('../../server/logger');

const VISIBLE_USER_FIELDS = [ 'users.id AS id', 'username AS email', 'firstname', 'lastname',
    'phone', 'a_number AS aNumber', 'bandanna', 'title', 'team', 'tags', 'discord', 'dead', 'nickname', 
    'active', 'tos_agree AS tosAgree' ];
const CONNECTED_BLACKLIST = [ 'id', 'user', ];

/**
 * Adds a new user.
 * 
 * @param {Object} user An object representing the usesr to add.
 * @returns {Promise<User>} The created user.
 */
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
            active: true,
            tosAgree: true,
        })
        .returning('*');

    await Permission
        .query()
        .insert({ user: _user.id, });

    await generateCode(_user.id);
    return _user;
}

/**
 * Updates a user's password.
 * 
 * @param {number} id The ID of the User to update.
 * @param {string} password The new password.
 * @returns {Promise<User>}
 */
async function updatePassword(id, password) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    return User.query().patch({ password: hash, password_reset_token: null }).whereNotNull('password_reset_token').where({ id: id, });
}

/**
 * Sets a user's nickname.
 * 
 * @param {number} id The ID of the User to update.
 * @param {string} nickname The new nickname.
 * @returns {Promise<void>}
 */
async function setNickname(id, nickname)
{
    return User.query().patchAndFetchById(id, { nickname: nickname, });
}

/**
 * Links a discord account to a local account.
 * 
 * @param {number} id The local account ID.
 * @param {string} discord The Discord snowflake.
 */
async function linkDiscord(id, discord)
{
    return User.query().patchAndFetchById(id, { discord: discord, });
}

/**
 * (Re)generates a code attached to a user.
 * 
 * @param {number} id The ID of the User whose code to regenerate.
 * @returns {Promise<void>}
 */
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
    return Promise.resolve();
}

/**
 * @returns {Promise{User[]}} The list of all users.
 */
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

/**
 * Get a user by ID.
 * 
 * @param {number} id The user ID to look up.
 * @returns {Promise<User>}
 */
async function getUser(id)
{
    return User.query()
               .select(VISIBLE_USER_FIELDS)
               .findById(id)
               .eager('[permissions, code]')
               .omit(Permission, CONNECTED_BLACKLIST)
               .omit(Code, CONNECTED_BLACKLIST);
}

/**
 * Check if a user exists with the given email.
 * 
 * @param {string} email The email to check.
 * @returns {Promise<Object>} A email-ID pair, if the user exists.
 */
async function hasUser(email)
{
    return User.query()
               .select('username AS email', 'id')
               .where('username', '=', email)
               .first()
               .catch(err => logger.error(err));
}

/**
 * Deletes a user.
 * 
 * @param {number} id The ID of the user to delete.
 * @returns {Promise<void>}
 */
async function deleteUser(id)
{
    return User.query()
               .deleteById(id);
}

/**
 * Updates a user's data.
 * 
 * @param {number} id The ID of the user to update.
 * @param {Object} data The new data to apply to the user.
 * @returns {Promise<void>}
 */
async function updateUser(id, data)
{
    return User
        .query()
        .patchAndFetchById(id, data);
}

/**
 * Update a user's permissions
 *  
 * @param {*} id The ID of the user to update.
 * @param {*} perms The new permissions.
 * @returns {Promise<void>} 
 */
async function updatePerms(id, perms)
{
    return Permission
        .query()
        .where('user', id)
        .first()
        .patch(perms);
}

/**
 * Toggles a bandanna on or off.
 *  
 * @param {number} id The ID of the user's bandana to toggle.
 * @returns {Promise<void>}
 */
async function toggleBandanna(id)
{
    const bandanna = (await User
        .query()
        .findById(id)).bandanna;

    return User
        .query()
        .patchAndFetchById(id, { bandanna: !bandanna });
}

/**
 * Looks up a user based on their discord snowflake.
 * 
 * @param {string} discord A discord snowflake of a linked user.
 * @returns {User} The looked up user if they exist.
 */
async function findUserFromDiscord(discord)
{
    return User
        .query()
        .where('discord', discord)
        .first();
}

/**
 * Gets a list of all emails for this team.
 * 
 * @param {number} id The team ID to look up.
 */
async function getEmailList(id)
{
    return User
        .query()
        .where('team', id)
        .where('active', true)
        .select('username', 'id');
}

/**
 * Get a list of OZs in a team.
 * 
 * @param {number?} team An optional team ID to check.
 * @returns {Promise<User[]>} A list of OZs for that team.
 */
async function getOZs(team = undefined)
{
    
    const ozs = await ((team === undefined) ? OZ.query() : OZ.query());
    logger.info(ozs);
    const users = await Promise.all(ozs.map(async i => await User.query().where('id', i.user).first()));
    users.filter(it => it.team === team);
    return users;
}

/**
 * Sets a password reset token for the given user.
 *  
 * @param {number} id The ID of the user to set.
 * @param {string} token The reset token to set.
 * @returns {Promise<void>}
 */
async function generatePasswordReset(id, token) {
    return User.query().patch({ passwordResetToken: token, }).where('id', id); 
}

/**
 * Marks all users as inactive.
 * 
 * @return {Promise<void>}
 */
async function setInactive()
{
    return User.query().patch({ active: false, });
}

/**
 * Gets a user from their reset token.
 * 
 * @param {string} token The password reset token to look up by.
 * @return {Promise<User>} The user bound to this token if it exists.
 */
async function getUserByResetToken(token) {
    return User.query().select(VISIBLE_USER_FIELDS).where({password_reset_token: token}).first();
}

module.exports = {
    addUser,
    updatePassword,
    getAllUsers,
    hasUser,
    getUser,
    updatePerms,
    deleteUser,
    updateUser,
    generateCode,
    toggleBandanna,
    setNickname,
    linkDiscord,
    findUserFromDiscord,
    getEmailList,
    getOZs,
    setInactive,
    generatePasswordReset,
    getUserByResetToken,
};
