import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Message, PermissionResolvable, TextChannel } from "discord.js";

import { channels, main, starboard } from "../../config";
import cap from "../../util/cap";

const event: Event = {
    name: "messageDelete",
    once: false,
    async execute(client: ExtendedClient & any, Discord: typeof import("discord.js"), message: Message) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            // Ignore messages not in the primary guild, partial messages
            if(!message.guild || message.partial) return;
            if(message.guild.id !== main.primaryGuild) return;

            const channel = message.guild.channels.cache.get(channels.messageLogs) as TextChannel;

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${message.author.id}` })
                .setTitle("Message Deleted")
                .addFields (
                    { name: "Channel", value: `${message.channel}`, inline: true },
                    { name: "Message Sent", value: `<t:${message.createdTimestamp.toString().slice(0, -3)}:f>`, inline: true },
                    { name: "Message ID", value: `\`${message.id}\``, inline: true },
                    { name: "Attachments", value: `${message.attachments.size}`, inline: true },
                    { name: "Embeds", value: `${message.embeds.length}`, inline: true },
                    { name: "Stickers", value: `${message.stickers.size}`, inline: true }
                )
                .setTimestamp()

            if(message.content) log.setDescription(cap(message.content, 4000));

            if(!main.logIgnoredChannels.includes(message.channel.id)) await channel.send({ embeds: [log] });

            // Ignore messages if the bot does not have the required permissions
            if(!message.guild.members.me.permissions.has(requiredPerms)) return;

            // Delete starboard message if it exists
            // Return if the message is one week old
            if(message.createdTimestamp < Date.now() - 604800000) return;

            // Return if the message is in the starboard channel or in a channel that is not allowed
            if(message.channel.id === channels.starboard || !starboard.allowed.includes(message.channel.id)) return;

            // Return if there is no message content or attachments
            if(!message.content && message.attachments.size < 1) return;

            const starboardChannel = message.guild.channels.cache.get(channels.starboard) as TextChannel;

            const messages = await starboardChannel.messages.fetch({ limit: 100 });
            const starMessage = messages.find(msg => msg.author.id === client.user.id && msg?.embeds?.length === 1 && msg.embeds[0]?.footer?.text === `ID: ${message.id}`);

            if(starMessage) await starMessage.delete();
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
