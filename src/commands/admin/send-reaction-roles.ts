import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "send-reaction-roles",
    description: "Send the reaction roles menu to a channel.",
    options: [
        {
            type: 7,
            name: "channel",
            description: "The channel to send the reaction roles menu to.",
            channel_types: [0],
            required: true
        }
    ],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: ["admin"],
    cooldown: 20,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const channel = interaction.options.get("channel").channel as TextChannel;

            const sending = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Sending menu to ${channel}...`)

            await interaction.editReply({ embeds: [sending] });

            try {
                const menu_1 = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("General Roles")

                const row_1: any = new Discord.ActionRowBuilder()
                    .addComponents (
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-898041778471592027")
                            .setEmoji("📣")
                            .setLabel("Announcements"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-898041779696312320")
                            .setEmoji("📝")
                            .setLabel("Changelogs"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-898041781445337098")
                            .setEmoji("🎉")
                            .setLabel("Giveaways"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-898041781927682090")
                            .setEmoji("📊")
                            .setLabel("Poll Ping"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-898041783995490344")
                            .setEmoji("👷‍♂️")
                            .setLabel("Staff Updates")
                    )

                const menu_2 = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Entertainment Roles")

                const row_2: any = new Discord.ActionRowBuilder()
                    .addComponents (
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-918235979389730848")
                            .setEmoji("🎮")
                            .setLabel("Game Nights"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-898041783135645756")
                            .setEmoji("🎥")
                            .setLabel("Movie Nights"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-898041784867913758")
                            .setEmoji("🎲")
                            .setLabel("Other Events")
                    )

                const menu_3 = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Programming Roles")

                const row_3: any = new Discord.ActionRowBuilder()
                    .addComponents (
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-898041776970010655")
                            .setEmoji("🟢")
                            .setLabel("C#"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-918241546497818684")
                            .setEmoji("🔴")
                            .setLabel("HTML"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-898041774373748796")
                            .setEmoji("🟠")
                            .setLabel("Java"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-898041776114372648")
                            .setEmoji("🟡")
                            .setLabel("JavaScript"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("reaction-role-898041773203550209")
                            .setEmoji("🔵")
                            .setLabel("Python"),
                    )

                await channel.send({ embeds: [menu_1], components: [row_1] });
                await channel.send({ embeds: [menu_2], components: [row_2] });
                await channel.send({ embeds: [menu_3], components: [row_3] });

                const sent = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} The reaction roles menu has been sent to ${channel}!`)

                await interaction.editReply({ embeds: [sent] });
            } catch {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} Failed to send menu!`)

                await interaction.editReply({ embeds: [error] });
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
