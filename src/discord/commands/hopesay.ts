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

const execute = async (
  message: Message,
  args: Array<string>,
  client: Client,
  data?: any
): Promise<string> => {
  // Send the message as the bot
  try {
    await message.delete();
  } catch {}

  // Get the message to send
  const messageToSend = message.content.replace("!hopesay", "").trim();

  return messageToSend;
};

const hopesay = new Command("hopesay", condition, execute, ["hopesay"]);

export default hopesay;
