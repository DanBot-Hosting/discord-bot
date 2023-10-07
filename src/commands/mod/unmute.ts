import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, PermissionFlagsBits, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "unmute",
    description: "Unmute a user.",
    options: [
        {
            type: 6,
            name: "user",
            description: "The user to unmute.",
            required: true
        },

        {
            type: 3,
            name: "reason",
            description: "The reason for unmuting the user.",
            min_length: 3,
            max_length: 250,
            required: true
        }
    ],
    default_member_permissions: PermissionFlagsBits.ModerateMembers.toString(),
    botPermissions: ["ModerateMembers"],
    requiredRoles: [],
    cooldown: 15,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const user = interaction.options.getUser("user");
            const reason = interaction.options.get("reason").value as string;

            const member = interaction.guild.members.cache.get(user.id);

            if(!member) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} ${member} is not in the server!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            if(!member.isCommunicationDisabled()) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} ${member} is not muted!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // Remove timeout from member
            await member.timeout(null, `${interaction.user.tag.endsWith("#0") ? interaction.user.username : interaction.user.tag} (${interaction.user.id}): ${reason}`);

            // Reply to interaction
            const muted = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Unmuted ${member}!`)

            await interaction.editReply({ embeds: [muted] });

            // Log
            const logChannel = interaction.guild.channels.cache.get(client.config_channels.modLogs) as TextChannel;

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.user.tag.endsWith("#0") ? interaction.user.username : interaction.user.tag, iconURL: interaction.user.avatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}`})
                .setTitle("Member Unmuted")
                .addFields (
                    { name: "User", value: `${user} **|** \`${user.id}\`` },
                    { name: "Reason", value: reason }
                )
                .setTimestamp()

            await logChannel.send({ embeds: [log] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
