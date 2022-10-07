import { Command } from '../command'
import { Message, Client, MessageEmbed, DiscordAPIError } from 'discord.js'
import { getActiveDiscordUsers } from '../../db/queries/users'
import logger from '../../server/logger'

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
  message.react('⌛')
  const players: string[] = (await getActiveDiscordUsers()).map(user => (user as any).discord);
  const guild = message.guild;
  const roles = [...message.guild.roles.cache.filter(
    i =>
      i.name.toLowerCase() === 'human' ||
      i.name.toLowerCase() === 'zombie' ||
      i.name.toLowerCase() === 'plague zombie' ||
      i.name.toLowerCase() === 'radiation zombie'
  ).values()].map(role => role.id);
  const humanRole = message.guild.roles.cache.find(
    i => i.name.toLowerCase() === 'human'
  )
  await message.guild.members.fetch();

  await Promise.all(roles.map(async roleId => {
    const role = await message.guild.roles.fetch(roleId);
    return role.members.map(member => member.roles.remove(roles))
  }))

  for (const snowflake of players) {
    let member;
    try {
      member = await guild.members.fetch(snowflake);
    }
    catch (error) {
      continue;
    }
    if (member.user.bot) continue

    const roles = member.roles.cache

    if (
      roles.some(
        i =>
          i.name.toLowerCase() === 'harbinger' ||
          i.name.toLowerCase() == 'human'
      )
    ) {
      continue
    }

    await member.roles.add(humanRole, 'Adding Human to start game')
  }
  await message.reactions.resolve('⌛').users.remove(client.user.id);
  return started(message)
}

const startgame = new Command('startgame', condition, execute, ['begingame'])

export default startgame
