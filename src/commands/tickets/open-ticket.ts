import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CategoryChannel, ChannelType, CommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "open-ticket",
    description: "Open a new ticket.",
    options: [
        {
            type: 3,
            name: "reason",
            description: "The reason for opening the ticket.",
            min_length: 5,
            max_length: 250,
            required: true
        },

        {
            type: 5,
            name: "admin-only",
            description: "Only allow administrators to see your ticket.",
            required: true
        }
    ],
    default_member_permissions: null,
    botPermissions: ["ManageChannels", "ManageRoles", "MentionEveryone"],
    requiredRoles: ["admin"],
    cooldown: 0,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const reason = interaction.options.get("reason").value as string;
            const adminOnly = interaction.options.get("admin-only").value as boolean;

            const creating = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Creating a ticket...`)

            await interaction.editReply({ embeds: [creating] });

            const ticketCategory = await interaction.guild.channels.fetch(client.config_categories.tickets) as CategoryChannel;

            // Check if the user has an open ticket
            const openTicket = ticketCategory.children.cache.find((c: TextChannel) => c.type === 0 && c.topic === `${interaction.user.id}`);

            if(openTicket) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You already have an open ticket!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const ticketChannel = await interaction.guild.channels.create({
                name: `🎫╏${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: ticketCategory,
                topic: `${interaction.user.id}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"],
                        allow: ["ReadMessageHistory", "SendMessages"]
                    },

                    {
                        id: client.user.id,
                        allow: ["ManageChannels", "ManageMessages", "ViewChannel"]
                    },

                    {
                        id: interaction.user.id,
                        allow: ["ViewChannel"]
                    }
                ]
            })

            if(adminOnly) {
                await ticketChannel.permissionOverwrites.create(client.config_roles.admin, { ViewChannel: true });
            } else {
                await ticketChannel.permissionOverwrites.create(client.config_roles.staff, { ViewChannel: true });
            }

            // Send message in the ticket channel
            const ticketMessage = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ extension: "png", forceStatic: false }) })
                .setTitle(`${interaction.user.displayName || interaction.user.username}'s Ticket`)
                .setDescription("⛔ Please do not ping staff, it will not solve your problem faster.")
                .addFields (
                    { name: "Reason", value: reason }
                )
                .setTimestamp()

            const buttons: any = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setCustomId(`close-ticket-${interaction.user.id}`)
                        .setLabel("Close Ticket")
                )

            const msg = await ticketChannel.send({ content: `${interaction.user}`, embeds: [ticketMessage], components: [buttons] });

            await msg.pin();

            if(adminOnly) {
                const adminOnlyMessage = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription("🔒 This ticket has been marked as admin-only.")

                await ticketChannel.send({ embeds: [adminOnlyMessage] });
            }

            const created = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Your ticket has been created: ${ticketChannel}`)

            await interaction.editReply({ embeds: [created] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
