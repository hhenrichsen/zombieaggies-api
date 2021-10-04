import { Command } from '../command'
import {
  Message,
  Client,
  MessageEmbed,
  GuildMember,
  Permissions
} from 'discord.js'
import logger from '../../server/logger'

const condition = (
  message: Message,
  args: Array<string>,
  client: Client,
  data?: any
) => {
  return message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)
}

const cured = function (message: Message): MessageEmbed {
  return new MessageEmbed({
    title: 'HOPE Admin | Cure All',
    description: `Removing Zombie from all members.
        `
  }).setColor(
    message.guild.roles.cache.find(
      role => role.name.toLowerCase() == 'harbinger'
    ).hexColor
  )
}

const execute = async (
  message: Message,
  args: Array<string>,
  client: Client,
  data?: any
) => {
  if (message.guild == null) {
    return new MessageEmbed({
      title: 'HOPE Admin | Error',
      description: `Failed to find guild.`
    }).setColor(
      message.guild.roles.cache.find(
        role => role.name.toLowerCase() == 'harbinger'
      ).hexColor
    )
  }

  const roles = message.guild.roles.cache.filter(
    i =>
      i.name === 'Zombie' ||
      i.name === 'Plague Zombie' ||
      i.name === 'Radiation Zombie'
  )
  const targets: GuildMember[] = []
  const members = await message.guild.members.list()
  for (const member of members) {
    if (!member || !member[1] || !member[0]) {
      continue
    }

    if (member[1].roles.cache.some(i => i.name.toLowerCase() === 'harbinger')) {
      continue
    }

    if (member[1].user.bot) continue

    targets.push(member[1])
  }
  for (const target of targets) {
    try {
      await target.roles.remove(roles)
    } catch (ex) {
      logger.error(
        `Failed to remove roles from ${target.id} (${target.user.username})`
      )
    }
  }
  return cured(message)
}

const unzombie = new Command('unzombie', condition, execute, ['cureall'])

export default unzombie
