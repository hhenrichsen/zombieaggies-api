import { Command } from '../command'
import { Message, Client, MessageEmbed, GuildMember } from 'discord.js'

const condition = (
  message: Message,
  args: Array<string>,
  client: Client,
  data?: any
) => {
  return message.member.roles.cache.some(
    i => i.name.toLowerCase() === 'admin' || i.name.toLowerCase() === 'officers'
  )
}

const ended = function (message: Message): MessageEmbed {
  return new MessageEmbed({
    title: 'HOPE Admin | Game Ended',
    description: `Good game! Adding all roles to members.

        *GG! See you next semester!*
        `
  }).setColor(
    message.guild.roles.cache.find(role => role.name.toLowerCase() == 'admin')
      ?.hexColor ?? 'GOLD'
  )
}

const execute = async (
  message: Message,
  args: Array<string>,
  client: Client,
  data?: any
) => {
  const allRoles = message.guild.roles.cache
  const roles = allRoles.filter(
    i =>
      i.name.toLowerCase() === 'zombie' ||
      i.name.toLowerCase() === 'human' ||
      i.name.toLowerCase() === 'plague zombie' ||
      i.name.toLowerCase() === 'radiation zombie'
  )
  const members = await message.guild.members.list()
  const targets: GuildMember[] = []
  for (const member of members.values()) {
    if (member.user.bot) {
      continue
    }
    if (member.roles.cache.some(i => i.name.toLowerCase() === 'harbinger')) {
      continue
    }
    targets.push(member)
  }
  await Promise.all(targets.map(member => member.roles.remove(roles)))
  return ended(message)
}

const endgame = new Command('endgame', condition, execute, ['stopgame'])

export default endgame
