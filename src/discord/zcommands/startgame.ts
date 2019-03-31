import {Command} from "../command";
import {ZCommand} from "./zcommand";
import {Message, Client, RichEmbed} from 'discord.js';
import {GuildConfig} from '../guildConfig';

var condition = (message: Message, args: Array<string>, config: GuildConfig, client: Client, data?: any) => {
    //The member is an Admin.
    if (!ZCommand.hasAdmin(message, config))
        return false;
    return true;
};

var execute = (message: Message, args: Array<string>, config: GuildConfig, client: Client, data?: any) => {
    for (const member of config.getGuild().members) {
        if (config.getRoles().adminRole)
            if (member[1].roles.some(role => role === config.getRoles().adminRole))
                continue;
        if (config.getRoles().humanRole)
            member[1].addRole(config.getRoles().humanRole!);
        if (config.getRoles().zombieRole)
            member[1].removeRole(config.getRoles().zombieRole!);
    }

    message.channel.send(started(message, config));
};

var started = function (message: Message, config: GuildConfig): RichEmbed {
    return new RichEmbed({
        title: 'Harbinger Admin | Game Started',
        description: `Starting the game. Added Human to all members.

        *Welcome to the apocalypse. Good luck surviving.*
        `
    }).setColor(config.getRoles().adminRole!.color);
};

var startgame = new Command('startgame', condition, execute, ['begingame']);
export default startgame;
