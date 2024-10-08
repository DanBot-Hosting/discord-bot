import LegacyCommand from "../../classes/LegacyCommand";
import ExtendedClient from "../../classes/ExtendedClient";
import { Message } from "discord.js";

import cap from "../../util/plainCap";
import { emojis as emoji } from "../../config";
import { exec } from "child_process";

const command: LegacyCommand = {
    name: "exec",
    description: "Execute code on the bot.",
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
                    .setDescription(`${emoji.cross} No command was provided.`)

                message.reply({ embeds: [error] });
                return;
            }

            console.log(`[exec] [input] ${message.author.tag} (${message.author.id}): ${args.join(" ")}`);

            const execInput = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("📥 Input")
                .setDescription(`\`\`\`\n${cap(args.join(" "), 4000)}\`\`\``)
                .setTimestamp()

            const executing = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Executing...`)

            const msg = await message.reply({ embeds: [executing] });

            // Run the command
            exec(args.join(" "), (err: Error, stdout: string, stderr: string) => {
                if(err) {
                    console.log(`[exec] [error] ${message.author.tag} (${message.author.id}):\n` + err);

                    const execOutput = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setTitle("📤 Output (error)")
                        .setDescription(`\`\`\`\n${cap(err.message, 4000)}\`\`\``)
                        .setTimestamp()

                    msg.edit({ embeds: [execInput, execOutput] });
                    return;
                }

                if(stderr) {
                    console.log(`[exec] [stderr] ${message.author.tag} (${message.author.id}):\n` + stderr);

                    const execOutput = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setTitle("📤 Output (stderr)")
                        .setDescription(`\`\`\`\n${cap(stderr, 4000)}\`\`\``)
                        .setTimestamp()

                    msg.edit({ embeds: [execInput, execOutput] });
                    return;
                }

                console.log(`[exec] [stdout] ${message.author.tag} (${message.author.id}):\n` + stdout);

                if(stdout === "" || stdout == null || stdout == undefined) {
                    const execOutput = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setTitle("📤 Output (stdout)")
                        .setDescription("No output was returned.")
                        .setTimestamp()

                    msg.edit({ embeds: [execInput, execOutput] });
                    return;
                }

                const execOutput = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("📤 Output (stdout)")
                    .setDescription(`\`\`\`\n${cap(stdout, 4000)}\`\`\``)
                    .setTimestamp()

                msg.edit({ embeds: [execInput, execOutput] });
                return;
            })
        } catch(err) {
            client.logLegacyError(err, message, Discord);
        }
    }
}

export = command;
