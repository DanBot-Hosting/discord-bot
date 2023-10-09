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
            choices: [
                {
                    name: "Account Issue - I need help with my account. (2FA lockout, username change, account deletion, etc.)",
                    value: "account-issue"
                },

                {
                    name: "Bug Report - I found a bug in the bot or website.",
                    value: "bug-report"
                },

                {
                    name: "Donation - I need my donation processed or I have a question about donating.",
                    value: "donation"
                },

                {
                    name: "Donation Issue - I have an issue with my donation. (questions, refunds, chargebacks, etc.)",
                    value: "donation-issue"
                },

                {
                    name: "Feature Request - I have a suggestion for the bot or website.",
                    value: "feature-request"
                },

                {
                    name: "Feedback - I have some feedback for the bot or website.",
                    value: "feedback"
                },

                {
                    name: "Other - I need help with something else.",
                    value: "other"
                },

                {
                    name: "Security Issue - I found a security issue with the bot or website. (vulnerabilities, exploits, etc.)",
                    value: "security-issue"
                }
            ],
            required: true
        }
    ],
    default_member_permissions: null,
    botPermissions: ["ManageChannels", "ManageRoles", "MentionEveryone"],
    requiredRoles: [],
    cooldown: 0,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const reason = interaction.options.get("reason").value as string;

            const creating = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Creating a ticket...`)

            await interaction.editReply({ embeds: [creating] });

            const highTickets = await interaction.guild.channels.fetch(client.config_categories.tickets.high) as CategoryChannel;
            const mediumTickets = await interaction.guild.channels.fetch(client.config_categories.tickets.medium) as CategoryChannel;
            const lowTickets = await interaction.guild.channels.fetch(client.config_categories.tickets.low) as CategoryChannel;
            const unknownTickets = await interaction.guild.channels.fetch(client.config_categories.tickets.unknown) as CategoryChannel;

            // Check if the user has an open ticket
            const openTicket = interaction.guild.channels.cache.find((c: TextChannel) => c.type === 0 && c.name.startsWith("🎫╏") && c.topic === `${interaction.user.id}`);

            if(openTicket) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You already have an open ticket!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const highPriority = ["account-issue", "bug-report", "security-issue"];
            const mediumPriority = ["donation", "donation-issue"];
            const lowPriority = ["feature-request", "feedback"];
            const unknownPriority = ["other"];

            const reasons: any = {
                "account-issue": "🔑 Account Issue",
                "bug-report": "🐛 Bug Report",
                "donation": "💰 Donation",
                "donation-issue": "❗ Donation Issue",
                "feature-request": "📝 Feature Request",
                "feedback": "📜 Feedback",
                "other": "❓ Other",
                "security-issue": "🔒 Security Issue"
            }

            let priority = unknownTickets.id;

            if(highPriority.includes(reason)) {
                priority = highTickets.id;
            } else if(mediumPriority.includes(reason)) {
                priority = mediumTickets.id;
            } else if(lowPriority.includes(reason)) {
                priority = lowTickets.id;
            } else if(unknownPriority.includes(reason)) {
                priority = unknownTickets.id;
            }

            const ticketChannel = await interaction.guild.channels.create({
                name: `🎫╏${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: priority,
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
                        id: client.config_roles.staff,
                        allow: ["ViewChannel"]
                    },

                    {
                        id: interaction.user.id,
                        allow: ["ViewChannel"]
                    }
                ]
            })

            // Send message in the ticket channel
            const ticketMessage = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ extension: "png", forceStatic: false }) })
                .setDescription("⛔ Please do not ping staff, it will not solve your problem faster.")
                .addFields (
                    { name: "Reason", value: reasons[reason] }
                )
                .setTimestamp()

            const buttons: any = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setCustomId(`ticket-close-${interaction.user.id}`)
                        .setLabel("Close"),

                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setCustomId(`ticket-priority`)
                        .setLabel("Change Priority")
                )

            const msg = await ticketChannel.send({ content: `${interaction.user}`, embeds: [ticketMessage], components: [buttons] });

            await msg.pin();

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
