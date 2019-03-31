"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const zcommand_1 = require("./zcommand");
const discord_js_1 = require("discord.js");
var condition = (message, args, config, client, data) => {
    //Switching is disabled.
    if (!config.getConfig().enableSwitching)
        return false;
    //The member is a Zombie.
    if (zcommand_1.ZCommand.hasZombie(message, config)) {
        message.channel.send(alreadyZombie()).then(message => command_1.Command.errorTimeout(message));
        return false;
    }
    //There is no Human role or the member is already a Human.
    if (zcommand_1.ZCommand.hasHuman(message, config)) {
        message.channel.send(alreadyHuman()).then(message => command_1.Command.errorTimeout(message));
        return false;
    }
    return true;
};
var execute = (message, args, config, client, data) => {
    message.member.addRole(config.getRoles().humanRole);
    message.channel.send(joined(message, config));
};
var alreadyHuman = function () {
    return new discord_js_1.RichEmbed({
        title: 'Harbinger | Error',
        description: `Error: You are already a Human.
        
        *You're already a part of this apocalypse. Good luck getting out.*`
    }).setColor('#FF0000');
};
var alreadyZombie = function () {
    return new discord_js_1.RichEmbed({
        title: 'Harbinger | Error',
        description: `Error: You are already a Zombie.

        *Sadly there is no cure for the Zombie plague, yet.*`
    }).setColor('#FF0000');
};
var joined = function (message, config) {
    return new discord_js_1.RichEmbed({
        title: 'Harbinger | Welcome',
        thumbnail: { url: message.author.avatarURL },
        description: `<@${message.member.id}> has joined the humans!

        *Welcome to the apocalypse. Good luck surviving.*
        `
    }).setColor(config.getRoles().humanRole.color);
};
var join = new command_1.Command('join', condition, execute, ['human']);
exports.default = join;
//# sourceMappingURL=join.js.map