import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { Attachment, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "ban",
    description: "Ban a user.",
    options: [
        {
            type: 6,
            name: "user",
            description: "The user to ban.",
            required: true
        },

        {
            type: 3,
            name: "reason",
            description: "The reason for banning the user.",
            min_length: 3,
            max_length: 250,
            required: true
        },

        {
            type: 3,
            name: "delete_messages",
            description: "Optionally delete the user's message history from a set time.",
            choices: [
                {
                    name: "Previous Hour",
                    value: "1h"
                },

                {
                    name: "Previous 6 Hours",
                    value: "6h"
                },

                {
                    name: "Previous 12 Hours",
                    value: "12h"
                },

                {
                    name: "Previous 24 Hours",
                    value: "24h"
                },

                {
                    name: "Previous 3 Days",
                    value: "3d"
                },

                {
                    name: "Previous 7 Days",
                    value: "1w"
                }
            ],
            required: false
        },

        {
            type: 11,
            name: "proof",
            description: "Evidence of the reason.",
            required: false
        }
    ],
    default_member_permissions: PermissionFlagsBits.BanMembers.toString(),
    botPermissions: ["BanMembers"],
    requiredRoles: [],
    cooldown: 15,
    enabled: true,
    deferReply: true,
    ephemeral: false,
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const user = interaction.options.getUser("user");
            const reason = interaction.options.get("reason").value as string;
            const deleteMessages = interaction.options.get("delete_messages")?.value as string;
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

            if(interaction.guild.bans.cache.has(user.id)) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} ${user} is already banned!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            if(user.id === interaction.user.id) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You cannot ban yourself!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            if(!member.bannable) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} I cannot ban ${member}!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            if(member.roles.highest.position >= author.roles.highest.position || member.roles.cache.has(client.config_roles.staff)) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You cannot ban ${member}!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // Send DM to member
            // Send DM before banning incase the bot doesn't have permission to DM them after banning them
            const dm = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ extension: "png", forceStatic: false }) })
                .setTitle("🔨 Banned")
                .setDescription(`You have been banned from **${interaction.guild.name}**!`)
                .addFields (
                    { name: "Reason", value: reason }
                )
                .setTimestamp()

            let sentDM = false;

            try {
                await member.send({ embeds: [dm] });
                sentDM = true;
            } catch {}

            // Convert deleteMessages to seconds
            let deleteMessagesSeconds = 0;

            if(deleteMessages) {
                // Hours
                if(deleteMessages.endsWith("h")) deleteMessagesSeconds = parseInt(deleteMessages.slice(0, -1)) * 3600;
                // Days
                if(deleteMessages.endsWith("d")) deleteMessagesSeconds = parseInt(deleteMessages.slice(0, -1)) * 86400;
                // Weeks
                if(deleteMessages.endsWith("w")) deleteMessagesSeconds = parseInt(deleteMessages.slice(0, -1)) * 604800;
            }

            // Ban member
            await member.ban({ reason: `${interaction.user.tag} (${interaction.user.id}): ${reason}`, deleteMessageSeconds: deleteMessagesSeconds });

            // Reply to interaction
            const banned = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Banned ${member}!`)

            await interaction.editReply({ embeds: [banned] });

            // Log
            const logChannel = interaction.guild.channels.cache.get(client.config_channels.modLogs) as TextChannel;

            const attachment = proof ? new Discord.AttachmentBuilder(proof.url ?? proof.proxyURL, { name: proof.name }) : null;

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}`})
                .setTitle("Ban")
                .addFields (
                    { name: "User", value: `${user} **|** \`${user.id}\``, inline: true },
                    { name: "Reason", value: reason },
                    { name: "Delete Messages", value: deleteMessages ? deleteMessages : emoji.cross, inline: true },
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
