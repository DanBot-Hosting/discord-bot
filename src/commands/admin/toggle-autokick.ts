import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "toggle-autokick",
    description: "Toggle the status of auto-kicking accounts under 10 days old.",
    options: [],
    default_member_permissions: null,
    botPermissions: ["KickMembers"],
    requiredRoles: ["admin"],
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: false,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const channel = client.channels.cache.get(client.config_channels.otherLogs) as TextChannel;

            if(client.autoKick) {
                // Disable auto-kick
                client.autoKick = false;

                const status = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .addFields (
                        { name: "Auto-kick", value: `${emoji.cross} Disabled` }
                    )
                    .setFooter({ text: "Members under 10 days old will not be kicked." })

                await interaction.editReply({ embeds: [status] });

                // Log action
                const log = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setAuthor({ name: interaction.user.tag.endsWith("#0") ? interaction.user.username : interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}` })
                    .addFields (
                        { name: "Auto-kick", value: `${emoji.cross} Disabled` }
                    )
                    .setTimestamp()

                channel.send({ embeds: [log] });
            } else {
                // Enable auto-kick
                client.autoKick = true;

                const status = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .addFields (
                        { name: "Auto-kick", value: `${emoji.tick} Enabled` }
                    )
                    .setFooter({ text: "Members under 10 days old will be kicked." })

                await interaction.editReply({ embeds: [status] });

                // Log action
                const log = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setAuthor({ name: interaction.user.tag.endsWith("#0") ? interaction.user.username : interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}` })
                    .addFields (
                        { name: "Auto-kick", value: `${emoji.tick} Enabled` }
                    )
                    .setTimestamp()

                channel.send({ embeds: [log] });
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
