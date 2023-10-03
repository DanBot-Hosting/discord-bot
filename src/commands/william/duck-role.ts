import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "duck-role",
    description: "Manage the duck role.",
    options: [
        {
            type: 1,
            name: "add",
            description: "Add a user to the duck role.",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "The user to add to the duck role.",
                    required: true
                }
            ]
        },
        
        {
            type: 1,
            name: "remove",
            description: "Remove a user from the duck role.",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "The user to remove from the duck role.",
                    required: true
                }
            ]
        }
    ],
    default_member_permissions: null,
    botPermissions: ["ManageRoles"],
    requiredRoles: ["staff"],
    cooldown: 10,
    enabled: true,
    deferReply: true,
    ephemeral: false,
    async execute(interaction: CommandInteraction & any, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const role = await interaction.guild.roles.fetch(client.config_roles.duck);
            const user = interaction.options.getUser("user");
            const member = await interaction.guild.members.fetch(user.id);

            if(interaction.options.getSubcommand() === "add") {
                if(member.roles.cache.has(role.id)) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} ${user} already has the duck role.`)

                    await interaction.editReply({ embeds: [error] });
                    return;
                }

                const adding = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.ping} Adding ${user} to duck role...`)

                await interaction.editReply({ embeds: [adding] });

                await member.roles.add(role);

                const added = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} Added ${user} to duck role.`)

                await interaction.editReply({ embeds: [added] });
                return;
            }

            if(interaction.options.getSubcommand() === "remove") {
                if(!member.roles.cache.has(role.id)) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} ${user} does not have the duck role.`)

                    await interaction.editReply({ embeds: [error] });
                    return;
                }

                const removing = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.ping} Removing ${user} from duck role...`)

                await interaction.editReply({ embeds: [removing] });

                await member.roles.remove(role);

                const removed = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} Removed ${user} from duck role.`)

                await interaction.editReply({ embeds: [removed] });
                return;
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
