import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "toggle-joining",
    description: "Toggle the status of new members joining the server.",
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
            const channel = client.channels.cache.get(client.config_channels.modLogs) as TextChannel;

            if(client.allowJoining) {
                // Disable new members joining
                client.allowJoining = false;

                const status = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .addFields (
                        { name: "Joining", value: `${emoji.cross} Disabled` }
                    )
                    .setFooter({ text: "All new members attempting to join the server will be kicked." })

                await interaction.editReply({ embeds: [status] });

                // Log action
                const log = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}` })
                    .addFields (
                        { name: "Joining", value: `${emoji.cross} Disabled` }
                    )
                    .setTimestamp()

                channel.send({ embeds: [log] });
            } else {
                // Enable new members joining
                client.allowJoining = true;

                const status = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .addFields (
                        { name: "Joining", value: `${emoji.tick} Enabled` }
                    )
                    .setFooter({ text: "New members can now join the server." })

                await interaction.editReply({ embeds: [status] });

                // Log action
                const log = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}` })
                    .addFields (
                        { name: "Joining", value: `${emoji.tick} Enabled` }
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
