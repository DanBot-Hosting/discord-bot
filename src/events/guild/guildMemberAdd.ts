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

            // Ignore members under 10 days old
            // Handled by the anti-raid system
            if(Date.now() - member.user.createdTimestamp < 10 * 24 * 60 * 60 * 1000) return;

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
