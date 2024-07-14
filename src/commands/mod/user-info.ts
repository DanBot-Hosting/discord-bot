import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { ChatInputCommandInteraction, GuildBan } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "user-info",
    description: "Get information about a user.",
    options: [
        {
            type: 6,
            name: "user",
            description: "The user to get information about.",
            required: true
        }
    ],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: ["staff"],
    cooldown: 10,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const user = interaction.options.getUser("user");
            const member = await interaction.guild.members.fetch(user.id).catch(() => null);

            let banned: boolean | GuildBan = false;

            try {
                const ban = await interaction.guild.bans.fetch(user.id);

                banned = ban;
            } catch {
                banned = false;
            }

            if(!member) {
                const info = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setAuthor({ name: user.tag, iconURL: user.avatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${user.id}`})
                    .setTitle("User Information")
                    .addFields (
                        { name: "🔢 ID", value: `\`${user.id}\`` },
                        { name: "📅 Created", value: `<t:${user.createdTimestamp.toString().slice(0, -3)}:f> (<t:${user.createdTimestamp.toString().slice(0, -3)}:R>)` },
                        { name: "🔨 Ban", value: banned ? `❓ ${banned.reason ? banned.reason : "*No reason provided.*"}` : emoji.cross }
                    )

                await interaction.editReply({ embeds: [info] });
            } else {
                const info = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setAuthor({ name: user.tag, iconURL: user.avatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${user.id}`})
                    .setTitle("Member Information")
                    .addFields (
                        { name: "🔢 ID", value: `\`${user.id}\`` },
                        { name: "📅 Created", value: `<t:${user.createdTimestamp.toString().slice(0, -3)}:f> (<t:${user.createdTimestamp.toString().slice(0, -3)}:R>)` },
                        { name: "📅 Joined", value: `<t:${member.joinedTimestamp.toString().slice(0, -3)}:f> (<t:${member.joinedTimestamp.toString().slice(0, -3)}:R>)` },
                        { name: "🔇 Timeout", value: member.isCommunicationDisabled() ? `📅 Expires <t:${member.communicationDisabledUntilTimestamp.toString().slice(0, -3)}:R>` : emoji.cross }
                    )

                await interaction.editReply({ embeds: [info] });
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
