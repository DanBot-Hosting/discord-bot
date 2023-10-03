import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CategoryChannel, CommandInteraction, ChannelType } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "create-channel",
    description: "Create a channel.",
    options: [
        {
            type: 3,
            name: "name",
            description: "The name of the channel.",
            max_length: 100,
            required: true
        },

        {
            type: 3,
            name: "type",
            description: "The type of channel to create.",
            choices: [
                {
                    name: "Category",
                    value: "category"
                },

                {
                    name: "Text Channel",
                    value: "text"
                },

                {
                    name: "Voice Channel",
                    value: "voice"
                }
            ],
            required: true
        },

        {
            type: 7,
            name: "category",
            description: "The category to create the channel in or the category the new category should be below.",
            channel_types: [4],
            required: false
        }
    ],
    default_member_permissions: null,
    botPermissions: ["ManageChannels"],
    requiredRoles: ["admin"],
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const name = interaction.options.get("name").value as string;
            const type = interaction.options.get("type").value as string;
            const category = interaction.options?.get("category").channel as CategoryChannel;

            if(type === "category") {
                const creating = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.ping} Creating category...`)

                await interaction.editReply({ embeds: [creating] });

                const newCategory = await interaction.guild.channels.create({
                    name: name,
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"]
                        },

                        {
                            id: interaction.user.id,
                            allow: ["ManageChannels", "ManageRoles", "ManageWebhooks", "ViewChannel"]
                        }
                    ],
                    reason: `Created by ${interaction.user.tag.endsWith("#0") ? interaction.user.username : interaction.user.tag} (${interaction.user.id})`
                })

                if(category) {
                    const id = category.position + 1;

                    const moving = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.ping} Moving category to position ${id}...`)

                    await interaction.editReply({ embeds: [moving] });

                    await newCategory.setPosition(id);
                }

                const created = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} Created category: ${newCategory.name} (\`${newCategory.id}\`)`)

                await interaction.editReply({ embeds: [created] });
            } else if(type === "text") {
                const creating = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.ping} Creating text channel...`)

                await interaction.editReply({ embeds: [creating] });

                const channel = await interaction.guild.channels.create({
                    name: name,
                    type: ChannelType.GuildText,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"]
                        },

                        {
                            id: interaction.user.id,
                            allow: ["ManageChannels", "ManageRoles", "ViewChannel"]
                        }
                    ],
                    reason: `Created by ${interaction.user.tag.endsWith("#0") ? interaction.user.username : interaction.user.tag} (${interaction.user.id})`
                })

                if(category) {
                    const overrides = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.ping} Syncing permissions...`)

                    await interaction.editReply({ embeds: [overrides] });

                    await channel.lockPermissions();

                    const adding = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.ping} Adding permission overrides...`)

                    await interaction.editReply({ embeds: [adding] });

                    // Add overrides to channel for user
                    await channel.permissionOverwrites.create(interaction.user.id, {
                        ManageChannels: true,
                        ManageRoles: true,
                        ViewChannel: true
                    })
                }

                const created = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} Created text channel: ${channel}`)

                await interaction.editReply({ embeds: [created] });
            } else if(type === "voice") {
                const creating = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.ping} Creating voice channel...`)

                await interaction.editReply({ embeds: [creating] });

                const channel = await interaction.guild.channels.create({
                    name: name,
                    type: ChannelType.GuildVoice,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"]
                        },

                        {
                            id: interaction.user.id,
                            allow: ["ManageChannels", "ManageRoles", "ViewChannel"]
                        }
                    ],
                    reason: `Created by ${interaction.user.tag.endsWith("#0") ? interaction.user.username : interaction.user.tag} (${interaction.user.id})`
                })

                if(category) {
                    const overrides = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.ping} Syncing permissions...`)

                    await interaction.editReply({ embeds: [overrides] });

                    await channel.lockPermissions();

                    const adding = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.ping} Adding permission overrides...`)

                    await interaction.editReply({ embeds: [adding] });

                    // Add overrides to channel for user
                    await channel.permissionOverwrites.create(interaction.user.id, {
                        ManageChannels: true,
                        ManageRoles: true,
                        ViewChannel: true
                    })
                }

                const created = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} Created voice channel: ${channel}`)

                await interaction.editReply({ embeds: [created] });
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
