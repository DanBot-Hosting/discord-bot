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
                    type: 4,
                    name: "amount",
                    description: "The amount of servers to add.",
                    min_value: 1,
                    max_value: 10000,
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
                    type: 4,
                    name: "amount",
                    description: "The amount of servers to remove.",
                    min_value: 1,
                    required: true
                }
            ]
        },

        {
            type: 1,
            name: "set",
            description: "Set a user's premium server count.",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "The user who's premium server count to set.",
                    required: true
                },

                {
                    type: 4,
                    name: "amount",
                    description: "The amount of servers to set the user's premium server count to.",
                    min_value: 0,
                    max_value: 10000,
                    required: true
                }
            ]
        },
    ],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: ["dev"],
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: false,
    async execute(interaction: CommandInteraction & any, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const user = interaction.options.getUser("user");
            const amount = interaction.options.get("amount").value as number;

            if(interaction.options.getSubcommand() === "add") {
                try {
                    await client.premium.add(user.id, amount, client);
                } catch(err) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} ${err.message}`)

                    await interaction.editReply({ embeds: [error] });
                    return;
                }

                const added = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} Added **${amount}** premium server${amount === 1 ? "" : "s"} to ${user}!`)

                await interaction.editReply({ embeds: [added] });

                try {
                    const donation = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`💖 Thank you ${user} for purchasing **${amount}** premium server${amount === 1 ? "" : "s"}!`)

                    const channel = await client.channels.fetch(client.config_channels.donations) as TextChannel;

                    await channel.send({ embeds: [donation] });
                } catch {}

                return;
            }

            if(interaction.options.getSubcommand() === "remove") {
                try {
                    await client.premium.remove(user.id, amount, client);
                } catch(err) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} ${err.message}`)

                    await interaction.editReply({ embeds: [error] });
                    return;
                }

                const removed = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} Removed **${amount}** premium server${amount === 1 ? "" : "s"} from ${user}!`)

                await interaction.editReply({ embeds: [removed] });
                return;
            }

            if(interaction.options.getSubcommand() === "set") {
                try {
                    await client.premium.set(user.id, amount, client);
                } catch(err) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} ${err.message}`)

                    await interaction.editReply({ embeds: [error] });
                    return;
                }

                const set = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} ${user}'s premium server count has been set to **${amount}**.`)

                await interaction.editReply({ embeds: [set] });
                return;
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
