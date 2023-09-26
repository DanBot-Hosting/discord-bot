import Button from "../../classes/Button";
import ExtendedClient from "../../classes/ExtendedClient";
import { ButtonInteraction } from "discord.js";

import { emojis as emoji } from "../../config";

const button: Button = {
    name: "premium-fix",
    startsWith: true,
    requiredRoles: ["donator"],
    async execute(interaction: ButtonInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        const user = interaction.customId.replace("premium-fix-", "");

        if(user !== interaction.user.id) {
            const error = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.error)
                .setDescription(`${emoji.cross} You cannot fix another user's premium count!`)

            await interaction.reply({ embeds: [error], ephemeral: true });
            return;
        }

        const oldData = await client.premium.get(user);
        const newCount = await client.premium.fix(user);

        if(oldData.used === newCount) {
            const error = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Your premium count is correct!`)

            await interaction.reply({ embeds: [error], ephemeral: true });
            return;
        }

        const fixed = new Discord.EmbedBuilder()
            .setColor(client.config_embeds.default)
            .setDescription(`${emoji.tick} Your premium count has been fixed!`)

        await interaction.reply({ embeds: [fixed], ephemeral: true });
    }
}

export = button;
