import Button from "../../classes/Button";
import ExtendedClient from "../../classes/ExtendedClient";
import { ButtonInteraction, Interaction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const button: Button = {
    name: "ticket-priority",
    startsWith: false,
    requiredRoles: ["staff"],
    async execute(interaction: ButtonInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const menu = new Discord.StringSelectMenuBuilder()
                .setCustomId(`select-menu-${interaction.id}`)
                .setPlaceholder("Select a priority")

            const currentPriority = interaction.channel.parent.id;

            if(currentPriority !== client.config_categories.tickets.high) {
                menu.addOptions (
                    new Discord.StringSelectMenuOptionBuilder()
                        .setEmoji("🔴")
                        .setLabel("High")
                        .setValue("high")
                )
            }

            if(currentPriority !== client.config_categories.tickets.medium) {
                menu.addOptions (
                    new Discord.StringSelectMenuOptionBuilder()
                        .setEmoji("🟠")
                        .setLabel("Medium")
                        .setValue("medium")
                )
            }

            if(currentPriority !== client.config_categories.tickets.low) {
                menu.addOptions (
                    new Discord.StringSelectMenuOptionBuilder()
                        .setEmoji("🟢")
                        .setLabel("Low")
                        .setValue("low")
                )
            }

            if(currentPriority !== client.config_categories.tickets.vps) {
                menu.addOptions (
                    new Discord.StringSelectMenuOptionBuilder()
                        .setEmoji("🔵")
                        .setLabel("VPS")
                        .setValue("vps")
                )
            }

            const row: any = new Discord.ActionRowBuilder().addComponents(menu);

            await interaction.reply({ components: [row], ephemeral: true });

            let finished = false;

            const listener = async (i: Interaction) => {
                if(!i.isStringSelectMenu()) return;

                if(i.customId === `select-menu-${interaction.id}`) {
                    const priority = i.values[0];

                    const categories: any = {
                        high: client.config_categories.tickets.high,
                        medium: client.config_categories.tickets.medium,
                        low: client.config_categories.tickets.low,
                        unknown: client.config_categories.tickets.unknown,
                        vps: client.config_categories.tickets.vps
                    }

                    const category = categories[priority];

                    const updating = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.ping} Updating ticket priority...`)

                    await interaction.editReply({ embeds: [updating], components: [] });

                    const channel = await interaction.guild.channels.fetch(interaction.channel.id) as TextChannel;

                    await channel.setParent(category, { lockPermissions: false });

                    finished = true;

                    const updated = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.tick} Updated ticket priority to **${priority}**.`)

                    await interaction.editReply({ embeds: [updated] });
                    return;
                }
            }

            client.on("interactionCreate", listener);

            setTimeout(async () => {
                client.off("interactionCreate", listener);

                const expired = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} Operation cancelled.`)

                if(!finished) await interaction.editReply({ embeds: [expired], components: [] });
            }, 30 * 1000);
        } catch(err) {
            client.logButtonError(err, interaction);
        }
    }
}

export = button;
