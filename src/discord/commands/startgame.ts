import {Command} from "../command";
import {Message, Client, RichEmbed} from 'discord.js';

const condition = (message: Message, args: Array<string>, client: Client, data?: any) => message.member.roles.has('Admin');

const started = function (message: Message): RichEmbed {
    return new RichEmbed({
        title: 'Harbinger Admin | Game Started',
        description: `Starting the game. Added Human to all members.

        *Welcome to the apocalypse. Good luck surviving.*
        `
    }).setColor(message.guild.roles.find('name', 'Admin').color);
};

const execute = (message: Message, args: Array<string>, client: Client, data?: any) => {
    for (const member of message.guild.members) {
        if (member[1].roles.has('admin')) {
            continue;
        }
        
        member[1].addRole(message.guild.roles.find(i => i.name.toLowerCase() === "human"));

        let roles = message.guild.roles.filter(i => i.name.toLowerCase() === "zombie" ||
            i.name.toLowerCase() === "plague zombie" ||
            i.name.toLowerCase() === "radiation zombie");
        member[1].removeRoles(roles);
    }
    message.channel.send(started(message));
};


const startgame = new Command('startgame', condition, execute, ['begingame']);

export default startgame;