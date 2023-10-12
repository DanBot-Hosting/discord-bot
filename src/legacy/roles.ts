import LegacyCommand from "../classes/LegacyCommand";
import ExtendedClient from "../classes/ExtendedClient";
import { Message } from "discord.js";

import { emojis as emoji } from "../config";

const command: LegacyCommand = {
    name: "roles",
    description: "Get all of a guild's roles.",
    aliases: [],
    botPermissions: [],
    requiredRoles: [],
    cooldown: 60,
    enabled: true,
    async execute(message: Message, args: string[], cmd: LegacyCommand, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const fetching = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Fetching roles...`)

            const msg = await message.reply({ embeds: [fetching] });

            const roles = message.guild.roles.cache;

            let content: any = roles.map(r => `${r.position}. ${r.name} (${r.id})`);

            // Sort the roles by position
            content.sort((a: string, b: string) => {
                const aPos = parseInt(a.split(". ")[0]);
                const bPos = parseInt(b.split(". ")[0]);

                return bPos - aPos;
            })

            // Convert to TXT file
            content = content.join("\n");

            // Send the file
            const file = new Discord.AttachmentBuilder(Buffer.from(content), { name: "roles.txt" });

            // Role info
            const highest = message.guild.roles.highest;
            const booster = message.guild.roles.premiumSubscriberRole;
            const mostMembers = roles.filter(r => r.id !== message.guild.id).sort((a, b) => b.members.size - a.members.size).first();

            const roleInfo = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ extension: "png", forceStatic: false }) })
                .setTitle("Roles")
                .addFields (
                    { name: "Count", value: roles.size.toString() },
                    { name: `Top Role (${highest.members.size} members)`, value: `${highest} **|** \`${highest.id}\`` },
                    { name: `Booster Role (${booster.members.size} members)`, value: `${booster} **|** \`${booster.id}\`` },
                    { name: `Most Members (${mostMembers.members.size} members)`, value: `${mostMembers} **|** \`${mostMembers.id}\`` }
                )

            msg.edit({ embeds: [roleInfo], files: [file] });
        } catch(err) {
            client.logLegacyError(err, message, Discord);
        }
    }
}

export = command;
