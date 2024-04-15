import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";

import { EmbedBuilder, TextChannel } from "discord.js";

import cap from "../../util/plainCap";
import checker from "../../util/server-status/checker";
import { exec } from "child_process";
import globalCommands from "../../scripts/global-commands";
import vcStats from "../../util/vcStats";

const event: Event = {
    name: "ready",
    once: true,
    async execute(client: ExtendedClient) {
        try {
            // Login Message
            console.log(`Logged in as: ${client.user.tag}`);

            // Register Commands
            await globalCommands(client);

            // Check and update server status every 60 seconds
            if(client.config_main.nodeStatus) {
                await checker(client);
                setInterval(async () => await checker(client), 60000);
            }

            // Check and update VC Stats every 60 seconds
            vcStats(client);
            setInterval(async () => vcStats(client), 60000);

            const githubChannel = client.channels.cache.get(client.config_channels.github) as TextChannel;

            // Pull from GitHub every 30 seconds
            setInterval(() => {
                exec("git pull", async (err, stdout) => {
                    if(err) return client.logError(err);

                    if(stdout.includes("Already up to date.")) return;

                    const embed = new EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setTitle("Automatic GitHub Pull")
                        .setDescription(`\`\`\`\n${cap(stdout, 4000)}\`\`\``)
                        .setTimestamp()

                    await githubChannel.send({ embeds: [embed] });

                    process.exit();
                })
            }, 30000);
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
