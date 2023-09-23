import LegacyCommand from "../classes/LegacyCommand";
import ExtendedClient from "../classes/ExtendedClient";
import { Message } from "discord.js";

import cap from "../util/cap";
import { emojis as emoji } from "../config";
import { noPermissionCommand } from "../util/embeds";

const command: LegacyCommand = {
    name: "eval",
    description: "Evaluate some code on the bot.",
    aliases: ["e"],
    botPermissions: [],
    requiredRoles: [],
    cooldown: 5,
    enabled: true,
    async execute(message: Message, args: string[], cmd: LegacyCommand, client: ExtendedClient, Discord: any) {
        try {
            if(!client.config_main.evalAllowed.includes(message.author.id)) return message.reply({ embeds: [noPermissionCommand] });

            if(!args[0]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} No code was provided.`)

                message.reply({ embeds: [error] });
                return;
            }

            try {
                // Run the code
                let output = await eval(args.join(" "));

                // Output was returned
                if(output) {
                    // Censor the database URL, Sentry DSN and bot token if they are returned
                    output = output.toString().replace(process.env.database, "CENSORED").replace(process.env.sentry_dsn, "CENSORED").replace(process.env.token, "CENSORED");

                    message.reply(`\`\`\`${cap(output, 2000)}\`\`\``);
                // No output was returned
                } else {
                    const noOutput = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} No output was returned.`)

                    message.reply({ embeds: [noOutput] });
                }
            } catch(err) {
                message.reply(`\`\`\`${err.message}\`\`\``);
            }
        } catch(err) {
            client.logLegacyError(err, message, Discord);
        }
    }
}

export = command;
