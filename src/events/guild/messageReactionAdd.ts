import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Message, MessageReaction, PartialMessageReaction, PartialUser, PermissionResolvable, TextChannel } from "discord.js";

import { channels, main, starboard } from "../../config";
import reactionRoles from "../../configs/reactionRoles";

const event: Event = {
    name: "messageReactionAdd",
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

            // Reaction Roles
            if(message.channel.id === channels.reactionRoles) {
                // Return if the message ID is not in the reaction roles config
                if(!reactionRoles[message.id]) return;

                // Return if the reaction emoji is not a valid reaction role emoji
                if(!Object.keys(reactionRoles[message.id]).includes(reaction.emoji.name)) return;

                // Return if the user is a bot
                if(user.bot) return;

                // Give the user the role
                const role = message.guild.roles.cache.get(reactionRoles[message.id][reaction.emoji.name]);

                if(!role) return;

                const member = message.guild.members.cache.get(user.id);

                let added = false;

                if(!member.roles.cache.has(role.id)) {
                    await member.roles.add(role, `Reaction roles in #${(message.channel as TextChannel).name} (${message.channel.id})`);
                    console.log(`[reactionRoles] [add] ${member.user.tag} (${member.id}): ${role.name} (${role.id})`);
                    added = true;
                } else {
                    await member.roles.remove(role, `Reaction roles in #${(message.channel as TextChannel).name} (${message.channel.id})`);
                    console.log(`[reactionRoles] [remove] ${member.user.tag} (${member.id}): ${role.name} (${role.id})`);
                }

                try {
                    const dm = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`You have been ${added ? "added to" : "removed from"} the **${role.name}** role.`)

                    await member.send({ embeds: [dm] });
                } catch {}

                await reaction.users.remove(user.id);
                return;
            }

            // Starboard
            // Return if the reaction emoji is not the starboard emoji
            if(reaction.emoji.name !== starboard.emoji) return;

            // Return if the message is more than 1 week old
            if(message.createdTimestamp < Date.now() - 604800000) return;

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
