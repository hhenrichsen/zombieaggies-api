import {Command} from "../command";
import {Message, Client, RichEmbed, GuildMember} from 'discord.js';
import logger from "../../server/logger";

const condition = (message: Message, args: Array<string>, client: Client, data?: any) => {
    return message.member.roles.some(i => i.name === "Admin" || i.name === "Officers");
};

const cured = function (message: Message): RichEmbed {
    return new RichEmbed({
        title: 'HOPE Admin | Cure All',
        description: `Removing Zombie from all members.
        `
    }).setColor(message.guild.roles.find('name', 'Admin').color);
};

const execute = async (message: Message, args: Array<string>, client: Client, data?: any) => {
    if (message.guild == null) {
        message.channel.send(new RichEmbed({
            title: 'HOPE Admin | Error',
            description: `Failed to find guild.`
        }).setColor(message.guild.roles.find('name', 'Admin').color));

        
        return;
    }

    const roles = message.guild.roles.filter(i =>
        i.name === "Zombie" ||
        i.name === "Plague Zombie" ||
        i.name === "Radiation Zombie");
    const targets : GuildMember[] = [];
    for (const member of message.guild.members) {
        if (!member || !member[1] || !member[0]) {
            continue;
        }

        if (member[1].roles.some(i => i.name === 'Admin')) {
            continue;
        }

        if (member[1].user.bot)
            continue;

        targets.push(member[1]);
    }
    for (const target of targets) {
        try {
            await target.removeRoles(roles);
        }
        catch (ex) {
            logger.error(`Failed to remove roles from ${target.id} (${target.user.username})`)
        }
    }
    return cured(message);
};


const unzombie = new Command('unzombie', condition, execute, ['cureall']);

export default unzombie;