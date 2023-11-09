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

            const res = await axios.post(`https://${client.config_main.botAPIDomain}/apikey`, {
                params: {
                    "discordid": interaction.user.id,
                    "key": process.env.bot_api_master_key
                }
            })

            const generated = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Your API key has been generated!`)
                .addFields (
                    { name: "API Key", value: `\`${res.data.result}\`` },
                    { name: "Note", value: "**Do not** share this key with anyone. If you believe it has been compromised, please regenerate it." }
                )

            await interaction.editReply({ embeds: [generated] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
