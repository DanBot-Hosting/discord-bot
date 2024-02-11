import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Interaction, PermissionResolvable, TextChannel } from "discord.js";

import autocompleteHandler from "../../util/interaction/autocomplete";
import buttonHandler from "../../util/interaction/button";
import commandHandler from "../../util/interaction/command";

const event: Event = {
    name: "interactionCreate",
    once: false,
    async execute(client: ExtendedClient, Discord: typeof import("discord.js"), interaction: Interaction) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            // Select menu handler
            if(interaction.isStringSelectMenu() && interaction.customId.startsWith("rating-")) {
                await interaction.deferUpdate();

                const message = await interaction.channel?.messages.fetch(interaction.message.id);

                // Get select menu data
                const rating = interaction.values[0] as unknown as number;

                // Convert number to amount of stars
                const stars = "⭐".repeat(rating);

                if(message) {
                    const rating = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`You rated us **${stars.length} star${stars.length === 1 ? "" : "s"}**, thank you for your feedback.`)

                    const ratingChannel = client.channels.cache.get(client.config_channels.ratings) as TextChannel;

                    const ratingResult = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}` })
                        .setDescription(stars)
                        .setTimestamp()

                    await ratingChannel.send({ embeds: [ratingResult] });
                    await message.edit({ embeds: [interaction.message.embeds[0], rating], components: [] });
                }
            }

            // Ignore interactions not in a guild
            if(!interaction.guild) return;
            // Ignore interactions if the bot does not have the required permissions
            if(!interaction.guild.members.me.permissions.has(requiredPerms)) return;

            // Autocomplete handler
            if(interaction.isAutocomplete()) return await autocompleteHandler(client, interaction);
            // Button handler
            if(interaction.isButton()) return await buttonHandler(client, Discord, interaction);
            // Command handler
            if(interaction.isCommand() && !interaction.isMessageContextMenuCommand() && !interaction.isUserContextMenuCommand()) return await commandHandler(client, Discord, interaction);
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
