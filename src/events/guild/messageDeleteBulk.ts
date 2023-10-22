import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Collection, Message, PermissionResolvable, Snowflake, TextChannel } from "discord.js";

import { channels, main, starboard } from "../../config";

const event: Event = {
    name: "messageDeleteBulk",
    once: false,
    async execute(client: ExtendedClient & any, Discord: typeof import("discord.js"), messages: Collection<Snowflake, Message>	) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            const guild = messages.first().guild;
            const channel = messages.first().channel as TextChannel;

            // Ignore messages not in the primary guild and messages by bots
            if(guild.id !== main.primaryGuild) return;

            // Return if the bot does not have the required permissions
            if(!guild.members.me.permissions.has(requiredPerms)) return;

            // Return if the message is in the starboard channel or in a channel that is not allowed
            if(channel.id === channels.starboard || !starboard.allowed.includes(channel.id)) return;

            // Remove messages from starboard if included
            const starboardChannel = client.channels.cache.get(channels.starboard) as TextChannel;

            const channelMsgs = await starboardChannel.messages.fetch({ limit: messages.size });
            const starboardMessages = channelMsgs.filter(msg => msg.author.id === client.user.id && msg.embeds.length === 1 && msg.embeds[0].footer.text.startsWith("ID: "));

            for(const message of messages.values()) {
                // Return if the message is more than 1 week old
                if(message.createdTimestamp < Date.now() - 604800000) continue;

                const starboardMessage = starboardMessages.find(msg => msg.embeds[0].footer.text === `ID: ${message.id}`);

                if(starboardMessage) await starboardMessage.delete();
            }
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
