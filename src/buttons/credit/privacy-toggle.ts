import Button from "../../classes/Button";
import ExtendedClient from "../../classes/ExtendedClient";
import { ButtonInteraction } from "discord.js";

import { emojis as emoji } from "../../config";

import User from "../../models/User";

const button: Button = {
    name: "credit-privacy-toggle",
    startsWith: true,
    requiredRoles: [],
    async execute(interaction: ButtonInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        let data = await User.findOne({ _id: interaction.user.id });

        if(data.hide_credit) {
            data.hide_credit = false;
            await data.save();

            const status = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Public visibility has been enabled.`)

            await interaction.reply({ embeds: [status], ephemeral: true });
        } else {
            data.hide_credit = true;
            await data.save();

            const status = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Public visibility has been disabled.`)

            await interaction.reply({ embeds: [status], ephemeral: true });
        }
    }
}

export = button;
