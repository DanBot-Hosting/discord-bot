import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction } from "discord.js";

import { emojis as emoji, premium } from "../../config";
import formatCurrency from "../../util/formatCurrency";
import getRoles from "../../functions/roles/get";

const command: Command = {
    name: "user",
    description: "Commands related to user management.",
    options: [
        {
            type: 1,
            name: "credit",
            description: "Get a user's credit amount.",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "The user who's credit amount to get.",
                    required: false
                }
            ]
        }
    ],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: [],
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction & any, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            if(interaction.options.getSubcommand() === "credit") {
                const user = interaction.options.getUser("user") || interaction.user;
                const userRoles = await getRoles(interaction.user.id, client);

                const data = await client.credit.get(user.id);

                if(data.hidden && user.id !== interaction.user.id && !userRoles.staff) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} ${user}'s premium count is private!`)

                    await interaction.editReply({ embeds: [error], ephemeral: true });
                    return;
                }

                if(data.donated === 0) {
                    const count = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`📊 ${user.id === interaction.user.id ? "You do not" : `${user} does not`} have any credits.${user.id === interaction.user.id ? `\n💸 You can buy credits by donating on [**PayPal**](https://paypal.me/DanBotHosting) or [**Donation Alerts**](https://www.donationalerts.com/r/danbothosting).` : ""}`)

                    if(user.id === interaction.user.id) {
                        count.addFields({ name: "Premium Server Price", value: `**${formatCurrency(premium.price)} USD** / server`, inline: true });
                    }

                    await interaction.editReply({ embeds: [count] });
                    return;
                }

                const count = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`📊 ${user.id === interaction.user.id ? "You have" : `${user} has`} used **${formatCurrency(data.used)}** out of **${formatCurrency(data.donated)}** credit.${user.id === interaction.user.id ? `\n💸 You can buy ${data.donated === 0 ? "" : "more"} credits by donating on [**PayPal**](https://paypal.me/DanBotHosting) or [**Donation Alerts**](https://www.donationalerts.com/r/danbothosting).` : ""}`)

                const buttons = new Discord.ActionRowBuilder()
                    .addComponents (
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("credit-privacy-toggle")
                            .setLabel("Toggle Public Visibility"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setCustomId(`credit-fix-${user.id}`)
                            .setLabel("Incorrect credit amount?")
                    )

                if(user.id === interaction.user.id) {
                    count.addFields (
                        { name: "Premium Server Price", value: `${formatCurrency(premium.price)} USD / server`, inline: true },
                        { name: "Public Visibilty", value: data.hidden ? `${emoji.cross} Disabled` : `${emoji.tick} Enabled`, inline: true }
                    )

                    await interaction.editReply({ embeds: [count], components: [buttons] });
                } else {
                    await interaction.editReply({ embeds: [count] });
                }

                return;
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
