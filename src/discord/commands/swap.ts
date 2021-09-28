import { Command } from '../command'
import { MessageEmbed } from 'discord.js'

export default new Command(
  'switch',
  Command.noCheck(),
  () =>
    new MessageEmbed({
      title: 'HOPE | Error',
      description:
        'That command has been replaced with discord linking. \nTo check your link status do `!link`.'
    })
)
