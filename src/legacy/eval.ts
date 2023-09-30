import LegacyCommand from "../classes/LegacyCommand";
import ExtendedClient from "../classes/ExtendedClient";
import { Message } from "discord.js";

import cap from "../util/cap";
import { emojis as emoji } from "../config";

const command: LegacyCommand = {
    name: "eval",
    description: "Evaluate code on the bot.",
    aliases: [],
    botPermissions: [],
    requiredRoles: ["botAdmin"],
    cooldown: 0,
    enabled: true,
    async execute(message: Message, args: string[], cmd: LegacyCommand, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            if(!args[0]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} No code was provided.`)

                message.reply({ embeds: [error] });
                return;
            }

            const evalInput = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("📥 Input")
                .setDescription(`\`\`\`js\n${cap(args.join(" "), 4000)}\`\`\``)
                .setTimestamp()

            try {
                // Run the code
                let output = await eval(args.join(" "));

                if(output) {
                    output = output.toString();

                    // Censor the database URL, Sentry DSN and bot token if they are returned
                    if(output.includes(process.env.database) && process.env.database) output = output.replace(process.env.database, "[CENSORED_DATABASE_URL]");
                    if(output.includes(process.env.sentry_dsn) && process.env.sentry_dsn) output = output.replace(process.env.sentry_dsn, "[CENSORED_SENTRY_DSN]");
                    if(output.includes(process.env.token) && process.env.token) output = output.replace(process.env.token, "[CENSORED_BOT_TOKEN]");

                    const evalOutput = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setTitle("📤 Output")
                        .setDescription(`\`\`\`js\n${cap(output, 4000)}\`\`\``)
                        .setTimestamp()

                    message.reply({ embeds: [evalInput, evalOutput] });
                } else {
                    const evalOutput = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setTitle("📤 Output")
                        .setDescription("No output was returned.")
                        .setTimestamp()

                    message.reply({ embeds: [evalInput, evalOutput] });
                }
            } catch(err) {
                // Censor the database URL, Sentry DSN and bot token if they are returned
                if(err.message.includes(process.env.database) && process.env.database) err.message = err.message.replace(process.env.database, "[CENSORED_DATABASE_URL]");
                if(err.message.includes(process.env.sentry_dsn) && process.env.sentry_dsn) err.message = err.message.replace(process.env.sentry_dsn, "[CENSORED_SENTRY_DSN]");
                if(err.message.includes(process.env.token) && process.env.token) err.message = err.message.replace(process.env.token, "[CENSORED_BOT_TOKEN]");

                const evalOutput = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setTitle("📤 Output")
                    .setDescription(`\`\`\`js\n${cap(err.message, 4000)}\`\`\``)
                    .setTimestamp()

                message.reply({ embeds: [evalInput, evalOutput] });
            }
        } catch(err) {
            client.logLegacyError(err, message, Discord);
        }
    }
}

export = command;
