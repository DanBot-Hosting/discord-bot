import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { GuildMember, PermissionResolvable, TextChannel } from "discord.js";

import { channels, main } from "../../config";

const event: Event = {
    name: "guildMemberAdd",
    once: false,
    async execute(client: ExtendedClient, Discord: typeof import("discord.js"), member: GuildMember) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks", "KickMembers", "ManageRoles"];

            if(!member.guild) return;
            if(member.guild.id !== main.primaryGuild) return;
            // Return if the bot does not have the required permissions
            if(!member.guild.members.me.permissions.has(requiredPerms)) return;

            const modLogs = member.guild.channels.cache.get(channels.modLogs) as TextChannel;

            // Kick members under 10 days old
            if(client.autoKick && Date.now() - member.user.createdTimestamp < 10 * 24 * 60 * 60 * 1000) {
                await member.kick("Account is under 10 days old.");

                const kicked = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("🚪 Kicked")
                    .setDescription(`You have been kicked from **${member.guild.name}**!`)
                    .addFields (
                        { name: "Reason", value: `Your account is under 10 days old.\nYou can join back on <t:${(member.user.createdTimestamp + 10 * 24 * 60 * 60 * 1000).toString().slice(0, -3)}:F>.` }
                    )
                    .setTimestamp()

                try {
                    await member.send({ embeds: [kicked] });
                } catch {}

                const kickLog = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Member Kicked")
                    .addFields (
                        { name: "User", value: `${member} **|** \`${member.id}\`` },
                        { name: "Account Created", value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}:F>` },
                        { name: "Reason", value: "Account is under 10 days old." }
                    )
                    .setTimestamp()

                modLogs.send({ embeds: [kickLog] });
                return;
            }

            // Kick members when joining is disabled
            if(!client.allowJoining) {
                await member.kick("Joining is disabled.");

                const kicked = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("🚪 Kicked")
                    .setDescription(`You have been kicked from **${member.guild.name}**!`)
                    .addFields (
                        { name: "Reason", value: "Joining is currently disabled.\nYou can join back when it is re-enabled." }
                    )
                    .setTimestamp()

                try {
                    member.send({ embeds: [kicked] });
                } catch {}

                const kickLog = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Member Kicked")
                    .addFields (
                        { name: "User", value: `${member} **|** \`${member.id}\`` },
                        { name: "Reason", value: "Joining is currently disabled.\nYou can join back when it is re-enabled." }
                    )
                    .setTimestamp()

                modLogs.send({ embeds: [kickLog] });
                return;
            }

            // Anti-raid
            // Kick members when more than 3 join with-in 1 minute
            if(member.guild.members.cache.filter(m => Date.now() - m.joinedTimestamp < 60 * 1000).size >= 3) {
                await member.kick("More than a specific amount of users have joined with-in 1 minute.");

                const kicked = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Kicked")
                    .setDescription(`You have been kicked from **${member.guild.name}**!`)
                    .addFields (
                        { name: "Reason", value: "More than a specific amount of users have joined with-in 1 minute.\nYou can join back in 1 minute." }
                    )
                    .setTimestamp()

                try {
                    await member.send({ embeds: [kicked] });
                } catch {}

                const kickLog = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Member Kicked")
                    .addFields (
                        { name: "User", value: `${member} **|** \`${member.id}\`` },
                        { name: "Reason", value: "More than a specific amount of users have joined with-in 1 minute.\nYou can join back in 1 minute." }
                    )
                    .setTimestamp()

                modLogs.send({ embeds: [kickLog] });
                return;
            }

            // Add bots role to bots
            if(member.user.bot) return await member.roles.add(client.config_roles.bots);

            const welcomeChannel = member.guild.channels.cache.get(channels.welcome) as TextChannel;

            await member.roles.add(client.config_roles.member);

            const welcome = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`👋 Welcome **${member.user.globalName || member.user.username}** to **${member.guild.name}**!`)
                .addFields (
                    { name: "Getting started", value: `Please read <#${channels.rules}> and <#${channels.gettingStarted}>.` }
                )

            welcomeChannel.send({ content: `${member}`, embeds: [welcome] });
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
