import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction } from "discord.js";

import axios from "axios";
import { emojis as emoji } from "../../config";

const command: Command = {
    name: "generate-bot-api-key",
    description: "Generate an API key for the bot API.",
    options: [],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: ["betaTester"],
    cooldown: 120,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const generating = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Generating API key...`)

            await interaction.editReply({ embeds: [generating] });

            let data = null;

            try {
                const result = await axios.post(`https://${client.config_main.botAPI}/apikey?discordid=${interaction.user.id}&key=${process.env.bot_api_master_key}`, {
                    headers: {
                        "User-Agent": "DBH"
                    }
                })

                data = result.data;
            } catch(err) {
                data = err.response.data;
            }

            if(data.error) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} An error occurred while generating your API key.`)
                    .addFields (
                        { name: "Error Message", value: `\`\`\`${data.error}\`\`\`` }
                    )

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const generated = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Bot API Key")
                .addFields (
                    { name: "API Key", value: `\`${data.result}\`` },
                    { name: "__NOTE__", value: "Please save this key someone secure as this will not be shown again!" },
                    { name: "__WARNING__", value: "Do **NOT** share this API key with anyone.\nIf you believe it has been compromised, please contact an administrator." }
                )

            try {
                await interaction.user.send({ embeds: [generated] });

                const sent = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.tick} Check your DMs!`)

                await interaction.editReply({ embeds: [sent] });
            } catch(err) {
                await interaction.editReply({ embeds: [generated] });
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
