import ExtendedClient from "../../classes/ExtendedClient";
import { ButtonInteraction } from "discord.js";

import Button from "../../classes/Button";

import Roles, { Role } from "../../classes/Roles";
import { emojis as emoji } from "../../config";
import getRoles from "../../functions/roles/get";
import { noPermissionButton } from "../embeds";

export = async (client: ExtendedClient, Discord: any, interaction: ButtonInteraction) => {
    try {
        const button: Button = client.buttons.get(interaction.customId);

        if(button) {
            const requiredRoles: Role[] = button.requiredRoles;
            const userRoles: Roles = await getRoles(interaction.user.id, client);

            if(requiredRoles.length) {
                const hasRoles = [];

                for(const role of requiredRoles) {
                    if(userRoles[role]) hasRoles.push(role);
                }

                if(requiredRoles.length !== hasRoles.length) return await interaction.reply({ embeds: [noPermissionButton], ephemeral: true });
            }

            try {
                await button.execute(interaction, client, Discord);
            } catch(err) {
                client.logError(err);

                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} There was an error while executing that button!`)

                await interaction.reply({ embeds: [error], ephemeral: true });
            }

            return;
        }

        for(const btn of client.buttons) {
            if(interaction.customId.startsWith(btn[0]) && btn[1].startsWith) {
                const requiredRoles: Role[] = btn[1].requiredRoles;
                const userRoles: Roles = await getRoles(interaction.user.id, client);

                if(requiredRoles.length) {
                    const hasRoles = [];

                    for(const role of requiredRoles) {
                        if(userRoles[role]) hasRoles.push(role);
                    }

                    if(requiredRoles.length !== hasRoles.length) return await interaction.reply({ embeds: [noPermissionButton], ephemeral: true });
                }

                try {
                    await btn[1].execute(interaction, client, Discord);
                } catch(err) {
                    client.logError(err);

                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} There was an error while executing that button!`)

                    await interaction.reply({ embeds: [error], ephemeral: true });
                }

                break;
            }
        }
    } catch(err) {
        client.logError(err);
    }
}
