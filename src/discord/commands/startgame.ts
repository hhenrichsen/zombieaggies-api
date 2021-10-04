import { Command } from '../command'
import { Message, Client, MessageEmbed } from 'discord.js'

const condition = (
  message: Message,
  args: Array<string>,
  client: Client,
  data?: any
) => {
  return message.member.roles.cache.some(
    i => i.name === 'Admin' || i.name === 'Officers'
  )
}

const started = function (message: Message): MessageEmbed {
  return new MessageEmbed({
    title: 'HOPE Admin | Game Started',
    description: `Starting the game. Added Human to all members.

        *Welcome to the apocalypse. Good luck surviving.*
        `
  }).setColor(
    message.guild.roles.cache.find(
      role => role.name.toLowerCase() == 'harbinger'
    ).hexColor ?? 'GOLD'
  )
}

const execute = async (
  message: Message,
  args: Array<string>,
  client: Client,
  data?: any
) => {
  const roles = message.guild.roles.cache.filter(
    i =>
      i.name === 'Zombie' ||
      i.name === 'Plague Zombie' ||
      i.name === 'Radiation Zombie'
  )
  const humanRole = message.guild.roles.cache.find(
    i => i.name.toLowerCase() === 'human'
  )

  const members = await message.guild.members.list({ limit: 1000 })

  for (const member of members) {
    if (member[1].roles.cache.some(i => i.name === 'Harbinger')) {
      continue
    }

    if (member[1].user.bot) continue

    await member[1].roles.remove(roles, 'Removing Zombie to start game')
    await member[1].roles.add(humanRole, 'Adding Human to start game')
  }
  return started(message)
}

const startgame = new Command('startgame', condition, execute, ['begingame'])

export default startgame
