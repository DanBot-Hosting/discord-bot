import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Message, MessageReaction, PartialMessageReaction, PartialUser, PermissionResolvable, TextChannel } from "discord.js";

import { channels, main, starboard } from "../../config";

const event: Event = {
    name: "messageReactionRemove",
    once: false,
    async execute(client: ExtendedClient, Discord: typeof import("discord.js"), r: PartialMessageReaction, user: PartialUser) {
        try {
            const reaction: MessageReaction = await r.fetch();
            const message: Message = await reaction.message.fetch();
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            // Ignore messages not in the primary guild and messages by bots
            if(message.author.bot || !message.guild) return;
            if(message.guild.id !== main.primaryGuild) return;

            // Return if the bot does not have the required permissions
            if(!message.guild.members.me.permissions.has(requiredPerms)) return;

            // Starboard
            // Return if the reaction emoji is not the starboard emoji
            if(reaction.emoji.name !== starboard.emoji) return;

            // Return if the message is more than 1 week old
            if(message.createdTimestamp < Date.now() - 604800000) return;

            // Return if the message is in the starboard channel
            if(message.channel.id === channels.starboard) return;

            // Return if the message is in a channel that is not allowed
            if(!starboard.allowed.includes(message.channel.id)) return;

            // Return if there is no message content or attachments
            if(!message.content && message.attachments.size < 1) return;

            const channel = message.guild.channels.cache.get(channels.starboard) as TextChannel;

            const messages = await channel.messages.fetch({ limit: 100 });
            const starMessage = messages.find(msg => msg.author.id === client.user.id && msg.embeds.length === 1 && msg.embeds[0].footer.text === `ID: ${message.id}`);

            // Delete the starboard message if the reaction threshold is no longer met
            if(starMessage && reaction.count < starboard.threshold) return starMessage.delete();

            // Edit the message
            if(starMessage) {
                const row: any = starMessage.components[0];

                row.components[0] = new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId("star-count")
                    .setEmoji(starboard.emoji)
                    .setLabel(`${reaction.count}`)

                // Edit the message
                starMessage.edit({ embeds: starMessage.embeds, components: starMessage.components });
            }
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
