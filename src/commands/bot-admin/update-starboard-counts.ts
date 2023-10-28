import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { ButtonStyle, CommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji, starboard } from "../../config";

const command: Command = {
    name: "update-starboard-counts",
    description: "Manually update all starboard star counts.",
    options: [],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: ["botAdmin"],
    cooldown: 60,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const starboardChannel = client.channels.cache.get(client.config_channels.starboard) as TextChannel;

            let messages = await starboardChannel.messages.fetch({ limit: 100 });
            messages = messages.filter(msg => msg.author.id === client.user.id && msg.embeds.length === 1 && msg.embeds[0].footer.text.startsWith("ID: "));

            if(!messages.size) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} No starboard messages found.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const updating = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Updating starboard star counts...`)

            await interaction.editReply({ embeds: [updating] });

            let count = 0;

            for(const [messageId, message] of messages) {
                const embed = message.embeds[0];
                const id = embed.footer.text.replace("ID: ", "");
                const url = (message.components[0].components[0].data as any).url;
                const channel = client.channels.cache.get(url.split("/")[5]) as TextChannel;
                let starboardMessage = null;

                try {
                    starboardMessage = await channel.messages.fetch(id);
                } catch {
                    await message.delete();
                    continue;
                }

                const updatingMessage = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.ping} Updating \`${messageId}\`...`)

                await interaction.editReply({ embeds: [updatingMessage] });

                const starCount = starboardMessage.reactions.cache.get("⭐")?.count || 0;

                if(starCount < starboard.threshold) await message.delete();

                await message.edit({ content: `${starboard.emoji} **${starCount}**`, embeds: message.embeds, components: message.components });
                count++;
            }

            if(!count) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} No starboard messages updated.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const updated = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Updated **${count}** starboard messages.`)

            await interaction.editReply({ embeds: [updated] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
