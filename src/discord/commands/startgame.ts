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

  await Promise.all(
    roles.map(role =>
      Promise.all(role.members.map(member => member.roles.remove(role)))
    )
  )

  for (const member of members) {
    if (member[1].user.bot) continue

    const roles = member[1].roles.cache

    if (
      roles.some(
        i =>
          i.name.toLowerCase() === 'harbinger' ||
          i.name.toLowerCase() == 'human'
      )
    ) {
      continue
    }

    await member[1].roles.add(humanRole, 'Adding Human to start game')
  }
  return started(message)
}

const startgame = new Command('startgame', condition, execute, ['begingame'])

export default startgame
