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
    message.guild.roles.cache.find(role => role.name.toLowerCase() == 'admin')
      .hexColor
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
  for (const member of message.guild.members.cache) {
    if (member[1].roles.cache.some(i => i.name === 'Admin')) {
      continue
    }

    if (member[1].user.bot) continue

    await member[1].roles.add(
      message.guild.roles.cache.find(i => i.name === 'Human')
    )

    await member[1].roles.remove(roles)
  }
  return started(message)
}

const startgame = new Command('startgame', condition, execute, ['begingame'])

export default startgame
