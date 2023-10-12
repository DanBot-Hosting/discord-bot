import Button from "../../classes/Button";
import ExtendedClient from "../../classes/ExtendedClient";
import { ButtonInteraction, Interaction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const button: Button = {
    name: "reaction-role",
    startsWith: true,
    requiredRoles: [],
    async execute(interaction: ButtonInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const id = interaction.customId.replace("reaction-role-", "");
            const role = interaction.guild.roles.cache.get(id);

            if(!role) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} Role not found!`)

                await interaction.reply({ embeds: [error], ephemeral: true });
                return;
            }

            const member = interaction.guild.members.cache.get(interaction.user.id);

            if(member.roles.cache.has(role.id)) {
                await member.roles.remove(role, `Reaction roles in #${interaction.channel.name} (${interaction.channel.id})`);

                const removed = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} You have been removed from the ${role} role!`)

                await interaction.reply({ embeds: [removed], ephemeral: true });
            } else {
                await member.roles.add(role, `Reaction roles in #${interaction.channel.name} (${interaction.channel.id})`);

                const added = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} You have been added to the ${role} role!`)

                await interaction.reply({ embeds: [added], ephemeral: true });
            }
        } catch(err) {
            client.logButtonError(err, interaction);
        }
    }
}

export = button;
