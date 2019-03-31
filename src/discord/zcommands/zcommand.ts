import {Command} from "../command";
import {GuildConfig} from "../guildConfig";
import {Message} from "discord.js";

export class ZCommand extends Command {
    static hasHuman(message: Message, config: GuildConfig): boolean {
        if (config.getRoles().humanRole)
            return message.member.roles.some(role => role === config.getRoles().humanRole);
        Command.missingRole(message, config, 'Human');
        return false;
    }

    static hasZombie(message: Message, config: GuildConfig): boolean {
        if (config.getRoles().zombieRole)
            return message.member.roles.some(role => role === config.getRoles().zombieRole);
        Command.missingRole(message, config, 'Zombie');
        return false;
    }

    static hasAdmin(message: Message, config: GuildConfig): boolean {
        if (config.getRoles().adminRole)
            return message.member.roles.some(role => role === config.getRoles().adminRole);
        Command.missingRole(message, config, 'Admin');
        return false;
    }

    static hasLancelot(message: Message, config: GuildConfig): boolean {
        if (config.getRoles().lancelotRole)
            return message.member.roles.some(role => role === config.getRoles().lancelotRole);
        return false;
    }
}