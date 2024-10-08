import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Message, MessageReaction, PartialMessageReaction, PartialUser, PermissionResolvable, TextChannel } from "discord.js";

import { channels, main, starboard } from "../../config";

const event: Event = {
    name: "messageReactionAdd",
    once: false,
    async execute(client: ExtendedClient, Discord: typeof import("discord.js"), r: PartialMessageReaction, user: PartialUser) {
        try {
            const reaction: MessageReaction = await r.fetch();
            const message: Message = await reaction.message.fetch();
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            // Ignore messages not in the primary guild
            if(!message.guild || message.guild.id !== main.primaryGuild) return;

            // Return if the bot does not have the required permissions
            if(!message.guild.members.me.permissions.has(requiredPerms)) return;

            // Starboard
            // Ignore messages created by bots
            if(message.author.bot) return;

            // Return if the reaction emoji is not the starboard emoji
            if(reaction.emoji.name !== starboard.emoji) return;

            // Return if the message is more than 1 month old
            if(message.createdTimestamp < Date.now() - 2592000000) return;

            // Return if the reaction count is less than the required amount
            if(reaction.count < starboard.threshold) return;

            // Return if the message is in the starboard channel or in a channel that is not allowed
            if(message.channel.id === channels.starboard || !starboard.allowed.includes(message.channel.id)) return;

            // Return if there is no message content or attachments
            if(!message.content && message.attachments.size < 1 || !message.content && !message.attachments.first().contentType.startsWith("image")) return;

            const channel = message.guild.channels.cache.get(channels.starboard) as TextChannel;

            const messages = await channel.messages.fetch({ limit: 100 });
            const starMessage = messages.find(msg => msg.author.id === client.user.id && msg.embeds.length === 1 && msg.embeds[0].footer.text === `ID: ${message.id}`);

            // Delete the starboard message if the reaction threshold is not met
            if(starMessage && reaction.count < starboard.threshold) return starMessage.delete();

            if(starMessage) {
                // Edit the message
                starMessage.edit({ content: `${starboard.emoji} **${reaction.count}**`, embeds: starMessage.embeds, components: starMessage.components });
            } else {
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.gold)
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${message.author.id}` })
                    .setFooter({ text: `ID: ${message.id}` })
                    .setTimestamp(message.createdTimestamp)

                const buttons: any = new Discord.ActionRowBuilder()
                    .addComponents (
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Link)
                            .setLabel("Jump to Message")
                            .setURL(message.url)
                    )

                // Add content and/or image to the embed
                if(message.content) embed.setDescription(message.content);
                if(message.attachments.size > 0) embed.setImage(message.attachments.first().url ?? message.attachments.first().proxyURL);

                // Return if there is no content or image
                if(!embed.data.description && !embed.data.image) return;

                // Send the message to the starboard channel
                channel.send({ content: `${starboard.emoji} **${reaction.count}**`, embeds: [embed], components: [buttons] });
            }
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
