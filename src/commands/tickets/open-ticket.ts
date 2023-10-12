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
                    name: "Missing Files - I am missing files from my server.",
                    value: "missing-files"
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

            const highPriority = ["security-issue"];
            const mediumPriority = ["account-issue", "bug-report", "donation", "donation-issue", "missing-files"];
            const lowPriority = ["feature-request", "feedback"];

            const reasons: any = {
                "account-issue": "🔑 Account Issue",
                "bug-report": "🐛 Bug Report",
                "donation": "💰 Donation",
                "donation-issue": "❗ Donation Issue",
                "feature-request": "📝 Feature Request",
                "feedback": "📜 Feedback",
                "missing-files": "📁 Missing Files",
                "other": "❓ Other",
                "security-issue": "🔒 Security Issue"
            }

            const autoAdminUpgrade = [
                "account-issue",
                "donation",
                "missing-files",
                "security-issue"
            ]

            const autoResponses: any = {
                "account-issue": "Please provide the following information about your account:\n- Username\n- Email",
                "bug-report": "Please provide, in detail, how to reproduce the bug you found, along with the following information:\n- What the bug is\n- What you expected to happen\n- What actually happened\n- Any other information you think may be useful",
                "donation": "Please provide the following information about your donation:\n- Transaction ID\n- Screenshot of the transaction\n- Which service you donated on (Donation Alerts / PayPal)",
                "missing-files": "Please provide the following details about your server:\n- Node\n- Server ID",
                "security-issue": "Please provide the following information about the security issue you found:\n- What the issue is\n- How to reproduce the issue\n- Any other information you think may be useful"
            }

            let priority = unknownTickets.id;

            if(highPriority.includes(reason)) {
                priority = highTickets.id;
            } else if(mediumPriority.includes(reason)) {
                priority = mediumTickets.id;
            } else if(lowPriority.includes(reason)) {
                priority = lowTickets.id;
            } else {
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

            const msg = await ticketChannel.send({ content: `${interaction.user} <@&${client.config_roles.ticketPing}>`, embeds: [ticketMessage], components: [buttons] });

            await msg.pin();

            // Upgrade ticket to admin ticket if needed
            if(autoAdminUpgrade.includes(reason)) {
                await ticketChannel.permissionOverwrites.delete(client.config_roles.staff);
                await ticketChannel.permissionOverwrites.create(client.config_roles.admin, { ViewChannel: true });

                const adminOnlyMessage = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription("🔒 This ticket has been automatically upgraded to administrator only.")
                    .addFields (
                        { name: "Why?", value: "The reason you selected can only be handled by administrators." }
                    )

                await ticketChannel.send({ embeds: [adminOnlyMessage] });
            }

            // Send auto response if needed
            if(autoResponses[reason]) {
                const autoResponse = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(autoResponses[reason])

                await ticketChannel.send({ content: `${interaction.user}`, embeds: [autoResponse] });
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
