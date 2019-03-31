"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const zcommand_1 = require("./zcommand");
const discord_js_1 = require("discord.js");
var condition = (message, args, config, client, data) => {
    //Switching is disabled.
    if (!config.getConfig().enableSwitching)
        return false;
    if (zcommand_1.ZCommand.hasAdmin(message, config)) {
        return true;
    }
    if (zcommand_1.ZCommand.hasLancelot(message, config)) {
        return true;
    }
    //The member is a Zombie.
    if (zcommand_1.ZCommand.hasZombie(message, config)) {
        message.channel.send(alreadyZombie()).then(message => command_1.Command.errorTimeout(message));
        return false;
    }
    //There is no Human role or the member is already a Human.
    if (!zcommand_1.ZCommand.hasHuman(message, config)) {
        message.channel.send(notJoined(config)).then(message => command_1.Command.errorTimeout(message));
        return false;
    }
    return true;
};
var normal = (message, args, config, client, data) => {
    message.member.addRole(config.getRoles().zombieRole);
    message.member.removeRole(config.getRoles().humanRole);
    message.channel.send(infected(message, config));
};
var execute = (message, args, config, client, data) => {
    if (zcommand_1.ZCommand.hasAdmin(message, config)) {
        if (message.mentions.users.size > 0) {
            for (const mention of message.mentions.members) {
                let user = mention[1];
                if (user.id !== message.author.id) {
                    let removeHuman = user.roles.some(role => role === config.getRoles().humanRole);
                    let toAdd = (removeHuman) ? config.getRoles().zombieRole : config.getRoles().humanRole;
                    let toRemove = (removeHuman) ? config.getRoles().humanRole : config.getRoles().zombieRole;
                    user.addRole(toAdd);
                    user.removeRole(toRemove);
                }
            }
            return;
        }
    }
    if (zcommand_1.ZCommand.hasLancelot(message, config)) {
        if (config.getRoles().humanRole && config.getRoles().zombieRole) {
            let removeHuman = message.member.roles.some(role => role === config.getRoles().humanRole);
            let toAdd = (removeHuman) ? config.getRoles().zombieRole : config.getRoles().humanRole;
            let toRemove = (removeHuman) ? config.getRoles().humanRole : config.getRoles().zombieRole;
            message.member.addRole(toAdd);
            message.member.removeRole(toRemove);
        }
        return;
    }
    normal(message, args, config, client, data);
};
var notJoined = function (config) {
    return new discord_js_1.RichEmbed({
        title: 'Harbinger | Error',
        description: `Error: You have not joined the game. Try \`${config.getPrefix()}join\`.
        
        *Ghosts, while undead, are immune to the zombie plague.*`
    }).setColor('#FF0000');
};
var alreadyZombie = function () {
    return new discord_js_1.RichEmbed({
        title: 'Harbinger | Error',
        description: `Error: You are already a Zombie.

        *Whose idea was it to reanimate a dead zombie, anyways?*`
    }).setColor('#FF0000');
};
var infected = function (message, config) {
    return new discord_js_1.RichEmbed({
        title: 'Harbinger | Infection',
        thumbnail: { url: message.author.avatarURL },
        description: `<@${message.member.id}> has been tagged and joined the Zombies!

        *Time to stop fighting for survival and start fighting for brains.*`
    }).setColor(config.getRoles().zombieRole.color);
};
var swap = new zcommand_1.ZCommand('swap', condition, execute, ['switch', 'zombie']);
exports.default = swap;
//# sourceMappingURL=swap.js.map