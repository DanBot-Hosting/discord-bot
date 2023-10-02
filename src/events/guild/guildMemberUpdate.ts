import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { GuildMember, PermissionResolvable, TextChannel } from "discord.js";

import { channels, main } from "../../config";

const event: Event = {
    name: "guildMemberUpdate",
    once: false,
    async execute(client: ExtendedClient & any, Discord: typeof import("discord.js"), oldMember: GuildMember, newMember: GuildMember) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            // Ignore events not in the primary guild
            if(!oldMember.guild) return;
            if(oldMember.guild.id !== main.primaryGuild) return;
            // Ignore events that are not nickname changes
            if(oldMember.nickname === newMember.nickname) return;

            // Ignore events if the bot does not have the required permissions
            if(!oldMember.guild.members.me.permissions.has(requiredPerms)) return;

            const channel = oldMember.guild.channels.cache.get(channels.otherLogs) as TextChannel;

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: oldMember.user.tag.endsWith("#0") ? oldMember.user.username : oldMember.user.tag, iconURL: oldMember.user.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${oldMember.user.id}` })
                .setTitle("Nickname Changed")
                .addFields (
                    { name: "Old Nickname", value: oldMember.nickname ? oldMember.nickname : "*None*", inline: true },
                    { name: "New Nickname", value: newMember.nickname ? newMember.nickname : "*None*", inline: true }
                )
                .setTimestamp()

            channel.send({ embeds: [log] });
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
