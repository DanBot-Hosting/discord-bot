import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "update-william-role-name",
    description: "Update William's custom role name.",
    options: [
        {
            type: 3,
            name: "name",
            description: "The new name for William's role.",
            max_length: 32,
            required: true
        }
    ],
    default_member_permissions: null,
    botPermissions: ["ManageRoles"],
    requiredRoles: ["william"],
    cooldown: 10,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const name = interaction.options.get("name").value as string;
            const role = interaction.guild.roles.cache.get(client.config_roles.william);

            await role.setName(name);

            const changed = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Updated role name to: \`${name}\``)

            await interaction.editReply({ embeds: [changed] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
