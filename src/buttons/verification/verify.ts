import Button from "../../classes/Button";
import ExtendedClient from "../../classes/ExtendedClient";
import { ButtonInteraction } from "discord.js";

import { emojis as emoji } from "../../config";

import User from "../../models/User";
import Verification from "../../models/Verification";

const button: Button = {
    name: "verify",
    startsWith: false,
    requiredRoles: [],
    async execute(interaction: ButtonInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const userData = await User.findOne({ _id: interaction.user.id });

            if(userData?.verified) {
                const alreadyVerified = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You are already verified!`)

                await interaction.reply({ embeds: [alreadyVerified], ephemeral: true });
                return;
            }

            const existingData = await Verification.findOne({ user: interaction.user.id });

            if(existingData) {
                const url = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Verification URL")
                    .setDescription(`http://localhost:3001/verify/${existingData._id}`)

                await interaction.reply({ embeds: [url], ephemeral: true });
            } else {
                const data = await new Verification({
                    _id: require("crypto").randomUUID(),
                    created: Date.now(),
                    user: interaction.user.id
                }).save()

                // Delete data after 15 minutes
                setTimeout(async () => {
                    const dataToDelete = await Verification.findOne({ _id: data._id });

                    if(dataToDelete) await dataToDelete.delete();
                }, 15 * 60 * 1000);

                const url = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Verification URL")
                    .setDescription(`http://localhost:3001/verify/${data._id}`)
                    .setFooter({ text: "This link will expire in 15 minutes." })

                await interaction.reply({ embeds: [url], ephemeral: true });
            }
        } catch(err) {
            client.logButtonError(err, interaction);
        }
    }
}

export = button;
