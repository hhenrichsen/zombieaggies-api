import { Command } from '../command'
import { Message, Client, MessageEmbed } from 'discord.js'

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
  const roles = message.guild.roles.cache.filter(
    i =>
      i.name === 'Zombie' ||
      i.name === 'Human' ||
      i.name === 'Plague Zombie' ||
      i.name === 'Radiation Zombie'
  )
  const members = await message.guild.members.list()
  for (const member of members) {
    if (member[1].roles.cache.some(i => i.name === 'Admin')) {
      continue
    }

    await member[1].roles.add(roles)
  }
  return ended(message)
}

const endgame = new Command('endgame', condition, execute, ['stopgame'])

export default endgame
