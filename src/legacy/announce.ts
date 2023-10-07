import LegacyCommand from "../classes/LegacyCommand";
import ExtendedClient from "../classes/ExtendedClient";
import { Message, TextChannel } from "discord.js";

import cap from "../util/cap";
import { channels, emojis as emoji } from "../config";

const command: LegacyCommand = {
    name: "announce",
    description: "Create and send an announcement.",
    aliases: ["announcement"],
    botPermissions: [],
    requiredRoles: ["admin"],
    cooldown: 60,
    enabled: true,
    async execute(message: Message, args: string[], cmd: LegacyCommand, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            if(!args[0]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} Please provide some text!`)

                message.reply({ embeds: [error] });
                return;
            }

            const channel = message.guild.channels.cache.get(channels.announcements) as TextChannel;

            const announcement = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: message.author.tag.endsWith("#0") ? message.author.username : message.author.tag, iconURL: message.author.avatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${message.author.id}`})
                .setDescription(cap(args.join(" "), 4000))
                .setTimestamp()

            const msg = await channel.send({ embeds: [announcement] });

            const sent = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} ${msg.url}`)

            message.reply({ embeds: [sent] });
        } catch(err) {
            client.logLegacyError(err, message, Discord);
        }
    }
}

export = command;
