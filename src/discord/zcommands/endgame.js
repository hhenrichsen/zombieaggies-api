"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const zcommand_1 = require("./zcommand");
const discord_js_1 = require("discord.js");
var condition = (message, args, config, client, data) => {
    //The member is an Admin.
    if (!zcommand_1.ZCommand.hasAdmin(message, config))
        return false;
    return true;
};
var execute = (message, args, config, client, data) => {
    for (const member of config.getGuild().members) {
        if (config.getRoles().adminRole)
            if (member[1].roles.some(role => role === config.getRoles().adminRole))
                continue;
        if (config.getRoles().humanRole)
            member[1].addRole(config.getRoles().humanRole);
        if (config.getRoles().zombieRole)
            member[1].addRole(config.getRoles().zombieRole);
    }
    message.channel.send(started(message, config));
};
var started = function (message, config) {
    return new discord_js_1.RichEmbed({
        title: 'Harbinger Admin | Game Ended',
        description: `Ended the game. Added Human and Zombie to all members.

        *Looks like the apocalypse is over, for now...*
        `
    }).setColor(config.getRoles().adminRole.color);
};
var endgame = new command_1.Command('endgame', condition, execute, ['stopgame', 'purge']);
exports.default = endgame;
//# sourceMappingURL=endgame.js.map