"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
/**
 * Provides a way to check conditions and hide execution code of commands.
 * @class Command
 * @author Hunter Henrichsen
 * @version 1.0
 */
class Command {
    constructor(name, condition, execute, aliases) {
        this.name = name;
        this.condition = condition;
        this.execute = execute;
        this.aliases = [name];
        if (aliases)
            this.aliases = this.aliases.concat(aliases);
    }
    /**
     * Run the command.
     * @param {Message} message Triggering message.
     * @param {Array<string>} args Command arguments.
     * @param {GuildConfig} config Guild config.
     * @param {Client} client Discord client.
     * @param {any} data Optional data to do with the execution of the command.
     */
    run(message, args, config, client, data) {
        if (this.condition(message, args, config, client, data)) {
            let response = this.execute(message, args, config, client, data);
            if (response)
                message.channel.send(response);
        }
        message.delete();
    }
    getAliases() {
        return this.aliases;
    }
    getName() {
        return this.name;
    }
    static noCheck() {
        return () => true;
    }
    static missingRole(message, config, role) {
        message.channel.send(new discord_js_1.RichEmbed({
            title: `Harbinger | Error`,
            color: '#FF0000',
            description: `Error: A required role is missing.
            
            Have an Admin run \`${config.getPrefix()}createroles\`.`
        }));
    }
    static errorTimeout(message) {
        if (message instanceof discord_js_1.Message)
            message.delete(60000);
        else
            for (const m of message) {
                m.delete(60000);
            }
    }
}
exports.Command = Command;
//# sourceMappingURL=command.js.map