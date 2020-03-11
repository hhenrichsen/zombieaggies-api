import {Client, Snowflake, Message, Collection, Guild, RichEmbed, TextChannel, GuildMember} from 'discord.js';
import {Command} from "./command";
import {swap, link, startgame, endgame} from './commands/';
import logger = require('../server/logger');
import tags = require('../db/queries/tags');
import users = require('../db/queries/users');
import teams = require('../db/queries/teams');

export class Harbinger {
    client: Client;
    token: string;
    commands: Collection<string, Command>;
//    db: HarbingerDatabase;
    logger: any;
    private guild: Guild;

    constructor(token = process.env['DISCORD_BOT_TOKEN']) {
        this.client = new Client();
        this.token = token;
        //this.db = new HarbingerDatabase('./harbinger.sqlite');
        this.logger = logger;
        this.commands = new Collection();
        this.registerCommands();
    }

    async handleDM(message: Message) {
        const user = await users.findUserFromDiscord(message.author.id);
        // @ts-ignore
        if (!(await tags.isOZ(user.id))) {
            logger.info('Not OZ, passing.');
            return;
        }
        // @ts-ignore
        const team = await teams.getSingleTeam(user.team);
        // @ts-ignore
        const channel = this.client.channels.get(team.channel_id);
        if(channel === undefined || !(channel instanceof TextChannel)) {
            // @ts-ignore
            logger.info(`${team.channel_id} is not a valid channel, passing.`);
            return;
        }
        const embed = new RichEmbed({
            description: message.cleanContent,
            title: "OZ Message",
        })
        channel.send(embed);
    }

    public start() {
        this.client.on('ready', async () => {
            this.logger.info('Harbinger active.');
            //this.logger.info(`Harbinger logged in with token: ${this.token}`);
            await this.client.user.setActivity('zombieaggies.me');

            this.guild = this.client.guilds.get(process.env['DISCORD_SERVER_ID']);
            if (this.guild === null || this.guild === undefined)
                throw(new Error("Guild cannot be null or undefined."));
        });

        this.client.on('message', (message) => {
            //Don't respond to bots; Bots are evil.
            if (message.author.bot) return;
            if (message.channel.type === "text") {
                this.handleMessage(message);
            }
            if (message.channel.type === "dm") {
                this.handleDM(message);
            }
        });

        return this.client.login(this.token);
    }

    async handleMessage(message: Message) {
        //This is not a message for us.
        const channels = await teams.getDiscordChannels();
        if(channels.has(message.channel.id.toString())) {
            const team = channels[message.channel.id];
            const ozs = await users.getOZs(team);
            for(const oz of ozs) {
                // @ts-ignore
                if(oz.discord !== undefined) {
                    logger.info(this.guild.members)
                    // @ts-ignore
                    let member = this.guild.members.get(oz.discord);
                    if(member === undefined) {
                        return;
                    }
                    let dmChannel = await member.createDM();
                    dmChannel.send(`**${message.member.nickname ? message.member.nickname : message.member.user.username}** ${message.cleanContent}`)
                }
            }
        }

        if (!message.cleanContent.startsWith('!')) {
            return;
        }

        let args = message.content.split(' ');
        let command = args[0].substring(1);
        if (this.commands.has(command)) {
            this.commands.get(command).run(message, args, this.client);
        }
    }

    registerCommands() {
        //Register commands here. Conflicting aliases are logged.
        let commands = [link, swap, startgame, endgame];

        for (const command of commands) {
            this.logger.verbose("Registerring command " + command.getName());
            //console.log(`Loading ${command.getName()} with aliases ${command.getAliases()}`)
            for (const alias of command.getAliases()) {
                if (!this.commands.has(alias))
                    this.commands.set(alias, command);
                else
                    console.error(`Conflicting alias: ${command.getName()}.${alias} and ${this.commands.get(alias)!.getName()}.${alias}`)
            }
        }
    }

    static switchEmbed(user, plague) {
        let re = new RichEmbed({
            title: 'HOPE | Zombie Status Notification',
            description: `${user.firstname}${user.nickname ? " \"" + user.nickname + "\" " : " "}${user.lastname} has been infected!
            
            *Please cease all contact with them and take cover.*`
        });
        re.setColor(plague ? "#DC143C" : "#32CD32");
        return re;
    }

    public async updateUser(user) {
        if (await tags.isOZ(user.id))
            return;

        if(user.team > 1)
        {
            let ch = <TextChannel>this.guild.channels.find(i => i.name === "general");
            ch.send(Harbinger.switchEmbed(user, user.team === 2));
        }
        if (!user.discord)
            return;

        switch (user.team) {
            case 1: {
                let member = await this.guild.fetchMember(user.discord);
                let roles = await this.guild.roles.filter(i => i.name === 'Zombie' || i.name === 'Plague Zombie' || i.name === 'Radiation Zombie');
                await member.removeRoles(roles).then(async () => await member.addRole(await this.guild.roles.find(i => i.name === 'Human')));
                break;
            }
            case 2: {
                let member = await this.guild.fetchMember(user.discord);
                let roles = await this.guild.roles.filter(i => i.name === 'Human' || i.name === 'Radiation Zombie');
                await member.removeRoles(roles).then(async () => await member.addRole(await this.guild.roles.find(i => i.name === 'Zombie' || i.name === "Plague Zombie")));
                break;
            }
            case 3: {
                let member = await this.guild.fetchMember(user.discord);
                let roles = await this.guild.roles.filter(i => i.name === 'Zombie' || i.name === 'Plague Zombie' || i.name === 'Human');
                await member.removeRoles(roles).then(async () => await member.addRole(await this.guild.roles.find(i => i.name === 'Radiation Zombie')));
                break;
            }
            case 0:
            default: {
                return;
            }
        }
    }
}