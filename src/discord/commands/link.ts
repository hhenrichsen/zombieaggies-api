import { Command } from '../command'
import { Client, Message, MessageEmbed } from 'discord.js'

import { findUserFromDiscord } from '../../db/queries/users'

export default new Command(
  'link',
  Command.noCheck(),
  async (message: Message, args: Array<string>, client: Client, data?: any) => {
    const user: any = await findUserFromDiscord(message.author.id)
    if (user) {
      let richEmbed = new MessageEmbed({
        title: 'HOPE | Link Success!',
        description: `**Discord**: <@${message.author.id}>
                **Linked To**: ${user.firstname!} ${user.lastname!}`,
        color: 'GREEN'
      })
      return richEmbed
    } else {
      let richEmbed = new MessageEmbed({
        title: 'NOPE | Link Failure!',
        description:
          'No linked account found. ' +
          '\nGo to https://zombieaggies.me/auth/status to link your account.',
        color: 'RED'
      })
      return richEmbed
    }
  }
)
require
