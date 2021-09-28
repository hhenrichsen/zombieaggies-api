import {Command} from "../command";
import {Message, Client, RichEmbed} from 'discord.js';

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
    for (const member of message.guild.members) {
        if (member[1].roles.some(i => i.name === 'Admin')) {
            continue;
        }

        if (member[1].user.bot)
            continue;

        let roles = message.guild.roles.filter(i =>
            i.name === "Zombie" ||
            i.name === "Plague Zombie" ||
            i.name === "Radiation Zombie");
        await member[1].removeRoles(roles);
    }
    return started(message);
};


const unzombie = new Command('unzombie', condition, execute, ['cureall']);

export default unzombie;