"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const discord_js_1 = require("discord.js");
var execute = (message, args, config, client, data) => {
    let result = new discord_js_1.RichEmbed({
        title: 'Harbinger | Help',
        description: `
            \`${config.getPrefix()}help\`\t\tDisplays this message.
            \`${config.getPrefix()}join\`\t\tJoins the game.
            \`${config.getPrefix()}switch\`\t\t${(config.getRoles().lancelotRole
            && message.member.roles.has(config.getRoles().lancelotRole.id)) ?
            "Switches you to the other team." : "Switches you to the zombie team."}${(config.getRoles().adminRole && message.member.roles.has(config.getRoles().adminRole.id)) ?
            "\n\`" + config.getPrefix() + "startgame\`\t\tStarts the game, adding Human to every member of the server." : ""}${(config.getRoles().adminRole && message.member.roles.has(config.getRoles().adminRole.id)) ?
            "\n\`" + config.getPrefix() + "endgame\`\t\tEnds the game, adding Human and Zombie to every member of the server." : ""}${(config.getRoles().adminRole && message.member.roles.has(config.getRoles().adminRole.id)) ?
            "\n\`" + config.getPrefix() + "createroles\`\t\tCreate any needed roles for the function of the bot." : ""}
            `
    }).setColor('#ffffff');
    message.channel.send(result).then(message => command_1.Command.errorTimeout(message));
};
var help = new command_1.Command('help', command_1.Command.noCheck(), execute, ['commands']);
exports.default = help;
//# sourceMappingURL=help.js.map