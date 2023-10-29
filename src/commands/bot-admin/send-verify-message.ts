import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "send-verify-message",
    description: "Send the verification message.",
    options: [
        {
            type: 7,
            name: "channel",
            description: "The channel to send the message to.",
            channel_types: [0],
            required: true
        }
    ],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: ["botAdmin"],
    cooldown: 60,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const channel = interaction.options.get("channel").channel as TextChannel;

            const sending = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Sending the verification message...`)

            await interaction.editReply({ embeds: [sending] });

            try {
                const verification = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Verification")
                    .setDescription("To help prevent usage of alt accounts, we require everyone to verify in order to gain access to the server.\n\n**Click the button below to verify.**")

                const row: any = new Discord.ActionRowBuilder()
                    .addComponents (
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Success)
                            .setCustomId("verify")
                            .setLabel("Verify")
                    )

                await channel.send({ embeds: [verification], components: [row] });

                const success = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} The verification message has been sent.`)

                await interaction.editReply({ embeds: [success] });
                return;
            } catch(err) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} Failed to send the verification message.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
