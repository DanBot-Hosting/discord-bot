import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "premium",
    description: "Add or remove premium servers from a user.",
    options: [
        {
            type: 1,
            name: "add",
            description: "Add premium servers to a user.",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "The user to add premium servers to.",
                    required: true
                },

                {
                    type: 10,
                    name: "amount",
                    description: "The amount of servers to add.",
                    required: true
                }
            ]
        },

        {
            type: 1,
            name: "remove",
            description: "Remove premium servers from a user.",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "The user to remove premium servers from.",
                    required: true
                },

                {
                    type: 10,
                    name: "amount",
                    description: "The amount of servers to remove.",
                    required: true
                }
            ]
        }
    ],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: ["dev"],
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: false,
    async execute(interaction: CommandInteraction & any, client: ExtendedClient, Discord: any) {
        try {
            const user = interaction.options.getUser("user");
            const amount = interaction.options.get("amount").value as number;

            if(interaction.options.getSubcommand() === "add") {
                const newAmount = await client.premium.add(user.id, amount);

                const added = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} ${amount} premium server${amount === 1 ? "" : "s"} have been added to ${user}! They now have ${newAmount} premium server${newAmount === 1 ? "" : "s"}.`)

                await interaction.editReply({ embeds: [added] });

                try {
                    const donation = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`💖 Thank you ${user} for purchasing ${amount} premium server${amount === 1 ? "" : "s"}!`)

                    const channel = await client.channels.fetch(client.config_channels.donations) as TextChannel;

                    await channel.send({ embeds: [donation] });
                } catch {}

                return;
            }

            if(interaction.options.getSubcommand() === "remove") {
                let newAmount = 0;

                try {
                    newAmount = await client.premium.remove(user.id, amount);
                } catch(err) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} ${err.message}`)

                    await interaction.editReply({ embeds: [error] });
                    return;
                }

                const removed = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} Removed ${amount} premium server${amount === 1 ? "" : "s"} from ${user}! They now have ${newAmount} premium server${newAmount === 1 ? "" : "s"}.`)

                await interaction.editReply({ embeds: [removed] });
                return;
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
