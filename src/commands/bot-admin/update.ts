import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, TextChannel } from "discord.js";

import cap from "../../util/plainCap";
import { emojis as emoji } from "../../config";
import { exec } from "child_process";

const command: Command = {
    name: "update",
    description: "Pull the latest changes from GitHub.",
    options: [],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: ["botAdmin"],
    cooldown: 60,
    enabled: true,
    deferReply: true,
    ephemeral: false,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            exec("git pull", async (err, stdout) => {
                if(err) return client.logCommandError(err, interaction, Discord); 

                if(stdout.includes("Already up to date.")) {
                    const upToDate = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.tick} Already up to date.`)

                    await interaction.editReply({ embeds: [upToDate] });
                    return;
                } else {
                    const channel = client.channels.cache.get(client.config_channels.github) as TextChannel;

                    const updating = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.tick} Pulling files from GitHub.`)

                    await interaction.editReply({ embeds: [updating] });

                    const log = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setAuthor({ name: interaction.user.tag.endsWith("#0") ? interaction.user.username : interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}` })
                        .setTitle("Manual GitHub Pull")
                        .setDescription(`\`\`\`\n${cap(stdout, 4000)}\`\`\``)
                        .setTimestamp()

                    await channel.send({ embeds: [log] });

                    process.exit();
                }
            })
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
