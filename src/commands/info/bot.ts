import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { ChatInputCommandInteraction } from "discord.js";

const bot = require("../../../package.json");

const command: Command = {
    name: "bot",
    description: "Different information about the bot.",
    options: [],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: [],
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const info = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${client.user.id}` })
                .setDescription(bot.description)
                .addFields (
                    { name: "🟢 Online Since", value: `<t:${(Date.now() - client.uptime).toString().slice(0, -3)}:f> (<t:${(Date.now() - client.uptime).toString().slice(0, -3)}:R>)`, inline: true },
                    { name: "🔧 Maintainers", value: "[**DIBSTER**](https://discord.com/users/757296951925538856)\n📨 dibster@danbot.host\n[**William**](https://discord.com/users/853158265466257448)\n📨 william@danbot.host" }
                )

            await interaction.editReply({ embeds: [info] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
