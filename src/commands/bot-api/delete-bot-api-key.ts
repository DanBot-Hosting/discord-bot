import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction } from "discord.js";

import axios from "axios";
import { emojis as emoji } from "../../config";

const command: Command = {
    name: "delete-bot-api-key",
    description: "Delete your API key from the bot API.",
    options: [],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: [],
    cooldown: 120,
    enabled: false,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const deleting = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Deleting API key...`)

            await interaction.editReply({ embeds: [deleting] });

            let data = null;

            try {
                const result = await axios.post(`https://${client.config_main.botAPI}/removeapikey?discordid=${interaction.user.id}&key=${process.env.bot_api_master_key}`, {
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
                    .setDescription(`${emoji.cross} An error occurred while deleting your API key.`)
                    .addFields (
                        { name: "Error Message", value: `\`\`\`${data.error}\`\`\`` }
                    )

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const deleted = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Your API key has been deleted!`)

            await interaction.editReply({ embeds: [deleted] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
