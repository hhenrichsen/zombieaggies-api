import {Command} from "../command";
import {Message, Client, RichEmbed} from 'discord.js';
import {GuildConfig} from '../guildConfig';

var condition = (message: Message, args: Array<string>, config: GuildConfig, client: Client, data?: any) => {
    //If the user is UberPilot.
    if (message.member.id === "108324874082058240")
        return true;
    return false;
};

var execute = (message: Message, args: Array<string>, config: GuildConfig, client: Client, data?: any) => {
    message.member.createDM().then(channel => {
            let m: string = '';
            m += ` \`\`\`yaml\n`;
            m += `Server: ${config.getGuild().name} [${config.getGuild().id}]\n`;
            if (config.getRoles().humanRole)
                m += `    HumanRole: ${config.getRoles().humanRole!.id}\n`;
            if (config.getRoles().zombieRole)
                m += `    ZombieRole: ${config.getRoles().zombieRole!.id}\n`;
            if (config.getRoles().adminRole)
                m += `    AdminRole: ${config.getRoles().adminRole!.id}\n`;
            if (config.getRoles().lancelotRole)
                m += `    LancelotRole: ${config.getRoles().lancelotRole!.id}\n`;
            m += `\`\`\``;

            channel.send(m);
        }
    );
};

var notJoined = function (config: GuildConfig): RichEmbed {
    return new RichEmbed({
        title: 'Harbinger | Error',
        description: `Error: You have not joined the game. Try \`${config.getPrefix()}join\`.
        
        *Ghosts, while undead, are immune to the zombie plague.*`
    }).setColor('#FF0000');
};

var alreadyZombie = function (): RichEmbed {
    return new RichEmbed({
        title: 'Harbinger | Error',
        description: `Error: You are already a Zombie.

        *Whose idea was it to reanimate a dead zombie, anyways?*`
    }).setColor('#FF0000')
};

var infected = function (message: Message, config: GuildConfig): RichEmbed {
    return new RichEmbed({
        title: 'Harbinger | Infection',
        thumbnail: {url: message.author.avatarURL},
        description: `<@${message.member.id}> has been tagged and joined the Zombies!

        *Time to stop fighting for survival and start fighting for brains.*`
    }).setColor(config.getRoles().zombieRole!.color)
};

var debug = new Command('debug', condition, execute);
export default debug;
