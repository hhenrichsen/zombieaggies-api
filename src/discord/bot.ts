import {Client, Snowflake, Message, Collection, Guild} from 'discord.js';
import {Command} from './command';
import {GuildConfig} from './guildConfig';
//import { HarbingerDatabase } from './database';
//import { Logger } from 'js-logger';
import help from './commands/help';
import join from './zcommands/join';
import swap from './zcommands/swap';
import startgame from './zcommands/startgame';
import endgame from './zcommands/endgame';
import debug from './commands/debug';


let instance: Harbinger = undefined;

class Harbinger {
    client: Client;
    token: string;
    guilds: Collection<Snowflake, GuildConfig>;
    commands: Collection<string, Command>;
//    db: HarbingerDatabase;
    logger: any;


    constructor() {
        this.client = new Client();
        this.token = process.env['TOKEN'];
        this.guilds = new Collection();
        this.commands = new Collection();
        this.registerCommands();
        //this.db = new HarbingerDatabase('./harbinger.sqlite');
        this.logger = require('./logger');
    }

    static handleDM(message: Message) {
        //Currently no support for DMs, but create method for handling them for future use.
        return;
    }

    start() {
        this.client.on('ready', () => {
            this.logger.info('Harbinger active.');
            //this.logger.info(`Harbinger logged in with token: ${this.token}`);
            this.client.user.setActivity('zombieaggies.me');
        });

        this.client.on('message', (message) => {
            //Don't respond to bots; Bots are evil.
            if (message.author.bot) return;
            if (message.channel.type === "text") {
                this.handleMessage(message);
            }
            if (message.channel.type === "dm") {
                Harbinger.handleDM(message);
            }
        });

        this.client.login(this.token);
    }

    handleMessage(message: Message) {
        let guild = message.guild;
        let config = this.findConfig(guild);
        //This is not a message for us.
        if (!message.cleanContent.startsWith(config.getPrefix()))
            return;

        let args = message.content.split(' ');
        let command = args[0].substring(1);

        if (this.commands.has(command))
            this.commands.get(command)!.run(message, args, config, this.client);
    }

    findConfig(guild: Guild): GuildConfig {
        if (this.guilds.has(guild.id))
            return this.guilds.get(guild.id)!;
        else
            return this.makeConfig(guild);
    }

    makeConfig(guild: Guild): GuildConfig {
        let config = new GuildConfig(guild);
        this.guilds.set(guild.id, config);
        return config;
    }

    registerCommands() {
        //Register commands here. Conflicting aliases are logged.
        let commands = [help, join, swap, startgame, endgame, debug];

        for (const command of commands) {
            //console.log(`Loading ${command.getName()} with aliases ${command.getAliases()}`)
            for (const alias of command.getAliases()) {
                if (!this.commands.has(alias))
                    this.commands.set(alias, command);
                else
                    this.logger.error(`Conflicting alias: ${command.getName()}.${alias} and ${this.commands.get(alias)!.getName()}.${alias}`)
            }
        }
    }

    public handleUserChange(user: Object) {
        if (user.discord) {

        } else {

        }
    }
}

instance = new Harbinger();
instance.start();
export default instance; 