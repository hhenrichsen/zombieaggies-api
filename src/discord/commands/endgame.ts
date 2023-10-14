import { Command } from "../command";
import { Message, Client, MessageEmbed, GuildMember } from "discord.js";
import logger from "../../server/logger";
import { getActiveDiscordUsers } from "../../db/queries/users";

const condition = (
  message: Message,
  args: Array<string>,
  client: Client,
  data?: any
) => {
  return message.member.roles.cache.some(
    (i) =>
      i.name.toLowerCase() === "admin" || i.name.toLowerCase() === "officers"
  );
};

const ended = function (message: Message): MessageEmbed {
  return new MessageEmbed({
    title: "HOPE Admin | Game Ended",
    description: `Good game! Adding all roles to members.

        *GG! See you next semester!*
        `,
  }).setColor(
    message.guild.roles.cache.find((role) => role.name.toLowerCase() == "admin")
      ?.hexColor ?? "GOLD"
  );
};

const execute = async (
  message: Message,
  args: Array<string>,
  client: Client,
  data?: any
) => {
  message.react("⌛");
  const guild = message.guild;
  const members = await guild.members.fetch();
  const players: string[] = (await getActiveDiscordUsers()).map(
    (user) => (user as any).discord
  );
  const allRoles = [...(await guild.roles.fetch()).values()];
  const roles = allRoles.filter(
    (i) =>
      i.name.toLowerCase() === "zombie" ||
      i.name.toLowerCase() === "human" ||
      i.name.toLowerCase() === "plague zombie" ||
      i.name.toLowerCase() === "radiation zombie"
  );
  for (const snowflake of players) {
    try {
      const member = await guild.members.fetch(snowflake);
      if (member.user.bot) continue;

      if (
        member.roles.cache.some((i) => i.name.toLowerCase() === "harbinger")
      ) {
        continue;
      }

      const rolesToAdd = roles.filter(
        (role) => !member.roles.cache.has(role.id)
      );

      await member.roles.add(rolesToAdd);
      logger.silly(`Adding roles to ${member.user.username} (${member.id})`);
    } catch (error) {
      logger.error(error);
      continue;
    }
  }
  await message.reactions.resolve("⌛").users.remove(client.user.id);
  return ended(message);
};

const endgame = new Command("endgame", condition, execute, ["stopgame"]);

export default endgame;
