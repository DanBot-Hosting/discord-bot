import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, PermissionFlagsBits, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "unban",
    description: "Unban a user.",
    options: [
        {
            type: 6,
            name: "user",
            description: "The user to unban.",
            required: true
        },

        {
            type: 3,
            name: "reason",
            description: "The reason for unbanning the user.",
            min_length: 3,
            max_length: 250,
            required: true
        }
    ],
    default_member_permissions: PermissionFlagsBits.BanMembers.toString(),
    botPermissions: ["BanMembers"],
    requiredRoles: [],
    cooldown: 15,
    enabled: true,
    deferReply: true,
    ephemeral: false,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const user = interaction.options.getUser("user");
            const reason = interaction.options.get("reason").value as string;

            const banned = await interaction.guild.bans.fetch({ user: user.id }).catch(() => null) || false;

            if(!banned) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} ${user} is not banned!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // Send DM to member
            const dm = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ extension: "png", forceStatic: false }) })
                .setTitle("🙌 Unbanned")
                .setDescription(`You have been unbanned from **${interaction.guild.name}**!\nYou can rejoin using the following invite link: [discord.gg/dbh](https://discord.gg/dbh)`)
                .addFields (
                    { name: "Reason", value: reason }
                )
                .setTimestamp()

            let sentDM = false;

            try {
                await user.send({ embeds: [dm] });
                sentDM = true;
            } catch {}

            // Unban member
            await interaction.guild.members.unban(user.id, `${interaction.user.tag} (${interaction.user.id}): ${reason}`);

            // Reply to interaction
            const unbanned = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Unbanned ${user}!`)

            await interaction.editReply({ embeds: [unbanned] });

            // Log
            const logChannel = interaction.guild.channels.cache.get(client.config_channels.modLogs) as TextChannel;

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}`})
                .setTitle("Unban")
                .addFields (
                    { name: "User", value: `${user} **|** \`${user.id}\``, inline: true },
                    { name: "User Notified", value: sentDM ? emoji.tick : emoji.cross, inline: true },
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
