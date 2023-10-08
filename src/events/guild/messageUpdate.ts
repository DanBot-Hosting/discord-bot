import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Message, PermissionResolvable, TextChannel } from "discord.js";

import cap from "../../util/cap";
import { channels, main } from "../../config";

const event: Event = {
    name: "messageUpdate",
    once: false,
    async execute(client: ExtendedClient & any, Discord: typeof import("discord.js"), oldMessage: Message, newMessage: Message) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            // Ignore messages not in the primary guild, partial messages and messages without content or attachments
            if(!oldMessage.guild || oldMessage.partial || newMessage.partial) return;
            if(oldMessage.guild.id !== main.primaryGuild) return;

            // Ignore messages if the bot does not have the required permissions
            if(!oldMessage.guild.members.me.permissions.has(requiredPerms)) return;

            const channel = oldMessage.guild.channels.cache.get(channels.messageLogs) as TextChannel;

            const messageInfo = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: oldMessage.author.tag.endsWith("#0") ? oldMessage.author.username : oldMessage.author.tag, iconURL: oldMessage.author.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${oldMessage.author.id}` })
                .setTitle("Message Edited")
                .addFields (
                    { name: "Channel", value: `${oldMessage.channel}`, inline: true },
                    { name: "Message Sent", value: `<t:${oldMessage.createdTimestamp.toString().slice(0, -3)}:f>`, inline: true },
                    { name: "Message ID", value: `\`${oldMessage.id}\``, inline: true },
                )
                .setTimestamp()

            const oldLog = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Old Message")
                .setDescription(cap(`${oldMessage.content || "*No message content.*"}`, 4000))
                .addFields (
                    { name: "Attachments", value: `${oldMessage.attachments.size}`, inline: true },
                    { name: "Embeds", value: `${oldMessage.embeds.length}`, inline: true }
                )

            const newLog = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("New Message")
                .setDescription(cap(`${newMessage.content || "*No message content.*"}`, 4000))
                .addFields (
                    { name: "Attachments", value: `${newMessage.attachments.size}`, inline: true },
                    { name: "Embeds", value: `${newMessage.embeds.length}`, inline: true }
                )

            const buttons: any = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("Jump to Message")
                        .setURL(oldMessage.url)
                )

            channel.send({ embeds: [messageInfo, oldLog, newLog], components: [buttons] });
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
