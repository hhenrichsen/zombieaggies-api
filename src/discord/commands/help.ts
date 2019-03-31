import {Command} from "../command";
import {Message, Client, RichEmbed} from 'discord.js';
import {GuildConfig} from '../guildConfig';

var execute = (message: Message, args: Array<string>, config: GuildConfig, client: Client, data?: any) => {
    let result = new RichEmbed(
        {
            title: 'Harbinger | Help',
            description:
                `
            \`${config.getPrefix()}help\`\t\tDisplays this message.
            \`${config.getPrefix()}join\`\t\tJoins the game.
            \`${config.getPrefix()}switch\`\t\t${(config.getRoles().lancelotRole
                    && message.member.roles.has(config.getRoles().lancelotRole!.id)) ?
                    "Switches you to the other team." : "Switches you to the zombie team."}${
                    (config.getRoles().adminRole && message.member.roles.has(config.getRoles().adminRole!.id)) ?
                        "\n\`" + config.getPrefix() + "startgame\`\t\tStarts the game, adding Human to every member of the server." : ""}${
                    (config.getRoles().adminRole && message.member.roles.has(config.getRoles().adminRole!.id)) ?
                        "\n\`" + config.getPrefix() + "endgame\`\t\tEnds the game, adding Human and Zombie to every member of the server." : ""}${
                    (config.getRoles().adminRole && message.member.roles.has(config.getRoles().adminRole!.id)) ?
                        "\n\`" + config.getPrefix() + "createroles\`\t\tCreate any needed roles for the function of the bot." : ""}
            `
        }
    ).setColor('#ffffff');

    message.channel.send(result).then(message => Command.errorTimeout(message));
};

var help = new Command('help', Command.noCheck(), execute, ['commands']);
export default help;
