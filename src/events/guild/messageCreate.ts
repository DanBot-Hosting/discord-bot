import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Message, PermissionResolvable } from "discord.js";

import { main } from "../../config";

const event: Event = {
    name: "messageCreate",
    once: false,
    async execute(client: ExtendedClient, Discord: any, message: Message) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            if(message.author.bot || !message.guild) return;
            if(!message.guild.members.me.permissions.has(requiredPerms)) return;

            if(message.content.toLowerCase().startsWith(main.legacyPrefix) && message.content.length > main.legacyPrefix.length + 3) {
                const description = [
                    `👋 Hey there ${message.author}!`,
                    "\nIn the recent rewrite of the DBH Discord bot we have decided to move away from prefix commands (e.g. `DBH!help`) and have moved to slash commands (e.g. `/help`).",
                    "\n\nThis change has been made to help make development easier of the Discord bot and allow us to maintain it easily.",
                    "\nRegards,",
                    "The **DanBot Team**"
                ]

                const legacy = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Deprecation of Prefix Commands")
                    .setDescription(description.join("\n"))

                message.reply({ embeds: [legacy] });
                return;
            }
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
