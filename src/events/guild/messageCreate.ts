import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Message, PermissionResolvable } from "discord.js";

import { main } from "../../config";

const event: Event = {
    name: "messageCreate",
    once: false,
    async execute(client: ExtendedClient, Discord: any, message: Message) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks", "ManageMessages"];

            if(message.author.bot || !message.guild) return;
            if(!message.guild.members.me.permissions.has(requiredPerms)) return;

            if(message.content.toLowerCase().startsWith(main.legacyPrefix) && message.content.length > main.legacyPrefix.length + 3) {
                const legacy = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Deprecation of Prefix Commands")
                    .setDescription(`
                        👋 Hey there ${message.author}!

                        In the recent rewrite of the DBH Discord bot we have decided to move away from prefix commands (e.g. \`DBH!help\`) and have moved to slash commands (e.g. \`/help\`).

                        This change has been made to help make development easier of the Discord bot and allow us to maintain it easily.

                        Regards,
                        The **DanBot Team**
                    `)

                message.reply({ embeds: [legacy] });
            }
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
