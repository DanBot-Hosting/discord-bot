import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { ChannelType, Message, PermissionResolvable } from "discord.js";

import cap from "../../util/cap";
import { main } from "../../config";

const event: Event = {
    name: "messageCreate",
    once: false,
    async execute(client: ExtendedClient & any, Discord: any, message: Message) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            if(message.author.bot) return;

            if(message.channel.type === ChannelType.DM && main.dmAllowed.includes(message.author.id)) {
                const args = message.content.trim().split(/ +/g);

                if(!args[1]) return message.reply("Please provide the text you would like to send to the channel.");

                try {
                    const msg = await client.channels.cache.get(args[0]).send(cap(message.content.split(" ").slice(1).join(" "), 2000));

                    message.react("✅");
                    message.reply(msg.url);
                } catch(err) {
                    message.react("❌");
                    message.reply(`\`\`\`${err.message}\`\`\``);
                }

                return;
            }

            if(!message.guild) return;
            if(!message.guild.members.me.permissions.has(requiredPerms)) return;

            if(message.content.toLowerCase().startsWith(main.legacyPrefix) && message.content.length > main.legacyPrefix.length + 3) {
                const description = [
                    `👋 Hey there ${message.author}!`,
                    "\nIn the recent rewrite of the DBH Discord bot we have decided to move away from prefix commands (e.g. `DBH!help`) and have moved to slash commands (e.g. `/help`).",
                    "\nThis change has been made to help make development easier of the Discord bot and allow us to maintain it easily.",
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
