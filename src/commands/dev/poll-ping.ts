import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";
import { noPermissionCommand } from "../../util/embeds";

const command: Command = {
    name: "poll-ping",
    description: "Ping the poll ping role for new developer questions.",
    options: [
        {
            type: 3,
            name: "reason",
            description: "The reason for the ping.",
            required: true
        }
    ],
    default_member_permissions: null,
    botPermissions: ["MentionEveryone"],
    requiredRoles: [],
    cooldown: 0,
    enabled: true,
    deferReply: false,
    ephemeral: false,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            // Return error if the user is not allowed to use the command
            if(!client.config_main.pollPingAllowed.includes(interaction.user.id)) {
                await interaction.reply({ embeds: [noPermissionCommand], ephemeral: true });
                return;
            }

            // Return error if the command is not in the dev-questions channel
            if(interaction.channelId !== client.config_channels.devQuestions) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} This command can only be used in <#${client.config_channels.devQuestions}>.`)

                await interaction.reply({ embeds: [error], ephemeral: true });
                return;
            }

            // Return error if the command is on cooldown
            // Cooldown: 1 hour
            if(client.lastPoll + 3600000 > Date.now()) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} This command is on cooldown, it can be used <t:${Math.floor((client.lastPoll + 3600000) / 1000)}:R>.`)

                await interaction.reply({ embeds: [error], ephemeral: true });
                return;
            }

            const reason = interaction.options.get("reason").value as string;

            // Update last poll time
            client.lastPoll = Date.now();

            // Ping the role
            await interaction.reply({ content: `<@&${client.config_roles.pollPing}>` });

            // Log the command
            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Poll Ping Command Used")
                .addFields (
                    { name: "User", value: `${interaction.user}` },
                    { name: "Reason", value: reason }
                )
                .setTimestamp()

            const channel = await client.channels.fetch(client.config_channels.otherLogs) as TextChannel;

            await channel.send({ embeds: [log] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
