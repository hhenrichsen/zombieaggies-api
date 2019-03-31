"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guildConfig_1 = require("./guildConfig");
//import { HarbingerDatabase } from './database';
//import { Logger } from 'js-logger';
const help_1 = require("./commands/help");
const join_1 = require("./zcommands/join");
const swap_1 = require("./zcommands/swap");
const startgame_1 = require("./zcommands/startgame");
const endgame_1 = require("./zcommands/endgame");
const debug_1 = require("./commands/debug");
class Harbinger {
    constructor() {
        this.client = new discord_js_1.Client();
        this.token = process.env['TOKEN'];
        this.guilds = new discord_js_1.Collection();
        this.commands = new discord_js_1.Collection();
        this.registerCommands();
        //this.db = new HarbingerDatabase('./harbinger.sqlite');
        this.logger = require('./logger');
    }
    start() {
        this.client.on('ready', () => {
            this.logger.info('Harbinger active.');
            //this.logger.info(`Harbinger logged in with token: ${this.token}`);
            this.client.user.setActivity('zombieaggies.me');
        });
        this.client.on('message', (message) => {
            //Don't respond to bots; Bots are evil.
            if (message.author.bot)
                return;
            if (message.channel.type === "text") {
                this.handleMessage(message);
            }
            if (message.channel.type === "dm") {
                Harbinger.handleDM(message);
            }
        });
        this.client.login(this.token);
    }
    handleMessage(message) {
        let guild = message.guild;
        let config = this.findConfig(guild);
        //This is not a message for us.
        if (!message.cleanContent.startsWith(config.getPrefix()))
            return;
        let args = message.content.split(' ');
        let command = args[0].substring(1);
        if (this.commands.has(command))
            this.commands.get(command).run(message, args, config, this.client);
    }
    static handleDM(message) {
        //Currently no support for DMs, but create method for handling them for future use.
        return;
    }
    findConfig(guild) {
        if (this.guilds.has(guild.id))
            return this.guilds.get(guild.id);
        else
            return this.makeConfig(guild);
    }
    makeConfig(guild) {
        let config = new guildConfig_1.GuildConfig(guild);
        this.guilds.set(guild.id, config);
        return config;
    }
    registerCommands() {
        //Register commands here. Conflicting aliases are logged.
        let commands = [help_1.default, join_1.default, swap_1.default, startgame_1.default, endgame_1.default, debug_1.default];
        for (const command of commands) {
            //console.log(`Loading ${command.getName()} with aliases ${command.getAliases()}`)
            for (const alias of command.getAliases()) {
                if (!this.commands.has(alias))
                    this.commands.set(alias, command);
                else
                    this.logger.error(`Conflicting alias: ${command.getName()}.${alias} and ${this.commands.get(alias).getName()}.${alias}`);
            }
        }
    }
}
new Harbinger().start();
//# sourceMappingURL=bot.js.map