import LegacyCommand from "../../classes/LegacyCommand";
import ExtendedClient from "../../classes/ExtendedClient";
import { Message } from "discord.js";

import { emojis as emoji } from "../../config";

const command: LegacyCommand = {
    name: "role-info",
    description: "Get a information about a role.",
    aliases: ["ri", "role", "roleinfo"],
    botPermissions: [],
    requiredRoles: ["staff"],
    cooldown: 5,
    enabled: true,
    async execute(message: Message, args: string[], cmd: LegacyCommand, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            if(!args[0]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} Please provide a role!`)

                message.reply({ embeds: [error] });
                return;
            }

            const fetching = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Fetching role...`)

            const msg = await message.reply({ embeds: [fetching] });

            const role = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.filter(r => r.name.toLowerCase().includes(args.join(" ").toLowerCase())).first() || message.mentions.roles.first();

            if(!role) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} Role not found!`)

                msg.edit({ embeds: [error] });
                return;
            }

            const humans = role.members.filter(m => !m.user.bot).size;
            const bots = role.members.filter(m => m.user.bot).size;

            const roleInfo = new Discord.EmbedBuilder()
                .setColor(role.hexColor)
                .setThumbnail(role.iconURL({ extension: "png", forceStatic: false }))
                .addFields (
                    { name: "Role", value: `${role} **|** \`${role.id}\`` },
                    { name: "Created", value: `<t:${role.createdTimestamp.toString().slice(0, -3)}:f> (<t:${role.createdTimestamp.toString().slice(0, -3)}:R>)` },
                    { name: "Position", value: role.position.toString() },
                    { name: "Manageable", value: role.managed ? emoji.cross : emoji.tick, inline: true },
                    { name: "Hoisted", value: role.hoist ? emoji.tick : emoji.cross, inline: true },
                    { name: "Mentionable", value: !role.mentionable ? emoji.cross : emoji.tick, inline: true },
                    { name: "Members", value: `**${role.members.size}** (**${humans}** human${humans === 1 ? "" : "s"}, **${bots}** bot${bots === 1 ? "" : "s"})` },
                    { name: "Permissions", value: role.permissions.toArray().join(", ") || "*None*" }
                )

            const buttons: any = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setCustomId(`role-members-${role.id}`)
                        .setLabel("Members")
                        .setEmoji("👤")
                )

            msg.edit({ embeds: [roleInfo], components: role.members.size ? [buttons] : [] });
        } catch(err) {
            client.logLegacyError(err, message, Discord);
        }
    }
}

export = command;
