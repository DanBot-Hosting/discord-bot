import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { Attachment, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "kick",
    description: "Kick a user.",
    options: [
        {
            type: 6,
            name: "user",
            description: "The user to kick.",
            required: true
        },

        {
            type: 3,
            name: "reason",
            description: "The reason for kicking the user.",
            min_length: 3,
            max_length: 250,
            required: true
        },

        {
            type: 11,
            name: "proof",
            description: "Evidence of the reason.",
            required: false
        }
    ],
    default_member_permissions: PermissionFlagsBits.KickMembers.toString(),
    botPermissions: ["KickMembers"],
    requiredRoles: [],
    cooldown: 15,
    enabled: true,
    deferReply: true,
    ephemeral: false,
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const user = interaction.options.getUser("user");
            const reason = interaction.options.get("reason").value as string;
            const proof: Attachment = interaction.options.get("proof")?.attachment;

            const author = interaction.guild.members.cache.get(interaction.user.id);
            const member = interaction.guild.members.cache.get(user.id);

            if(!member) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} ${user} is not in the server!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            if(user.id === interaction.user.id) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You cannot kick yourself!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            if(!member.kickable) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} I cannot kick ${member}!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            if(member.roles.highest.position >= author.roles.highest.position || member.roles.cache.has(client.config_roles.staff)) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You cannot kick ${member}!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // Send DM to member
            // Send DM before kicking incase the bot doesn't have permission to DM them after kicking them
            const dm = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ extension: "png", forceStatic: false }) })
                .setTitle("🚪 Kicked")
                .setDescription(`You have been kicked from **${interaction.guild.name}**!`)
                .addFields (
                    { name: "Reason", value: reason }
                )
                .setTimestamp()

            let sentDM = false;

            try {
                await member.send({ embeds: [dm] });
                sentDM = true;
            } catch {}

            // Kick member
            await member.kick(`${interaction.user.tag} (${interaction.user.id}): ${reason}`);

            // Reply to interaction
            const kicked = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Kicked ${member}!`)

            await interaction.editReply({ embeds: [kicked] });

            // Log
            const logChannel = interaction.guild.channels.cache.get(client.config_channels.modLogs) as TextChannel;

            const attachment = proof ? new Discord.AttachmentBuilder(proof.url ?? proof.proxyURL, { name: proof.name }) : null;

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}`})
                .setTitle("Kick")
                .addFields (
                    { name: "User", value: `${user} **|** \`${user.id}\``, inline: true },
                    { name: "Reason", value: reason },
                    { name: "User Notified", value: sentDM ? emoji.tick : emoji.cross, inline: true }
                )
                .setTimestamp()

            await logChannel.send({ embeds: [log], files: attachment ? [attachment] : [] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
