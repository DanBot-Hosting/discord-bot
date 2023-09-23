import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

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
    ephemeral: false,
    async execute(interaction: CommandInteraction & any, client: ExtendedClient, Discord: any) {
        try {
            if(interaction.options.getSubcommand() === "premium") {
                const user = interaction.options.getUser("user") || interaction.user;

                const amount = await client.premium.get(user.id);

                const count = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${user.id === interaction.user.id ? "You have" : `${user} has`} **${amount}** premium server${amount === 1 ? "" : "s"}.\nYou can buy ${amount === 0 ? "" : "more"} premium servers by donating on [PayPal](https://paypal.me/DanBotHosting) or [Donation Alerts](https://www.donationalerts.com/r/danbothosting).`)

                const buttons = new Discord.ActionRowBuilder()
                    .addComponents (
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Link)
                            .setLabel("PayPal")
                            .setURL("https://paypal.me/DanBotHosting"),

                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Link)
                            .setLabel("Donation Alerts")
                            .setURL("https://www.donationalerts.com/r/danbothosting")
                    )

                await interaction.editReply({ embeds: [count], components: [buttons] });
                return;
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
