import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";
import { randomUUID } from "crypto";

import TestingChannel from "../../models/TestingChannel";

const command: Command = {
    name: "testing",
    description: "Create and manage testing channels.",
    options: [
        {
            type: 1,
            name: "create",
            description: "Create a testing channel.",
            options: [
                {
                    type: 3,
                    name: "topic",
                    description: "The topic of the testing channel.",
                    max_length: 1024,
                    required: false
                }
            ]
        },

        {
            type: 1,
            name: "delete",
            description: "Delete a testing channel. Can only be used in a testing channel."
        },

        {
            type: 1,
            name: "delete-all",
            description: "Delete all of your testing channels."
        },

        {
            type: 2,
            name: "user",
            description: "Add or remove users from your testing channel.",
            options: [
                {
                    type: 1,
                    name: "add",
                    description: "Add a user to your testing channel.",
                    options: [
                        {
                            type: 6,
                            name: "user",
                            description: "The user to add.",
                            required: true
                        }
                    ]
                },

                {
                    type: 1,
                    name: "remove",
                    description: "Remove a user from your testing channel.",
                    options: [
                        {
                            type: 6,
                            name: "user",
                            description: "The user to remove.",
                            required: true
                        }
                    ]
                }
            ]
        }
    ],
    default_member_permissions: null,
    botPermissions: ["ManageChannels"],
    requiredRoles: ["botAdmin"],
    cooldown: 0,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction & any, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            // Return if not in the primary guild
            if(interaction.guild.id !== client.config_main.primaryGuild) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} This command can only be used in the primary guild.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            if(interaction.options.getSubcommand() === "create") {
                const channelTopic = interaction.options.get("topic");

                const creating = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.ping} Creating a testing channel...`)

                await interaction.editReply({ embeds: [creating] });

                const id = randomUUID().slice(0, 8);

                const channel = await interaction.guild.channels.create({
                    name: `testing-${id}`,
                    type: Discord.ChannelType.GuildText,
                    topic: channelTopic ? channelTopic.value : null,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"],
                            allow: ["EmbedLinks", "ReadMessageHistory", "SendMessages", "UseExternalEmojis"]
                        },

                        {
                            id: client.user.id,
                            allow: ["ViewChannel", "ManageChannels", "ManageMessages"]
                        },

                        {
                            id: interaction.user.id,
                            allow: ["ManageChannels", "ViewChannel"]
                        }
                    ]
                })

                const registering = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.ping} Registering channel in the database...`)

                await interaction.editReply({ embeds: [registering] });

                const data = await new TestingChannel({
                    _id: id,
                    channel: channel.id,
                    created: Date.now(),
                    owner: interaction.user.id
                }).save()

                const welcome = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Testing Channels")
                    .setDescription(`Welcome to your testing channel, **${interaction.user.globalName || interaction.user.username}**!\n\nThis channel has been setup with overrides so only you and server admins can access it.\n\n**This channel will be automatically deleted after 24 hours.**`)
                    .addFields (
                        { name: "Your Permissions", value: "```yaml\n- Embed Links\n- Manage Channels\n- Read Message History\n- Send Messages\n- Use External Emojis\n- View Channel\n```" },
                        { name: "Delete Channel", value: `To delete this channel, use the command: \`/testing delete\`` }
                    )
                    .setTimestamp()

                const channelInfo = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Channel Information")
                    .addFields (
                        { name: "Owner", value: `${interaction.user}` },
                        { name: "Created", value: `<t:${data.created.toString().slice(0, -3)}:f> (<t:${data.created.toString().slice(0, -3)}:R>)` },
                        { name: "Expires", value: `<t:${(data.created + 86400000).toString().slice(0, -3)}:f> (<t:${(data.created + 86400000).toString().slice(0, -3)}:R>)` }
                    )
                    .setTimestamp()

                const welcomeMsg = await channel.send({ content: `${interaction.user}`, embeds: [welcome, channelInfo] });

                await welcomeMsg.pin();

                const created = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} Your testing channel has been created: ${channel}`)

                await interaction.editReply({ embeds: [created] });
                return;
            }

            if(interaction.options.getSubcommand() === "delete") {
                const channel = interaction.channel as TextChannel;

                if(!channel.name.startsWith("testing-")) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} This command can only be used in a testing channel.`)

                    await interaction.editReply({ embeds: [error] });
                    return;
                }

                const data = await TestingChannel.findOne({ channel: channel.id });

                if(data && interaction.user.id !== data.owner) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} You do not own this testing channel!`)

                    await interaction.editReply({ embeds: [error] });
                    return;
                }

                const deleting = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.ping} Deleting testing channel...`)

                await interaction.editReply({ embeds: [deleting] });

                if(data) await data.delete();
                await channel.delete();
                return;
            }

            if(interaction.options.getSubcommand() === "delete-all") {
                // Return if the command is run in a testing channel
                if(interaction.channel.name.startsWith("testing-")) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} This command cannot be used in a testing channel.`)

                    await interaction.editReply({ embeds: [error] });
                    return;
                }

                const deleting = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.ping} Fetching testing channels...`)

                await interaction.editReply({ embeds: [deleting] });

                const data = await TestingChannel.find({ owner: interaction.user.id });

                if(!data.length) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} You do not have any testing channels!`)

                    await interaction.editReply({ embeds: [error] });
                    return;
                }

                for(const item of data) {
                    const fetching = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.ping} Fetching channel \`${item._id}\`...`)

                    await interaction.editReply({ embeds: [fetching] });

                    try {
                        const channel = await interaction.guild.channels.fetch(item.channel);

                        const deleting = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setDescription(`${emoji.ping} Deleting channel \`${item._id}\`...`)

                        await interaction.editReply({ embeds: [deleting] });

                        await item.delete();
                        await channel.delete();
                    } catch(err) {
                        const error = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.cross} Unable to fetch channel \`${item._id}\`, deleting from database...`)

                        await interaction.editReply({ embeds: [error] });

                        await item.delete();
                    }
                }

                const deleted = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} All of your testing channels have been deleted.`)

                await interaction.editReply({ embeds: [deleted] });
                return;
            }

            if(interaction.options.getSubcommandGroup() === "user") {
                const user = interaction.options.getUser("user");
                const channel = interaction.channel as TextChannel;

                if(interaction.options.getSubcommand() === "add") {
                    if(!channel.name.startsWith("testing-")) {
                        const error = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.cross} This command can only be used in a testing channel.`)

                        await interaction.editReply({ embeds: [error] });
                        return;
                    }

                    const data = await TestingChannel.findOne({ channel: channel.id });

                    if(interaction.user.id !== data.owner) {
                        const error = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.cross} You do not own this testing channel!`)

                        await interaction.editReply({ embeds: [error] });
                        return;
                    }

                    const member = await interaction.guild.members.fetch(user.id);

                    if(!member) {
                        const error = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.cross} ${user} is not in this server!`)

                        await interaction.editReply({ embeds: [error] });
                        return;
                    }

                    const perms = channel.permissionOverwrites.cache.get(member.id);

                    if(perms) {
                        const error = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.cross} ${user} is already in this testing channel!`)

                        await interaction.editReply({ embeds: [error] });
                        return;
                    }

                    await channel.permissionOverwrites.create(member.id, { ViewChannel: true });

                    const welcome = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${user} has been added to the testing channel.`)

                    interaction.channel.send({ embeds: [welcome] });

                    const added = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.tick} Added ${member} to the testing channel.`)

                    await interaction.editReply({ embeds: [added] });
                    return;
                }

                if(interaction.options.getSubcommand() === "remove") {
                    if(!channel.name.startsWith("testing-")) {
                        const error = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.cross} This command can only be used in a testing channel.`)

                        await interaction.editReply({ embeds: [error] });
                        return;
                    }

                    const data = await TestingChannel.findOne({ channel: channel.id });

                    if(interaction.user.id !== data.owner) {
                        const error = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.cross} You do not own this testing channel!`)

                        await interaction.editReply({ embeds: [error] });
                        return;
                    }

                    const member = await interaction.guild.members.fetch(user.id);

                    if(!member) {
                        const error = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.cross} ${user} is not in this server!`)

                        await interaction.editReply({ embeds: [error] });
                        return;
                    }

                    const perms = channel.permissionOverwrites.cache.get(member.id);

                    if(!perms) {
                        const error = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.cross} ${user} is not in this testing channel!`)

                        await interaction.editReply({ embeds: [error] });
                        return;
                    }

                    await perms.delete();

                    const goodbye = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${user} has been removed from the testing channel.`)

                    interaction.channel.send({ embeds: [goodbye] });

                    const removed = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.tick} Removed ${member} from the testing channel.`)

                    await interaction.editReply({ embeds: [removed] });
                    return;
                }
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
