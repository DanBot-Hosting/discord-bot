import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from "discord.js";

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
    ephemeral: false,
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const user = interaction.options.getUser("user");
            const reason = interaction.options.get("reason").value as string;

            const member = interaction.guild.members.cache.get(user.id);

            if(!member) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} ${user} is not in the server!`)

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
            await member.timeout(null, `${interaction.user.tag} (${interaction.user.id}): ${reason}`);

            // Send DM to member
            const dm = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ extension: "png", forceStatic: false }) })
                .setTitle("🔈Unmute")
                .setDescription(`You have been unmuted in **${interaction.guild.name}**!`)
                .addFields (
                    { name: "Reason", value: reason }
                )
                .setTimestamp()

            let sentDM = false;

            try {
                await member.send({ embeds: [dm] });
                sentDM = true;
            } catch {}

            // Reply to interaction
            const muted = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Unmuted ${member}!`)

            await interaction.editReply({ embeds: [muted] });

            // Log
            const logChannel = interaction.guild.channels.cache.get(client.config_channels.modLogs) as TextChannel;

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}`})
                .setTitle("Unmute")
                .addFields (
                    { name: "User", value: `${user} **|** \`${user.id}\``, inline: true },
                    { name: "Reason", value: reason },
                    { name: "User Notified", value: sentDM ? emoji.tick : emoji.cross, inline: true }
                )
                .setTimestamp()

            await logChannel.send({ embeds: [log] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
