import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "toggle-ticket-ping",
    description: "Toggle whether you get pinged for new tickets or not.",
    options: [],
    default_member_permissions: null,
    botPermissions: ["ManageRoles"],
    requiredRoles: ["staff"],
    cooldown: 60,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction & any, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const role = await interaction.guild.roles.fetch(client.config_roles.ticketPing);
            const member = await interaction.guild.members.fetch(interaction.user.id);

            if(member.roles.cache.has(role.id)) {
                await member.roles.remove(role);

                const removed = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} You will no longer be pinged for new tickets.`)

                await interaction.editReply({ embeds: [removed] });
                return;
            }

            await member.roles.add(role);

            const added = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} You will now be pinged for new tickets.`)

            await interaction.editReply({ embeds: [added] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
