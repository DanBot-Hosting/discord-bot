import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CategoryChannel, ChannelType, CommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";
import getRoles from "../../functions/roles/get";

const command: Command = {
    name: "open",
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
                    name: "Bot Issue - I need help with the bot. (buttons and commands not working, etc.)",
                    value: "bot-issue"
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
                    name: "Feature Request - I have a suggestion.",
                    value: "feature-request"
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
                    name: "Proxy - I need help to proxy a domain name to my server.",
                    value: "proxy"
                },

                {
                    name: "Question - I have a question.",
                    value: "question"
                },

                {
                    name: "Security Issue - I found a security issue with the bot or website. (vulnerabilities, exploits, etc.)",
                    value: "security-issue"
                },

                {
                    name: "Server Issue - I am having an issue with my server. (crashes, errors, etc.)",
                    value: "server-issue"
                }
            ],
            required: true
        },

        {
            type: 6,
            name: "on-behalf-of",
            description: "[STAFF ONLY] The user you are opening the ticket on behalf of.",
            required: false
        }
    ],
    default_member_permissions: null,
    botPermissions: ["ManageChannels", "ManageRoles", "MentionEveryone"],
    requiredRoles: [],
    cooldown: 10,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const reason = interaction.options.get("reason").value as string;
            let user = interaction.user;

            const userRoles = await getRoles(user.id, client);
            const onBehalfOf = interaction.options.getUser("on-behalf-of");

            // Check if the user is staff and if they are opening the ticket on behalf of someone
            if(onBehalfOf && userRoles.staff) user = onBehalfOf;

            if(user.id !== interaction.user.id) {
                const member = interaction.guild.members.cache.get(user.id);

                if(!member) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} ${user} is not in the server!`)

                    await interaction.editReply({ embeds: [error] });
                    return;
                }

                if(member.user.bot) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} You cannot open a ticket for a bot!`)

                    await interaction.editReply({ embeds: [error] });
                    return;
                }
            }

            const creating = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Creating a ticket...`)

            await interaction.editReply({ embeds: [creating] });

            const highTickets = interaction.guild.channels.cache.get(client.config_categories.tickets.high) as CategoryChannel;
            const mediumTickets = interaction.guild.channels.cache.get(client.config_categories.tickets.medium) as CategoryChannel;
            const lowTickets = interaction.guild.channels.cache.get(client.config_categories.tickets.low) as CategoryChannel;
            const unknownTickets = interaction.guild.channels.cache.get(client.config_categories.tickets.unknown) as CategoryChannel;

            // Check if the user has an open ticket
            const openTicket = interaction.guild.channels.cache.find((c: TextChannel) => c.type === 0 && c.name.startsWith("🎫╏") && c.topic === `${user.id}`);

            if(openTicket) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} ${user.id === interaction.user.id ? "You already have" : `${user} already has`} an open ticket!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const highPriority = ["missing-files", "security-issue"];
            const mediumPriority = ["account-issue", "bot-issue", "bug-report", "donation", "donation-issue", "server-issue"];
            const lowPriority = ["feature-request", "proxy", "question"];

            const reasons: any = {
                "account-issue": "🔑 Account Issue",
                "bot-issue": "🤖 Bot Issue",
                "bug-report": "🐛 Bug Report",
                "donation": "💰 Donation",
                "donation-issue": "❗ Donation Issue",
                "feature-request": "📝 Feature Request",
                "missing-files": "📁 Missing Files",
                "other": "❓ Other",
                "proxy": "🔗 Proxy",
                "question": "🆘 Question",
                "security-issue": "🔒 Security Issue",
                "server-issue": "🖥️ Server Issue"
            }

            const requiredInfo: any = {
                "account-issue": "👤 Username\n📨 Email",
                "bot-issue": "❓ What the issue is\n🔄️ How to reproduce the issue\nℹ️ Any other information you think may be useful",
                "bug-report": "❓ What the bug is\n👀 What you expected to happen\n💥 What actually happened\nℹ️ Any other information you think may be useful",
                "donation": "🔢 Transaction ID\n📸 Screenshot of the transaction",
                "donation-issue": "❓ What the issue is",
                "feature-request": "📝 What you want to be added\n📄 Why you want it to be added\n📸 Example of the feature (if applicable)",
                "missing-files": "🗄️ Node\n🪪 Server ID",
                "other": "📄 Please describe your issue in as much detail as possible",
                "proxy": "🪪 Server ID\n🗄️ Server Address\n🌐 Domain Name (e.g. example.com, subdomain.example.com)",
                "question": "❓ What is your question?\nℹ️ Any other information you think may be useful",
                "security-issue": "❓ What the issue is\n🔄️ How to reproduce the issue\nℹ️ Any other information you think may be useful",
                "server-issue": "🗄️ Node\n🪪 Server ID\n💥 The problem"
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
                name: `🎫╏${user.username}`,
                type: ChannelType.GuildText,
                parent: priority,
                topic: `${user.id}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"],
                        allow: ["ReadMessageHistory", "SendMessages", "UseApplicationCommands"]
                    },

                    {
                        id: client.config_roles.staff,
                        allow: ["ViewChannel"]
                    },

                    {
                        id: user.id,
                        allow: ["ViewChannel"]
                    }
                ]
            })

            // Send message in the ticket channel
            const ticketMessage = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${user.id}` })
                .setDescription("⛔ Please do not ping staff, it will not solve your problem faster.")
                .addFields (
                    { name: "Reason", value: reasons[reason] }
                )
                .setTimestamp()

            const onBehalfOfMessage = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`👤 This ticket was opened on behalf of ${user} by ${interaction.user}.`)

            const buttons: any = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setCustomId(`ticket-close-${user.id}`)
                        .setLabel("Close"),

                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setCustomId("ticket-priority")
                        .setLabel("Change Priority")
                )

            const msg = await ticketChannel.send({ content: `${user.id === interaction.user.id ? `${interaction.user}` : `${user} ${interaction.user}`} <@&${client.config_roles.ticketPing}>`, embeds: user.id === interaction.user.id ? [ticketMessage] : [ticketMessage, onBehalfOfMessage], components: [buttons] });

            await msg.pin();

            // Ask for required information if needed
            if(requiredInfo[reason]) {
                const response = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setAuthor({ name: "Please provide us with the following information so we can help you.", iconURL: interaction.guild.iconURL({ extension: "png", forceStatic: true }) })
                    .setDescription(requiredInfo[reason])

                await ticketChannel.send({ content: `${user}`, embeds: [response] });
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
