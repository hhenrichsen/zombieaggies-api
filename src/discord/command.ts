import {Message, Client, RichEmbed, MessageOptions, Attachment, StringResolvable, GuildMember, Guild} from 'discord.js';
import {GuildConfig} from './guildConfig';

type CommandExecutable = (message: Message, args: Array<string>, config: GuildConfig, client: Client, data?: any) => void | string | RichEmbed | Attachment | MessageOptions;
type CommandCondition = (message: Message, args: Array<string>, config: GuildConfig, client: Client, data?: any) => boolean;

/**
 * Provides a way to check conditions and hide execution code of commands.
 * @class Command
 * @author Hunter Henrichsen
 * @version 1.0
 */
export class Command {
    private name: string;
    private condition: CommandCondition;
    private execute: Function;
    private aliases: Array<string>;

    constructor(name: string, condition: CommandCondition, execute: CommandExecutable, aliases?: Array<string>) {
        this.name = name;
        this.condition = condition;
        this.execute = execute;
        this.aliases = [name];

        if (aliases)
            this.aliases = this.aliases.concat(aliases!);
    }

    static noCheck(): CommandCondition {
        return () => true;
    }

    static missingRole(message: Message, config: GuildConfig, role: string): void {
        message.channel.send(new RichEmbed({
            title: `Harbinger | Error`,
            color: '#FF0000',
            description: `Error: A required role is missing.
            
            Have an Admin run \`${config.getPrefix()}createroles\`.`
        }))
    }

    static errorTimeout(message: Message | Message[]) {
        if (message instanceof Message)
            message.delete(60000);
        else
            for (const m of message) {
                m.delete(60000);
            }
    }

    /**
     * Run the command.
     * @param {Message} message Triggering message.
     * @param {Array<string>} args Command arguments.
     * @param {GuildConfig} config Guild config.
     * @param {Client} client Discord client.
     * @param {any} data Optional data to do with the execution of the command.
     */
    public run(message: Message, args: Array<string>, config: GuildConfig, client: Client, data?: any): void {
        if (this.condition(message, args, config, client, data)) {
            let response = this.execute(message, args, config, client, data);
            if (response)
                message.channel.send(response);
        }
        message.delete();
    }

    getAliases(): Array<string> {
        return this.aliases;
    }

    getName(): string {
        return this.name;
    }
}