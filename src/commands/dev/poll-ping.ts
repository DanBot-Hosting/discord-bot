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
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            // Return error if the command is not in the primary guild
            if(interaction.guild.id !== client.config_main.primaryGuild) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} This command can only be used in the primary guild.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // Return error if the user does not have the pollPingAllowed role
            const roles = await interaction.guild.members.fetch(interaction.user.id).then(member => member.roles.cache.map(role => role.id));

            if(!roles.includes(client.config_roles.pollPingAllowed)) {
                await interaction.editReply({ embeds: [noPermissionCommand] });
                return;
            }

            // Return error if the command is not in the dev-questions channel
            if(interaction.channelId !== client.config_channels.devQuestions) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} This command can only be used in <#${client.config_channels.devQuestions}>.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // Return error if the command is on cooldown
            // Cooldown: 1 hour
            if(client.lastPoll + 3600000 > Date.now()) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} This command is on cooldown, it can be used <t:${Math.floor((client.lastPoll + 3600000) / 1000)}:R>.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const reason = interaction.options.get("reason").value as string;

            // Update last poll time
            client.lastPoll = Date.now();

            // Ping the role
            await interaction.channel.send({ content: `testing` });
            await interaction.deleteReply();

            // Log the command
            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Poll Ping")
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
