import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction } from "discord.js";

import { emojis as emoji } from "../../config";
import getRoles from "../../functions/roles/get";

const command: Command = {
    name: "user",
    description: "Commands related to user management.",
    options: [
        {
            type: 1,
            name: "premium",
            description: "Get a user's premium server count.",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "The user who's premium server count to get."
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
            if(interaction.options.getSubcommand() === "premium") {
                const user = interaction.options.getUser("user") || interaction.user;
                const userRoles = await getRoles(interaction.user.id, client);

                const data = await client.premium.get(user.id);

                if(data.hidden && user.id !== interaction.user.id && !userRoles.staff) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} ${user}'s premium count is private!`)

                    await interaction.editReply({ embeds: [error], ephemeral: true });
                    return;
                }

                const count = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`📊 ${user.id === interaction.user.id ? "You have" : `${user} has`} used **${data.used}** out of **${data.count}** premium servers.${user.id === interaction.user.id ? `\n💸 You can buy ${data.count === 0 ? "" : "more"} premium servers by donating on [PayPal](https://paypal.me/DanBotHosting) or [Donation Alerts](https://www.donationalerts.com/r/danbothosting).` : ""}`)

                const buttons = new Discord.ActionRowBuilder()
                    .addComponents (
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setCustomId("premium-hidden-toggle")
                            .setLabel("Toggle Public Visibility"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setCustomId(`premium-fix-${user.id}`)
                            .setLabel("Incorrect premium count?")
                    )

                if(data.count > 0 && user.id === interaction.user.id) {
                    count.addFields({ name: "Public Visibilty", value: data.hidden ? `${emoji.cross} Disabled` : `${emoji.tick} Enabled` });

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
