import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { AuditLogEvent, Channel, ChannelType, GuildChannel } from "discord.js";

import { main } from "../../config";

const event: Event = {
    name: "channelCreate",
    once: false,
    async execute(client: ExtendedClient, Discord: typeof import("discord.js"), channel: Channel & GuildChannel) {
        try {
            if(!channel.guild) return;
            if(channel.guild.id !== main.primaryGuild) return;

            // If the channel is not a text channel, return
            if(channel.type !== ChannelType.GuildText) return;

            // Give the channel creator permissions to the channel
            // Fetch audit logs to get the user who created the channel
            const auditLogs = await channel.guild.fetchAuditLogs({ limit: 10, type: AuditLogEvent.ChannelCreate });
            // Get the audit log entry which matches the channel ID
            const auditLog = auditLogs.entries.find((entry) => entry.target.id === channel.id);

            // If the audit log entry is undefined, return
            if(!auditLog) return;
            // If the audit log entry was not created by a user, return
            if(auditLog.executor.bot) return;

            // The channel creator
            const user = auditLog.executor;

            // Log to console
            console.log(`[channelCreate] ${user.tag} (${user.id}) created #${channel.name} (${channel.id}).`);

            // Give the creator permissions to the channel
            await channel.permissionOverwrites.create(user, {
                ViewChannel: true,
                ManageChannels: true,
                ManageRoles: true,
                CreateInstantInvite: true,
                SendMessages: true,
                SendMessagesInThreads: true,
                CreatePublicThreads: true,
                CreatePrivateThreads: true,
                EmbedLinks: true,
                AttachFiles: true,
                AddReactions: true,
                UseExternalEmojis: true,
                UseExternalStickers: true,
                ManageMessages: true,
                ManageThreads: true,
                ReadMessageHistory: true,
                SendTTSMessages: true,
                UseApplicationCommands: true,
                SendVoiceMessages: true,
                UseEmbeddedActivities: true
            })

            // Log to console
            console.log(`[channelCreate] Gave ${user.tag} (${user.id}) permissions to manage #${channel.name} (${channel.id}).`);
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
