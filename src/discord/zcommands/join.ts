import {Command} from "../command";
import {ZCommand} from "./zcommand";
import {Message, Client, RichEmbed} from 'discord.js';
import {GuildConfig} from '../guildConfig';

var condition = (message: Message, args: Array<string>, config: GuildConfig, client: Client, data?: any) => {
    //Switching is disabled.
    if (!config.getConfig().enableSwitching)
        return false;

    //The member is a Zombie.
    if (ZCommand.hasZombie(message, config)) {
        message.channel.send(alreadyZombie()).then(message => Command.errorTimeout(message));
        return false;
    }

    //There is no Human role or the member is already a Human.
    if (ZCommand.hasHuman(message, config)) {
        message.channel.send(alreadyHuman()).then(message => Command.errorTimeout(message));
        return false;
    }
    return true;
};

var execute = (message: Message, args: Array<string>, config: GuildConfig, client: Client, data?: any) => {
    message.member.addRole(config.getRoles().humanRole!);
    message.channel.send(joined(message, config));
};

var alreadyHuman = function (): RichEmbed {
    return new RichEmbed({
        title: 'Harbinger | Error',
        description: `Error: You are already a Human.
        
        *You're already a part of this apocalypse. Good luck getting out.*`
    }).setColor('#FF0000');
};

var alreadyZombie = function (): RichEmbed {
    return new RichEmbed({
        title: 'Harbinger | Error',
        description: `Error: You are already a Zombie.

        *Sadly there is no cure for the Zombie plague, yet.*`
    }).setColor('#FF0000')
};

var joined = function (message: Message, config: GuildConfig): RichEmbed {
    return new RichEmbed({
        title: 'Harbinger | Welcome',
        thumbnail: {url: message.author.avatarURL},
        description: `<@${message.member.id}> has joined the humans!

        *Welcome to the apocalypse. Good luck surviving.*
        `
    }).setColor(config.getRoles().humanRole!.color);
};

var join = new Command('join', condition, execute, ['human']);
export default join;
