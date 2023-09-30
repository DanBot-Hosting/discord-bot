// This command will not actually be in the final release
// It was only created for educational purposes

import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "gamble",
    description: "Gamble a premium server away for the chance to win one.",
    options: [],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: [],
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction & any, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const premiumServers = await client.premium.get(interaction.user.id);

            if(premiumServers.count === 0) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You don't have any premium servers!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // If the user's premium count is 1, then we can't gamble it away.
            if(premiumServers.count === 1) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You only have **1** premium server! You can't gamble it away.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // The user cannot end up with less premium servers than their used count
            if(premiumServers.count - 1 < premiumServers.used) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You cannot gamble a premium server away since your total count of premium servers can't be less than the amount in use.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // Stop a user from gambling if their premium server count will exceed 10,000
            if(premiumServers.count + 1 > 10000) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You cannot gamble a premium server away since your total count of premium servers cannot exceed **10000**.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // Confirm the user wants to gamble
            const confirm = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Hold up!")
                .setDescription("Are you sure you want to gamble a premium server away?\n\nIf you lose, you will **lose** a premium server. If you win, you will **gain** a premium server.")
                .addFields (
                    { name: "Dice Type", value: "12-sided" }
                )
                .setFooter({ text: "This prompt will expire in 30 seconds." })

            const actions = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Success)
                        .setCustomId(`yes-${interaction.id}`)
                        .setLabel("Yes"),

                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setCustomId(`no-${interaction.id}`)
                        .setLabel("No")
                )

            await interaction.editReply({ embeds: [confirm], components: [actions] });

            const filter = (i: any) => i.user.id === interaction.user.id;

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

            collector.on("collect", async (i: any) => {
                if(i.customId === `yes-${interaction.id}`) {
                    collector.stop();

                    await gamble();
                    return;
                }

                if(i.customId === `no-${interaction.id}`) {
                    collector.stop();

                    const cancelled = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} Gamble cancelled.`)

                    await interaction.editReply({ embeds: [cancelled], components: [] });
                    return;
                }
            })

            collector.on("end", async (collected: any) => {
                if(collected.size == 0) {
                    const cancelled = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} Gamble cancelled.`)

                    await interaction.editReply({ embeds: [cancelled], components: [] });
                    return;
                }
            })

            async function gamble() {
                const rolling = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`🎲 Rolling the first die (12-sided)...`)

                await interaction.editReply({ embeds: [rolling], components: [] });

                const random = Math.floor(Math.random() * 12) + 1;
                const random2 = Math.floor(Math.random() * 12) + 1;

                setTimeout(async () => {
                    const landed = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`🎲 The first die (12-sided) landed on ${random}!`)

                    await interaction.editReply({ embeds: [landed] });
                }, 1500);

                setTimeout(async () => {
                    const rolling2 = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`🎲 Rolling the second die (12-sided)...`)

                    await interaction.editReply({ embeds: [rolling2] });
                }, 3000);

                setTimeout(async () => {
                    const landed2 = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`🎲 The second die (12-sided) landed on ${random2}!`)

                    await interaction.editReply({ embeds: [landed2] });
                }, 5000);

                setTimeout(async () => {
                    if(random === random2) {
                        const win = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setDescription(`${emoji.tick} You won a premium server! You now have **${premiumServers.count + 1}** premium servers.`)

                        await interaction.editReply({ embeds: [win] });

                        try {
                            await client.premium.add(interaction.user.id, 1, client);
                        } catch(err) {
                            const error = new Discord.EmbedBuilder()
                                .setColor(client.config_embeds.error)
                                .setDescription(`${emoji.cross} ${err.message}`)

                            await interaction.editReply({ embeds: [error] });
                        }
                    } else {
                        const lose = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.cross} You lost a premium server! You now have **${premiumServers.count - 1}** premium server${premiumServers.count - 1 === 1 ? "" : "s"}.`)

                        await interaction.editReply({ embeds: [lose] });

                        try {
                            await client.premium.remove(interaction.user.id, 1, client);
                        } catch(err) {
                            const error = new Discord.EmbedBuilder()
                                .setColor(client.config_embeds.error)
                                .setDescription(`${emoji.cross} ${err.message}`)

                            await interaction.editReply({ embeds: [error] });
                        }
                    }
                }, 7000);
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
