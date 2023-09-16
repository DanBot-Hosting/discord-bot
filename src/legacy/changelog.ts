import LegacyCommand from "../classes/LegacyCommand";
import ExtendedClient from "../classes/ExtendedClient";
import { Message, TextChannel } from "discord.js";

import cap from "../util/cap";
import { channels, emojis as emoji } from "../config";

const command: LegacyCommand = {
    name: "changelog",
    description: "Create and send a changelog.",
    aliases: ["cl"],
    botPermissions: [],
    requiredRoles: ["dev"],
    cooldown: 10,
    enabled: true,
    async execute(message: Message, args: string[], cmd: LegacyCommand, client: ExtendedClient, Discord: any) {
        try {
            if(!args[0]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} Please provide some text!`)

                message.reply({ embeds: [error] });
                return;
            }

            const channel = message.guild.channels.cache.get(channels.changelogs) as TextChannel;

            const changelog = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: message.author.tag.endsWith("#0") ? message.author.username : message.author.tag, iconURL: message.author.avatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${message.author.id}`})
                .setDescription(cap(args.join(" "), 2000))
                .setTimestamp()

            const msg = await channel.send({ embeds: [changelog] });

            const sent = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Your changelog was sent: ${msg.url}`)

            message.reply({ embeds: [sent] });
        } catch(err) {
            client.logLegacyError(err, message, Discord);
        }
    }
}

export = command;
