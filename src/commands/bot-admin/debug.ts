import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { APIGatewaySessionStartLimit, CommandInteraction } from "discord.js";

import { emojis as emoji } from "../../config";
import osu from "node-os-utils";

const command: Command = {
    name: "debug",
    description: "Get debug information about the bot.",
    options: [],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: ["botAdmin"],
    cooldown: 60,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const cpu = await osu.cpu.usage();
            const mem = process.memoryUsage().heapUsed;

            const info = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("💻 System")
                .addFields (
                    { name: "📈 CPU Usage", value: `${cpu}%`, inline: true },
                    { name: "🖨️ Memory Usage", value: formatBytes(mem, 0), inline: true }
                )

            // session_start_limit
            // https://discord.com/developers/docs/topics/gateway#session-start-limit-object-session-start-limit-structure
            const session: APIGatewaySessionStartLimit = (await client.rest.get("/gateway/bot") as any).session_start_limit;

            const bot = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("🤖 Bot")
                .addFields (
                    { name: `${emoji.nodejs} Node.js`, value: `${process.version}`, inline: true },
                    { name: `${emoji.discordjs} Discord.js`, value: `v${Discord.version}`, inline: true },
                    { name: "🟢 Online Since", value: `<t:${(Date.now() - client.uptime).toString().slice(0, -3)}:f> (<t:${(Date.now() - client.uptime).toString().slice(0, -3)}:R>)` },
                    { name: "📈 Session Limit", value: `${session.total - session.remaining} **/** ${session.total} (resets <t:${((Date.now() + session.reset_after) / 1000).toString().slice(0, -4)}:R>)`, inline: true },
                    { name: "🌐 Websocket Ping", value: `${client.ws.ping}ms`, inline: true },
                    { name: "🔊 Max Listeners", value: `${client.getMaxListeners()}`, inline: true },
                    { name: `${emoji.discord} Commands`, value: `**${client.commands.size}** Slash Commands\n**${client.legacyCommands.size}** Legacy Commands` }
                )

            const stats = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("📊 Statistics")
                .addFields (
                    { name: "Guilds", value: `${client.guilds.cache.size}`, inline: true },
                    { name: "Users", value: `${client.users.cache.size}`, inline: true },
                    { name: "Channels", value: `${client.channels.cache.size}`, inline: true },
                    { name: "Voice Adapters", value: `${client.voice.adapters.size}`, inline: true },
                )

            await interaction.editReply({ embeds: [info, bot, stats] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

function formatBytes(bytes: number, decimals: number = 2): string {
    if(bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export = command;
