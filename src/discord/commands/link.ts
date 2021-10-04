import { Command } from '../command'
import { Client, Message, MessageEmbed } from 'discord.js'

import { findUserFromDiscord } from '../../db/queries/users'
import { isOZ } from '../../db/queries/tags'

export default new Command(
  'link',
  Command.noCheck(),
  async (message: Message, args: Array<string>, client: Client, data?: any) => {
    const humanRole = message.guild.roles.cache.find(
      role => role.name.toLowerCase() === 'human'
    )
    const zombieRole = message.guild.roles.cache.find(
      role => role.name.toLowerCase() === 'zombie'
    )
    const teamMapping = {
      1: humanRole,
      2: zombieRole
    }
    const user: any = await findUserFromDiscord(message.author.id)
    if (user) {
      let richEmbed = new MessageEmbed({
        title: 'HOPE | Link Success!',
        description: `**Discord**: <@${message.author.id}>
                **Linked To**: ${user.firstname!} ${user.lastname!}
                
                *Roles have been syncronized.*`,
        color: 'GREEN'
      })
      if (await isOZ(user.id)) {
        return
      }
      const member = message.guild.members.cache.get(message.author.id)
      const team = user.team
      const notTeams = Object.keys(teamMapping).filter(it => it != team)
      await member.roles.add(teamMapping[team])
      await member.roles.remove(notTeams.map(notTeam => teamMapping[notTeam]))
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
