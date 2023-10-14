import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { GuildMember, PermissionResolvable, TextChannel } from "discord.js";

import { channels, main } from "../../config";

const event: Event = {
    name: "guildMemberAdd",
    once: false,
    async execute(client: ExtendedClient, Discord: typeof import("discord.js"), member: GuildMember) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            if(member.user.bot || !member.guild) return;
            if(member.guild.id !== main.primaryGuild) return;

            // Return if the bot does not have the required permissions
            if(!member.guild.members.me.permissions.has(requiredPerms)) return;

            // Kick members under 10 days old
            if(client.autoKick && Date.now() - member.user.createdTimestamp < 10 * 24 * 60 * 60 * 1000) {
                if(!member.guild.members.me.permissions.has(["KickMembers"])) return;

                await member.kick("Account is under 10 days old.");

                const channel = member.guild.channels.cache.get(channels.modLogs) as TextChannel;

                const kicked = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Kicked")
                    .setDescription(`You have been kicked from **${member.guild.name}**!`)
                    .addFields (
                        { name: "Reason", value: `Your account is under 10 days old.\nYou can join back on <t:${(member.user.createdTimestamp + 10 * 24 * 60 * 60 * 1000).toString().slice(0, -3)}:F>.` }
                    )
                    .setTimestamp()

                let sentDM = false;

                try {
                    member.send({ embeds: [kicked] });
                    sentDM = true;
                } catch {}

                const kickLog = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Member Kicked")
                    .addFields (
                        { name: "User", value: `${member} | \`${member.id}\`` },
                        { name: "Account Created", value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}:F>` },
                        { name: "Reason", value: "Account is under 10 days old." }
                    )
                    .setTimestamp()

                channel.send({ embeds: [kickLog] });
                return;
            }

            const channel = member.guild.channels.cache.get(channels.welcome) as TextChannel;

            await member.roles.add(client.config_roles.member);

            const welcome = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`👋 Welcome **${member.user.globalName || member.user.username}** to **${member.guild.name}**!`)
                .addFields (
                    { name: "Getting started", value: `Please read <#${channels.rules}> and <#${channels.gettingStarted}>.` }
                )

            channel.send({ content: `${member}`, embeds: [welcome] });
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
