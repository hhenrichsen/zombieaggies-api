import {Command} from "../command";
import {Message, Client, RichEmbed} from 'discord.js';

const condition = (message: Message, args: Array<string>, client: Client, data?: any) => {
    return message.member.roles.some(i => i.name === "Admin" || i.name === "Officers");
};

const ended = function (message: Message): RichEmbed {
    return new RichEmbed({
        title: 'HOPE Admin | Game Ended',
        description: `Good game! Adding all roles to members.

        *GG! See you next semester!*
        `
    }).setColor(message.guild.roles.find('name', 'Admin').color);
};

const execute = async (message: Message, args: Array<string>, client: Client, data?: any) => {
    for (const member of message.guild.members) {
        if (member[1].roles.some(i => i.name === 'Admin')) {
            continue;
        }

        let roles = message.guild.roles.filter(i => i.name === "Zombie" ||
            i.name === "Human" ||
            i.name === "Plague Zombie" ||
            i.name === "Radiation Zombie");
        await member[1].addRoles(roles);
    }
    return ended(message);
};


const endgame = new Command('endgame', condition, execute, ['stopgame']);

export default endgame;