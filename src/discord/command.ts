import {
  Client,
  Message,
  MessageOptions,
  MessageEmbed,
  Channel,
  TextChannel,
  TextBasedChannels
} from 'discord.js'
import logger from '../server/logger'

type CommandExecutable = (
  message: Message,
  args: Array<string>,
  client: Client,
  data?: any
) =>
  | undefined
  | string
  | MessageEmbed
  | Promise<undefined | string | MessageEmbed>
type CommandCondition = (
  message: Message,
  args: Array<string>,
  client: Client,
  data?: any
) => boolean

/**
 * Provides a way to check conditions and hide execution code of commands.
 * @class Command
 * @author Hunter Henrichsen
 * @version 1.0
 */
export class Command {
  private name: string
  private condition: CommandCondition
  private execute: CommandExecutable
  private aliases: Array<string>

  constructor (
    name: string,
    condition: CommandCondition,
    execute: CommandExecutable,
    aliases?: Array<string>
  ) {
    this.name = name
    this.condition = condition
    this.execute = execute
    this.aliases = [name]

    if (aliases) this.aliases = this.aliases.concat(aliases!)
  }

  static noCheck (): CommandCondition {
    return () => true
  }

  static async errorTimeout (message: Message | Message[]) {
    if (message instanceof Message) await message.delete()
    else
      for (const m of message) {
        await m.delete()
      }
  }

  /**
   * Run the command.
   * @param {Message} message Triggering message.
   * @param {Array<string>} args Command arguments.
   * @param {Client} client Discord client.
   * @param {any} data Optional data to do with the execution of the command.
   */
  public async run (
    message: Message,
    args: Array<string>,
    client: Client,
    data?: any
  ): Promise<void> {
    try {
      await message.channel.sendTyping()
      if (this.condition(message, args, client, data)) {
        let response = this.execute(message, args, client, data)
        if (response) {
          await this.send(message.channel, response)
          await message.delete()
        } else {
          await message.delete()
        }
      }
    } catch (ex) {
      logger.error(ex)
      console.error(ex)
    }
  }

  private async send (
    channel: TextBasedChannels,
    message:
      | undefined
      | string
      | MessageEmbed
      | Promise<undefined | string | MessageEmbed>
  ) {
    if (message instanceof Promise) {
      await this.send(channel, await message)
    } else if (typeof message == 'undefined') {
      return
    } else if (typeof message == 'string') {
      channel.send(message)
    } else if (message instanceof MessageEmbed) {
      channel.send({ embeds: [message] })
    } else {
      logger.error('Attempting to send invalid typed message: ' + message)
    }
  }

  getAliases (): Array<string> {
    return this.aliases
  }

  getName (): string {
    return this.name
  }
}
