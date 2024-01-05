import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { AuditLogEvent, Channel, GuildChannel, PermissionResolvable, TextChannel } from "discord.js";

import { channels, main } from "../../config";

const event: Event = {
    name: "channelCreate",
    once: false,
    async execute(client: ExtendedClient & any, Discord: typeof import("discord.js"), channel: Channel & GuildChannel) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            // Ignore events not in the primary guild
            if(!channel.guild) return;
            if(channel.guild.id !== main.primaryGuild) return;

            // Ignore events if the bot does not have the required permissions
            if(!channel.guild.members.me.permissions.has(requiredPerms)) return;

            const channelTypes: any = {
                0: "Text [0]",
                1: "DM [1]",
                2: "Voice [2]",
                3: "Group DM [3]",
                4: "Category [4]",
                5: "Announcement [5]",
                10: "Announcement Thread [10]",
                11: "Public Thread [11]",
                12: "Private Thread [12]",
                13: "Stage Voice [13]",
                14: "Directory [14]",
                15: "Forum [15]",
                16: "Media [16]"
            }

            const ignoredTypes = [1, 3, 10, 11, 12, 14];

            if(ignoredTypes.includes(channel.type)) return;

            // Fetch channel creator from the audit log
            const auditLogs = await channel.guild.fetchAuditLogs({ limit: 10, type: AuditLogEvent.ChannelCreate });
            const auditLog = auditLogs.entries.find((entry) => entry.target.id === channel.id);

            const logChannel = client.channels.cache.get(channels.otherLogs) as TextChannel;

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Channel Created")
                .addFields (
                    { name: "Channel", value: `${channel} **|** \`${channel.id}\`` },
                    { name: "Type", value: channelTypes[channel.type] },
                    { name: "Category", value: channel.parent ? `${channel.parent} **|** \`${channel.parent.id}\`` : "*None*" }
                )
                .setTimestamp()

            if(auditLog) log.setAuthor({ name: auditLog.executor.tag, iconURL: auditLog.executor.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${auditLog.executor.id}` });

            logChannel.send({ embeds: [log] });
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
