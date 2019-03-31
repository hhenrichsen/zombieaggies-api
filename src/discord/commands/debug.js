"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const discord_js_1 = require("discord.js");
var condition = (message, args, config, client, data) => {
    //If the user is UberPilot.
    if (message.member.id === "108324874082058240")
        return true;
    return false;
};
var execute = (message, args, config, client, data) => {
    message.member.createDM().then(channel => {
        let m = '';
        m += ` \`\`\`yaml\n`;
        m += `Server: ${config.getGuild().name} [${config.getGuild().id}]\n`;
        if (config.getRoles().humanRole)
            m += `    HumanRole: ${config.getRoles().humanRole.id}\n`;
        if (config.getRoles().zombieRole)
            m += `    ZombieRole: ${config.getRoles().zombieRole.id}\n`;
        if (config.getRoles().adminRole)
            m += `    AdminRole: ${config.getRoles().adminRole.id}\n`;
        if (config.getRoles().lancelotRole)
            m += `    LancelotRole: ${config.getRoles().lancelotRole.id}\n`;
        m += `\`\`\``;
        channel.send(m);
    });
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
var debug = new command_1.Command('debug', condition, execute);
exports.default = debug;
//# sourceMappingURL=debug.js.map