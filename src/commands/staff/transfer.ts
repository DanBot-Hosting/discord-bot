import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction } from "discord.js";

import { emojis as emoji } from "../../config";

import User from "../../models/User";

const command: Command = {
    name: "transfer",
    description: "Transfer user data to another account.",
    options: [
        {
            type: 6,
            name: "from",
            description: "The user who's data to move.",
            required: true
        },

        {
            type: 6,
            name: "to",
            description: "The account to move it to.",
            required: true
        }
    ],
    default_member_permissions: null,
    botPermissions: ["ManageRoles"],
    requiredRoles: ["staff"],
    cooldown: 10,
    enabled: true,
    deferReply: true,
    ephemeral: false,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const fetching = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Fetching users...`)

            const i = await interaction.editReply({ embeds: [fetching] });

            const from = interaction.options.getUser("from");
            const to = interaction.options.getUser("to");

            const checkingUsers = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Checking users...`)

            await i.edit({ embeds: [checkingUsers] });

            if(from.id === to.id) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} The sending and receiving users cannot be the same!`)

                await i.edit({ embeds: [error] });
                return;
            }

            if(from.bot || to.bot) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You can only transfer data between users!`)

                await i.edit({ embeds: [error] });
                return;
            }

            const fromGuildMember = interaction.guild.members.cache.get(from.id);
            const toGuildMember = interaction.guild.members.cache.get(to.id);

            if(!fromGuildMember) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} ${from} is not in this server!`)

                await i.edit({ embeds: [error] });
                return;
            }

            if(!toGuildMember) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} ${to} is not in this server!`)

                await i.edit({ embeds: [error] });
                return;
            }

            // TODO: Verify both have the same console accounts linked

            const verifyingTransfer = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Verifying transfer...`)

            await i.edit({ embeds: [verifyingTransfer] });

            let fromUser = await User.findOne({ _id: from.id });
            let toUser = await User.findOne({ _id: to.id }) || new User({ _id: to.id, hide_premium: false, premium_count: 0, premium_used: 0 });

            if(!fromUser) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} ${from} has no data to be transferred!`)

                await i.edit({ embeds: [error] });
                return;
            }

            const confirm = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Transfer Data")
                .setDescription(`Are you sure you want to transfer all data associated with ${from} to ${to}?`)
                .addFields (
                    { name: "What will be transferred?", value: `✨ **${fromUser.premium_count}** premium server${fromUser.premium_count === 1 ? "" : "s"}\n🔒 Privacy settings` }
                )
                .setFooter({ text: "This prompt will expire in 30 seconds." })

            const actions: any = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setCustomId(`transfer-${interaction.id}`)
                        .setLabel("Confirm"),

                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setCustomId(`cancel-${interaction.id}`)
                        .setLabel("Cancel")
                )

            await i.edit({ embeds: [confirm], components: [actions] });

            const collector = interaction.channel.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 30000 });

            collector.on("collect", async c => {
                if(c.user.id !== interaction.user.id) {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} This button is not for you!`)

                    c.reply({ embeds: [error], ephemeral: true });
                    return;
                }

                if(c.customId === `transfer-${interaction.id}`) {
                    collector.stop();

                    const premiumTransfer = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.ping} Transferring premium server data...`)

                    await i.edit({ embeds: [premiumTransfer], components: [] });

                    toUser.hide_premium = fromUser.hide_premium;
                    toUser.premium_count += fromUser.premium_count;
                    toUser.premium_used += fromUser.premium_used;

                    await toUser.save();

                    const deleting = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.ping} Deleting old data...`)

                    await i.edit({ embeds: [deleting], components: [] });

                    await fromUser.delete();

                    const assigningRoles = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.ping} Assigning roles...`)

                    await i.edit({ embeds: [assigningRoles], components: [] });

                    if(fromGuildMember.roles.cache.get(client.config_roles.donator)) {
                        await fromGuildMember.roles.remove(client.config_roles.donator);
                    }

                    if(toUser.premium_count > 0 && !toGuildMember.roles.cache.get(client.config_roles.donator)) {
                        await toGuildMember.roles.add(client.config_roles.donator);
                    }

                    const transferred = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.tick} All data associated with ${from} has been transferred to ${to}!`)

                    await i.edit({ embeds: [transferred], components: [] });
                    return;
                }

                if(c.customId === `cancel-${interaction.id}`) {
                    collector.stop();

                    const cancelled = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} Operation cancelled.`)

                    await i.edit({ embeds: [cancelled], components: [] });
                    return;
                }
            })

            collector.on("end", async collected => {
                let validInteractions = [];

                collected.forEach(c => {
                    if(c.user.id === interaction.user.id) validInteractions.push(c);
                })

                if(validInteractions.length == 0) {
                    const cancelled = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} Operation cancelled.`)

                    await i.edit({ embeds: [cancelled], components: [] });
                }
            })
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
