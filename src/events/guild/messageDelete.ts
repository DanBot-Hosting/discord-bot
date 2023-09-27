import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Message, PermissionResolvable, TextChannel } from "discord.js";

import cap from "../../util/cap";
import { channels, main, starboard } from "../../config";
import path from "path";

const event: Event = {
    name: "messageDelete",
    once: false,
    async execute(client: ExtendedClient & any, Discord: typeof import("discord.js"), message: Message) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            // Ignore messages not in the primary guild
            // Also ignore partial messages and messages that are only embeds
            if(message.partial || (message.embeds.length && !message.content && !message.attachments.size) || !message.guild) return;
            if(message.guild.id !== main.primaryGuild) return;
            // Ignore messages if the bot does not have the required permissions
            if(!message.guild.members.me.permissions.has(requiredPerms)) return;

            const channel = message.guild.channels.cache.get(channels.messageLogs) as TextChannel;

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: message.author.tag.endsWith("#0") ? message.author.username : message.author.tag, iconURL: message.author.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${message.author.id}` })
                .setTitle("Message Deleted")
                .setDescription(cap(message.content, 2000) ?? "*Message contained no content.*")
                .addFields (
                    { name: "Channel", value: `<#${message.channel.id}>`, inline: true }
                )
                .setTimestamp()

            // If the message had an attachment, add it to the embed
            let attachment = null;

            if(message.attachments.first()) {
                const fileExt = path.extname(message.attachments.first().url.toLowerCase());
                const allowedExtensions = ["gif", "jpeg", "jpg", "png", "svg", "webp"];

                if(allowedExtensions.includes(fileExt.split(".").join(""))) {
                    attachment = new Discord.AttachmentBuilder(message.attachments.first().url, { name: `attachment${fileExt}` });

                    log.setImage(`attachment://${attachment.name}`);
                }
            }

            channel.send({ embeds: [log] });

            // Delete starboard message if it exists
            // Return if the message is one week old
            if(message.createdTimestamp < Date.now() - 604800000) return;

            // Return if the message is in the starboard channel
            if(message.channel.id === channels.starboard) return;

            // Return if the message is in a channel that is not allowed
            if(!starboard.allowed.includes(message.channel.id)) return;

            // Return if there is no message content or attachments
            if(!message.content && message.attachments.size < 1) return;

            const starboardChannel = message.guild.channels.cache.get(channels.starboard) as TextChannel;

            const messages = await starboardChannel.messages.fetch({ limit: 100 });
            const starMessage = messages.find(msg => msg.author.id === client.user.id && msg.embeds.length === 1 && msg.embeds[0].footer.text === `ID: ${message.id}`);

            if(starMessage) starMessage.delete();
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
