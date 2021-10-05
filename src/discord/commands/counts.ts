import { Command } from '../command'
import { Client, Message, MessageEmbed } from 'discord.js'

import { findUserFromDiscord } from '../../db/queries/users'
import { isOZ } from '../../db/queries/tags'
import { getAllTeams, getPlayerCount } from '../../db/queries/teams'

export default new Command(
  'counts',
  Command.noCheck(),
  async (message: Message, args: Array<string>, client: Client, data?: any) => {
    const teams: any = await getAllTeams()
    const embed = new MessageEmbed()
    embed.setTitle('HOPE | Team Counts')
    for (const team of teams) {
      const players = await getPlayerCount(team.id)
      embed.addField(team.name, players.toString())
    }
    return embed
  }
)
