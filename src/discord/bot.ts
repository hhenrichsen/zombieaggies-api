import {
  Client,
  Snowflake,
  Message,
  Collection,
  Guild,
  TextChannel,
  Intents,
  MessageEmbed
} from 'discord.js'
import { Command } from './command'
import { swap, link, startgame, endgame } from './commands/'
import logger from '../server/logger'
import { getOZs, isOZ } from '../db/queries/tags'
import unzombie from './commands/unzombie'
import { findUserFromDiscord } from '../db/queries/users'

export class Harbinger {
  client: Client
  token: string
  relayChannelId: string
  commands: Collection<string, Command>
  //    db: HarbingerDatabase;
  private guild: Guild

  constructor (token = process.env['DISCORD_BOT_TOKEN']) {
    this.client = new Client({
      intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES
      ],
      partials: ['CHANNEL', 'MESSAGE', 'GUILD_MEMBER', 'USER']
    })
    this.token = token
    //this.db = new HarbingerDatabase('./harbinger.sqlite');
    this.commands = new Collection()
    this.relayChannelId = process.env['RELAY_CHANNEL']
    this.registerCommands()
  }

  async handleDM (message: Message) {
    logger.verbose(
      `Got a DM from ${message.author.id} (${message.author.username}): ${message.content}`
    )
    const user = (await findUserFromDiscord(message.author.id)) as any
    if (await isOZ(user.id)) {
      const channel = this.client.channels.cache.get(this.relayChannelId)
      if (channel.type == 'GUILD_TEXT') {
        const textChannel = channel as TextChannel
        const embed = new MessageEmbed()
        embed.setTitle('OZ Message')
        embed.setColor('#ff0000')
        embed.setDescription(message.content)
        textChannel.send({ embeds: [embed] })
      }
    }
  }

  public start () {
    this.client.on('ready', async () => {
      logger.info('Harbinger active.')
      //this.logger.info(`Harbinger logged in with token: ${this.token}`);
      this.client.user.setActivity('zombieaggies.localhost')

      this.guild = this.client.guilds.cache.get(
        process.env['DISCORD_SERVER_ID']
      )
      if (this.guild === null || this.guild === undefined)
        throw new Error('Guild cannot be null or undefined.')
    })

    this.client.on('messageCreate', message => {
      //Don't respond to bots; Bots are evil.
      if (message.author.bot) return
      else if (message.channel.type === 'DM') {
        this.handleDM(message)
        return
      } else if (message.channel.type === 'GUILD_TEXT') {
        this.handleMessage(message)
        return
      }
    })

    return this.client.login(this.token)
  }

  async handleMessage (message: Message) {
    try {
      if (message.cleanContent.startsWith('!')) {
        let args = message.content.split(' ')
        let command = args[0].substring(1)
        if (this.commands.has(command)) {
          this.commands.get(command).run(message, args, this.client)
        }
      } else if (message.channel.id == this.relayChannelId) {
        const ozs: any[] = await getOZs()
        for (const oz of ozs) {
          if (oz && oz.discord && typeof oz.discord == 'string') {
            const user = this.client.users.cache.get(oz.discord)
            if (user) {
              const channel = await user.createDM()
              const embed = new MessageEmbed()
              embed.setAuthor(
                message.author.username,
                message.author.avatarURL()
              )
              embed.setTitle('OZ Relay')
              embed.setColor('#ff0000')
              embed.setDescription(message.content)
              channel.send({ embeds: [embed] })
              return
            }
          }
        }
      }
    } catch (error) {
      console.error(error)
      logger.error(error)
    }
  }

  registerCommands () {
    //Register commands here. Conflicting aliases are logged.
    let commands = [link, swap, startgame, endgame, unzombie]

    for (const command of commands) {
      logger.verbose('Registerring command ' + command.getName())
      //console.log(`Loading ${command.getName()} with aliases ${command.getAliases()}`)
      for (const alias of command.getAliases()) {
        if (!this.commands.has(alias)) this.commands.set(alias, command)
        else
          console.error(
            `Conflicting alias: ${command.getName()}.${alias} and ${this.commands
              .get(alias)!
              .getName()}.${alias}`
          )
      }
    }
  }

  static switchEmbed (user, plague) {
    let re = new MessageEmbed({
      title: 'HOPE | Zombie Status Notification',
      description: `${user.firstname}${
        user.nickname ? ' "' + user.nickname + '" ' : ' '
      }${user.lastname} has been infected!
            
            *Please cease all contact with them and take cover.*`
    })
    re.setColor(plague ? '#DC143C' : '#32CD32')
    return re
  }

  public async updateUser (user) {
    if (await isOZ(user.id)) return

    if (user.team > 1) {
      let ch = <TextChannel>(
        this.guild.channels.cache.find(i => i.name === 'general')
      )
      ch.send({ embeds: [Harbinger.switchEmbed(user, user.team === 2)] })
    }
    if (!user.discord) return

    switch (user.team) {
      case 1: {
        let member = this.guild.members.cache.get(user.discord)
        let roles = this.guild.roles.cache.filter(i => i.name === 'Zombie')
        await member.roles
          .remove(roles)
          .then(
            async () =>
              await member.roles.add(
                this.guild.roles.cache.find(i => i.name === 'Human')
              )
          )
        break
      }
      case 2: {
        let member = this.guild.members.cache.get(user.discord)
        let roles = this.guild.roles.cache.filter(
          i => i.name === 'Human' || i.name === 'Zombie'
        )
        await member.roles
          .remove(roles)
          .then(
            async () =>
              await member.roles.add(
                this.guild.roles.cache.find(i => i.name === 'Zombie')
              )
          )
        break
      }
      case 0:
      default: {
        return
      }
    }
  }
}
