import Button from "../../classes/Button";
import ExtendedClient from "../../classes/ExtendedClient";
import { ButtonInteraction } from "discord.js";

import { emojis as emoji } from "../../config";
import getRoles from "../../functions/roles/get";

const button: Button = {
    name: "delete-message",
    startsWith: true,
    requiredRoles: [],
    async execute(interaction: ButtonInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const user = interaction.customId.replace("delete-message-", "");

            const userRoles = await getRoles(interaction.user.id, client);

            if(user !== interaction.user.id && !userRoles.staff) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.cross} You can't delete someone else's message.`)

                await interaction.reply({ embeds: [error], ephemeral: true });
                return;
            }

            await interaction.message.delete();
        } catch(err) {
            client.logButtonError(err, interaction);
        }
    }
}

export = button;
