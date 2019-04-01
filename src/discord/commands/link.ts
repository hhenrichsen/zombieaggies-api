import {Command} from "../command";
import {Client, Message, RichEmbed} from "discord.js";

const users = require("../../db/queries/users");

export default new Command('link', Command.noCheck(),
    async (message: Message, args: Array<string>, client: Client, data?: any) => {
        const user = await users.findUserFromDiscord(message.author.id);
        if (user) {
            let richEmbed = new RichEmbed({
                title: 'HOPE | Link Success!',
                description: `**Linked To**: ${user.firstname!} ${user.lastname!}`,
                color: 10731148,
            });
            return richEmbed;
        } else {
            let richEmbed = new RichEmbed({
                title: 'HOPE | Link Failure!',
                description: 'No linked account found. ' +
                    '\nGo to https://zombieaggies.me/auth/status to link your account.',
                color: 12542314,
            });
            return richEmbed;
        }
    }
);