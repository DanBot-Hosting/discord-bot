import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { GuildMember, Interaction, PermissionResolvable, TextChannel } from "discord.js";

import { channels, main } from "../../config";

const event: Event = {
    name: "guildMemberAdd",
    once: false,
    async execute(client: ExtendedClient, Discord: any, member: GuildMember) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            // Ignore messages from bots and messages not in the primary guild
            if(member.user.bot || !member.guild) return;
            if(member.guild.id !== main.primaryGuild) return;
            // Ignore interactions if the bot does not have the required permissions
            if(!member.guild.members.me.permissions.has(requiredPerms)) return;

            // Kick members under 10 days old
            if(client.autoKick && member.user.createdTimestamp > Date.now() - 999999999999999) {
                await member.kick("Account is under 10 days old.");

                const channel = member.guild.channels.cache.get(channels.welcome) as TextChannel;

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

            const welcome = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`👋 Welcome **${member.user.globalName || member.user.username}** to **${member.guild.name}**!`)
                .addFields (
                    { name: "Getting Started", value: `Please read <#${channels.rules}> and <#${channels.gettingStarted}>.` }
                )

            channel.send({ content: `${member}`, embeds: [welcome] });
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
