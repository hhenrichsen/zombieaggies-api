import {Command} from "../command";
import {Message, Client, RichEmbed, GuildMember} from 'discord.js';

const condition = (message: Message, args: Array<string>, client: Client, data?: any) => {
    return message.member.roles.some(i => i.name === "Admin" || i.name === "Officers");
};

const started = function (message: Message): RichEmbed {
    return new RichEmbed({
        title: 'HOPE Admin | Cure All',
        description: `Removing Zombie from all members.
        `
    }).setColor(message.guild.roles.find('name', 'Admin').color);
};

const execute = async (message: Message, args: Array<string>, client: Client, data?: any) => {
    const roles = message.guild.roles.filter(i =>
        i.name === "Zombie" ||
        i.name === "Plague Zombie" ||
        i.name === "Radiation Zombie");
    const targets : GuildMember[] = [];
    for (const member of message.guild.members) {
        if (member[1].roles.some(i => i.name === 'Admin')) {
            continue;
        }

        if (member[1].user.bot)
            continue;

        targets.push(member[1]);
    }
    await Promise.all(targets.map(async (member) => member && member.removeRoles(roles)))
    return started(message);
};


const unzombie = new Command('unzombie', condition, execute, ['cureall']);

export default unzombie;