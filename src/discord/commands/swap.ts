import {Command} from "../command";
import {RichEmbed} from "discord.js";

export default new Command('switch', Command.noCheck(), () => new RichEmbed({
    title: 'Harbinger | Error',
    description: 'That command has been replaced with discord linking. \nTo check your link status do `!link`.'
}))