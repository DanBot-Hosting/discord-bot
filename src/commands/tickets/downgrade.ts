import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { ChatInputCommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";
import getRoles from "../../functions/roles/get";

const command: Command = {
    name: "downgrade",
    description: "Make a ticket accessible to all staff.",
    options: [],
    default_member_permissions: null,
    botPermissions: ["ManageChannels", "ManageRoles"],
    requiredRoles: [],
    cooldown: 120,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            if(interaction.guild.id !== client.config_main.primaryGuild) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} This command can only be used in the main server!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // Check if the command is being used in a ticket channel
            if(!interaction.channel.name.startsWith("🎫╏")) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} This command can only be used in a ticket channel!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const channel = interaction.channel as TextChannel;
            const userRoles = await getRoles(interaction.user.id, client);

            if(channel.topic !== interaction.user.id && !userRoles.staff) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You cannot downgrade another user's ticket!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const downgrading = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Downgrading ticket...`)

            await interaction.editReply({ embeds: [downgrading] });

            if(channel.permissionOverwrites.cache.has(client.config_roles.staff)) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} This ticket is already visible to all staff!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            await channel.permissionOverwrites.delete(client.config_roles.admin);
            await channel.permissionOverwrites.create(client.config_roles.staff, { ViewChannel: true });

            const adminOnlyMessage = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription("⏬ This ticket is now visible to all staff.")

            await channel.send({ embeds: [adminOnlyMessage] });

            const success = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} This ticket is now visible to all staff.`)

            await interaction.editReply({ embeds: [success] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
